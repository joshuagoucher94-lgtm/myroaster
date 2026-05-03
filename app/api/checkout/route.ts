import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { hasDatabaseUrl, getDb } from "@/src/db";
import { orderItems, orders } from "@/src/db/schema";
import { checkoutSchema, createOrderId, createOrderItemId, priceConfiguration } from "@/src/lib/configurator";

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid checkout request." }, { status: 400 });
  }

  try {
    const input = parsed.data;
    const priced = await priceConfiguration(input);
    const orderId = createOrderId();
    const orderItemId = createOrderItemId();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

    if (hasDatabaseUrl()) {
      const db = getDb();
      await db.insert(orders).values({
        id: orderId,
        customerEmail: input.customerEmail,
        businessName: input.businessName,
        contactName: input.contactName,
        status: "pending_payment",
        artworkUrl: input.artworkUrl,
        subtotalPence: priced.subtotalPence,
        setupFeePence: priced.setupFeePence,
        totalPence: priced.totalPence,
        currency: priced.currency,
      });
      await db.insert(orderItems).values({
        id: orderItemId,
        orderId,
        coffeeProductId: input.coffeeProductId,
        bagOptionId: input.bagOptionId,
        bagSizeId: input.bagSizeId,
        labelOptionId: input.labelOptionId,
        grindOptionId: input.grindOptionId,
        quantity: input.quantity,
        unitAmountPence: priced.unitAmountPence,
        configurationSnapshot: {
          coffee: priced.coffee,
          bag: priced.bag,
          size: priced.size,
          label: priced.label,
          grind: priced.grind,
          artworkUrl: input.artworkUrl,
        },
      });
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
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel?order=${orderId}`,
      line_items: [
        {
          quantity: input.quantity,
          price_data: {
            currency: priced.currency,
            unit_amount: priced.unitAmountPence,
            product_data: {
              name: `${priced.coffee.name} ${priced.size.label} - ${priced.bag.name}`,
              description: `${priced.grind.name} grind with ${priced.label.name} label`,
            },
          },
        },
        ...(priced.setupFeePence > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: priced.currency,
                  unit_amount: priced.setupFeePence,
                  product_data: {
                    name: "White-label artwork setup",
                  },
                },
              },
            ]
          : []),
      ],
    });

    if (hasDatabaseUrl()) {
      await getDb()
        .update(orders)
        .set({ stripeCheckoutSessionId: session.id, updatedAt: new Date() })
        .where(eq(orders.id, orderId));
    }

    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout." },
      { status: 500 }
    );
  }
}
