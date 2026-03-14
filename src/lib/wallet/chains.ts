export const POLYGON = {
  chainIdHex: "0x89", // 137
  chainIdDec: 137,
  name: "Polygon Mainnet",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: [process.env.POLYGON_RPC_URL || "https://polygon-rpc.com/"],
  blockExplorerUrls: ["https://polygonscan.com/"]
};

export function isPolygon(chainId: string | number | bigint | null | undefined) {
  if (!chainId && chainId !== 0) return false;
  if (typeof chainId === "bigint") return chainId === BigInt(POLYGON.chainIdDec);
  if (typeof chainId === "string") return chainId.toLowerCase() === POLYGON.chainIdHex;
  if (typeof chainId === "number") return chainId === POLYGON.chainIdDec;
  return false;
}
/** Normalize any chainId format to lowercase hex string.
 *  Handles: hex string "0x89", decimal number 137, BigInt 137n, CAIP-2 "eip155:137" */
export function normalizeChainId(raw: string | number | bigint | null | undefined): string | null {
  if (raw === null || raw === undefined || raw === "") return null;
  if (typeof raw === "bigint") return "0x" + raw.toString(16);
  if (typeof raw === "number") return "0x" + raw.toString(16);
  if (typeof raw === "string") {
    // CAIP-2: "eip155:137"
    const caip = raw.match(/^eip155:(\d+)$/i);
    if (caip) return "0x" + parseInt(caip[1]).toString(16);
    return raw; // already hex string
  }
  return null;
}

export function chainKey(chainId: string | number | null | undefined) {
  const hex = normalizeChainId(chainId);
  if (!hex) return null;
  if (hex.toLowerCase() === "0x89") return "polygon";
  if (hex.toLowerCase() === "0x7a69") return "localhost"; // hardhat
  return null;
}
