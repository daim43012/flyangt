import type { RequestEvent } from "@sveltejs/kit";
import { getGoogleAuthUrl } from "$lib/google";

export const GET = async ({ url, cookies }: RequestEvent) => {
  const ref = url.searchParams.get("ref");
  if (ref) {
    cookies.set("pending_ref", String(ref).trim().toUpperCase(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10 
    });
  }

  const state = url.searchParams.get("state") ?? undefined;
  const authUrl = getGoogleAuthUrl(state);

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl }
  });
};
