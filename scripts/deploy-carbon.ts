import hre from "hardhat";

async function main() {
  console.log("🚀 Starting Carbon Wallet deployment...");

  // USDC address for testnet (you can update this)
  const USDC_ADDRESS = "0x3600000000000000000000000000000000000000"; // From your params.json

  console.log("📄 Deploying CarbonPoints contract...");
  const carbonPoints = await hre.viem.deployContract("CarbonPoints", []);
  console.log("✅ CarbonPoints deployed to:", carbonPoints.address);

  console.log("📄 Deploying OffsetManager contract...");
  const offsetManager = await hre.viem.deployContract("OffsetManager", [
    USDC_ADDRESS,
    carbonPoints.address
  ]);
  console.log("✅ OffsetManager deployed to:", offsetManager.address);

  // Transfer ownership of CarbonPoints to OffsetManager
  console.log("🔑 Transferring CarbonPoints ownership to OffsetManager...");
  await carbonPoints.write.transferOwnership([offsetManager.address]);
  console.log("✅ Ownership transferred!");

  console.log("\n🎉 Deployment Summary:");
  console.log("========================");
  console.log("CarbonPoints:  ", carbonPoints.address);
  console.log("OffsetManager: ", offsetManager.address);
  console.log("USDC Address:  ", USDC_ADDRESS);
  console.log("========================");

  // Verify the setup
  console.log("\n🔍 Verifying deployment...");
  const owner = await carbonPoints.read.owner();
  console.log("CarbonPoints owner:", owner);
  console.log("Should match OffsetManager:", offsetManager.address);
  console.log("Ownership correct:", owner === offsetManager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
