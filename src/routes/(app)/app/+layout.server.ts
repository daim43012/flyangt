import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { verifyJwt } from '$lib/jwt';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('auth_token');

  if (!token) {
    throw redirect(302, '/login');
  }

  try {
    const payload = await verifyJwt(token);

    return {
      user: payload
    };
  } catch {
    cookies.delete('auth_token', { path: '/' });
    throw redirect(302, '/login');
  }
};
