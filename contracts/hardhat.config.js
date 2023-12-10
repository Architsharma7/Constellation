require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },

  defaultNetwork: "snowtrace",
  // defaultNetwork: "mumbai",

  networks: {
    snowtrace: {
      chainId: 43114,
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/ZiPX0JtXnVqQ56RGdvdy8mvCOs4ZDchO`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    // apiKey: "JYMKRTHHFUSX4X11I1NQRNW6X7K2FJFJUU",
    apiKey: "snowtrace", // apiKey is not required, just set a placeholder
    customChains: [
      {
        network: "snowtrace",
        chainId: 43114,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan",
          browserURL: "https://avalanche.routescan.io",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
