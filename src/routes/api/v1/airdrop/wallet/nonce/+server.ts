import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { resolveUser } from "$lib/api/resolveUser";
import { SignJWT } from "jose";
import { randomInt } from "crypto";

/** v1: nonce returned as signed JWT token instead of cookie (mobile-friendly) */
export const POST = async ({ request, cookies }: RequestEvent) => {
  const auth = await resolveUser(request, cookies);
  if (!auth) return json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const address = String(body?.address ?? "").toLowerCase();
  const provider = body?.provider ?? null;

  if (!address || !address.startsWith("0x")) {
    return json({ error: "address_required" }, { status: 400 });
  }

  const user = await prisma.flyUsers.findUnique({
    where: { email: auth.email },
    select: { id: true, wallet: { select: { address: true } } },
  });
  if (!user) return json({ error: "user_not_found" }, { status: 404 });

  if (user.wallet?.address && user.wallet.address.toLowerCase() !== address) {
    return json({ error: "wallet_mismatch", registered: user.wallet.address }, { status: 409 });
  }

  const nonce = randomInt(100000, 999999);
  const message = `FlyANG Wallet Verification\nAddress: ${address}\nNonce: ${nonce}`;

  await prisma.walletInfo.upsert({
    where: { userId: user.id },
    update: { address, provider },
    create: { userId: user.id, address, provider, verified: false },
  });

  // Sign nonce as short-lived JWT so mobile doesn't need cookies
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return json({ error: "server_config_error" }, { status: 500 });

  const nonceToken = await new SignJWT({ _type: "wallet_nonce", nonce, address, userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(secret));

  return json({ nonce, message, nonceToken });
};
