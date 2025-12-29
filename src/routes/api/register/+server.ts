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
    | { email?: string; password?: string; name?: string }
    | null;

  const email = String(body?.email ?? '').trim().toLowerCase();
  const rawPassword = String(body?.password ?? '');
  const name = body?.name ? String(body.name) : null;

  if (!email || !rawPassword) return json({ error: 'Email and password required' }, 400);
  if (rawPassword.length < 8) return json({ error: 'Password must be at least 8 chars' }, 400);

  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const existing = await prisma.flyUsers.findUnique({ where: { email } });

  if (!existing) {
    const user = await prisma.flyUsers.create({
      data: { email, name, password: passwordHash } 
    });

    const token = await signJwt({ uid: user.id, email: user.email });
    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30
    });

    return json({ ok: true, mode: 'created' });
  }

  if (!existing.password) {
    const user = await prisma.flyUsers.update({
      where: { email },
      data: { password: passwordHash, ...(name ? { name } : {}) }
    });

    const token = await signJwt({ uid: user.id, email: user.email });
    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30
    });

    return json({ ok: true, mode: 'linked' });
  }

  return json(
    { ok: false, code: 'ACCOUNT_EXISTS', message: 'Account exists. Please log in.' },
    409
  );
};
