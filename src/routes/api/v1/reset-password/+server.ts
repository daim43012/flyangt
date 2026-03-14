import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import bcrypt from "bcryptjs";

export const POST = async ({ request }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as {
      token?: string;
      password?: string;
    } | null;

    const token = String(body?.token ?? "").trim();
    const rawPassword = String(body?.password ?? "");

    if (!token) {
      return Response.json({ error: "Invalid or missing token." }, { status: 400 });
    }
    if (!rawPassword || rawPassword.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const user = await prisma.flyUsers.findUnique({
      where: { resetToken: token },
      select: { id: true, resetTokenExpiry: true },
    });

    if (!user) {
      return Response.json({ error: "Invalid or expired link." }, { status: 400 });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return Response.json(
        { error: "This link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(rawPassword, 12);

    await prisma.flyUsers.update({
      where: { id: user.id },
      data: { password: passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    return Response.json({ ok: true });
  } catch (e) {
    console.error("[v1/reset-password] error:", e);
    return Response.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
};
