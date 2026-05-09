import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { orderArtworkFiles, orders } from "@/src/db/schema";
import { allowedArtworkMimeTypes, maxArtworkUploadBytes, uploadArtworkFile } from "@/src/lib/artwork";
import {
  createOrderArtworkId,
  getManagedOrder,
  recordOrderEvent,
  requireOrderDatabase,
} from "@/src/lib/orders";

function getAccessToken(request: Request) {
  return new URL(request.url).searchParams.get("token")?.trim() ?? "";
}

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
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

    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") ?? "supporting").trim() || "supporting";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Artwork file is required." }, { status: 400 });
    }

    if (!allowedArtworkMimeTypes.has(file.type)) {
      return NextResponse.json({ error: "Upload a PNG, JPG, SVG, or PDF file." }, { status: 400 });
    }

    if (file.size > maxArtworkUploadBytes) {
      return NextResponse.json({ error: "Artwork must be below 10MB." }, { status: 400 });
    }

    const upload = await uploadArtworkFile(file, `order-artwork/${orderId}`);
    const db = requireOrderDatabase();
    const now = new Date();

    await db.insert(orderArtworkFiles).values({
      id: createOrderArtworkId(),
      orderId,
      fileName: file.name,
      fileUrl: upload.url,
      contentType: file.type,
      sizeBytes: file.size,
      kind,
      uploadedBy: "customer",
    });

    await db
      .update(orders)
      .set({
        artworkUrl: kind === "primary" ? upload.url : order.artworkUrl,
        fulfillmentStage: "artwork_review",
        lastArtworkUploadAt: now,
        lastCustomerActivityAt: now,
        updatedAt: now,
      })
      .where(eq(orders.id, orderId));

    await recordOrderEvent({
      orderId,
      eventType: "customer_uploaded_artwork",
      title: "Artwork uploaded",
      detail: `${file.name} was added to the order.`,
      metadata: {
        kind,
        sizeBytes: file.size,
        fileUrl: upload.url,
      },
    });

    return NextResponse.json({
      file: {
        fileName: file.name,
        fileUrl: upload.url,
        contentType: file.type,
        sizeBytes: file.size,
        kind,
      },
      warning: upload.warning,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload artwork." },
      { status: 500 }
    );
  }
}
