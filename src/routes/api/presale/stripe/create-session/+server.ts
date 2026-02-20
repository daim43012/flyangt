// src/routes/api/presale/stripe/create-session/+server.ts
import { json, error, type RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { verifyJwt } from "$lib/jwt";
import Stripe from "stripe";
import { JsonRpcProvider, Contract } from "ethers";
import { ADDRESSES } from "$lib/web3/addresses";
import { PRESALE_ABI } from "$lib/web3/abi/presale.abi";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw error(500, "Missing STRIPE_SECRET_KEY");
  return new Stripe(key);
}

function parseUsd(v: unknown) {
  const s = String(v ?? "").replace(",", ".").trim();
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0) throw error(400, "Invalid payAmount");
  return n;
}

async function readPresaleOnchain() {
  const rpc = process.env.POLYGON_RPC_URL?.trim();
  if (!rpc) throw error(500, "Missing POLYGON_RPC_URL");

  const provider = new JsonRpcProvider(rpc);
  const presale = new Contract(ADDRESSES.polygon.presale, PRESALE_ABI as any, provider);

  const [active, week, priceMicro] = await Promise.all([
    presale.isActive(),
    presale.currentWeek(),
    presale.currentPriceUsdMicro(),
  ]);

  const pm = BigInt(priceMicro);
  const priceUsd = Number(pm) / 1e6;

  return { active: Boolean(active), week: Number(week), priceMicro: pm, priceUsd };
}

function toErrMessage(e: any) {
  return e?.message || e?.shortMessage || String(e);
}

export const POST = async ({ request, cookies, url }: RequestEvent) => {
  try {
    // ---- auth ----
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
      select: { id: true, email: true, wallet: { select: { id: true } } },
    });
    if (!user) throw error(401, "Unauthorized");

    // ---- body ----
    const body = await request.json().catch(() => null);
    if (!body) throw error(400, "Invalid JSON");

    const payUsd = parseUsd(body.payAmount);

    // ---- onchain truth ----
    const st = await readPresaleOnchain();
    if (!st.active) throw error(400, "Presale is not active");
    if (!Number.isFinite(st.priceUsd) || st.priceUsd <= 0) throw error(500, "Bad onchain price");

    const tokenAmount = payUsd / st.priceUsd;

    const stripe = getStripe();

    const successUrl = `${url.origin}/app/presale/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${url.origin}/app/presale/cancel`;

    // 1) create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `ANGT Presale Week ${st.week}` },
            unit_amount: Math.round(payUsd * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        week: String(st.week),
        priceMicro: st.priceMicro.toString(),
        payUsd: String(payUsd),
        tokenAmount: String(tokenAmount),
      },
    });

    // 2) write pending purchase linked to session.id
    await prisma.presalePurchase.create({
      data: {
        userId: user.id,
        walletId: user.wallet?.id ?? null,
        method: "stripe",
        currency: "USD",
        status: "pending",
        week: st.week,
        price: st.priceUsd,
        payAmount: payUsd,
        tokenAmount,
        externalId: session.id,
      },
    });

    return json({ ok: true, url: session.url });
  } catch (e: any) {
    console.error("[api/presale/stripe/create-session] ERROR:", e);

    const status = typeof e?.status === "number" ? e.status : 500;
    return json(
      {
        ok: false,
        message: toErrMessage(e),
        name: e?.name ?? null,
        code: e?.code ?? null,
        type: e?.type ?? null,
      },
      { status }
    );
  }
};
