import { json, error, type RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { verifyJwt } from "$lib/jwt";

const TASK_KEY = "ig_code";
const TASK_TITLE = "Instagram code";
const AMOUNT = 50;

function normalizeCode(v: string) {
  return v.trim().toUpperCase().replace(/\s+/g, "");
}

export const POST = async ({ request, cookies }: RequestEvent) => {
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

  const walletTask = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: "wallet_connected" } }
  });
  if (!walletTask) throw error(400, "Connect wallet task required");

  const body = await request.json().catch(() => ({}));
  const code = body?.code;
  if (!code || typeof code !== "string") throw error(400, "Code required");

  const rawExpected = process.env.IG_AIRDROP_CODE ?? "";
  const expected = normalizeCode(rawExpected);

  console.log("[IG_CODE] expected exists:", !!expected, "len:", expected.length);

  if (!expected) throw error(500, "IG code not configured");

  if (normalizeCode(code) !== expected) {
    throw error(400, "Wrong code");
  }

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
