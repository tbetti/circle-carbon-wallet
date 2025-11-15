import hre from "hardhat";

async function main() {
  console.log("🚀 Starting Carbon Wallet deployment...");

  // USDC address for testnet (you can update this)
  const USDC_ADDRESS = "0x3600000000000000000000000000000000000000"; // From your params.json

  console.log("📄 Deploying CarbonPoints contract...");
  const CarbonPointsFactory = await hre.ethers.getContractFactory("CarbonPoints");
  const carbonPoints = await CarbonPointsFactory.deploy();
  await carbonPoints.waitForDeployment();
  const carbonPointsAddress = await carbonPoints.getAddress();
  console.log("✅ CarbonPoints deployed to:", carbonPointsAddress);

  console.log("📄 Deploying OffsetManager contract...");
  const OffsetManagerFactory = await hre.ethers.getContractFactory("OffsetManager");
  const offsetManager = await OffsetManagerFactory.deploy(USDC_ADDRESS, carbonPointsAddress);
  await offsetManager.waitForDeployment();
  const offsetManagerAddress = await offsetManager.getAddress();
  console.log("✅ OffsetManager deployed to:", offsetManagerAddress);

  // Transfer ownership of CarbonPoints to OffsetManager
  console.log("🔑 Transferring CarbonPoints ownership to OffsetManager...");
  await carbonPoints.transferOwnership(offsetManagerAddress);
  console.log("✅ Ownership transferred!");

  console.log("\n🎉 Deployment Summary:");
  console.log("========================");
  console.log("CarbonPoints:  ", carbonPointsAddress);
  console.log("OffsetManager: ", offsetManagerAddress);
  console.log("USDC Address:  ", USDC_ADDRESS);
  console.log("========================");

  // Verify the setup
  console.log("\n🔍 Verifying deployment...");
  const owner = await carbonPoints.owner();
  console.log("CarbonPoints owner:", owner);
  console.log("Should match OffsetManager:", offsetManagerAddress);
  console.log("Ownership correct:", owner === offsetManagerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
