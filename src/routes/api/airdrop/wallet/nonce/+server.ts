import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyJwt } from '$lib/jwt';
import  prisma  from '$lib/prisma';
import { randomInt } from 'crypto';

export const POST: RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get('auth_token');
  if (!token) {
    return json({ error: 'unauthorized' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await verifyJwt(token);
  } catch (e) {
    cookies.delete('auth_token', { path: '/' });
    return json({ error: 'unauthorized' }, { status: 401 });
  }

  const email = payload?.email;
  if (!email) {
    return json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const address = String(body?.address ?? '').toLowerCase();
  const provider = body?.provider ?? null;

  if (!address || !address.startsWith('0x')) {
    return json({ error: 'address_required' }, { status: 400 });
  }

  const user = await prisma.flyUsers.findUnique({
    where: { email },
    select: {
      id: true,
      wallet: { select: { address: true } }
    }
  });

  if (!user) {
    return json({ error: 'user_not_found' }, { status: 404 });
  }

  if (user.wallet?.address && user.wallet.address.toLowerCase() !== address) {
    return json(
      {
        error: 'wallet_mismatch',
        registered: user.wallet.address
      },
      { status: 409 }
    );
  }

  const nonce = randomInt(100000, 999999);
  const message = `FlyANG Wallet Verification\nAddress: ${address}\nNonce: ${nonce}`;

  await prisma.walletInfo.upsert({
    where: { userId: user.id },
    update: {
      address,
      provider
    },
    create: {
      userId: user.id,
      address,
      provider,
      verified: false
    }
  });

  cookies.set('wallet_nonce', String(nonce), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 300
  });

  return json({ nonce, message });
};
