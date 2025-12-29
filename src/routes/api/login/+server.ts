import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { signJwt } from "$lib/jwt";
import bcrypt from "bcryptjs";

function text(message: string, status = 200) {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const POST = async ({ request, cookies }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      password?: string;
    } | null;

    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();
    const rawPassword = String(body?.password ?? "");

    if (!email || !rawPassword) {
      return text("Please provide email and password.", 400);
    }

    const user = await prisma.flyUsers.findUnique({ where: { email } });

    if (!user) return text("Wrong email or password.", 401);

    if (!user.password) {
      return text(
        "Password not set. Sign in with Google or create one on Register.",
        401
      );
    }

    const ok = await bcrypt.compare(rawPassword, user.password);
    if (!ok) return text("Wrong email or password.", 401);

    const token = await signJwt({ uid: user.id, email: user.email });
    cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    return text("OK", 200);
  } catch (e) {
    console.error("Login error:", e);
    return text("Server error. Please try again later.", 500);
  }
};
