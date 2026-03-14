import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import {
  ensurePolygon,
  getPreferredProvider,
  savePreferredProvider,
  type Eip1193Provider,
  startEip6963Discovery,
  getAllProviders,
} from "./provider";
import { isPolygon, normalizeChainId } from "./chains";
import { disconnectWalletConnect } from "./walletconnect";
import { clog } from "$lib/utils/clientLog";
import { pushAdvisorError } from "$lib/stores/advisor";

type WalletStatus =
  | "idle"
  | "initializing"
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
  providerName: null,
};

const LS_AUTOCONNECT = "wallet_autoconnect";
const LS_LOCK = "wallet_locked";
const LS_PROVIDER_ID = "wallet_provider_id";

function listProviders() {
  return getAllProviders().map(({ id, name, icon }) => ({ id, name, icon }));
}

function prettifyError(e: any) {
  const code = e?.code;
  const msg = String(e?.message ?? e ?? "Wallet error");
  const lower = msg.toLowerCase();

  if (code === 4001 || lower.includes("user rejected")) return "You cancelled the request.";

  if (lower.includes("page restored from cache") || lower.includes("restored from cache")) {
    return "Connection interrupted. Please tap Connect again.";
  }

  if (code === 4100 || lower.includes("not been authorized")) {
    return "Wallet not authorized. Click Connect and approve in your wallet.";
  }

  // RPC / network failures
  if (
    lower.includes("failed to fetch") ||
    lower.includes("network error") ||
    lower.includes("rpc") ||
    lower.includes("eth_chainid") ||
    lower.includes("polygon-rpc") ||
    lower.includes("request failed") ||
    lower.includes("could not detect network") ||
    lower.includes("timeout")
  ) {
    return "Network error. Please switch to Polygon in your wallet and retry.";
  }

  // Chain switch rejected
  if (code === 4902) {
    return "Polygon network not found. Add it in your wallet settings.";
  }

  // Unknown provider / method errors
  if (lower.includes("unsupported method") || lower.includes("not supported")) {
    return "Method not supported by your wallet. Try a different wallet.";
  }

  // Keep short — strip long technical details
  if (msg.length > 120) return "Connection failed. Check your wallet and retry.";

  return msg;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function createWallet() {
  const store = writable<WalletState>(initial);
  const { subscribe, set, update } = store;

  let handlersBound = false;

  let onAccountsChanged: (accs: string[]) => void;
  let onChainChanged: (chainId: string) => void;
  let onDisconnect: () => void;

  function isLocked() {
    return browser && localStorage.getItem(LS_LOCK) === "1";
  }

  function bindEvents(provider: Eip1193Provider) {
    if (handlersBound || !provider.on) return;

    onAccountsChanged = (accs: string[]) => {
      const addr = accs?.[0] ?? null;

      update((s) => ({
        ...s,
        address: addr,
        status: addr
          ? isPolygon(s.chainId)
            ? "connected"
            : "wrong_network"
          : "idle",
      }));

      if (!addr && browser) localStorage.removeItem(LS_AUTOCONNECT);
    };

    onChainChanged = (rawChainId: any) => {
      const chainId = normalizeChainId(rawChainId);
      const s = get(store);
      const polygon = isPolygon(chainId);
      update((prev) => ({
        ...prev,
        chainId,
        status: prev.address
          ? polygon ? "connected" : "wrong_network"
          : "idle",
      }));
      if (s.address && !polygon) {
        pushAdvisorError("You switched to the wrong network. Please switch back to Polygon.");
      }
    };

    onDisconnect = () => {
      const s = get(store);
      if (s.providerId === "walletconnect") {
        disconnectWalletConnect().catch(() => {});
      }
      set({ ...initial, status: "idle" });
      if (browser) localStorage.removeItem(LS_AUTOCONNECT);
      // lock снимаем только через кнопку Disconnect
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

  async function refresh(
    provider: Eip1193Provider,
    providerMeta?: { id?: string; name?: string },
  ) {
    let chainId: string | null = null;
    let address: string | null = null;

    try {
      const raw = await provider.request({ method: "eth_chainId" });
      chainId = normalizeChainId(raw);
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
      status: address
        ? isPolygon(chainId)
          ? "connected"
          : "wrong_network"
        : "idle",
      address,
      chainId,
      provider,
      providerId: providerMeta?.id ?? null,
      providerName: providerMeta?.name ?? null,
    });

    bindEvents(provider);
  }

  function pickProviderNow(): {
    provider: Eip1193Provider;
    id: string;
    name: string;
  } | null {
    const selected = getPreferredProvider();
    if (!selected?.provider) return null;

    savePreferredProvider(selected.id);

    return {
      provider: selected.provider,
      id: selected.id,
      name: selected.name,
    };
  }

  async function pickProviderWithRetry(maxMs = 1500) {
    const saved = browser ? localStorage.getItem(LS_PROVIDER_ID) : null;

    if (!saved) return pickProviderNow();

    const started = Date.now();
    while (Date.now() - started < maxMs) {
      const all = getAllProviders();
      const match = all.find((p) => p.id === saved);
      if (match?.provider) {
        savePreferredProvider(match.id);
        return { provider: match.provider, id: match.id, name: match.name };
      }
      await sleep(100);
    }

    return pickProviderNow();
  }
  async function init() {
    if (!browser) return;

    update((s) => ({ ...s, status: "initializing", lastError: undefined }));

    startEip6963Discovery();

    const picked = await pickProviderWithRetry(1800);
    if (!picked) {
      set({ ...initial, status: "no_provider" });
      return;
    }

    // WalletConnect: не инициализируем при старте, если ранее не было подключения —
    // иначе будет лишний сетевой запрос к WC-серверам при каждом открытии страницы.
    if (picked.id === "walletconnect" && !localStorage.getItem(LS_AUTOCONNECT)) {
      set({ ...initial, status: "idle" });
      return;
    }

    await refresh(picked.provider, { id: picked.id, name: picked.name });

    // Auto-switch to Polygon on page reload if user was previously connected
    const s = get(store);
    if (s.address && !isPolygon(s.chainId)) {
      try {
        await ensurePolygon(picked.provider);
        await refresh(picked.provider, { id: picked.id, name: picked.name });
      } catch {
        // user rejected — stay on wrong_network
      }
    }
  }

  async function connect() {
    if (!browser) return;

    clog.info("wallet", "connect: start");
    update((s) => ({ ...s, status: "connecting", lastError: undefined }));

    startEip6963Discovery();

    const picked = await pickProviderWithRetry(1800);
    if (!picked) {
      clog.warn("wallet", "connect: no_provider");
      set({ ...initial, status: "no_provider" });
      return;
    }

    clog.info("wallet", "connect: provider picked", { id: picked.id, name: picked.name });
    const provider = picked.provider;

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const address = accounts?.[0] ?? null;
      clog.info("wallet", "connect: accounts received", { address: address ?? "null" });

      try {
        await ensurePolygon(provider);
      } catch (e: any) {
        clog.warn("wallet", "connect: ensurePolygon failed", { err: e?.message });
        // switch failed — we'll detect wrong_network below
      }

      let chainId: string | null = null;
      try {
        const raw = await provider.request({ method: "eth_chainId" });
        chainId = normalizeChainId(raw);
      } catch (e: any) {
        clog.warn("wallet", "connect: eth_chainId failed", { err: e?.message });
      }

      const polygon = isPolygon(chainId);
      const status = address ? (polygon ? "connected" : "wrong_network") : "idle";

      clog.info("wallet", "connect: done", { status, chainId: chainId ?? "null", polygon });

      set({
        status,
        address,
        chainId,
        provider,
        providerId: picked.id,
        providerName: picked.name,
        lastError: address && !polygon
          ? "Switch to Polygon network in your wallet."
          : undefined,
      });

      if (address && !polygon) {
        pushAdvisorError("Wrong network connected. Please switch to Polygon.");
      }

      bindEvents(provider);

      savePreferredProvider(picked.id);
      localStorage.setItem(LS_AUTOCONNECT, "1");
      localStorage.setItem(LS_LOCK, "1");
    } catch (e: any) {
      const msg = prettifyError(e);
      clog.error("wallet", "connect: error", { err: e?.message, code: e?.code, pretty: msg });
      set({
        ...initial,
        status: "error",
        lastError: msg,
      });
      pushAdvisorError(`Wallet connection failed: ${msg}`);
    }
  }

  async function disconnect() {
    const s = get(store);
    unbindEvents(s.provider);

    if (s.providerId === "walletconnect") {
      await disconnectWalletConnect();
    }

    set({ ...initial, status: "idle" });

    if (browser) {
      localStorage.removeItem(LS_AUTOCONNECT);
      localStorage.removeItem(LS_LOCK);
      localStorage.removeItem(LS_PROVIDER_ID);
    }
  }

  async function setProvider(id: string) {
    if (!browser) return;

    if (isLocked()) return;

    localStorage.setItem(LS_PROVIDER_ID, id);

    const picked = await pickProviderWithRetry(1200);
    if (!picked) {
      set({ ...initial, status: "no_provider" });
      return;
    }

    const s = get(store);
    unbindEvents(s.provider);

    await refresh(picked.provider, { id: picked.id, name: picked.name });
  }

  return {
    subscribe,
    init,
    connect,
    disconnect,
    refresh,
    setProvider,
    listProviders,
    isLocked,
  };
}

export const wallet = createWallet();
