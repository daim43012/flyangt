import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_DIR = path.resolve("uploads");

function safeExt(filename: string) {
  const ext = path.extname(filename || "").toLowerCase();
  if (!ext || ext.length > 8) return "";
  return ext.replace(/[^a-z0-9.]/g, "");
}

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    throw error(400, "file is required");
  }

  if (!file.type.startsWith("image/")) {
    throw error(400, "Only image files are allowed");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const ext = safeExt(file.name) || ".bin";
  const filename = `${Date.now()}_${crypto.randomBytes(12).toString("hex")}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  return json({
    url: `/media/${filename}`,
    filename,
    size: buffer.length,
    mime: file.type
  });
};
