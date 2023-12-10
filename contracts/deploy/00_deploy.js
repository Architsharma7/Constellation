require("hardhat-deploy");
require("hardhat-deploy-ethers");

const { ethers } = require("hardhat");
const { Console } = require("console");
const { getContractFactory } = require("hardhat-deploy-ethers/types");
const {
  getAgentID,
  deployment_config,
  deployment_config_avax,
  codeStringT,
  codeStringU,
  codeStringR,
  _forwRatings,
  _forwUsers,
  _forwTwitter,
  distributionRewards,
  getSourceID,
  _forwarderAddress,
} = require("../utils");
const { verify } = require("crypto");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  // Deploy the contract
  const AgentPlace = await deploy("RocketAI", {
    from: wallet.address,
    args: deployment_config_avax,
    log: false,
  });

  // Verify the contract
  await hre.run("verify:verify", {
    address: AgentPlace.address,
    constructorArguments: deployment_config_avax,
  });

  const agentPlace = await ethers.getContractFactory("RocketAI");

  const agentPlaceInstance = agentPlace.attach(AgentPlace.address);

  console.log(getSourceID("twitterIds"));
  console.log(getSourceID("users"));
  console.log(getSourceID("ratings"));

  console.log(getAgentID("Solidity Auditor"));
  console.log(getAgentID("Solidity Auditor V2"));

  // -------------------------------- STEP 1 --------------------------------
  // First step then execute the second step to test the functionality separately

  // Add the reward mechanism for users to the contract
  let tx = await agentPlaceInstance.addRewardMechanism(
    "ratings",
    " ",
    // This should be the chainlink forwarder address after creating
    // the time based upkeep job to call the function sendRequest with the
    //  sourceID as parameter sourceID is a bytes32 to identify the source
    // getSourceID("source1")
    wallet.address,
    // _forwRatings,
    // An array of the amount of the reward "tokens" that each agent will receive
    // 1st agent 1st index, 2nd agent 2nd index, etc ...
    distributionRewards,
    // { gasLimit: 10000000 }
  );
  await tx.wait();

  // tx = await agentPlaceInstance.addRewardMechanism(
  //   "twitterIds",
  //   codeStringT,
  //   // This should be the chainlink forwarder address after creating
  //   // the time based upkeep job to call the function sendRequest with the
  //   //  sourceID as parameter sourceID is a bytes32 to identify the source
  //   // getSourceID("source1")
  //   // wallet.address,
  //   _forwTwitter,
  //   // An array of the amount of the reward "tokens" that each agent will receive
  //   // 1st agent 1st index, 2nd agent 2nd index, etc ...
  //   distributionRewards,
  //   { gasLimit: 10000000 }
  // );
  // await tx.wait();

  // tx = await agentPlaceInstance.addRewardMechanism(
  //   "users",
  //   codeStringU,
  //   // This should be the chainlink forwarder address after creating
  //   // the time based upkeep job to call the function sendRequest with the
  //   //  sourceID as parameter sourceID is a bytes32 to identify the source
  //   // getSourceID("source1")
  //   // wallet.address,
  //   _forwUsers,
  //   // An array of the amount of the reward "tokens" that each agent will receive
  //   // 1st agent 1st index, 2nd agent 2nd index, etc ...
  //   distributionRewards,
  //   { gasLimit: 10000000 }
  // );
  // await tx.wait();

  // console.log("Reward mechanisms are added");

  // Register the agent
  // let tx = await agentPlaceInstance.registerAgent([
  //   // agentName
  //   "Solidity Auditor",
  //   // agentID
  //   getAgentID("Solidity Auditor"),
  //   1000,
  //   "0x0000000000000000000000000000000000000000",
  //   // keyPrice
  //   10000,
  //   // basisPoint
  //   500,
  //   "lockName",
  //   "lockSymbol",
  //   "baseTokenURI",
  //   // rewardCategory
  //   getSourceID("twitterIds"),
  //   // actualCategory
  //   "Coding",
  //   true,
  // ]);
  // await tx.wait();

  // console.log("Agent registered");

  // Purchase the subscription of the agentName "example1" and ID getAgentID("example1")
  // let tx = await agentPlaceInstance.purchaseSubscription(
  //   getAgentID("Solidity Auditor"),
  //   10000,
  //   "_threadID",
  //   { value: 10000, gasLimit: 10000000 }
  // );
  // await tx.wait();

  // // Register the agent version as contribution

  // tx = await agentPlaceInstance.registerAgentVersion(
  //   getAgentID("Solidity Auditor"),
  //   getAgentID("Solidity Auditor V2"),
  //   "Solidity Auditor V2",
  //   "baseTokenURI"
  // );

  // console.log("Agent version registered");

  // tx = await agentPlaceInstance.extendSubscription(
  //   10000,
  //   1,
  //   getAgentID("example2"),
  //   { value: 10000, gasLimit: 10000000 }
  // );
  // await tx.wait();

  // //-------------------------------- STEP 2 --------------------------------
  // // Testing the sendRequest function instead of the chainlink job
  // // Call this allone after the first step to test the functionality
  // // If chainlink automation is registered then this function will be called automaticly

  // tx = await agentPlaceInstance.sendRequest(getSourceID("twitterAds"), {
  //   gasLimit: 10000000,
  // });
  // await tx.wait();

  //  tx = await agentPlaceInstance.sendRequest(getSourceID("usersRewardMechanism"), {
  //     gasLimit: 10000000,
  //   });
  //   await tx.wait();

  // console.log(AgentPlace.address);
};
