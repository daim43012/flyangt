import type { RequestEvent } from "@sveltejs/kit";
import { getGoogleClient } from "$lib/google";
import prisma from "$lib/prisma";
import { signJwt } from "$lib/jwt";
import { createUniqueReferralCode } from "$lib/utils/createUniqueReferralCode";

export const GET = async ({ url, cookies }: RequestEvent) => {
  try {
    const code = url.searchParams.get("code");
    if (!code) return new Response("Missing code", { status: 400 });

    const client = getGoogleClient();

    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) return new Response("Missing id_token", { status: 400 });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return new Response("Invalid Google payload", { status: 400 });
    }

    const email = String(payload.email).trim().toLowerCase();
    const googleId = String(payload.sub);
    const name = payload.name ? String(payload.name) : null;

    const pendingRef = cookies.get("pending_ref");
    cookies.delete("pending_ref", { path: "/" });

    let referredById: string | null = null;
    if (pendingRef) {
      const refUser = await prisma.flyUsers.findUnique({
        where: { referralCode: pendingRef },
        select: { id: true }
      });
      if (refUser) referredById = refUser.id;
    }

    const existing = await prisma.flyUsers.findUnique({
      where: { email },
      select: { id: true, email: true, referredById: true }
    });

    let user;
    if (existing) {
      user = await prisma.flyUsers.update({
        where: { email },
        data: {
          googleId,
          name,
          ...(referredById && !existing.referredById ? { referredById } : {})
        }
      });
    } else {
      const myRef = await createUniqueReferralCode();

      user = await prisma.flyUsers.create({
        data: {
          email,
          googleId,
          name,
          referralCode: myRef,
          ...(referredById ? { referredById } : {})
        }
      });
    }

    const token = await signJwt({ uid: user.id, email: user.email });

    cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30
    });

    const redirectTo = cookies.get("redirectAfterLogin") || "/app/dashboard";

    cookies.set("redirectAfterLogin", "", {
      path: "/",
      maxAge: 0
    });

    return new Response(null, {
      status: 302,
      headers: { Location: redirectTo }
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
    return new Response("OAuth failed", { status: 500 });
  }
};
