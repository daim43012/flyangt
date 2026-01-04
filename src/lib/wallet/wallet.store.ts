import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import {
  ensurePolygon,
  getPreferredProvider,
  savePreferredProvider,
  type Eip1193Provider
} from "./provider";
import { isPolygon } from "./chains";
import { startEip6963Discovery, getAllProviders } from "./provider";

type WalletStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "wrong_network"
  | "no_provider"
  | "error";

type WalletState = {
  status: WalletStatus;
  address: string | null;
  chainId: string | null;
  provider: Eip1193Provider | null;
  providerId?: string | null;
  providerName?: string | null;
  lastError?: string;
};

const initial: WalletState = {
  status: "idle",
  address: null,
  chainId: null,
  provider: null,
  providerId: null,
  providerName: null
};
function listProviders() {
  return getAllProviders().map(({ id, name, icon }) => ({ id, name, icon }));
}

function prettifyError(e: any) {
  const code = e?.code;
  const msg = String(e?.message ?? e ?? "Wallet error");

  if (code === 4001) return "You canceled the request.";

  if (code === 4100 || msg.toLowerCase().includes("not been authorized")) {
    return "Wallet is not authorized. Please click Connect and approve access in the wallet.";
  }

  return msg;
}

function createWallet() {
  const store = writable<WalletState>(initial);
  const { subscribe, set, update } = store;

  let handlersBound = false;

  let onAccountsChanged: (accs: string[]) => void;
  let onChainChanged: (chainId: string) => void;
  let onDisconnect: () => void;

  function bindEvents(provider: Eip1193Provider) {
    if (handlersBound || !provider.on) return;

    onAccountsChanged = (accs: string[]) => {
      const addr = accs?.[0] ?? null;

      update((s) => ({
        ...s,
        address: addr,
        status: addr ? (isPolygon(s.chainId) ? "connected" : "wrong_network") : "idle"
      }));

      if (!addr && browser) localStorage.removeItem("wallet_autoconnect");
    };

    onChainChanged = (chainId: string) => {
      update((s) => ({
        ...s,
        chainId,
        status: s.address ? (isPolygon(chainId) ? "connected" : "wrong_network") : "idle"
      }));
    };

    onDisconnect = () => {
      set({ ...initial, status: "idle" });
      if (browser) localStorage.removeItem("wallet_autoconnect");
    };

    provider.on("accountsChanged", onAccountsChanged);
    provider.on("chainChanged", onChainChanged);
    provider.on("disconnect", onDisconnect);

    handlersBound = true;
  }

  function unbindEvents(provider: Eip1193Provider | null) {
    if (!provider?.removeListener || !handlersBound) return;
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    handlersBound = false;
  }

  async function refresh(provider: Eip1193Provider, providerMeta?: { id?: string; name?: string }) {
    let chainId: string | null = null;
    let address: string | null = null;

    try {
      chainId = await provider.request({ method: "eth_chainId" });
    } catch {
      chainId = null;
    }

    try {
      const accounts = await provider.request({ method: "eth_accounts" });
      address = accounts?.[0] ?? null;
    } catch {
      address = null;
    }

    set({
      status: address ? (isPolygon(chainId) ? "connected" : "wrong_network") : "idle",
      address,
      chainId,
      provider,
      providerId: providerMeta?.id ?? null,
      providerName: providerMeta?.name ?? null
    });

    bindEvents(provider);
  }

  function pickProvider(): { provider: Eip1193Provider; id: string; name: string } | null {
    const selected = getPreferredProvider();
    if (!selected?.provider) return null;
    savePreferredProvider(selected.id);
    return { provider: selected.provider, id: selected.id, name: selected.name };
  }

  async function init() {
    if (!browser) return;
startEip6963Discovery();

    const picked = pickProvider();
    if (!picked) {
      set({ ...initial, status: "no_provider" });
      return;
    }

    await refresh(picked.provider, { id: picked.id, name: picked.name });
  }

  async function connect() {
    if (!browser) return;

    update((s) => ({ ...s, status: "connecting", lastError: undefined }));

    const picked = pickProvider();
    if (!picked) {
      set({ ...initial, status: "no_provider" });
      return;
    }

    const provider = picked.provider;

    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const address = accounts?.[0] ?? null;

      await ensurePolygon(provider);

      const chainId = await provider.request({ method: "eth_chainId" });

      set({
        status: address ? (isPolygon(chainId) ? "connected" : "wrong_network") : "idle",
        address,
        chainId,
        provider,
        providerId: picked.id,
        providerName: picked.name
      });

      bindEvents(provider);
      localStorage.setItem("wallet_autoconnect", "1");
    } catch (e: any) {
      set({
        ...initial,
        status: "error",
        lastError: prettifyError(e)
      });
    }
  }

  async function disconnect() {
    const s = get(store);
    unbindEvents(s.provider);
    set({ ...initial, status: "idle" });
    if (browser) localStorage.removeItem("wallet_autoconnect");
  }

  async function setProvider(id: string) {
    if (!browser) return;
    localStorage.setItem("wallet_provider_id", id);

    const picked = pickProvider();
    if (!picked) {
      set({ ...initial, status: "no_provider" });
      return;
    }

    const s = get(store);
    unbindEvents(s.provider);

    await refresh(picked.provider, { id: picked.id, name: picked.name });
  }

return { subscribe, init, connect, disconnect, refresh, setProvider, listProviders };
}

export const wallet = createWallet();
