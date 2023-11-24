require("hardhat-deploy");
require("hardhat-deploy-ethers");

const { ethers } = require("hardhat");
const { Console } = require("console");
const { getContractFactory } = require("hardhat-deploy-ethers/types");
const {
  getAgentID,
  getTopKAgents,
  config,
  encodeUint16ArrayRLE,
} = require("../utils");
const { verify } = require("crypto");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  const AgentPlace = await deploy("AgentPlace", {
    from: wallet.address,
    args: config,
    log: false,
  });

  await hre.run("verify:verify", {
    address: AgentPlace.address,
    constructorArguments: config,
  });

  console.log(getAgentID("example1"));
  const agentPlace = await ethers.getContractFactory("AgentPlace");

  const agentPlaceInstance = agentPlace.attach(AgentPlace.address);

  let tx = await agentPlaceInstance.registerAgent([
    getAgentID("example13"),
    10000,
    "0x0000000000000000000000000000000000000000",
    10000,
    500,
    "test",
    "test",
    "test",
    true,
  ]);

  await tx.wait();
  console.log("dd");

  tx = await agentPlaceInstance.registerAgentVersion(
    getAgentID("example13"),
    getAgentID("subExample1"),
    "test"
  );
  await tx.wait();

  tx = await agentPlaceInstance.purchaseSubscription(
    getAgentID("example13"),
    [10000],
    ["YOUR ADDRESSSSSSSSSSSSSSSSSSSSSSSS"],
    ["0x00"],
    { value: 10000, gasLimit: 10000000 }
  );
  await tx.wait();

  console.log(AgentPlace.address);
};
