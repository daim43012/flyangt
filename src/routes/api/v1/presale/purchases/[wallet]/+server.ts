import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { Interface, getAddress, id, zeroPadValue } from "ethers";
import { PRESALE_ABI } from "$lib/web3/abi/presale.abi";
import { ADDRESSES } from "$lib/web3/addresses";

const ETHERSCAN_V2_API = "https://api.etherscan.io/v2/api";

export async function GET({ params }: RequestEvent) {
  const { wallet } = params;

  try {
    const walletAddress = getAddress(wallet);
    const iface = new Interface(PRESALE_ABI as any);
    const topic0 = id("Purchased(address,address,uint256,uint256,uint256,uint256)");
    const buyerTopic = zeroPadValue(walletAddress, 32);
    const fromBlock = ADDRESSES.polygon.presaleFromBlock;

    const apiKey = process.env.ETHERSCAN_API_KEY?.trim() || "";
    const qs = new URLSearchParams({
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

    const res = await fetch(`${ETHERSCAN_V2_API}?${qs}`);
    const body = await res.json();

    if (body.status !== "1" || !Array.isArray(body.result)) {
      if (body.message === "No records found") return json([]);
      console.error("[v1/presale/purchases] etherscan:", JSON.stringify(body));
      return json([]);
    }

    const purchases: object[] = [];
    for (const log of body.result) {
      const parsed = iface.parseLog({ topics: log.topics, data: log.data });
      if (!parsed) continue;
      const args: any = parsed.args;
      purchases.push({
        txHash: log.transactionHash,
        blockNumber: Number(log.blockNumber),
        buyer: String(args.buyer),
        payToken: String(args.payToken),
        payAmount6: String(args.payAmount),
        tokenAmountWei: String(args.tokenAmountWei),
        week: Number(args.weekRef),
        priceMicro: String(args.priceRef),
        blockTimestamp: Number(log.timeStamp),
      });
    }

    purchases.sort((a: any, b: any) => b.blockNumber - a.blockNumber);
    return json(purchases.slice(0, 50));
  } catch (e: any) {
    console.error("[v1/presale/purchases]", e?.message ?? e);
    return json([]);
  }
}
