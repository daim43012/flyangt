import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ url }) => {
  const take = Math.min(Number(url.searchParams.get("take") ?? 24), 60);
  const page = Math.max(Number(url.searchParams.get("page") ?? 1), 1);
  const skip = (page - 1) * take;

  const [items, total] = await Promise.all([
    prisma.flyPost.findMany({
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
      },
    }),
    prisma.flyPost.count(),
  ]);

  return {
    items,
    total,
    page,
    take,
  };
};
