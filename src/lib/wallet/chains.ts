export const POLYGON = {
  chainIdHex: "0x89", // 137
  chainIdDec: 137,
  name: "Polygon Mainnet",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: ["https://polygon-rpc.com/"],
  blockExplorerUrls: ["https://polygonscan.com/"]
};

export function isPolygon(chainId: string | number | null | undefined) {
  if (!chainId) return false;
  if (typeof chainId === "string") return chainId.toLowerCase() === POLYGON.chainIdHex;
  return chainId === POLYGON.chainIdDec;
}
