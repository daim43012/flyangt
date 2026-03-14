import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { getGoogleClient } from "$lib/google";
import prisma from "$lib/prisma";
import { signJwt } from "$lib/jwt";
import { createUniqueReferralCode } from "$lib/utils/createUniqueReferralCode";

/**
 * POST /api/v1/auth/google/token
 * Mobile Google OAuth: client gets idToken via expo-auth-session or
 * @react-native-google-signin/google-signin, then sends it here.
 * Returns JWT for use as Bearer token.
 *
 * Body: { idToken: string, referralCode?: string }
 */
export const POST = async ({ request }: RequestEvent) => {
  try {
    const body = await request.json().catch(() => null);
    const idToken = String(body?.idToken ?? "").trim();
    const referralCode = String(body?.referralCode ?? "").trim().toUpperCase();

    if (!idToken) {
      return json({ error: "idToken required" }, { status: 400 });
    }

    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return json({ error: "Invalid Google token" }, { status: 400 });
    }

    const email = String(payload.email).trim().toLowerCase();
    const googleId = String(payload.sub);
    const name = payload.name ? String(payload.name) : null;

    let referredById: string | null = null;
    if (referralCode) {
      const refUser = await prisma.flyUsers.findUnique({
        where: { referralCode },
        select: { id: true },
      });
      if (refUser) referredById = refUser.id;
    }

    const existing = await prisma.flyUsers.findUnique({
      where: { email },
      select: { id: true, email: true, referredById: true },
    });

    let user;
    if (existing) {
      user = await prisma.flyUsers.update({
        where: { email },
        data: {
          googleId,
          name,
          ...(referredById && !existing.referredById ? { referredById } : {}),
        },
      });
    } else {
      const myRef = await createUniqueReferralCode();
      user = await prisma.flyUsers.create({
        data: {
          email,
          googleId,
          name,
          referralCode: myRef,
          ...(referredById ? { referredById } : {}),
        },
      });
    }

    const token = await signJwt({ uid: user.id, email: user.email });

    return json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("[v1/auth/google/token] error:", err);
    return json({ error: "Google authentication failed" }, { status: 400 });
  }
};
