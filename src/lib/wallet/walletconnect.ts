import { browser } from "$app/environment";
import { JsonRpcProvider } from "ethers";
import type { Eip1193Provider } from "./provider";

const PROJECT_ID = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "") as string;

/* ── Direct RPC for read-only methods ──
 * WalletConnect relay is designed for signing, not for heavy reads like eth_getLogs.
 * Routing reads through WC on mobile causes the app to freeze.
 * We use a direct JsonRpcProvider for all read-only RPC calls instead. */
const READ_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com/";
let _readRpc: JsonRpcProvider | null = null;

function getReadRpc(): JsonRpcProvider {
  if (!_readRpc) {
    _readRpc = new JsonRpcProvider(READ_RPC_URL, { chainId: 137, name: "matic" });
  }
  return _readRpc;
}

const READ_METHODS = new Set([
  "eth_call",
  "eth_estimateGas",
  "eth_getBalance",
  "eth_getBlockByHash",
  "eth_getBlockByNumber",
  "eth_getCode",
  "eth_getLogs",
  "eth_getStorageAt",
  "eth_getTransactionByHash",
  "eth_getTransactionCount",
  "eth_getTransactionReceipt",
  "eth_blockNumber",
  "net_version",
  "eth_gasPrice",
  "eth_feeHistory",
  "eth_maxPriorityFeePerGas",
]);

export const WC_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='24' fill='%233B99FC'/%3E%3Cpath fill='white' d='M26 35.7c12.1-11.9 31.9-11.9 44 0l1.5 1.4c.6.6.6 1.6 0 2.2l-5 4.9c-.3.3-.8.3-1.1 0L64 42.8C57 36 39 36 32 42.8l-1.5 1.4c-.3.3-.8.3-1.1 0l-5-4.9c-.6-.6-.6-1.6 0-2.2L26 35.7zm54.3 10.1 4.5 4.4c.6.6.6 1.6 0 2.2L64.8 72.3c-.6.6-1.5.6-2.1 0L49 58.8c-.3-.3-.7-.3-1 0L34.3 72.3c-.6.6-1.5.6-2.1 0L12.2 52c-.6-.6-.6-1.6 0-2.2l4.5-4.4c.6-.6 1.5-.6 2.1 0l13.7 13.5c.3.3.7.3 1 0L47.2 45.4c.6-.6 1.5-.6 2.1 0l13.7 13.5c.3.3.7.3 1 0L77.7 45.4c.6-.6 1.5-.6 2.1 0l.5.4z'/%3E%3C/svg%3E";

let _real: any = null;
let _initPromise: Promise<any> | null = null;
const _pending: Array<{ event: string; cb: (...args: any[]) => void }> = [];

