// src/lib/server/chainBalances.ts
import { ethers } from 'ethers';
import { getTokensFromEnv, type TokenSymbol } from './tokens';

const ERC20_ABI = ['function balanceOf(address account) view returns (uint256)'] as const;

function getRpcUrl() {
  return process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
}

export type BalanceItem = {
  symbol: TokenSymbol;
  decimals: number;
  raw: string;
  amount: string;
  source: 'onchain';
  available: boolean;
};

export type BalancesResponse = {
  address: string;
  network: 'polygon';
  balances: Record<TokenSymbol, BalanceItem>;
  updatedAt: string;
};

function zeroItem(symbol: TokenSymbol, decimals: number): BalanceItem {
  return { symbol, decimals, raw: '0', amount: '0', source: 'onchain', available: false };
}

async function erc20Balance(
  provider: ethers.JsonRpcProvider,
  tokenAddress: `0x${string}` | undefined,
  owner: string,
  symbol: TokenSymbol,
  decimals: number
): Promise<BalanceItem> {
  if (!tokenAddress) return zeroItem(symbol, decimals);

  const c = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const bn = await c.balanceOf(owner);

  return {
    symbol,
    decimals,
    raw: bn.toString(),
    amount: ethers.formatUnits(bn, decimals),
    source: 'onchain',
    available: true
  };
}

export async function getOnchainBalances(address: string): Promise<BalancesResponse> {
  if (!ethers.isAddress(address)) throw new Error('Invalid address');

  const TOKENS = getTokensFromEnv();
  const provider = new ethers.JsonRpcProvider(getRpcUrl());

  // POL всегда доступен
  const polWei = await provider.getBalance(address);

  const [usdtItem, angtItem] = await Promise.all([
    erc20Balance(provider, TOKENS.USDT.address, address, 'USDT', TOKENS.USDT.decimals),
    erc20Balance(provider, TOKENS.ANGT.address, address, 'ANGT', TOKENS.ANGT.decimals)
  ]);

  return {
    address,
    network: 'polygon',
    balances: {
      POL: {
        symbol: 'POL',
        decimals: TOKENS.POL.decimals,
        raw: polWei.toString(),
        amount: ethers.formatUnits(polWei, TOKENS.POL.decimals),
        source: 'onchain',
        available: true
      },
      USDT: usdtItem,
      ANGT: angtItem
    },
    updatedAt: new Date().toISOString()
  };
}
