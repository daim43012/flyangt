import 'dotenv/config';
import type { Handle } from "@sveltejs/kit";
import { verifyJwt } from "$lib/jwt";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("auth_token");

  if (token) {
    try {
      event.locals.user = await verifyJwt(token);
    } catch {
      event.cookies.delete("auth_token", { path: "/" });
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
