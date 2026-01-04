import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async () => {
  const posts = await prisma.flyPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      image: true,
      createdAt: true,
    },
  });

  return {
    posts,
  };
};
