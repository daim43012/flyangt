import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { level = "info", tag = "client", message, data } = body;

    const ts = new Date().toISOString();
    const prefix = `[${ts}] [${level.toUpperCase()}] [${tag}]`;

    if (level === "error") {
      console.error(prefix, message, data ? JSON.stringify(data) : "");
    } else if (level === "warn") {
      console.warn(prefix, message, data ? JSON.stringify(data) : "");
    } else {
      console.log(prefix, message, data ? JSON.stringify(data) : "");
    }
  } catch {
    // ignore malformed bodies
  }

  return new Response(null, { status: 204 });
};
