import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { orderMessages, orders } from "@/src/db/schema";
import {
  createOrderMessageId,
  customerOrderMessageSchema,
  getManagedOrder,
  recordOrderEvent,
  requireOrderDatabase,
} from "@/src/lib/orders";

function getAccessToken(request: Request) {
  return new URL(request.url).searchParams.get("token")?.trim() ?? "";
}

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const parsed = customerOrderMessageSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid message request." },
      { status: 400 }
    );
  }

  try {
    const { orderId } = await context.params;
    const accessToken = getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Missing order access token." }, { status: 401 });
    }

    const order = await getManagedOrder(orderId, accessToken);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const db = requireOrderDatabase();
    const now = new Date();

    await db.insert(orderMessages).values({
      id: createOrderMessageId(),
      orderId,
      sender: "customer",
      body: parsed.data.message,
      visibleToCustomer: true,
    });

    await db
      .update(orders)
      .set({
        lastCustomerActivityAt: now,
        updatedAt: now,
      })
      .where(eq(orders.id, orderId));

    await recordOrderEvent({
      orderId,
      eventType: "customer_message",
      title: "Customer sent a message",
      detail: parsed.data.message.slice(0, 140),
      visibleToCustomer: false,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send message." },
      { status: 500 }
    );
  }
}
