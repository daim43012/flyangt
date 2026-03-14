// src/routes/api/presale/stripe/webhook/+server.ts
import { json, error, type RequestEvent } from "@sveltejs/kit";
import Stripe from "stripe";
import prisma from "$lib/prisma";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw error(500, "Missing STRIPE_SECRET_KEY");
  return new Stripe(key);
}

function getWebhookSecret() {
  const sec = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!sec) throw error(500, "Missing STRIPE_WEBHOOK_SECRET");
  return sec;
}

async function readRawBody(request: Request) {
  const ab = await request.arrayBuffer();
  return Buffer.from(ab);
}

function safeStr(v: unknown) {
  return typeof v === "string" ? v : "";
}

export const POST = async ({ request }: RequestEvent) => {
  const stripe = getStripe();
  const whsec = getWebhookSecret();

  const sig = request.headers.get("stripe-signature");
  if (!sig) throw error(400, "Missing stripe-signature");

  const raw = await readRawBody(request);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whsec);
  } catch (e: any) {
    console.error("[stripe:webhook] signature verify failed:", e?.message ?? e);
    throw error(400, "Webhook signature verification failed");
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = safeStr(session.id);
      if (!sessionId) return json({ ok: true, ignored: true });

      const purchase = await prisma.presalePurchase.findUnique({
        where: { externalId: sessionId },
        select: {
          id: true,
          status: true,
          userId: true,
          walletId: true,
          tokenAmount: true,
        },
      });

      if (!purchase) {
        console.warn("[stripe:webhook] purchase not found for session:", sessionId);
        return json({ ok: true, ignored: true });
      }

      // idempotent
      if (purchase.status === "paid") {
        return json({ ok: true, already: true });
      }

      // Check if presale_500 reward already exists (before the transaction)
      const rewardExists = await prisma.rewardLedger.findUnique({
        where: {
          userId_taskKey: {
            userId: purchase.userId,
            taskKey: "presale_500",
          },
        },
        select: { id: true },
      });

      await prisma.$transaction(async (tx) => {
        await tx.presalePurchase.update({
          where: { id: purchase.id },
          data: { status: "paid" },
        });

        const inc = purchase.tokenAmount || 0;

        await tx.presaleTotal.upsert({
          where: { userId: purchase.userId },
          create: {
            userId: purchase.userId,
            walletId: purchase.walletId ?? null,
            totalTokenAmount: inc,
          },
          update: {
            walletId: purchase.walletId ?? null,
            totalTokenAmount: { increment: inc },
          },
        });

        // Award presale_500 airdrop task if total Stripe purchases >= $500
        if (!rewardExists) {
          const agg = await tx.presalePurchase.aggregate({
            where: { userId: purchase.userId, status: "paid" },
            _sum: { payAmount: true },
          });

          if ((agg._sum.payAmount ?? 0) >= 500) {
            const wallet = purchase.walletId
              ? await tx.walletInfo.findUnique({
                  where: { id: purchase.walletId },
                  select: { address: true },
                })
              : null;

            const addr = wallet?.address ?? "";

            await tx.rewardLedger.create({
              data: {
                userId: purchase.userId,
                walletAddress: addr,
                taskKey: "presale_500",
                taskTitle: "Presale purchase $500+",
                amount: 500,
              },
            });

            await tx.rewardTotal.upsert({
              where: { userId: purchase.userId },
              create: {
                userId: purchase.userId,
                walletAddress: addr,
                totalAmount: 500,
              },
              update: {
                totalAmount: { increment: 500 },
              },
            });
          }
        }
      });

      return json({ ok: true });
    }

    // optional: mark pending as expired/failed if you enabled these events
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = safeStr(session.id);
      if (sessionId) {
        await prisma.presalePurchase.updateMany({
          where: { externalId: sessionId, status: "pending" },
          data: { status: "expired" },
        });
      }
      return json({ ok: true });
    }

    return json({ ok: true, ignored: true, type: event.type });
  } catch (e: any) {
    console.error("[stripe:webhook] handler error:", e);
    throw error(500, e?.message ?? "Webhook handler error");
  }
};
