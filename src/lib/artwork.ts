import { put } from "@vercel/blob";

export const allowedArtworkMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
]);

export const maxArtworkUploadBytes = 10 * 1024 * 1024;

export function sanitizeArtworkFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function uploadArtworkFile(file: File, directory: string) {
  const safeName = sanitizeArtworkFileName(file.name);
  const pathname = `${directory}/${crypto.randomUUID()}-${safeName}`;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      url: `local-upload://${pathname}`,
      warning: "BLOB_READ_WRITE_TOKEN is not set, so this upload is a local placeholder.",
    };
  }

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
  });

  return { url: blob.url };
}
