import dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ignition";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 31337
    },
    arcTestnet: {
      type: "http",
      url: process.env.ARC_RPC_URL || "https://testnet-rpc.arc.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 462
    }
  }
};

export default config;
