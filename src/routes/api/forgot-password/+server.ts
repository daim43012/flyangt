import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import { RESEND_API_KEY } from "$env/static/private";

const resend = new Resend(RESEND_API_KEY);

function text(message: string, status = 200) {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const POST = async ({ request }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as { email?: string } | null;
    const email = String(body?.email ?? "").trim().toLowerCase();

    console.log("[forgot-password] request for:", email);

    if (!email) return text("Please provide an email.", 400);

    const user = await prisma.flyUsers.findUnique({ where: { email } });

    console.log("[forgot-password] user found:", !!user, "| has password:", !!user?.password);

    // Всегда отвечаем OK чтобы не раскрывать наличие аккаунта
    if (!user || !user.password) {
      return text("OK", 200);
    }

    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 час

    await prisma.flyUsers.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    console.log("[forgot-password] token saved, expiry:", expiry.toISOString());

    const resetUrl = `https://flyangt.com/reset-password?token=${token}`;

    const { data, error: resendError } = await resend.emails.send({
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
      console.error("[forgot-password] Resend error:", JSON.stringify(resendError));
      return text("Server error. Please try again later.", 500);
    }

    console.log("[forgot-password] email sent, id:", data?.id);
    return text("OK", 200);
  } catch (e) {
    console.error("[forgot-password] unexpected error:", e);
    return text("Server error. Please try again later.", 500);
  }
};
