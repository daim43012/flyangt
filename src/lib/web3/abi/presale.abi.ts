export const PRESALE_ABI = [
  "function isActive() view returns (bool)",
  "function currentWeek() view returns (uint32)",
  "function currentPriceUsdMicro() view returns (uint256)",
  "function priceForWeek(uint32 week) view returns (uint256)",
  "function pricesLength() view returns (uint256)",
  "function quote(uint256 payAmount) view returns (uint256)",
  "function buy(address payToken, uint256 payAmount) returns (uint256)",
  "event Purchased(address indexed buyer, address indexed payToken, uint256 payAmount, uint256 tokenAmountWei, uint256 weekRef, uint256 priceRef)",
] as const;
