import { NextResponse } from "next/server";

import {
  buildCustomerPortalHref,
  customerOrderLookupSchema,
  getOrderByReference,
  requireOrderDatabase,
} from "@/src/lib/orders";

export async function POST(request: Request) {
  const parsed = customerOrderLookupSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order lookup request." },
      { status: 400 }
    );
  }

  try {
    requireOrderDatabase();

    const order = await getOrderByReference(parsed.data.orderReference, parsed.data.customerEmail);

    if (!order) {
      return NextResponse.json(
        { error: "We couldn't find an order with that reference and email address." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      orderReference: order.orderReference,
      portalUrl: buildCustomerPortalHref(order.id, order.customerAccessToken),
      status: order.status,
      fulfillmentStage: order.fulfillmentStage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order lookup is unavailable right now." },
      { status: 500 }
    );
  }
}
