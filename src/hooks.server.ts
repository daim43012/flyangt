import 'dotenv/config';
import type { Handle } from "@sveltejs/kit";
import { verifyJwt } from "$lib/jwt";

const CORS_ORIGINS = [
  'http://localhost:8081',   // Expo web
  'http://localhost:19006',  // Expo DevTools
  'flyangt://',              // Expo deep link scheme
];

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getCorsOrigin(origin: string | null): string | null {
  if (!origin) return null;
  if (CORS_ORIGINS.includes(origin)) return origin;
  // В продакшене добавить свой домен или вернуть '*'
  return null;
}

export const handle: Handle = async ({ event, resolve }) => {
  const { request, url } = event;
  const origin = request.headers.get('origin');

  // Auth — для всех маршрутов
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

  // CORS только для /api/v1/*
  if (url.pathname.startsWith('/api/v1/')) {
    const allowedOrigin = getCorsOrigin(origin);

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
          ...CORS_HEADERS,
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Обычный запрос — добавляем заголовки к ответу
    const response = await resolve(event);
    if (allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
    }
    return response;
  }

  return resolve(event);
};
