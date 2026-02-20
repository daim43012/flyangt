import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { signJwt } from "$lib/jwt";
import bcrypt from "bcryptjs";
import { createUniqueReferralCode } from "$lib/utils/createUniqueReferralCode";

function text(message: string, status = 200) {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}

export const POST = async ({ request, cookies }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: string; password?: string; name?: string; referralCode?: string }
      | null;

    const email = String(body?.email ?? "").trim().toLowerCase();
    const rawPassword = String(body?.password ?? "");
    const name = body?.name ? String(body.name) : null;

    const inputRef = String(body?.referralCode ?? "")
      .trim()
      .toUpperCase();

    if (!email || !rawPassword) {
      return text("Please provide email and password.", 400);
    }

    if (rawPassword.length < 8) {
      return text("Password must be at least 8 characters.", 400);
    }

    const passwordHash = await bcrypt.hash(rawPassword, 12);

    let referredById: string | null = null;
    if (inputRef) {
      const refUser = await prisma.flyUsers.findUnique({
        where: { referralCode: inputRef },
        select: { id: true }
      });

      if (!refUser) return text("Referral code not found.", 400);
      referredById = refUser.id;
    }

    const existing = await prisma.flyUsers.findUnique({ where: { email } });

    if (!existing) {
      const myRef = await createUniqueReferralCode();

      if (referredById && referredById === myRef) {
        referredById = null;
      }

      const user = await prisma.flyUsers.create({
        data: {
          email,
          name,
          password: passwordHash,
          referralCode: myRef,
          ...(referredById ? { referredById } : {})
        }
      });

      const token = await signJwt({ uid: user.id, email: user.email });
      cookies.set("auth_token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30
      });

      return text("OK", 200);
    }

    if (!existing.password) {
      const myRef = existing.referralCode || (await createUniqueReferralCode());

      const user = await prisma.flyUsers.update({
        where: { email },
        data: {
          password: passwordHash,
          ...(name ? { name } : {}),
          ...(existing.referralCode ? {} : { referralCode: myRef }),
          ...(referredById && !existing.referredById ? { referredById } : {})
        }
      });

      const token = await signJwt({ uid: user.id, email: user.email });
      cookies.set("auth_token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30
      });

      return text("OK", 200);
    }

    return text("Account already exists. Please log in.", 409);
  } catch (e) {
    console.error("Register error:", e);
    return text("Server error. Please try again later.", 500);
  }
};