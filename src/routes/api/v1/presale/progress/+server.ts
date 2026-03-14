import { json, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { Interface, id } from "ethers";
import { ADDRESSES } from "$lib/web3/addresses";
import { PRESALE_ABI } from "$lib/web3/abi/presale.abi";

let cache: { ts: number; data: any } | null = null;
const CACHE_TTL = 5 * 60_000;

const ETHERSCAN_V2_API = "https://api.etherscan.io/v2/api";

async function readOnchainSold(): Promise<number> {
  try {
    const iface = new Interface(PRESALE_ABI as any);
    const topic0 = id("Purchased(address,address,uint256,uint256,uint256,uint256)");
    const fromBlock = ADDRESSES.polygon.presaleFromBlock;

    const apiKey = process.env.ETHERSCAN_API_KEY?.trim() || "";
    const params = new URLSearchParams({
      chainid: "137",
      module: "logs",
      action: "getLogs",
      address: ADDRESSES.polygon.presale,
      topic0,
      fromBlock: String(fromBlock),
      toBlock: "latest",
      ...(apiKey ? { apikey: apiKey } : {}),
    });

    const res = await fetch(`${ETHERSCAN_V2_API}?${params}`);
    const body = await res.json();

    if (body.status !== "1" || !Array.isArray(body.result)) {
      if (body.message === "No records found") return 0;
      return 0;
    }

    let totalWei = 0n;
    for (const log of body.result) {
      const parsed = iface.parseLog({ topics: log.topics, data: log.data });
      if (parsed) totalWei += BigInt(parsed.args.tokenAmountWei);
    }

    return Number(totalWei) / 1e18;
  } catch (e: any) {
    console.error("[v1/presale/progress] onchain error:", e?.message ?? e);
    return 0;
  }
}

export const GET = async () => {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return json(cache.data);
  }

  try {
    const [dbAgg, onchainTokens] = await Promise.all([
      prisma.presalePurchase.aggregate({
        where: { status: "paid" },
        _sum: { tokenAmount: true },
      }),
      readOnchainSold(),
    ]);

    const data = {
      dbTokens: dbAgg._sum.tokenAmount ?? 0,
      onchainTokens,
      goal: 50_000_000,
    };

    cache = { ts: Date.now(), data };
    return json(data);
  } catch (e: any) {
    console.error("[v1/presale/progress] error:", e);
    throw error(500, "Failed to fetch presale progress");
  }
};
