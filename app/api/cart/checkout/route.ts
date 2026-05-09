import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { hasDatabaseUrl, getDb } from "@/src/db";
import { orderItems, orders } from "@/src/db/schema";
import { getCatalogue } from "@/src/db/catalogue";
import { getBestPrice } from "@/src/lib/catalogue-pricing";
import { createOrderId, createOrderItemId } from "@/src/lib/configurator";
import { createCustomerAccessToken, createOrderReference, recordOrderEvent } from "@/src/lib/orders";

const cartCheckoutItemSchema = z.object({
  coffeeProductId: z.string().min(1),
  bagOptionId: z.string().min(1),
  bagSizeId: z.string().min(1),
  labelOptionId: z.string().min(1),
  grindOptionId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(1000),
  brandName: z.string().max(120).default(""),
  labelTitle: z.string().max(120).default(""),
  artworkFileName: z.string().max(240).default(""),
  productionNotes: z.string().max(1000).default(""),
});

const cartCheckoutSchema = z.object({
  businessName: z.string().min(2).max(120),
  contactName: z.string().min(2).max(120),
  customerEmail: z.email(),
  items: z.array(cartCheckoutItemSchema).min(1),
});

export async function POST(request: Request) {
  const parsed = cartCheckoutSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid cart checkout request." },
      { status: 400 }
    );
  }

  try {
    const input = parsed.data;
    const catalogue = await getCatalogue();
    const orderId = createOrderId();
    const orderReference = createOrderReference();
    const customerAccessToken = createCustomerAccessToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

    const pricedItems = input.items.map((item) => {
      const coffee = catalogue.coffees.find((catalogueItem) => catalogueItem.id === item.coffeeProductId);
      const bag = catalogue.bags.find((catalogueItem) => catalogueItem.id === item.bagOptionId);
      const size = catalogue.sizes.find((catalogueItem) => catalogueItem.id === item.bagSizeId);
      const label = catalogue.labels.find((catalogueItem) => catalogueItem.id === item.labelOptionId);
      const grind = catalogue.grinds.find((catalogueItem) => catalogueItem.id === item.grindOptionId);
      const price = getBestPrice(catalogue, item);

      if (!coffee || !bag || !size || !label || !grind || !price) {
        throw new Error("One of the cart configurations is no longer available.");
      }

      const subtotalPence = price.unitAmountPence * item.quantity;
      const totalPence = subtotalPence + price.setupFeePence;

      return {
        ...item,
        coffee,
        bag,
        size,
        label,
        grind,
        price,
        subtotalPence,
        totalPence,
      };
    });

    const subtotalPence = pricedItems.reduce((total, item) => total + item.subtotalPence, 0);
    const setupFeePence = pricedItems.reduce((total, item) => total + item.price.setupFeePence, 0);
    const totalPence = subtotalPence + setupFeePence;
    const currency = pricedItems[0]?.price.currency ?? "gbp";

    if (hasDatabaseUrl()) {
      try {
        const db = getDb();
        await db.insert(orders).values({
          id: orderId,
          orderReference,
          customerAccessToken,
          customerEmail: input.customerEmail,
          businessName: input.businessName,
          contactName: input.contactName,
          status: "pending_payment",
          artworkUrl: "cart-artwork-pending",
          subtotalPence,
          setupFeePence,
          totalPence,
          currency,
        });

        await db.insert(orderItems).values(
          pricedItems.map((item) => ({
            id: createOrderItemId(),
            orderId,
            coffeeProductId: item.coffeeProductId,
            bagOptionId: item.bagOptionId,
            bagSizeId: item.bagSizeId,
            labelOptionId: item.labelOptionId,
            grindOptionId: item.grindOptionId,
            quantity: item.quantity,
            unitAmountPence: item.price.unitAmountPence,
            configurationSnapshot: {
              coffee: item.coffee,
              bag: item.bag,
              size: item.size,
              label: item.label,
              grind: item.grind,
              brandName: item.brandName,
              labelTitle: item.labelTitle,
              artworkFileName: item.artworkFileName,
              productionNotes: item.productionNotes,
            },
          }))
        );
        await recordOrderEvent({
          orderId,
          eventType: "order_created",
          title: "Order created",
          detail: "We captured your multi-item order and are waiting for payment confirmation.",
          metadata: {
            itemCount: pricedItems.length,
            customerEmail: input.customerEmail,
          },
        });
      } catch (error) {
        console.warn("Cart checkout is continuing without a database order write.", error);
      }
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        url: `/checkout/success?order=${orderId}&demo=true`,
        orderId,
        warning: "STRIPE_SECRET_KEY is not set, so checkout is using demo success mode.",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.customerEmail,
      client_reference_id: orderId,
      metadata: {
        orderId,
        businessName: input.businessName,
        itemCount: String(pricedItems.length),
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel?order=${orderId}`,
      line_items: pricedItems.flatMap((item) => [
        {
          quantity: item.quantity,
          price_data: {
            currency: item.price.currency,
            unit_amount: item.price.unitAmountPence,
            product_data: {
              name: `${item.coffee.name} ${item.size.label} - ${item.bag.name}`,
              description: `${item.grind.name} grind with ${item.label.name} label`,
            },
          },
        },
        ...(item.price.setupFeePence > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: item.price.currency,
                  unit_amount: item.price.setupFeePence,
                  product_data: {
                    name: `${item.coffee.name} artwork setup`,
                  },
                },
              },
            ]
          : []),
      ]),
    });

    if (hasDatabaseUrl()) {
      try {
        await getDb()
          .update(orders)
          .set({ stripeCheckoutSessionId: session.id, updatedAt: new Date() })
          .where(eq(orders.id, orderId));
        await recordOrderEvent({
          orderId,
          eventType: "checkout_started",
          title: "Checkout started",
          detail: "A payment session was opened for this order.",
          metadata: { stripeCheckoutSessionId: session.id },
        });
      } catch (error) {
        console.warn("Stripe session was created, but the order record could not be updated.", error);
      }
    }

    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create cart checkout." },
      { status: 500 }
    );
  }
}
