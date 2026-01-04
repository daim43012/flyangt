import { writable } from 'svelte/store';

export type TokenSymbol = 'POL' | 'ANGT' | 'USDT';

export type BalanceItem = {
  symbol: TokenSymbol;
  decimals: number;
  raw: string;
  amount: string;
  source: 'onchain';
};

export type BalancesApiResponse = {
  address: string;
  network: 'polygon';
  balances: Record<TokenSymbol, BalanceItem>;
  updatedAt: string;
};

type State = {
  loading: boolean;
  error: string | null;
  data: BalancesApiResponse | null;
};

function createBalancesStore() {
  const { subscribe, set, update } = writable<State>({
    loading: false,
    error: null,
    data: null
  });

  async function load(address: string) {
    if (!address) {
      set({ loading: false, error: 'Missing address', data: null });
      return;
    }

    update((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch(`/api/dashboard/balances?address=${encodeURIComponent(address)}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }

      set({ loading: false, error: null, data: json as BalancesApiResponse });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      set({ loading: false, error: message, data: null });
    }
  }

  function reset() {
    set({ loading: false, error: null, data: null });
  }

  return { subscribe, load, reset };
}

export const balancesStore = createBalancesStore();
