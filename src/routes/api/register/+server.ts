import type { RequestEvent } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { signJwt } from '$lib/jwt';
import bcrypt from 'bcryptjs';

function text(message: string, status = 200) {
  return new Response(message, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });
}

export const POST = async ({ request, cookies }: RequestEvent) => {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: string; password?: string; name?: string }
      | null;

const email = String(body?.email ?? '').trim();
    const rawPassword = String(body?.password ?? '');
    const name = body?.name ? String(body.name) : null;

    if (!email || !rawPassword) {
      return text('Please provide email and password.', 400);
    }

    if (rawPassword.length < 8) {
      return text('Password must be at least 8 characters.', 400);
    }

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

      return text('OK', 200);
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

      return text('OK', 200);
    }

    return text('Account already exists. Please log in.', 409);
  } catch (e) {
    console.error('Register error:', e);
    return text('Server error. Please try again later.', 500);
  }
};
