// src/lib/web3/presale.ts
import { Contract, Interface, getAddress, id, zeroPadValue } from "ethers";
import type { Eip1193Provider } from "$lib/wallet/provider";
import { getBrowserProvider, getSigner } from "./ethers";
import { PRESALE_ABI } from "./abi/presale.abi";
import { ADDRESSES } from "./addresses";

export type PresalePurchaseEvent = {
  txHash: string;
  blockNumber: number;
  buyer: string;
  payToken: string;
  payAmount6: bigint; // 1e6
  tokenAmountWei: bigint; // 1e18
  week: number;
  priceMicro: bigint; // 1e6
  blockTimestamp?: number;
};

export function presaleRead(provider: Eip1193Provider, presale: string) {
  return new Contract(presale, PRESALE_ABI, getBrowserProvider(provider));
}

export async function presaleWrite(provider: Eip1193Provider, presale: string) {
  return new Contract(presale, PRESALE_ABI, await getSigner(provider));
}

export async function presaleState(provider: Eip1193Provider, presale: string) {
  const c: any = presaleRead(provider, presale);

  const [active, week, priceMicro] = await Promise.all([
    c.isActive(),
    c.currentWeek(),
    c.currentPriceUsdMicro(),
  ]);

  return {
    active: Boolean(active),
    week: Number(week),
    priceMicro: priceMicro as bigint, // 1e6
  };
}

export async function presaleQuoteWei(
  provider: Eip1193Provider,
  presale: string,
  payAmount6: bigint,
) {
  const c: any = presaleRead(provider, presale);
  return (await c.quote(payAmount6)) as bigint; // 1e18
}

export async function presaleBuy(
  provider: Eip1193Provider,
  presale: string,
  payToken: string,
  payAmount6: bigint,
) {
  const c: any = await presaleWrite(provider, presale);
  const tx = await c.buy(payToken, payAmount6);
  return await tx.wait();
}

export async function presaleRoadmap(
  provider: Eip1193Provider,
  presale: string,
) {
  const c: any = presaleRead(provider, presale);

  const length = Number(await c.pricesLength());
  const currentWeek = Number(await c.currentWeek());

  const prices: number[] = [];
  for (let i = 1; i <= length; i++) {
    const p = await c.priceForWeek(i);
    prices.push(Number(p) / 1e6); // micro -> USD
  }

  return { currentWeek, prices };
}

const ETHERSCAN_V2_API = "https://api.etherscan.io/v2/api";

/**
 * Server-side: get total USD spent by a wallet via Etherscan logs API
 * (works on free Alchemy tier, no block range limits)
 */
export async function getOnchainTotalUsd(walletAddress: string): Promise<number> {
  try {
    const iface = new Interface(PRESALE_ABI as any);
    const topic0 = id("Purchased(address,address,uint256,uint256,uint256,uint256)");
    const buyerTopic = zeroPadValue(getAddress(walletAddress), 32);
    const fromBlock = ADDRESSES.polygon.presaleFromBlock;

    const apiKey = process.env.ETHERSCAN_API_KEY?.trim() || "";
    const params = new URLSearchParams({
      chainid: "137",
      module: "logs",
      action: "getLogs",
      address: ADDRESSES.polygon.presale,
      topic0,
      topic1: buyerTopic,
      topic0_1_opr: "and",
      fromBlock: String(fromBlock),
      toBlock: "latest",
      ...(apiKey ? { apikey: apiKey } : {}),
    });

    const res = await fetch(`${ETHERSCAN_V2_API}?${params}`);
    const body = await res.json();

    if (body.status !== "1" || !Array.isArray(body.result)) {
      if (body.message === "No records found") return 0;
      console.error("[presale] etherscan user logs:", JSON.stringify(body));
      return 0;
    }

    let totalPay6 = 0n;
    for (const log of body.result) {
      const parsed = iface.parseLog({ topics: log.topics, data: log.data });
      if (!parsed) continue;
      totalPay6 += BigInt(parsed.args.payAmount);
    }

    return Number(totalPay6) / 1e6;
  } catch (e: any) {
    console.error("[presale] onchain user total error:", e?.message ?? e);
    return 0;
  }
}

export async function presaleUserPurchases(
  provider: Eip1193Provider,
  presale: string,
  buyer: string,
  fromBlock: number,
  limit = 20,
): Promise<PresalePurchaseEvent[]> {
  const bp = getBrowserProvider(provider);
  const iface = new Interface(PRESALE_ABI as any);

  const topic0 = id(
    "Purchased(address,address,uint256,uint256,uint256,uint256)",
  );

  const buyerChecksum = getAddress(buyer);
  const buyerTopic = zeroPadValue(buyerChecksum, 32);

  const rawLogs = await bp.getLogs({
    address: presale,
    fromBlock: fromBlock ?? 0,
    toBlock: "latest",
    topics: [topic0, buyerTopic],
  });

  // Filter out pending/reorg'd logs that have null transactionHash, blockHash, or blockNumber
  // (these cause ethers "could not coalesce" errors when parsing)
  const logs = rawLogs.filter((l) => l.transactionHash && l.blockHash && l.blockNumber);

  const items: PresalePurchaseEvent[] = [];

  for (const log of logs) {
    const parsed = iface.parseLog(log);
    if (!parsed) continue;

    const args: any = parsed.args;

    items.push({
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      buyer: String(args.buyer),
      payToken: String(args.payToken),
      payAmount6: args.payAmount as bigint,
      tokenAmountWei: args.tokenAmountWei as bigint,
      week: Number(args.weekRef),
      priceMicro: args.priceRef as bigint,
    });
  }

  items.sort((a, b) => b.blockNumber - a.blockNumber);
  return items.slice(0, limit);
}
