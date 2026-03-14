import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { resolveUser } from "$lib/api/resolveUser";

export const PATCH = async ({ request, cookies }: RequestEvent) => {
  const auth = await resolveUser(request, cookies);
  if (!auth) throw error(401, "Unauthorized");

  await prisma.flyUsers.update({
    where: { email: auth.email },
    data: { onboardingDone: true },
  });

  return json({ ok: true });
};
