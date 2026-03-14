import { json, error, type RequestEvent } from "@sveltejs/kit";
import { verifyJwt } from "$lib/jwt";
import prisma from "$lib/prisma";
import { getOnchainTotalUsd } from "$lib/web3/presale";

const PRESALE_500_AMOUNT = 200;
const THRESHOLD_USD = 500;

export const POST = async ({ cookies }: RequestEvent) => {
  const token = cookies.get("auth_token");
  if (!token) throw error(401, "Unauthorized");

  let payload: any;
  try {
    payload = await verifyJwt(token);
  } catch {
    throw error(401, "Unauthorized");
  }

  const email: string | undefined = payload?.email;
  if (!email) throw error(401, "Unauthorized");

  const user = await prisma.flyUsers.findUnique({
    where: { email },
    select: {
      id: true,
      wallet: { select: { address: true, verified: true } },
    },
  });

  if (!user) throw error(401, "Unauthorized");

  // Check if already claimed
  const existing = await prisma.rewardLedger.findUnique({
    where: {
      userId_taskKey: { userId: user.id, taskKey: "presale_500" },
    },
    select: { id: true },
  });

  if (existing) {
    return json({ alreadyClaimed: true });
  }

  // Sum Stripe purchases (paid)
  const stripeAgg = await prisma.presalePurchase.aggregate({
    where: { userId: user.id, status: "paid" },
    _sum: { payAmount: true },
  });
  let totalUsd = stripeAgg._sum.payAmount ?? 0;

  // Sum on-chain purchases (if wallet connected & verified)
  if (user.wallet?.address && user.wallet.verified) {
    totalUsd += await getOnchainTotalUsd(user.wallet.address);
  }

  if (totalUsd < THRESHOLD_USD) {
    return json({
      eligible: false,
      totalUsd: Math.round(totalUsd * 100) / 100,
      threshold: THRESHOLD_USD,
    });
  }

  // Award the reward
  const addr = user.wallet?.address ?? "";

  await prisma.$transaction(async (tx) => {
    await tx.rewardLedger.create({
      data: {
        userId: user.id,
        walletAddress: addr,
        taskKey: "presale_500",
        taskTitle: "Presale purchase $500+",
        amount: PRESALE_500_AMOUNT,
      },
    });

    await tx.rewardTotal.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        walletAddress: addr,
        totalAmount: PRESALE_500_AMOUNT,
      },
      update: {
        totalAmount: { increment: PRESALE_500_AMOUNT },
      },
    });
  });

  return json({
    claimed: true,
    amount: PRESALE_500_AMOUNT,
    totalUsd: Math.round(totalUsd * 100) / 100,
  });
};
