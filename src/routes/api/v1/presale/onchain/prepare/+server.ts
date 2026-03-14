import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { resolveUser } from "$lib/api/resolveUser";
import { JsonRpcProvider, Contract, Interface } from "ethers";
import { ADDRESSES } from "$lib/web3/addresses";
import { PRESALE_ABI } from "$lib/web3/abi/presale.abi";

const ERC20_ABI = ["function approve(address spender, uint256 amount) returns (bool)"];

async function readPresaleOnchain() {
  const rpc = process.env.POLYGON_RPC_URL?.trim();
  if (!rpc) throw error(500, "Missing POLYGON_RPC_URL");

  const provider = new JsonRpcProvider(rpc);
  const presale = new Contract(ADDRESSES.polygon.presale, PRESALE_ABI as any, provider);

  const [active, week, priceMicro] = await Promise.all([
    presale.isActive(),
    presale.currentWeek(),
    presale.currentPriceUsdMicro(),
  ]);

  const pm = BigInt(priceMicro);
  return { active: Boolean(active), week: Number(week), priceMicro: pm, priceUsd: Number(pm) / 1e6 };
}

/**
 * POST /api/v1/presale/onchain/prepare
 * Returns two transactions (approve + buy) ready for WalletConnect eth_sendTransaction.
 * Body: { payToken: "usdt" | "usdc", payAmountUsd: number }
 */
export const POST = async ({ request, cookies }: RequestEvent) => {
  const auth = await resolveUser(request, cookies);
  if (!auth) throw error(401, "Unauthorized");

  const body = await request.json().catch(() => null);
  if (!body) throw error(400, "Invalid JSON");

  const payTokenInput = String(body.payToken ?? "").toLowerCase();
  const payAmountUsd = Number(body.payAmountUsd);

  if (!["usdt", "usdc"].includes(payTokenInput)) {
    throw error(400, "payToken must be 'usdt' or 'usdc'");
  }
  if (!Number.isFinite(payAmountUsd) || payAmountUsd <= 0) {
    throw error(400, "Invalid payAmountUsd");
  }

  const st = await readPresaleOnchain();
  if (!st.active) throw error(400, "Presale is not active");
  if (!Number.isFinite(st.priceUsd) || st.priceUsd <= 0) throw error(500, "Bad onchain price");

  const payTokenAddress =
    payTokenInput === "usdt" ? ADDRESSES.polygon.usdt : ADDRESSES.polygon.usdc;

  // USDT/USDC both use 6 decimals
  const payAmount6 = BigInt(Math.round(payAmountUsd * 1_000_000));
  const tokenAmount = payAmountUsd / st.priceUsd;

  const presaleIface = new Interface(PRESALE_ABI as any);
  const erc20Iface = new Interface(ERC20_ABI);

  const approveData = erc20Iface.encodeFunctionData("approve", [
    ADDRESSES.polygon.presale,
    payAmount6,
  ]);

  const buyData = presaleIface.encodeFunctionData("buy", [payTokenAddress, payAmount6]);

  return json({
    ok: true,
    chainId: 137,
    presaleAddress: ADDRESSES.polygon.presale,
    payTokenAddress,
    payTokenSymbol: payTokenInput.toUpperCase(),
    payAmountUsd,
    payAmount6: payAmount6.toString(),
    tokenAmount,
    week: st.week,
    priceUsd: st.priceUsd,
    // Two transactions to execute in order on mobile via WalletConnect
    transactions: [
      {
        step: 1,
        type: "approve",
        to: payTokenAddress,
        data: approveData,
        description: `Approve ${payAmountUsd} ${payTokenInput.toUpperCase()} for presale contract`,
      },
      {
        step: 2,
        type: "buy",
        to: ADDRESSES.polygon.presale,
        data: buyData,
        description: `Buy ${tokenAmount.toFixed(4)} ANGT tokens`,
      },
    ],
  });
};
