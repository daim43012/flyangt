import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { resolveUser } from "$lib/api/resolveUser";

export const POST = async ({ request, cookies }: RequestEvent) => {
  const auth = await resolveUser(request, cookies);
  if (!auth) return json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const address = String(body?.address ?? "").toLowerCase();

  if (!address || !address.startsWith("0x")) {
    return json({ error: "address_required" }, { status: 400 });
  }

  const user = await prisma.flyUsers.findUnique({
    where: { email: auth.email },
    select: {
      id: true,
      wallet: { select: { address: true, verified: true, verifiedAt: true, provider: true } },
    },
  });
  if (!user) return json({ error: "user_not_found" }, { status: 404 });

  if (user.wallet?.address && user.wallet.address.toLowerCase() !== address) {
    return json(
      { ok: false, error: "wallet_mismatch", registered: user.wallet.address },
      { status: 409 }
    );
  }

  const reward = await prisma.rewardLedger.findUnique({
    where: { userId_taskKey: { userId: user.id, taskKey: "wallet_connected" } },
    select: { id: true, amount: true, createdAt: true },
  });

  const verified = Boolean(user.wallet?.verified);

  return json({
    ok: true,
    address,
    registered: user.wallet?.address ?? null,
    verified,
    verifiedAt: user.wallet?.verifiedAt ?? null,
    rewardIssued: Boolean(reward),
    rewardAmount: reward?.amount ?? 0,
    rewardAt: reward?.createdAt ?? null,
    needsSignature: !verified,
  });
};
