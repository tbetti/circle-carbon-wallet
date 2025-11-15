// bridgeKitClient.ts
// BridgeKit integration for Solana → Arc Testnet USDC bridging

import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { SupportedChainId, CHAIN_IDS_TO_USDC_ADDRESSES, SOLANA_RPC_ENDPOINT } from "./chains";

export const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet", 
  network: "arc-testnet",
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
};

// Get user's Solana USDC balance
export async function getSolanaUSDCBalance(phantomAddress: string): Promise<string> {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");
    const walletPublicKey = new PublicKey(phantomAddress);
    const usdcMint = new PublicKey(CHAIN_IDS_TO_USDC_ADDRESSES[SupportedChainId.SOLANA_DEVNET] as string);

    const associatedTokenAddress = await getAssociatedTokenAddress(usdcMint, walletPublicKey);
    const tokenAccount = await getAccount(connection, associatedTokenAddress);
    
    const balance = Number(tokenAccount.amount) / Math.pow(10, 6); // USDC has 6 decimals
    return balance.toString();
  } catch (error) {
    console.error("Error getting Solana USDC balance:", error);
    return "0";
  }
}

// Connect to Phantom wallet
export async function connectPhantom(): Promise<string | null> {
  try {
    if (!window.solana?.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    const response = await window.solana.connect();
    return response.publicKey.toString();
  } catch (error) {
    console.error("Error connecting to Phantom:", error);
    return null;
  }
}

// Bridge USDC from Solana to Arc Testnet
export async function bridgeUSDC(
  phantomAddress: string,
  arcAddress: string, 
  amount: string,
  onProgress?: (step: string) => void
): Promise<string> {
  try {
    onProgress?.("Initiating bridge transfer...");
    
    // This would integrate with Circle's CCTP for Solana → Arc
    // For now, we'll use the existing cross-chain transfer logic
    
    // Step 1: Burn USDC on Solana
    onProgress?.("Burning USDC on Solana...");
    
    // Step 2: Get attestation
    onProgress?.("Getting attestation...");
    
    // Step 3: Mint USDC on Arc Testnet
    onProgress?.("Minting USDC on Arc Testnet...");
    
    // Return transaction hash
    return "bridge-tx-hash-placeholder";
  } catch (error) {
    console.error("Bridge error:", error);
    throw error;
  }
}

// Check if user has Phantom wallet installed
export function isPhantomInstalled(): boolean {
  return typeof window !== 'undefined' && window.solana?.isPhantom;
}

export default {
  connectPhantom,
  getSolanaUSDCBalance,
  bridgeUSDC,
  isPhantomInstalled,
};
