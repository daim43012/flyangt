// src/routes/api/airdrop/wallet/verify/+server.ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { verifyJwt } from "$lib/jwt";
import prisma from "$lib/prisma";
import { verifyMessage } from "ethers";

const WALLET_CONNECT_REWARD = 50;
const REFERRAL_WALLET_REWARD = 150;

export const POST: RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get("auth_token");
  if (!token) {
    return json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await verifyJwt(token);
  } catch {
    cookies.delete("auth_token", { path: "/" });
    return json({ error: "unauthorized" }, { status: 401 });
  }

  const email = payload?.email;
  if (!email) {
    return json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const address = String(body?.address ?? "").toLowerCase();
  const message = String(body?.message ?? "");
  const signature = String(body?.signature ?? "");

  const nonceCookie = cookies.get("wallet_nonce");
  if (!nonceCookie) {
    return json({ error: "nonce_expired" }, { status: 401 });
  }

  const nonce = Number(nonceCookie);
  if (!message.includes(`Nonce: ${nonce}`) || !message.includes(`Address: ${address}`)) {
    return json({ error: "nonce_mismatch" }, { status: 401 });
  }

  const user = await prisma.flyUsers.findUnique({
    where: { email },
    select: {
      id: true,
      referredById: true,
      wallet: { select: { address: true } }
    }
  });

  if (!user) {
    return json({ error: "user_not_found" }, { status: 404 });
  }

  // если у пользователя уже закреплен другой адрес — блокируем
  if (user.wallet?.address && user.wallet.address.toLowerCase() !== address) {
    return json({ error: "wallet_mismatch", registered: user.wallet.address }, { status: 409 });
  }

  const recovered = verifyMessage(message, signature).toLowerCase();
  if (recovered !== address) {
    return json({ error: "signature_mismatch" }, { status: 401 });
  }

  // nonce одноразовый
  cookies.delete("wallet_nonce", { path: "/" });

  // уже ли выполнен таск connect wallet самим пользователем
  const alreadySelf = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: "wallet_connected" } },
    select: { id: true }
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      // ✅ всегда фиксируем verified wallet
      await tx.walletInfo.upsert({
        where: { userId: user.id },
        update: { address, verified: true, verifiedAt: new Date() },
        create: { userId: user.id, address, verified: true, verifiedAt: new Date() }
      });

      let selfRewarded = false;
      let referralRewarded = false;
      let inviterId: string | null = null;

      // ✅ 1) reward за подключение кошелька (только 1 раз)
      if (!alreadySelf) {
        await tx.rewardLedger.create({
          data: {
            userId: user.id,
            walletAddress: address,
            taskKey: "wallet_connected",
            taskTitle: "Connect Wallet",
            amount: WALLET_CONNECT_REWARD
          }
        });

        await tx.rewardTotal.upsert({
          where: { userId: user.id },
          update: {
            walletAddress: address,
            totalAmount: { increment: WALLET_CONNECT_REWARD }
          },
          create: {
            userId: user.id,
            walletAddress: address,
            totalAmount: WALLET_CONNECT_REWARD
          }
        });

        selfRewarded = true;
      } else {
        // на случай если reward уже был, но walletAddress в total не выставлен
        await tx.rewardTotal.upsert({
          where: { userId: user.id },
          update: { walletAddress: address },
          create: { userId: user.id, walletAddress: address, totalAmount: 0 }
        });
      }

      // ✅ 2) reward пригласившему (за каждого реферала 1 раз)
      if (user.referredById) {
        inviterId = user.referredById;

        const referralTaskKey = `referral_wallet_connected:${user.id}`;

        const alreadyReferral = await tx.rewardLedger.findUnique({
          where: { userId_taskKey: { userId: inviterId, taskKey: referralTaskKey } },
          select: { id: true }
        });

        if (!alreadyReferral) {
          await tx.rewardLedger.create({
            data: {
              userId: inviterId,
              walletAddress: address, // адрес реферала (удобно для аудита)
              taskKey: referralTaskKey,
              taskTitle: "Invite a friend (wallet connected)",
              amount: REFERRAL_WALLET_REWARD
            }
          });

          // ✅ RewardTotal требует walletAddress — берём адрес inviter-а из walletInfo (если есть)
          const inviterWallet = await tx.walletInfo.findUnique({
            where: { userId: inviterId },
            select: { address: true }
          });

          await tx.rewardTotal.upsert({
            where: { userId: inviterId },
            update: {
              totalAmount: { increment: REFERRAL_WALLET_REWARD }
            },
            create: {
              userId: inviterId,
              walletAddress: inviterWallet?.address ?? "", // обязательное поле
              totalAmount: REFERRAL_WALLET_REWARD
            }
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
      inviterId: result.inviterId
    });
  } catch (e: any) {
    // fallback: verified всё равно фиксируем
    await prisma.walletInfo.upsert({
      where: { userId: user.id },
      update: { address, verified: true, verifiedAt: new Date() },
      create: { userId: user.id, address, verified: true, verifiedAt: new Date() }
    });

    return json({ error: "tx_failed" }, { status: 500 });
  }
};
