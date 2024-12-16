import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ignition-viem";
import "dotenv/config";
import "hardhat-gas-reporter";
import "hardhat-storage-layout";
import type { HardhatUserConfig } from "hardhat/config";
import "solidity-coverage";
import "tsconfig-paths/register";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 9001,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./tests",
    ignition: "./ignition",
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    L1: "ethereum",
    L1Etherscan: process.env.ETHERSCAN_API_KEY,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};

export default config;
