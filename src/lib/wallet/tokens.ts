import { env } from '$env/dynamic/private';

export type TokenSymbol = 'POL' | 'ANGT' | 'USDT';

export type TokenConfig = {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
  address?: `0x${string}`;
};

function envAddr(key: string) {
  const v = env[key]; 

  if (!v) return undefined;
  const s = String(v).trim();
  return s ? (s as `0x${string}`) : undefined;
}

export function getTokensFromEnv() {
  const TOKENS: Record<TokenSymbol, TokenConfig> = {
    POL: { symbol: 'POL', name: 'Polygon (POL)', decimals: 18 },
    ANGT: { symbol: 'ANGT', name: 'ANGT', decimals: 18, address: envAddr('ANGT_ADDRESS') },
    USDT: { symbol: 'USDT', name: 'Tether USD', decimals: 6, address: envAddr('USDT_ADDRESS') }
  };

  return TOKENS;
}
