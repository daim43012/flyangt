/**
 * Client-side logger that forwards logs to /api/log → pm2 stdout.
 * Fire-and-forget: never throws, never blocks the UI.
 */

type Level = "info" | "warn" | "error";

function send(level: Level, tag: string, message: string, data?: Record<string, unknown>) {
  try {
    const payload: Record<string, unknown> = { level, tag, message };
    if (data) payload.data = data;

    // Enrich with context
    if (typeof window !== "undefined") {
      payload.data = {
        url: window.location.href,
        ua: navigator.userAgent,
        ...(data ?? {}),
      };
    }

    fetch("/api/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      // keepalive so the request survives page unload
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never throw from logger
  }
}

export const clog = {
  info:  (tag: string, msg: string, data?: Record<string, unknown>) => send("info",  tag, msg, data),
  warn:  (tag: string, msg: string, data?: Record<string, unknown>) => send("warn",  tag, msg, data),
  error: (tag: string, msg: string, data?: Record<string, unknown>) => send("error", tag, msg, data),
};
