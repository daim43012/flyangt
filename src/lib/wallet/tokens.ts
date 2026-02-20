import { env } from '$env/dynamic/private';

export type TokenSymbol = 'POL' | 'ANGT' | 'USDT';

export type TokenConfig = {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
  address?: `0x${string}`;
};

const POLYGON_USDT: `0x${string}` = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

function envAddr(key: string) {
  const v = env[key];
  if (!v) return undefined;

  const s = String(v).trim();
  if (!/^0x[a-fA-F0-9]{40}$/.test(s)) return undefined;

  return s as `0x${string}`;
}

export function getTokensFromEnv() {
  const TOKENS: Record<TokenSymbol, TokenConfig> = {
    POL: { symbol: 'POL', name: 'Polygon (POL)', decimals: 18 },
    ANGT: { symbol: 'ANGT', name: 'ANGT', decimals: 18, address: envAddr('ANGT_ADDRESS') },

    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      address: envAddr('USDT_ADDRESS') ?? POLYGON_USDT
    }
  };

  return TOKENS;
}
