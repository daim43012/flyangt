import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const GET: RequestHandler = async ({ url }) => {
  const take = Math.min(Number(url.searchParams.get("take") ?? 20), 100);
  const skip = Math.max(Number(url.searchParams.get("skip") ?? 0), 0);

  const items = await prisma.flyPost.findMany({
    orderBy: { createdAt: "desc" },
    take,
    skip,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return json({ items });
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  const title = String(body.title ?? "").trim();
  if (!title) throw error(400, "title is required");

  const content = body.content;
  if (!content || typeof content !== "object") {
    throw error(400, "content (TipTap JSON) is required");
  }

  const slug = String(body.slug ?? slugify(title)).trim();
  if (!slug) throw error(400, "slug is required");

  const exists = await prisma.flyPost.findUnique({ where: { slug } });
  if (exists) throw error(409, "slug already exists");

  const post = await prisma.flyPost.create({
    data: {
      slug,
      title,
      excerpt: body.excerpt ?? null,
      content,
      image: body.image ?? null,
      speakers: body.speakers ?? null,
      ...(body.createdAt ? { createdAt: new Date(body.createdAt) } : {}),
    },
  });

  return json(post, { status: 201 });
};
