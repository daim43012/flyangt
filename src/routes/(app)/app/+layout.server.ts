import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { verifyJwt } from '$lib/jwt';
import prisma from '$lib/prisma';

const COOKIE_OPTS = {
  path: '/',
  httpOnly: false,  // needs to be readable by client JS after login
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 10
};

function saveRedirect(cookies: Parameters<LayoutServerLoad>[0]['cookies'], url: URL) {
  const target = url.pathname + url.search;
  if (target && target !== '/login') {
    cookies.set('redirectAfterLogin', target, COOKIE_OPTS);
  }
}

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const token = cookies.get('auth_token');

  if (!token) {
    saveRedirect(cookies, url);
    throw redirect(302, '/login');
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    cookies.delete('auth_token', { path: '/' });
    saveRedirect(cookies, url);
    throw redirect(302, '/login');
  }

  const dbUser = await prisma.flyUsers.findUnique({
    where: { email: (payload as any).email },
    select: { onboardingDone: true },
  });

  return {
    user: payload,
    onboardingDone: dbUser?.onboardingDone ?? false,
  };
};
