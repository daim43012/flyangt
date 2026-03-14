import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import { RESEND_API_KEY } from "$env/static/private";

const resend = new Resend(RESEND_API_KEY);

export const POST = async ({ request }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as { email?: string } | null;
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return Response.json({ error: "Please provide an email." }, { status: 400 });
    }

    const user = await prisma.flyUsers.findUnique({ where: { email } });

    if (!user || !user.password) {
      return Response.json({ ok: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.flyUsers.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `https://flyangt.com/reset-password?token=${token}`;

    const { error: resendError } = await resend.emails.send({
      from: "FlyANGT <noreply@flyangt.com>",
      to: email,
      subject: "Reset your FlyANGT password",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #121416;">
          <div style="font-size: 22px; font-weight: 600; margin-bottom: 8px;">Reset your password</div>
          <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
            We received a request to reset your FlyANGT account password.<br>
            Click the button below. The link is valid for <strong>1 hour</strong>.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block; padding:13px 28px; border-radius:14px; background:#B08D57; color:#fff; font-size:13px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; text-decoration:none;">
            Reset password
          </a>
          <p style="margin-top:32px; color:#94a3b8; font-size:12px;">
            If you didn't request this, ignore this email — your password won't change.
          </p>
        </div>
      `,
    });

    if (resendError) {
      console.error("[v1/forgot-password] Resend error:", JSON.stringify(resendError));
      return Response.json({ error: "Server error. Please try again later." }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error("[v1/forgot-password] error:", e);
    return Response.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
};
