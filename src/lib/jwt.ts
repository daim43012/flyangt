import { SignJWT, jwtVerify } from 'jose';

const getSecret = () => {
  const s = process.env.AUTH_JWT_SECRET;
  return s ? new TextEncoder().encode(s) : null;
};

export async function signJwt(payload: { uid: string; email: string }) {
  const secret = getSecret();
  if (!secret) throw new Error('AUTH_JWT_SECRET is missing in env');

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyJwt(token: string) {
  const secret = getSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { uid: string; email: string };
  } catch {
    return null;
  }
}
