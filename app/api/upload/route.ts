import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const allowedTypes = new Set(["image/png", "image/jpeg", "image/svg+xml", "application/pdf"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Artwork file is required." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Upload a PNG, JPG, SVG, or PDF file." }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Artwork must be below 10MB." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const pathname = `artwork/${crypto.randomUUID()}-${safeName}`;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({
      url: `local-upload://${pathname}`,
      warning: "BLOB_READ_WRITE_TOKEN is not set, so this upload is a local placeholder.",
    });
  }

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
