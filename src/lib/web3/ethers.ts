import { BrowserProvider } from "ethers";
import type { Eip1193Provider } from "$lib/wallet/provider";

export function getBrowserProvider(p: Eip1193Provider) {
  return new BrowserProvider(p as any);
}

export async function getSigner(p: Eip1193Provider) {
  const bp = getBrowserProvider(p);
  return await bp.getSigner();
}
