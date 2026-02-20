// src/lib/web3/presale.ts
import { Contract, Interface, getAddress, id, zeroPadValue } from "ethers";
import type { Eip1193Provider } from "$lib/wallet/provider";
import { getBrowserProvider, getSigner } from "./ethers";
import { PRESALE_ABI } from "./abi/presale.abi";

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

  const logs = await bp.getLogs({
    address: presale,
    fromBlock: fromBlock ?? 0,
    toBlock: "latest",
    topics: [topic0, buyerTopic],
  });

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
