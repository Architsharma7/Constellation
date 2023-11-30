require("hardhat-deploy");
require("hardhat-deploy-ethers");

const { ethers } = require("hardhat");
const { Console } = require("console");
const { getContractFactory } = require("hardhat-deploy-ethers/types");
const {
  getAgentID,
  deployment_config,
  codeString,
  distributionRewards,
  getSourceID,
} = require("../utils");
const { verify } = require("crypto");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  // Deploy the contract
  const AgentPlace = await deploy("AgentPlace", {
    from: wallet.address,
    args: deployment_config,
    log: false,
  });

  // Verify the contract
  await hre.run("verify:verify", {
    address: AgentPlace.address,
    constructorArguments: deployment_config,
  });

  const agentPlace = await ethers.getContractFactory("AgentPlace");

  const agentPlaceInstance = agentPlace.attach(AgentPlace.address);

  // -------------------------------- STEP 1 --------------------------------
  // First step then execute the second step to test the functionality separately

  // Add the reward mechanism to the contract
  let tx = await agentPlaceInstance.addRewardMechanism(
    "source1",
    codeString,
    // This should be the chainlink forwarder address after creating
    // the time based upkeep job to call the function sendRequest with the
    //  sourceID as parameter sourceID is a bytes32 to identify the source
    // getSourceID("source1")
    wallet.address,
    // An array of the amount of the reward "tokens" that each agent will receive
    // 1st agent 1st index, 2nd agent 2nd index, etc ...
    distributionRewards
  );
  await tx.wait();

  // Register the agent
  tx = await agentPlaceInstance.registerAgent([
    "example1",
    getAgentID("example1"),
    "0x0000000000000000000000000000000000000000",
    10000,
    500,
    "test",
    "test",
    "test",
    "test",
    true,
  ]);
  await tx.wait();

  // Register the agent version as contribution
  tx = await agentPlaceInstance.registerAgentVersion(
    getAgentID("example1"),
    getAgentID("example2"),
    "example2",
    "test"
  );

  // Purchase the subscription of the agentName "example1" and ID getAgentID("example1")
  tx = await agentPlaceInstance.purchaseSubscription(
    getAgentID("example1"),
    10000,
    { value: 10000, gasLimit: 10000000 }
  );
  await tx.wait();

  //-------------------------------- STEP 2 --------------------------------
  // Testing the sendRequest function instead of the chainlink job
  // Call this allone after the first step to test the functionality

  // let tx = await agentPlaceInstance.sendRequest(getSourceID("source1"));
  // await tx.wait();

  console.log(AgentPlace.address);
};
