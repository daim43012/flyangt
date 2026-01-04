import { getOnchainBalances } from '$lib/wallet/chainBalances';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  try {
   
    const address = url.searchParams.get('address');
    if (!address) return json({ error: 'Missing address' }, { status: 400 });

    const data = await getOnchainBalances(address);
    return json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: message }, { status: 500 });
  }
};
