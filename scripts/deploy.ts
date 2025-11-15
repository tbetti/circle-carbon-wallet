import hre from "hardhat";
import { createWalletClient, http, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";
dotenv.config();

// Arc Testnet chain definition for viem
const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  network: "arc-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: { http: [process.env.ARC_RPC_URL!] },
    public: { http: [process.env.ARC_RPC_URL!] },
  },
});

async function main() {
  console.log("🔑 Loading account from private key...");
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  const client = createWalletClient({
    account,
    chain: arcTestnet,
    transport: http(process.env.ARC_RPC_URL!),
  });

  console.log("🚀 Deploying CarbonPoints...");
  const CarbonPoints = await hre.ethers.getContractFactory("CarbonPoints");
  const carbon = await CarbonPoints.deploy();
  await carbon.waitForDeployment();
  const carbonAddress = await carbon.getAddress();
  console.log("CarbonPoints deployed at:", carbonAddress);

  console.log("🚀 Deploying OffsetManager...");
  const OffsetManager = await getContractFactory("OffsetManager");
  const offset = await OffsetManager.deploy(
    process.env.ARC_USDC_ADDRESS!,
    carbonAddress
  );
  await offset.waitForDeployment();
  const offsetAddress = await offset.getAddress();
  console.log("OffsetManager deployed at:", offsetAddress);

  console.log("🎉 Deployment complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
