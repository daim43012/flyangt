import { browser } from "$app/environment";
import { POLYGON } from "./chains";

export type Eip1193Provider = {
  request: (args: { method: string; params?: any[] | object }) => Promise<any>;
  on?: (event: string, cb: (...args: any[]) => void) => void;
  removeListener?: (event: string, cb: (...args: any[]) => void) => void;

  isMetaMask?: boolean;
  isRabby?: boolean;
  isCoinbaseWallet?: boolean;
  isBraveWallet?: boolean;
  isOKExWallet?: boolean;
  isPhantom?: boolean;

  providers?: Eip1193Provider[];
};

export type NamedProvider = {
  id: string;       
  name: string;    
  provider: Eip1193Provider;
  icon?: string;    
};

const LS_KEY = "wallet_provider_id";

type EIP6963Detail = {
  info: { uuid: string; name: string; icon: string; rdns: string };
  provider: Eip1193Provider;
};

let discovered: NamedProvider[] = [];
let discoveryStarted = false;

function addDiscovered(p: NamedProvider) {
  if (discovered.some((x) => x.provider === p.provider || x.id === p.id)) return;
  discovered = [...discovered, p];
}

export function startEip6963Discovery() {
  if (!browser || discoveryStarted) return;
  discoveryStarted = true;

  const handler = (event: Event) => {
    const e = event as CustomEvent<EIP6963Detail>;
    const info = e.detail?.info;
    const provider = e.detail?.provider;
    if (!info || !provider?.request) return;

    addDiscovered({
      id: `eip6963:${info.rdns}:${info.uuid}`,
      name: info.name,
      icon: info.icon,
      provider
    });
  };

  window.addEventListener("eip6963:announceProvider", handler as any);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
}

export function getDiscoveredProviders(): NamedProvider[] {
  return discovered;
}

function fallbackInjectedProviders(): NamedProvider[] {
  if (!browser) return [];
  const w = window as any;
  const out: NamedProvider[] = [];

  if (w.phantom?.ethereum?.request) {
    out.push({ id: "phantom", name: "Phantom", provider: w.phantom.ethereum });
  }

  const eth = w.ethereum as Eip1193Provider | undefined;
  if (eth?.request) {
    const list = Array.isArray((eth as any).providers) ? (eth as any).providers : null;

    if (list?.length) {
      for (const p of list) {
        if (!p?.request) continue;
        out.push({ id: guessId(p), name: guessName(p), provider: p });
      }
    } else {
      out.push({ id: guessId(eth), name: guessName(eth), provider: eth });
    }
  }

  const uniq: NamedProvider[] = [];
  const seen = new Set<any>();
  for (const item of out) {
    if (seen.has(item.provider)) continue;
    seen.add(item.provider);
    uniq.push(item);
  }
  return uniq;
}

function guessId(p: any) {
  if (p?.isRabby) return "rabby";
  if (p?.isMetaMask) return "metamask";
  if (p?.isCoinbaseWallet) return "coinbase";
  if (p?.isBraveWallet) return "brave";
  if (p?.isOKExWallet) return "okx";
  if (p?.isPhantom || p?._isPhantom) return "phantom";
  return "injected";
}
function guessName(p: any) {
  if (p?.isRabby) return "Rabby";
  if (p?.isMetaMask) return "MetaMask";
  if (p?.isCoinbaseWallet) return "Coinbase Wallet";
  if (p?.isBraveWallet) return "Brave Wallet";
  if (p?.isOKExWallet) return "OKX Wallet";
  if (p?.isPhantom || p?._isPhantom) return "Phantom";
  return "Injected Wallet";
}

export function getAllProviders(): NamedProvider[] {
  const a = getDiscoveredProviders();
  const b = fallbackInjectedProviders();

  const merged: NamedProvider[] = [];
  const seen = new Set<any>();

  for (const p of [...a, ...b]) {
    if (seen.has(p.provider)) continue;
    seen.add(p.provider);
    merged.push(p);
  }

  return merged;
}

export function getPreferredProvider(): NamedProvider | null {
  const providers = getAllProviders();
  if (!providers.length) return null;

  const saved = browser ? localStorage.getItem(LS_KEY) : null;
  if (saved) {
    const match = providers.find((p) => p.id === saved);
    if (match) return match;
  }

  const priority = ["rabby", "metamask", "coinbase", "brave", "okx", "phantom", "injected"];
  for (const id of priority) {
    const match = providers.find((p) => p.id === id);
    if (match) return match;
  }

  return providers[0];
}

export function savePreferredProvider(id: string) {
  if (!browser) return;
  localStorage.setItem(LS_KEY, id);
}

export async function ensurePolygon(provider: Eip1193Provider) {
  const chainId = await provider.request({ method: "eth_chainId" });
  if (String(chainId).toLowerCase() === POLYGON.chainIdHex) return;

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: POLYGON.chainIdHex }]
    });
  } catch (e: any) {
    if (e?.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: POLYGON.chainIdHex,
            chainName: POLYGON.name,
            nativeCurrency: POLYGON.nativeCurrency,
            rpcUrls: POLYGON.rpcUrls,
            blockExplorerUrls: POLYGON.blockExplorerUrls
          }
        ]
      });
      return;
    }
    throw e;
  }
}
