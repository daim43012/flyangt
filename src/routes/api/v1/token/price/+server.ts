import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

type DexPair = any;

function isEvmAddress(v: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(v);
}

function toNum(x: any, fallback = NaN) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function pickBestPolygonPair(pairs: DexPair[]) {
  const polygonPairs = pairs.filter(
    (p) => String(p?.chainId || "").toLowerCase() === "polygon"
  );
  if (!polygonPairs.length) return null;
  return polygonPairs
    .slice()
    .sort((a, b) => toNum(b?.liquidity?.usd, 0) - toNum(a?.liquidity?.usd, 0))[0];
}

export const GET: RequestHandler = async ({ url, fetch }) => {
  const tokenAddress = (url.searchParams.get("address") || "").trim();

  if (!isEvmAddress(tokenAddress)) {
    throw error(400, "Invalid token address");
  }

  const dsRes = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
  );

  if (!dsRes.ok) throw error(502, `Dexscreener failed (${dsRes.status})`);

  const ds = await dsRes.json();
  const pairs: DexPair[] = Array.isArray(ds?.pairs) ? ds.pairs : [];

  if (!pairs.length) throw error(404, "No pools found for this token");

  const best = pickBestPolygonPair(pairs);
  if (!best) throw error(404, "No Polygon pairs found for this token");

  const pairAddress = String(best?.pairAddress || "");
  if (!isEvmAddress(pairAddress)) throw error(502, "Dexscreener returned invalid pairAddress");

  const priceUsd = toNum(best?.priceUsd, NaN);
  if (!Number.isFinite(priceUsd)) throw error(502, "priceUsd is not available");

  return json(
    {
      tokenAddress,
      network: "polygon",
      symbol: String(best?.baseToken?.symbol || "TOKEN"),
      name: String(best?.baseToken?.name || "Token"),
      pairAddress,
      dexId: String(best?.dexId || "dex"),
      priceUsd,
      priceNative: toNum(best?.priceNative, priceUsd),
      changePct24h: toNum(best?.priceChange?.h24, 0),
      volume24h: toNum(best?.volume?.h24, 0),
      buys24h: toNum(best?.txns?.h24?.buys, 0),
      sells24h: toNum(best?.txns?.h24?.sells, 0),
      liquidityUsd: toNum(best?.liquidity?.usd, 0),
      source: "dexscreener",
      updatedAt: new Date().toISOString(),
    },
    { headers: { "cache-control": "public, max-age=15" } }
  );
};
