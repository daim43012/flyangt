import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { resolveUser } from "$lib/api/resolveUser";
import { verifyMessage } from "ethers";
import { jwtVerify } from "jose";

const WALLET_CONNECT_REWARD = 50;
const REFERRAL_WALLET_REWARD = 150;

/** v1: nonce verified from nonceToken JWT instead of cookie (mobile-friendly) */
export const POST = async ({ request, cookies }: RequestEvent) => {
  const auth = await resolveUser(request, cookies);
  if (!auth) return json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const address = String(body?.address ?? "").toLowerCase();
  const message = String(body?.message ?? "");
  const signature = String(body?.signature ?? "");
  const nonceToken = String(body?.nonceToken ?? "");

  if (!nonceToken) return json({ error: "nonce_token_required" }, { status: 400 });

  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return json({ error: "server_config_error" }, { status: 500 });

  let noncePayload: any;
  try {
    const { payload } = await jwtVerify(nonceToken, new TextEncoder().encode(secret));
    noncePayload = payload;
  } catch {
    return json({ error: "nonce_expired" }, { status: 401 });
  }

  if (
    noncePayload._type !== "wallet_nonce" ||
    noncePayload.userId !== auth.uid ||
    noncePayload.address !== address
  ) {
    return json({ error: "nonce_mismatch" }, { status: 401 });
  }

  const nonce = Number(noncePayload.nonce);
  if (!message.includes(`Nonce: ${nonce}`) || !message.includes(`Address: ${address}`)) {
    return json({ error: "nonce_mismatch" }, { status: 401 });
  }

  const user = await prisma.flyUsers.findUnique({
    where: { email: auth.email },
    select: { id: true, referredById: true, wallet: { select: { address: true } } },
  });
  if (!user) return json({ error: "user_not_found" }, { status: 404 });

  if (user.wallet?.address && user.wallet.address.toLowerCase() !== address) {
    return json({ error: "wallet_mismatch", registered: user.wallet.address }, { status: 409 });
  }

  const recovered = verifyMessage(message, signature).toLowerCase();
  if (recovered !== address) {
    return json({ error: "signature_mismatch" }, { status: 401 });
  }

  const alreadySelf = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: "wallet_connected" } },
    select: { id: true },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.walletInfo.upsert({
        where: { userId: user.id },
        update: { address, verified: true, verifiedAt: new Date() },
        create: { userId: user.id, address, verified: true, verifiedAt: new Date() },
      });

      let selfRewarded = false;
      let referralRewarded = false;
      let inviterId: string | null = null;

      if (!alreadySelf) {
        await tx.rewardLedger.create({
          data: {
            userId: user.id,
            walletAddress: address,
            taskKey: "wallet_connected",
            taskTitle: "Connect Wallet",
            amount: WALLET_CONNECT_REWARD,
          },
        });

        await tx.rewardTotal.upsert({
          where: { userId: user.id },
          update: { walletAddress: address, totalAmount: { increment: WALLET_CONNECT_REWARD } },
          create: { userId: user.id, walletAddress: address, totalAmount: WALLET_CONNECT_REWARD },
        });

        selfRewarded = true;
      } else {
        await tx.rewardTotal.upsert({
          where: { userId: user.id },
          update: { walletAddress: address },
          create: { userId: user.id, walletAddress: address, totalAmount: 0 },
        });
      }

      if (user.referredById) {
        inviterId = user.referredById;
        const referralTaskKey = `referral_wallet_connected:${user.id}`;
        const alreadyReferral = await tx.rewardLedger.findUnique({
          where: { userId_taskKey: { userId: inviterId, taskKey: referralTaskKey } },
          select: { id: true },
        });

        if (!alreadyReferral) {
          await tx.rewardLedger.create({
            data: {
              userId: inviterId,
              walletAddress: address,
              taskKey: referralTaskKey,
              taskTitle: "Invite a friend (wallet connected)",
              amount: REFERRAL_WALLET_REWARD,
            },
          });

          const inviterWallet = await tx.walletInfo.findUnique({
            where: { userId: inviterId },
            select: { address: true },
          });

          await tx.rewardTotal.upsert({
            where: { userId: inviterId },
            update: { totalAmount: { increment: REFERRAL_WALLET_REWARD } },
            create: {
              userId: inviterId,
              walletAddress: inviterWallet?.address ?? "",
              totalAmount: REFERRAL_WALLET_REWARD,
            },
          });

          referralRewarded = true;
        }
      }

      return { selfRewarded, referralRewarded, inviterId };
    });

    return json({
      ok: true,
      address,
      completedTaskKey: "wallet_connected",
      selfRewarded: result.selfRewarded,
      referralRewarded: result.referralRewarded,
      inviterId: result.inviterId,
    });
  } catch (e: any) {
    await prisma.walletInfo.upsert({
      where: { userId: user.id },
      update: { address, verified: true, verifiedAt: new Date() },
      create: { userId: user.id, address, verified: true, verifiedAt: new Date() },
    });
    return json({ error: "tx_failed" }, { status: 500 });
  }
};
