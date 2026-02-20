import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { verifyJwt } from "$lib/jwt";
import prisma from "$lib/prisma";

const TASKS = [
  { key: "wallet_connected", title: "Connect wallet" },
  { key: "profile_completed", title: "Fill profile" },
  { key: "social_ig", title: "Instagram visit" },
  { key: "ig_code", title: "Instagram code" },
  { key: "invite_friend", title: "Invite a friend" }
] as const;

const REF_PREFIX = "referral_wallet_connected:";

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("auth_token");
  if (!token) throw redirect(302, "/login");

  let payload: any;
  try {
    payload = await verifyJwt(token);
  } catch {
    cookies.delete("auth_token", { path: "/" });
    throw redirect(302, "/login");
  }

  const email: string | undefined = payload?.email;
  if (!email) throw redirect(302, "/login");

  const user = await prisma.flyUsers.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      referralCode: true,
      wallet: {
        select: {
          address: true,
          provider: true,
          verified: true,
          verifiedAt: true
        }
      },
      total: {
        select: {
          totalAmount: true
        }
      },
      rewards: {
        orderBy: { createdAt: "desc" },
        select: {
          taskKey: true,
          taskTitle: true,
          amount: true,
          createdAt: true
        }
      }
    }
  });

  if (!user) {
    cookies.delete("auth_token", { path: "/" });
    throw redirect(302, "/login");
  }

  const completedKeys = new Set(user.rewards.map((r) => r.taskKey));

  const referralRewards = user.rewards.filter((r) => String(r.taskKey).startsWith(REF_PREFIX));
  const referralCount = referralRewards.length;

  const tasks = TASKS.map((t) => {
    if (t.key === "invite_friend") {
      return {
        key: t.key,
        title: t.title,
        completed: referralCount > 0,
        meta: { referralCount } 
      };
    }

    return {
      key: t.key,
      title: t.title,
      completed: completedKeys.has(t.key)
    };
  });

  const completedCount = tasks.filter((t: any) => t.completed).length;

  const totalAmount =
    user.total?.totalAmount !== null && user.total?.totalAmount !== undefined
      ? Number(user.total.totalAmount)
      : 0;

  return {
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode
      },
      wallet: user.wallet
        ? {
            address: user.wallet.address,
            provider: user.wallet.provider,
            verified: user.wallet.verified,
            verifiedAt: user.wallet.verifiedAt
          }
        : null,
      rewards: user.rewards.map((r) => ({
        taskKey: r.taskKey,
        taskTitle: r.taskTitle ?? r.taskKey,
        amount: Number(r.amount),
        createdAt: r.createdAt
      })),
      totals: {
        totalAmount,
        completedCount,
        totalTasks: TASKS.length
      },
      tasks,
      referral: {
        code: user.referralCode,
        count: referralCount
      }
    }
  };
};
