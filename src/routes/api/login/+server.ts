import type { RequestEvent } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { signJwt } from '$lib/jwt';
import bcrypt from 'bcryptjs';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

export const POST = async ({ request, cookies }: RequestEvent) => {
  const body = await request.json().catch(() => null) as
    | { email?: string; password?: string }
    | null;

  const email = String(body?.email ?? '').trim().toLowerCase();
  const rawPassword = String(body?.password ?? '');

  if (!email || !rawPassword) return json({ error: 'Email and password required' }, 400);

  const user = await prisma.flyUsers.findUnique({ where: { email } });

  if (!user) return json({ ok: false, code: 'INVALID_CREDENTIALS' }, 401);

  if (!user.password) {
    return json(
      {
        ok: false,
        code: 'PASSWORD_NOT_SET',
        message: 'Account exists. Sign in with Google or set a password via registration.'
      },
      401
    );
  }

  const ok = await bcrypt.compare(rawPassword, user.password);
  if (!ok) return json({ ok: false, code: 'INVALID_CREDENTIALS' }, 401);

  const token = await signJwt({ uid: user.id, email: user.email });
  cookies.set('auth_token', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30
  });

  return json({ ok: true });
};
