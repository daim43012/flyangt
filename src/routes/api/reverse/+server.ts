import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

type CacheVal = { value: any; expires: number };
const cache = new Map<string, CacheVal>();

function cacheGet(key: string) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(key: string, value: any, ttlMs: number) {
  cache.set(key, { value, expires: Date.now() + ttlMs });
}

export const GET: RequestHandler = async ({ url }) => {
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return json({ error: "lat/lon required" }, { status: 400 });
  }

  const key = `${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`;
  const cached = cacheGet(key);
  if (cached) return json(cached);

  const nominatimUrl =
    "https://nominatim.openstreetmap.org/reverse" +
    `?format=jsonv2&lat=${encodeURIComponent(lat)}` +
    `&lon=${encodeURIComponent(lon)}` +
    `&zoom=10&addressdetails=1`;

  const res = await fetch(nominatimUrl, {
    headers: {
      "User-Agent": "svelte-weather/1.0 (contact: you@example.com)",
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    return json({ error: `Nominatim error ${res.status}` }, { status: 502 });
  }

  const data = await res.json();

  const a = data?.address ?? {};
  const place =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.county ||
    a.state ||
    data?.name ||
    "Near you";

  const out = {
    place,
    country: a.country ?? null
  };

  cacheSet(key, out, 60 * 60 * 1000);

  return json(out);
};
