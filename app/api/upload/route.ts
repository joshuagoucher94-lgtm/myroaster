import { NextResponse } from "next/server";

import { allowedArtworkMimeTypes, maxArtworkUploadBytes, uploadArtworkFile } from "@/src/lib/artwork";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Artwork file is required." }, { status: 400 });
  }

  if (!allowedArtworkMimeTypes.has(file.type)) {
    return NextResponse.json({ error: "Upload a PNG, JPG, SVG, or PDF file." }, { status: 400 });
  }

  if (file.size > maxArtworkUploadBytes) {
    return NextResponse.json({ error: "Artwork must be below 10MB." }, { status: 400 });
  }

  const upload = await uploadArtworkFile(file, "artwork");

  return NextResponse.json(upload);
}
