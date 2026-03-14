import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import bcrypt from "bcryptjs";

function text(message: string, status = 200) {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const POST = async ({ request }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as {
      token?: string;
      password?: string;
    } | null;

    const token = String(body?.token ?? "").trim();
    const rawPassword = String(body?.password ?? "");

    if (!token) return text("Invalid or missing token.", 400);
    if (!rawPassword || rawPassword.length < 8) {
      return text("Password must be at least 8 characters.", 400);
    }

    const user = await prisma.flyUsers.findUnique({
      where: { resetToken: token },
      select: { id: true, resetTokenExpiry: true },
    });

    if (!user) return text("Invalid or expired link.", 400);

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return text("This link has expired. Please request a new one.", 400);
    }

    const passwordHash = await bcrypt.hash(rawPassword, 12);

    await prisma.flyUsers.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return text("OK", 200);
  } catch (e) {
    console.error("Reset password error:", e);
    return text("Server error. Please try again later.", 500);
  }
};
