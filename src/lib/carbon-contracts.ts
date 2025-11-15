// Carbon Credits Contract Addresses on Arc Testnet
export const CARBON_CONTRACTS = {
  CARBON_POINTS: "0x9Bd256d3E98d36463524e49553F382D637a4C689", // CarbonPoints ERC20 token (with decimal fix)
  OFFSET_MANAGER: "0x5d3E23605b0D5D1E9069AcE697Fa6ccEf8625F1E", // OffsetManager contract (with decimal fix)
  USDC_ADDRESS: "0x3600000000000000000000000000000000000000", // Arc Testnet USDC
  ARC_CHAIN_ID: 5042002, // Arc Testnet Chain ID
} as const;

// OffsetManager ABI (minimal for minting carbon points)
export const OFFSET_MANAGER_ABI = [
  "function buyOffsets(uint256 usdcAmount) external",
  "function carbonPoints() view returns (address)",
  "function usdc() view returns (address)",
  "function owner() view returns (address)"
] as const;

// USDC ABI for approvals
export const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
] as const;

// CarbonPoints ABI (minimal for checking balance)
export const CARBON_POINTS_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
] as const;
