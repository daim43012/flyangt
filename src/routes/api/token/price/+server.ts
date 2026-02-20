import { json, error, type RequestHandler } from "@sveltejs/kit";

type DexPair = any;

type TokenPriceResponse = {
  tokenAddress: `0x${string}`;
  network: "polygon";

  // token
  symbol: string;
  name: string;

  // quote token of pool (например WPOL/USDT)
  quoteSymbol: string;
  quoteName: string;

  // pool
  pairAddress: `0x${string}`;
  dexId: string;
  pairCreatedAt?: number;

  // prices
  priceUsd: number;
  priceNative: number;

  // 24h stats
  changePct24h: number;
  volume24h: number;
  buys24h: number;
  sells24h: number;

  // liquidity / caps
  liquidityUsd: number;
  fdv?: number;
  marketCap?: number;

  // media/info (optional)
  imageUrl?: string;
  headerUrl?: string;
  websites?: { url: string; label?: string }[];
  socials?: { url: string; type?: string }[];

  source: "dexscreener";
  updatedAt: string;
};

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

  // самый ликвидный пул
  return polygonPairs
    .slice()
    .sort((a, b) => toNum(b?.liquidity?.usd, 0) - toNum(a?.liquidity?.usd, 0))[0];
}

export const GET: RequestHandler = async ({ url, fetch }) => {
  const tokenAddress = (url.searchParams.get("address") || "").trim();

  if (!isEvmAddress(tokenAddress)) {
    throw error(400, "Invalid token address");
  }

  const dsUrl = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
  const dsRes = await fetch(dsUrl);

  if (!dsRes.ok) {
    throw error(502, `Dexscreener failed (${dsRes.status})`);
  }

  const ds = await dsRes.json();
  const pairs: DexPair[] = Array.isArray(ds?.pairs) ? ds.pairs : [];

  if (!pairs.length) {
    throw error(404, "No pools found for this token");
  }

  const best = pickBestPolygonPair(pairs);
  if (!best) {
    throw error(404, "No Polygon pairs found for this token");
  }

  const pairAddress = String(best?.pairAddress || "");
  if (!isEvmAddress(pairAddress)) {
    throw error(502, "Dexscreener returned invalid pairAddress");
  }

  const priceUsd = toNum(best?.priceUsd, NaN);
  const priceNative = toNum(best?.priceNative, NaN);

  if (!Number.isFinite(priceUsd)) {
    throw error(502, "priceUsd is not available");
  }

  const changePct24h = toNum(best?.priceChange?.h24, 0);
  const volume24h = toNum(best?.volume?.h24, 0);

  const buys24h = toNum(best?.txns?.h24?.buys, 0);
  const sells24h = toNum(best?.txns?.h24?.sells, 0);

  const liquidityUsd = toNum(best?.liquidity?.usd, 0);

  const out: TokenPriceResponse = {
    tokenAddress: tokenAddress as `0x${string}`,
    network: "polygon",

    symbol: String(best?.baseToken?.symbol || "TOKEN"),
    name: String(best?.baseToken?.name || "Token"),

    quoteSymbol: String(best?.quoteToken?.symbol || "QUOTE"),
    quoteName: String(best?.quoteToken?.name || "Quote Token"),

    pairAddress: pairAddress as `0x${string}`,
    dexId: String(best?.dexId || "dex"),
    pairCreatedAt: typeof best?.pairCreatedAt === "number" ? best.pairCreatedAt : undefined,

    priceUsd,
    priceNative: Number.isFinite(priceNative) ? priceNative : priceUsd,

    changePct24h,
    volume24h,
    buys24h,
    sells24h,

    liquidityUsd,
    fdv: Number.isFinite(toNum(best?.fdv)) ? toNum(best?.fdv) : undefined,
    marketCap: Number.isFinite(toNum(best?.marketCap)) ? toNum(best?.marketCap) : undefined,

    imageUrl: best?.info?.imageUrl,
    headerUrl: best?.info?.header,
    websites: Array.isArray(best?.info?.websites) ? best.info.websites : undefined,
    socials: Array.isArray(best?.info?.socials) ? best.info.socials : undefined,

    source: "dexscreener",
    updatedAt: new Date().toISOString()
  };

  return json(out, {
    headers: {
      "cache-control": "public, max-age=15"
    }
  });
};
