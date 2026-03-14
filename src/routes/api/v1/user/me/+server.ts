import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { resolveUser } from "$lib/api/resolveUser";

export const GET = async ({ request, cookies }: RequestEvent) => {
  const auth = await resolveUser(request, cookies);
  if (!auth) return json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.flyUsers.findUnique({
    where: { email: auth.email },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      country: true,
      age: true,
      instagram: true,
      x: true,
      telegram: true,
      onboardingDone: true,
      referralCode: true,
      wallet: { select: { address: true, verified: true, verifiedAt: true } },
    },
  });

  if (!user) return json({ error: "User not found" }, { status: 404 });

  return json({ ok: true, user });
};
