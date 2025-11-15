import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployCarbon", (m) => {
  const usdcAddress = m.getParameter("USDC_ADDRESS");

  const carbonPoints = m.contract("CarbonPoints");
  const offsetManager = m.contract("OffsetManager", [usdcAddress, carbonPoints]);

  return { carbonPoints, offsetManager };
});
