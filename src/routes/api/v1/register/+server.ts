import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { signJwt } from "$lib/jwt";
import bcrypt from "bcryptjs";
import { createUniqueReferralCode } from "$lib/utils/createUniqueReferralCode";

export const POST = async ({ request }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      password?: string;
      name?: string;
      referralCode?: string;
    } | null;

    const email = String(body?.email ?? "").trim().toLowerCase();
    const rawPassword = String(body?.password ?? "");
    const name = body?.name ? String(body.name) : null;
    const inputRef = String(body?.referralCode ?? "").trim().toUpperCase();

    if (!email || !rawPassword) {
      return json({ error: "Please provide email and password." }, { status: 400 });
    }
    if (rawPassword.length < 8) {
      return json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(rawPassword, 12);

    let referredById: string | null = null;
    if (inputRef) {
      const refUser = await prisma.flyUsers.findUnique({
        where: { referralCode: inputRef },
        select: { id: true },
      });
      if (!refUser) return json({ error: "Referral code not found." }, { status: 400 });
      referredById = refUser.id;
    }

    const existing = await prisma.flyUsers.findUnique({ where: { email } });

    if (!existing) {
      const myRef = await createUniqueReferralCode();
      if (referredById === myRef) referredById = null;

      const user = await prisma.flyUsers.create({
        data: {
          email,
          name,
          password: passwordHash,
          referralCode: myRef,
          ...(referredById ? { referredById } : {}),
        },
      });

      const token = await signJwt({ uid: user.id, email: user.email });
      return json({ ok: true, token, user: { id: user.id, email: user.email, name: user.name } });
    }

    if (!existing.password) {
      const myRef = existing.referralCode || (await createUniqueReferralCode());
      const user = await prisma.flyUsers.update({
        where: { email },
        data: {
          password: passwordHash,
          ...(name ? { name } : {}),
          ...(existing.referralCode ? {} : { referralCode: myRef }),
          ...(referredById && !existing.referredById ? { referredById } : {}),
        },
      });

      const token = await signJwt({ uid: user.id, email: user.email });
      return json({ ok: true, token, user: { id: user.id, email: user.email, name: user.name } });
    }

    return json({ error: "Account already exists. Please log in." }, { status: 409 });
  } catch (e) {
    console.error("v1/register error:", e);
    return json({ error: "Server error. Please try again later." }, { status: 500 });
  }
};
