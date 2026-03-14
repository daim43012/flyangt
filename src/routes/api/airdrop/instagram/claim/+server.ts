// src/routes/api/airdrop/instagram/claim/+server.ts
import { json, error, type RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { verifyJwt } from "$lib/jwt";
import { verifyTaskToken } from "$lib/server/taskToken";

const TASK_KEY = "social_ig";
const TASK_TITLE = "Instagram visit";
const AMOUNT = 75;

export const POST = async ({ request, cookies }: RequestEvent) => {
  const secret = process.env.AIRDROP_TASK_SECRET;
  console.log("[IG_CLAIM] secret exists:", !!secret, "len:", secret?.length ?? 0);

  if (!secret || secret.length < 16) {
    throw error(500, "AIRDROP_TASK_SECRET is not configured");
  }

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
    select: { id: true }
  });
  if (!user) throw error(401, "Unauthorized");

  const body = await request.json().catch(() => ({}));
  const token = body?.token;
  if (!token || typeof token !== "string") throw error(400, "Token required");

  // ✅ verify with process.env secret
  const p = verifyTaskToken(token, secret);

  if (p.uid !== user.id) throw error(403, "Token mismatch");
  if (p.task !== TASK_KEY) throw error(400, "Wrong task");
  if (Date.now() > Number(p.exp)) throw error(400, "Token expired");

  const waited = Date.now() - Number(p.start);
  if (waited < 60_000) {
    return json({ ok: false, needWaitMs: 60_000 - waited });
  }

  // ✅ требуем выполненный wallet_connected
  const walletTask = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: "wallet_connected" } }
  });
  if (!walletTask) throw error(400, "Connect wallet task required");

  const wallet = await prisma.walletInfo.findUnique({
    where: { userId: user.id },
    select: { address: true }
  });
  if (!wallet?.address) throw error(400, "Wallet not found");

  try {
    const total = await prisma.$transaction(async (tx) => {
      await tx.rewardLedger.create({
        data: {
          userId: user.id,
          walletAddress: wallet.address,
          taskKey: TASK_KEY,
          taskTitle: TASK_TITLE,
          amount: AMOUNT
        }
      });

      return tx.rewardTotal.upsert({
        where: { userId: user.id },
        create: { userId: user.id, walletAddress: wallet.address, totalAmount: AMOUNT },
        update: { walletAddress: wallet.address, totalAmount: { increment: AMOUNT } }
      });
    });

    return json({ ok: true, claimed: true, amount: AMOUNT, totalAmount: total.totalAmount });
  } catch {
    return json({ ok: true, alreadyClaimed: true });
  }
};
