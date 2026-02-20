import { json, error, type RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { verifyJwt } from "$lib/jwt";

function cleanString(v: unknown) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length ? s : null;
}

function parseAge(v: unknown) {
  if (v === null || v === undefined) return null;

  const n =
    typeof v === "number"
      ? v
      : typeof v === "string"
        ? Number(v.trim())
        : NaN;

  if (!Number.isFinite(n)) return null;

  const age = Math.floor(n);
  if (age < 0 || age > 120) throw error(400, "Invalid age");

  return age;
}

const TASK_KEY = "profile_completed";
const TASK_TITLE = "Complete profile";
const AMOUNT = 200;

export const PATCH = async ({ request, cookies }: RequestEvent) => {
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
      wallet: { select: { address: true } }
    }
  });
  if (!user) throw error(401, "Unauthorized");

  const body = await request.json().catch(() => null);
  if (!body) throw error(400, "Invalid JSON");

  const phone = cleanString(body.phone);
  const country = cleanString(body.country);
  const instagram = cleanString(body.instagram);
  const x = cleanString(body.x);
  const telegram = cleanString(body.telegram);
  const age = parseAge(body.age);

  const profileCompleted =
    !!phone &&
    !!country &&
    (!!instagram || !!telegram || !!x);

  const walletTask = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: "wallet_connected" } }
  });

  const alreadyProfileReward = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: TASK_KEY } }
  });

  const walletAddress = user.wallet?.address ?? null;

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.flyUsers.update({
      where: { id: user.id },
      data: { phone, country, age, instagram, x, telegram },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        country: true,
        age: true,
        instagram: true,
        x: true,
        telegram: true
      }
    });

    let reward: null | { claimed: boolean; amount: number } = null;
    if (profileCompleted && walletTask && !alreadyProfileReward && walletAddress) {
      await tx.rewardLedger.create({
        data: {
          userId: user.id,
          walletAddress,
          taskKey: TASK_KEY,
          taskTitle: TASK_TITLE,
          amount: AMOUNT
        }
      });

      await tx.rewardTotal.upsert({
        where: { userId: user.id },
        create: { userId: user.id, walletAddress, totalAmount: AMOUNT },
        update: { walletAddress, totalAmount: { increment: AMOUNT } }
      });

      reward = { claimed: true, amount: AMOUNT };
    } else if (alreadyProfileReward) {
      reward = { claimed: false, amount: AMOUNT };
    }

    return { updated, reward };
  });

  return json({ ok: true, user: result.updated, reward: result.reward });
};
