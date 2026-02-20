import { json, error, type RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { verifyJwt } from "$lib/jwt";

export const GET = async ({ url, cookies }: RequestEvent) => {
  const auth = cookies.get("auth_token");
  if (!auth) throw error(401, "Unauthorized");

  let payloadJwt: any;
  try {
    payloadJwt = await verifyJwt(auth);
  } catch {
    throw error(401, "Unauthorized");
  }

  const email: string | undefined = payloadJwt?.email;
  if (!email) throw error(401, "Unauthorized");

  const user = await prisma.flyUsers.findUnique({
    where: { email },
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
