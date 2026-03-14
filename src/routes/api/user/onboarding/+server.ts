import { json, error, type RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { verifyJwt } from "$lib/jwt";

export const PATCH = async ({ cookies }: RequestEvent) => {
  const auth = cookies.get("auth_token");
  if (!auth) throw error(401, "Unauthorized");

  let payload: any;
  try {
    payload = await verifyJwt(auth);
  } catch {
    throw error(401, "Unauthorized");
  }

  const email: string | undefined = payload?.email;
  if (!email) throw error(401, "Unauthorized");

  await prisma.flyUsers.update({
    where: { email },
    data: { onboardingDone: true },
  });

  return json({ ok: true });
};
