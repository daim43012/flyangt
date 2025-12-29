import type { LayoutServerLoad } from './$types';
import { verifyJwt } from '$lib/jwt';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('auth_token');
  if (!token) return { user: null };

  try {
    const user = await verifyJwt(token);
    return { user };
  } catch {
    cookies.delete('auth_token', { path: '/' });
    return { user: null };
  }
};
