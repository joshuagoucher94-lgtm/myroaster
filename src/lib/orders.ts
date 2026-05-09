import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, hasDatabaseUrl } from "@/src/db";
import { orderArtworkFiles, orderEvents, orderItems, orderMessages, orders } from "@/src/db/schema";

export const customerOrderLookupSchema = z.object({
  orderReference: z.string().trim().min(4).max(40),
  customerEmail: z.email(),
});

export const customerOrderUpdateSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().max(40).default(""),
  customerNotes: z.string().trim().max(1000).default(""),
  requestedFulfillmentDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Requested date must use YYYY-MM-DD.")
    .or(z.literal(""))
    .optional(),
});

export const customerOrderMessageSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

export function createOrderReference() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `MR-${stamp}-${suffix}`;
}

export function createCustomerAccessToken() {
  return `ordtok_${crypto.randomUUID().replace(/-/g, "")}`;
}

export function createOrderArtworkId() {
  return `order_artwork_${crypto.randomUUID()}`;
}

export function createOrderMessageId() {
  return `order_message_${crypto.randomUUID()}`;
}

export function createOrderEventId() {
  return `order_event_${crypto.randomUUID()}`;
}

export function requireOrderDatabase() {
  if (!hasDatabaseUrl()) {
    throw new Error("Order management requires DATABASE_URL to be configured.");
  }

  return getDb();
}

export async function recordOrderEvent(input: {
  orderId: string;
  eventType: string;
  title: string;
  detail?: string | null;
  metadata?: Record<string, unknown>;
  visibleToCustomer?: boolean;
}) {
  const db = requireOrderDatabase();

  await db.insert(orderEvents).values({
    id: createOrderEventId(),
    orderId: input.orderId,
    eventType: input.eventType,
    title: input.title,
    detail: input.detail ?? null,
    metadata: input.metadata,
    visibleToCustomer: input.visibleToCustomer ?? true,
  });
}

export async function getOrderByReference(orderReference: string, customerEmail: string) {
  const db = requireOrderDatabase();

  return db.query.orders.findFirst({
    where: and(
      eq(orders.orderReference, orderReference.trim().toUpperCase()),
      eq(orders.customerEmail, customerEmail.trim().toLowerCase())
    ),
  });
}

export async function getManagedOrder(orderId: string, customerAccessToken: string) {
  const db = requireOrderDatabase();
  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.customerAccessToken, customerAccessToken)),
  });

  if (!order) {
    return null;
  }

  const [items, artworkFiles, messages, events] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).orderBy(asc(orderItems.id)),
    db.select().from(orderArtworkFiles).where(eq(orderArtworkFiles.orderId, orderId)).orderBy(desc(orderArtworkFiles.createdAt)),
    db
      .select()
      .from(orderMessages)
      .where(and(eq(orderMessages.orderId, orderId), eq(orderMessages.visibleToCustomer, true)))
      .orderBy(desc(orderMessages.createdAt)),
    db
      .select()
      .from(orderEvents)
      .where(and(eq(orderEvents.orderId, orderId), eq(orderEvents.visibleToCustomer, true)))
      .orderBy(desc(orderEvents.createdAt)),
  ]);

  return {
    ...order,
    items,
    artworkFiles,
    messages,
    events,
  };
}

export async function getOrderForSuccessPage(input: { orderId?: string; sessionId?: string }) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const db = getDb();

  if (input.orderId) {
    return db.query.orders.findFirst({
      where: eq(orders.id, input.orderId),
    });
  }

  if (input.sessionId) {
    return db.query.orders.findFirst({
      where: eq(orders.stripeCheckoutSessionId, input.sessionId),
    });
  }

  return null;
}

export function buildCustomerPortalHref(orderId: string, customerAccessToken: string) {
  return `/orders/${orderId}?token=${customerAccessToken}`;
}
