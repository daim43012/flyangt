import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { signJwt } from "$lib/jwt";
import bcrypt from "bcryptjs";

export const POST = async ({ request }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      password?: string;
    } | null;

    const email = String(body?.email ?? "").trim().toLowerCase();
    const rawPassword = String(body?.password ?? "");

    if (!email || !rawPassword) {
      return json({ error: "Please provide email and password." }, { status: 400 });
    }

    const user = await prisma.flyUsers.findUnique({ where: { email } });
    if (!user) return json({ error: "Wrong email or password." }, { status: 401 });

    if (!user.password) {
      return json(
        { error: "Password not set. Sign in with Google or create one on Register." },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(rawPassword, user.password);
    if (!ok) return json({ error: "Wrong email or password." }, { status: 401 });

    const token = await signJwt({ uid: user.id, email: user.email });

    return json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    console.error("v1/login error:", e);
    return json({ error: "Server error. Please try again later." }, { status: 500 });
  }
};
