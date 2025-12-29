import type { RequestEvent } from '@sveltejs/kit';
import { getGoogleAuthUrl } from '$lib/google';

export const GET = async ({ url }: RequestEvent) => {
  const state = url.searchParams.get('state') ?? undefined;
  const authUrl = getGoogleAuthUrl(state);

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl }
  });
};
