import type { RequestEvent } from '@sveltejs/kit';
import { getGoogleClient } from '$lib/google';
import prisma from '$lib/prisma';
import { signJwt } from '$lib/jwt';

export const GET = async ({ url, cookies }: RequestEvent) => {
  try {
    const code = url.searchParams.get('code');
    if (!code) return new Response('Missing code', { status: 400 });

    const client = getGoogleClient();

    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) return new Response('Missing id_token', { status: 400 });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return new Response('Invalid Google payload', { status: 400 });
    }

    const email = String(payload.email).trim().toLowerCase();
    const googleId = String(payload.sub);
    const name = payload.name ? String(payload.name) : null;

    const user = await prisma.flyUsers.upsert({
      where: { email },
      update: { googleId, name },
      create: { email, googleId, name }
    });

    const token = await signJwt({ uid: user.id, email: user.email });

    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30 
    });

    const redirectTo = cookies.get('redirectAfterLogin') || '/app/dashboard';

    cookies.set('redirectAfterLogin', '', {
      path: '/',
      maxAge: 0
    });

    return new Response(null, {
      status: 302,
      headers: { Location: redirectTo }
    });
  } catch (err) {
    console.error('Google OAuth error:', err);
    return new Response('OAuth failed', { status: 500 });
  }
};
