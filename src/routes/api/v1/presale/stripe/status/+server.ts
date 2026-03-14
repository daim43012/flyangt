import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { resolveUser } from "$lib/api/resolveUser";

export const GET = async ({ request, cookies, url }: RequestEvent) => {
  const auth = await resolveUser(request, cookies);
  if (!auth) throw error(401, "Unauthorized");

  const user = await prisma.flyUsers.findUnique({
    where: { email: auth.email },
    select: { id: true },
  });
  if (!user) throw error(401, "Unauthorized");

  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) throw error(400, "Missing session_id");

  const p = await prisma.presalePurchase.findFirst({
    where: { userId: user.id, externalId: sessionId },
    select: {
      id: true,
      status: true,
      week: true,
      price: true,
      payAmount: true,
      tokenAmount: true,
      createdAt: true,
    },
  });

  if (!p) throw error(404, "Purchase not found");

  return json({ ok: true, purchase: p });
};
