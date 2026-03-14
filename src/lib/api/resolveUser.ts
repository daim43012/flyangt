import { verifyJwt } from "$lib/jwt";

/** Resolves authenticated user from Bearer token (mobile) or cookie (web). */
export async function resolveUser(
  request: Request,
  cookies?: { get: (name: string) => string | undefined }
): Promise<{ uid: string; email: string } | null> {
  let token: string | null = null;

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  } else if (cookies) {
    token = cookies.get("auth_token") ?? null;
  }

  if (!token) return null;

  try {
    const payload = (await verifyJwt(token)) as any;
    if (!payload?.email || !payload?.uid) return null;
    return { uid: payload.uid, email: payload.email };
  } catch {
    return null;
  }
}
