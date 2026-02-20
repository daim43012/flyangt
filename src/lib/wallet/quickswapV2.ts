import { ethers } from "ethers";
import type { Eip1193Provider } from "$lib/wallet/provider";

export const UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
export const WPOL = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
export const FTMC = "0xDa517744d51E5028db6624B5048aCC9C6bE67A7E";

// как в твоём Node-скрипте:
export const FTMC_POOL_FEE: 10000 = 10000; // 1.0%

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)"
] as const;

const ROUTER_ABI = [
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)"
] as const;

function niceErr(e: any) {
  return (
    e?.shortMessage ||
    e?.reason ||
    e?.info?.error?.message ||
    e?.message ||
    "Swap failed"
  );
}

export async function getErc20MetaAndBalance(params: {
  eip1193: Eip1193Provider;
  token: string;
  owner: string;
}) {
  const { eip1193, token, owner } = params;
  const provider = new ethers.BrowserProvider(eip1193);
  const signer = await provider.getSigner();
  const c = new ethers.Contract(token, ERC20_ABI, signer);

  const [decimals, symbol, raw] = await Promise.all([
    c.decimals() as Promise<number>,
    c.symbol() as Promise<string>,
    c.balanceOf(owner) as Promise<bigint>
  ]);

  return {
    token,
    symbol,
    decimals,
    raw,
    amount: ethers.formatUnits(raw, decimals)
  };
}

async function ensureAllowance(params: {
  signer: ethers.Signer;
  token: string;
  owner: string;
  spender: string;
  amount: bigint;
}) {
  const { signer, token, owner, spender, amount } = params;
  const c = new ethers.Contract(token, ERC20_ABI, signer);
  const allowance: bigint = await c.allowance(owner, spender);

  if (allowance >= amount) return;

  const tx = await c.approve(spender, amount);
  await tx.wait();
}

export async function swapWpolToFtmcUniswapV3(params: {
  eip1193: Eip1193Provider;
  owner: string;
  amountInHuman: string; // например "0.1"
  fee?: number;          // по умолчанию 10000
  // MVP: minOut=0, чтобы не падать из-за микроликвидности/изменения цены
  // позже можно добавить Quoter и честный amountOutMinimum.
}) {
  const { eip1193, owner, amountInHuman } = params;
  const fee = (params.fee ?? FTMC_POOL_FEE) as number;

  if (!owner) throw new Error("Missing owner address");
  const a = Number(amountInHuman);
  if (!Number.isFinite(a) || a <= 0) throw new Error("Enter amount");

  const provider = new ethers.BrowserProvider(eip1193);
  const signer = await provider.getSigner();

  const wpol = new ethers.Contract(WPOL, ERC20_ABI, signer);
  const router = new ethers.Contract(UNISWAP_V3_ROUTER, ROUTER_ABI, signer);

  const wpolDecimals: number = Number(await wpol.decimals());
  const amountIn = ethers.parseUnits(amountInHuman, wpolDecimals);

  // баланс
  const bal: bigint = await wpol.balanceOf(owner);
  if (bal < amountIn) throw new Error("Not enough WPOL balance");

  // approve к Uniswap V3 Router
  await ensureAllowance({
    signer,
    token: WPOL,
    owner,
    spender: UNISWAP_V3_ROUTER,
    amount: amountIn
  });

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  // MVP: minOut = 0
  const paramsStruct = {
    tokenIn: WPOL,
    tokenOut: FTMC,
    fee,
    recipient: owner,
    deadline,
    amountIn,
    amountOutMinimum: 0n,
    sqrtPriceLimitX96: 0n
  };

  // ✅ ВАЖНО: сначала симулируем, чтобы получить нормальную ошибку до отправки tx
  try {
    // ethers v6 staticCall
    await router.exactInputSingle.staticCall(paramsStruct);
  } catch (e) {
    throw new Error("Simulation failed: " + niceErr(e));
  }

  // отправляем
  try {
    const tx = await router.exactInputSingle(paramsStruct);
    return { tx };
  } catch (e) {
    throw new Error(niceErr(e));
  }
}
