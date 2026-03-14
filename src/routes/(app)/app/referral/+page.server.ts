import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { verifyJwt } from "$lib/jwt";
import prisma from "$lib/prisma";

const REF_PREFIX = "referral_wallet_connected:";

export const load: PageServerLoad = async ({ cookies, url }) => {
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
      referralCode: true,
      referrals: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          wallet: {
            select: { verified: true }
          }
        }
      },
      rewards: {
        select: {
          taskKey: true,
          amount: true
        }
      }
    }
  });

  if (!user) {
    cookies.delete("auth_token", { path: "/" });
    throw redirect(302, "/login");
  }

  const referralRewards = user.rewards.filter((r) =>
    String(r.taskKey).startsWith(REF_PREFIX)
  );

  const totalEarned = referralRewards.reduce(
    (sum, r) => sum + Number(r.amount),
    0
  );

  const activeReferrals = user.referrals.filter(
    (r) => r.wallet?.verified
  ).length;

  const origin = url.origin;
  const referralLink = `${origin}/register?ref=${encodeURIComponent(user.referralCode ?? "")}`;

  return {
    referralCode: user.referralCode,
    referralLink,
    referrals: user.referrals.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      createdAt: r.createdAt?.toISOString() ?? null,
      walletConnected: r.wallet?.verified ?? false
    })),
    stats: {
      totalReferred: user.referrals.length,
      activeReferrals,
      totalEarned
    }
  };
};
