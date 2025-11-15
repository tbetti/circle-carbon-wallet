// bridgeKitClient.ts
// ---------------------------------------------
// Handles:
// - Phantom (Solana) connection
// - Solana adapter for Bridge Kit
// - Arc Testnet EVM adapter
// - USDC bridging Solana → Arc Testnet
// ---------------------------------------------

import { BridgeKit } from "@circle-fin/bridge-kit";
import { createSolanaAdapter } from "@circle-fin/adapter-solana";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection } from "@solana/web3.js";

import { createWalletClient, custom } from "viem";
import { createAdapterFromWalletClient } from "@circle-fin/adapter-viem-v3";


// ------------------------------------------------------
// ARC TESTNET CONFIG (official)
// ------------------------------------------------------
export const arcTestnet = {
  id: 5042002, // Chain ID from Arc Docs
  name: "Arc Testnet",
  network: "arc-testnet",
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
};


// ------------------------------------------------------
// PHANTOM WALLET SETUP (Solana)
// ------------------------------------------------------
let phantom: PhantomWalletAdapter | null = null;

export async function connectPhantom() {
  phantom = new PhantomWalletAdapter();

  await phantom.connect(); // opens Phantom popup
  console.log("Connected Phantom:", phantom.publicKey?.toString());

  return phantom;
}


// ------------------------------------------------------
// CREATE SOLANA ADAPTER FOR BRIDGE KIT
// ------------------------------------------------------
export function getSolanaAdapter() {
  if (!phantom) throw new Error("Phantom wallet is not connected");

  // Use Solana mainnet RPC if you're using real USDC
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  // If using testnet USDC, switch to:
  // const connection = new Connection("https://api.testnet.solana.com");

  return createSolanaAdapter({
    connection,
    wallet: phantom,
  });
}


// ------------------------------------------------------
// CREATE ARC TESTNET ADAPTER (EVM)
// ------------------------------------------------------
export function getArcAdapter() {
  const walletClient = createWalletClient({
    chain: arcTestnet,
    transport: custom(window.ethereum), // MetaMask or WalletConnect
  });

  return createAdapterFromWalletClient({
    client: walletClient,
  });
}


// ------------------------------------------------------
// INITIALIZE BRIDGE KIT SDK
// ------------------------------------------------------
const kit = new BridgeKit();


// ------------------------------------------------------
// BRIDGING FUNCTION — Solana → Arc Testnet
// ------------------------------------------------------
export async function bridgeUSDC(amountUSDC: string) {
  if (!phantom) throw new Error("Phantom wallet is not connected");

  const solanaAdapter = getSolanaAdapter();
  const arcAdapter = getArcAdapter();

  console.log("Starting USDC bridge:", amountUSDC);

  const result = await kit.bridge({
    from: {
      adapter: solanaAdapter,
      chain: "Solana",
    },
    to: {
      adapter: arcAdapter,
      chain: "Arc_Testnet",
    },
    amount: amountUSDC, // Example: "5.00"
  });

  console.log("Bridge successful:", result);
  return result;
}


// ------------------------------------------------------
// DEFAULT EXPORT
// ------------------------------------------------------
export default {
  connectPhantom,
  bridgeUSDC,
  getSolanaAdapter,
  getArcAdapter,
};
