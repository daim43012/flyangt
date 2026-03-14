import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { resolveUser } from "$lib/api/resolveUser";
import { signTaskToken } from "$lib/server/taskToken";

const IG_URL = "https://www.instagram.com/crown_aero_group/";
const TASK_KEY = "social_ig";
const AMOUNT = 75;

export const POST = async ({ request, cookies }: RequestEvent) => {
  const secret = process.env.AIRDROP_TASK_SECRET;
  if (!secret || secret.length < 16) throw error(500, "AIRDROP_TASK_SECRET is not configured");

  const auth = await resolveUser(request, cookies);
  if (!auth) throw error(401, "Unauthorized");

  const user = await prisma.flyUsers.findUnique({
    where: { email: auth.email },
    select: { id: true, wallet: { select: { address: true } } },
  });
  if (!user) throw error(401, "Unauthorized");

  const walletTask = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: "wallet_connected" } },
  });
  if (!walletTask) throw error(400, "Connect wallet task required");

  const already = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: TASK_KEY } },
  });
  if (already) return json({ ok: true, alreadyClaimed: true });

  const walletAddress = user.wallet?.address;
  if (!walletAddress) throw error(400, "Wallet not found");

  const now = Date.now();
  const token = signTaskToken(
    { uid: user.id, wa: walletAddress, task: TASK_KEY, start: now, exp: now + 10 * 60_000 },
    secret
  );

  return json({ ok: true, igUrl: IG_URL, token, amount: AMOUNT, waitMs: 60_000 });
};
