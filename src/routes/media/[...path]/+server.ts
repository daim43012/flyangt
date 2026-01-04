import type { RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import fs from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.resolve("uploads");

function contentTypeByExt(ext: string) {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

export const GET: RequestHandler = async ({ params }) => {
  const relPath = params.path;
  if (!relPath || relPath.includes("..")) throw error(400, "Invalid path");

  const filePath = path.join(UPLOAD_DIR, relPath);

  let bytes: Uint8Array;
  try {
    bytes = (await fs.readFile(filePath)) as unknown as Uint8Array;
  } catch {
    throw error(404, "Not found");
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = contentTypeByExt(ext);

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
};
