import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { verifyJwt } from "$lib/jwt";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
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
    select: {
      id: true,
      email: true,
      wallet: { select: { address: true, id: true } },
      presaleTotal: { select: { totalTokenAmount: true, updatedAt: true } },
    },
  });
  if (!user) throw error(401, "Unauthorized");

  const purchases = await prisma.presalePurchase.findMany({
    where: {
      userId: user.id,
      method: "stripe",
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      externalId: true,
      status: true,
      week: true,
      price: true,
      payAmount: true,
      tokenAmount: true,
      createdAt: true,
    },
  });

  const offchainPurchases = purchases.map((p) => ({
    sessionId: p.externalId ?? null,
    status: p.status ?? "pending",
    week: p.week ?? null,
    price: p.price ?? 0,
    payAmount: p.payAmount ?? 0,
    amount: p.tokenAmount ?? 0,
    createdAt: p.createdAt.toISOString(),
  }));

  const totalTokenAmount = user.presaleTotal?.totalTokenAmount ?? 0;
  const totalUpdatedAt = user.presaleTotal?.updatedAt?.toISOString?.() ?? null;

  return {
    user: {
      id: user.id,
      email: user.email,
      walletAddress: user.wallet?.address ?? null,
      walletId: user.wallet?.id ?? null,
    },

    presaleTotal: {
      totalTokenAmount,
      updatedAt: totalUpdatedAt,
    },

    offchainPurchases,
  };
};
