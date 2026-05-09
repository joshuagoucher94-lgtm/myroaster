import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { orders } from "@/src/db/schema";
import {
  customerOrderUpdateSchema,
  getManagedOrder,
  recordOrderEvent,
  requireOrderDatabase,
} from "@/src/lib/orders";

function getAccessToken(request: Request) {
  return new URL(request.url).searchParams.get("token")?.trim() ?? "";
}

function serializeOrder(order: NonNullable<Awaited<ReturnType<typeof getManagedOrder>>>) {
  return {
    id: order.id,
    orderReference: order.orderReference,
    customerEmail: order.customerEmail,
    businessName: order.businessName,
    contactName: order.contactName,
    customerPhone: order.customerPhone,
    customerNotes: order.customerNotes,
    status: order.status,
    fulfillmentStage: order.fulfillmentStage,
    artworkUrl: order.artworkUrl,
    requestedFulfillmentDate: order.requestedFulfillmentDate,
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    subtotalPence: order.subtotalPence,
    setupFeePence: order.setupFeePence,
    totalPence: order.totalPence,
    currency: order.currency,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    lastCustomerActivityAt: order.lastCustomerActivityAt,
    lastArtworkUploadAt: order.lastArtworkUploadAt,
    items: order.items,
    artworkFiles: order.artworkFiles,
    messages: order.messages,
    events: order.events,
  };
}

export async function GET(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const accessToken = getAccessToken(_request);

    if (!accessToken) {
      return NextResponse.json({ error: "Missing order access token." }, { status: 401 });
    }

    const order = await getManagedOrder(orderId, accessToken);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order: serializeOrder(order) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load order." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const parsed = customerOrderUpdateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order update request." },
      { status: 400 }
    );
  }

  try {
    const { orderId } = await context.params;
    const accessToken = getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Missing order access token." }, { status: 401 });
    }

    const existingOrder = await getManagedOrder(orderId, accessToken);

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const db = requireOrderDatabase();
    const nextRequestedDate = parsed.data.requestedFulfillmentDate?.trim() || null;
    const changedFields = [
      existingOrder.businessName !== parsed.data.businessName ? "business name" : null,
      existingOrder.contactName !== parsed.data.contactName ? "contact name" : null,
      existingOrder.customerPhone !== parsed.data.customerPhone ? "phone" : null,
      existingOrder.customerNotes !== parsed.data.customerNotes ? "notes" : null,
      (existingOrder.requestedFulfillmentDate ?? null) !== nextRequestedDate ? "requested date" : null,
    ].filter(Boolean);

    await db
      .update(orders)
      .set({
        businessName: parsed.data.businessName,
        contactName: parsed.data.contactName,
        customerPhone: parsed.data.customerPhone,
        customerNotes: parsed.data.customerNotes,
        requestedFulfillmentDate: nextRequestedDate,
        lastCustomerActivityAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    if (changedFields.length > 0) {
      await recordOrderEvent({
        orderId,
        eventType: "customer_updated_order",
        title: "Customer updated order details",
        detail: `Updated ${changedFields.join(", ")}.`,
      });
    }

    const updatedOrder = await getManagedOrder(orderId, accessToken);

    return NextResponse.json({ order: updatedOrder ? serializeOrder(updatedOrder) : null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update order." },
      { status: 500 }
    );
  }
}
