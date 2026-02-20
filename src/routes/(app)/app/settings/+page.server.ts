import prisma from "$lib/prisma";
import { verifyJwt } from "$lib/jwt";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
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
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      country: true,
      age: true,
      instagram: true,
      x: true,
      telegram: true
    }
  });

  if (!user) throw error(401, "Unauthorized");

  return {
    user
  };
};