/** True when running on mobile — no MetaMask extension expected */
export function isMobileDevice(): boolean {
  if (!browser) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/** Whether WalletConnect is configured (PROJECT_ID set) */
export function isWcAvailable(): boolean {
  return Boolean(PROJECT_ID);
}

/**
 * Cleanup AppKit modal (w3m-modal) if it gets stuck.
 * Also resets any body styles that the modal may have injected.
 * Exported so ConnectWallet and other components can call it as a safety net.
 */
export function cleanupModal(): void {
  if (!browser) return;
  try {
    // Remove all known AppKit / WalletConnect modal elements
    document
      .querySelectorAll("w3m-modal, wcm-modal, w3m-overlay, wui-flex")
      .forEach((el) => el.remove());

    // Reset body / html styles the modal may have injected
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
    document.body.style.userSelect = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    document.documentElement.style.overflow = "";
    document.documentElement.style.pointerEvents = "";

    // Remove any backdrop-like overlays with high z-index
    document.querySelectorAll("[class*='w3m'], [class*='wcm']").forEach((el) => {
      if ((el as HTMLElement).style?.zIndex && parseInt((el as HTMLElement).style.zIndex) > 99999) {
        el.remove();
      }
    });
  } catch {
    // ignore
  }
}

async function getRealProvider(): Promise<any> {
  if (_real) return _real;
  if (_initPromise) return _initPromise;
  if (!browser) throw new Error("WalletConnect is only available in the browser");
  if (!PROJECT_ID) throw new Error("VITE_WALLETCONNECT_PROJECT_ID is not set in .env");

  _initPromise = (async () => {
    const { EthereumProvider } = await import("@walletconnect/ethereum-provider");

    const p = await EthereumProvider.init({
      projectId: PROJECT_ID,
      chains: [137],
      rpcMap: { 137: READ_RPC_URL },
      showQrModal: true,
      methods: [
        "eth_sendTransaction",
        "eth_sign",
        "personal_sign",
        "eth_signTypedData",
        "wallet_switchEthereumChain",
        "wallet_addEthereumChain",
      ],
      events: ["chainChanged", "accountsChanged", "disconnect"],
      metadata: {
        name: "FlyANGT",
        description: "FlyANGT Web3 Aviation Platform",
        url: browser ? window.location.origin : "https://flyangt.com",
        icons: [],
      },
    });

    // Apply any listeners that were registered before init completed
    for (const { event, cb } of _pending) {
      p.on(event as any, cb);
    }
    _pending.length = 0;

    _real = p;
    return p;
  })();

  _initPromise.catch(() => {
    _initPromise = null;
  });

  return _initPromise;
}

/**
 * Opens the AppKit modal and waits for WalletConnect session.
 * AppKit handles both desktop (QR code) and mobile (wallet list with deeplinks)
 * without triggering iOS bfcache navigation on the current page.
 */
async function wcConnect(p: any): Promise<void> {
  try {
    await p.connect();
  } finally {
    cleanupModal();
  }
}

/**
 * Lazy EIP-1193 proxy for WalletConnect.
 * Safe to pass to getAllProviders() — real WC is only initialized on first .request() call.
 */
export const wcEip1193: Eip1193Provider = {
  request: async (args) => {
    // Route read-only RPC methods through direct JsonRpcProvider.
    // This avoids the WC relay entirely — prevents mobile freezes from
    // heavy calls (eth_getLogs, eth_call, etc.) going through WalletConnect.
    if (READ_METHODS.has(args.method)) {
      return getReadRpc().send(args.method, args.params ?? []);
    }

    const p = await getRealProvider();

    // eth_requestAccounts — enable() имеет баг: если session есть, но signer.namespaces
    // не восстановлен (устаревшая/частичная сессия после перезагрузки страницы),
    // enable() пропускает connect() и сразу вызывает request() → validateChain() → ошибка.
    // Решение: проверяем namespaces вручную и при необходимости вызываем connect().
    if (args.method === "eth_requestAccounts") {
      const hasValidSession = p.session && (p as any).signer?.namespaces;
      if (!hasValidSession) {
        await wcConnect(p);
      }
      return (p.accounts as string[]) ?? [];
    }

    // Без активной сессии читающие методы возвращают безопасные дефолты
    // вместо исключения "Please call connect() before request()"
    if (!p.session || !(p as any).signer?.namespaces) {
      if (args.method === "eth_accounts") return [];
      if (args.method === "eth_chainId") return null;
    }

    // Read-only fire-and-forget methods: no modal cleanup needed.
    if (args.method === "eth_accounts" || args.method === "eth_chainId") {
      return p.request(args);
    }

    // Interactive requests (personal_sign, wallet_switchEthereumChain, etc.)
    // may trigger the AppKit modal on mobile. Always clean up after they settle
    // so the modal backdrop cannot block pointer events on the page.
    try {
      return await p.request(args);
    } finally {
      cleanupModal();
    }
  },

  on: (event, cb) => {
    if (_real) {
      _real.on(event, cb);
    } else {
      _pending.push({ event, cb });
    }
  },

  removeListener: (event, cb) => {
    if (_real) {
      _real.removeListener?.(event, cb);
    } else {
      const i = _pending.findIndex((l) => l.event === event && l.cb === cb);
      if (i >= 0) _pending.splice(i, 1);
    }
  },
};

/** Clean up WC session and provider instance */
export async function disconnectWalletConnect(): Promise<void> {
  if (_real?.disconnect) {
    try {
      // Timeout: don't hang forever if relay is unreachable on mobile
      await Promise.race([
        _real.disconnect(),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error("disconnect timeout")), 4000),
        ),
      ]);
    } catch {
      // session may already be gone or timed out — proceed with cleanup
    }
  }
  _real = null;
  _initPromise = null;
  _pending.length = 0;
  cleanupModal();
}
