import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getDb, hasDatabaseUrl } from "@/src/db";
import { orders } from "@/src/db/schema";
import { recordOrderEvent } from "@/src/lib/orders";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed" && hasDatabaseUrl()) {
    const session = event.data.object;
    const orderId = session.client_reference_id ?? session.metadata?.orderId;

    if (orderId) {
      await getDb()
        .update(orders)
        .set({
          status: "paid",
          fulfillmentStage: "artwork_review",
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));
      await recordOrderEvent({
        orderId,
        eventType: "payment_received",
        title: "Payment received",
        detail: "Payment cleared successfully. Your artwork is ready for review.",
        metadata: {
          stripeCheckoutSessionId: session.id,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
