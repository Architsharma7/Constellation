const { ethers } = require("hardhat");

function getAgentID(agentNameID) {
  const abi = ethers.utils.defaultAbiCoder;

  let agentId_bytes = abi.encode(["string"], [agentNameID]);

  const agent_bytes32 = ethers.utils.keccak256(agentId_bytes);
  // Convert the bytes32 value to a BigInt
  const uint256Value = BigInt(agent_bytes32);

  // Perform the uint64 conversion
  const uint64Value = uint256Value & BigInt("0xFFFFFFFFFFFFFFFF");

  // Perform the uint16 conversion
  const uint16Value = Number(uint64Value & BigInt("0xFFFF"));

  return uint16Value;
}

function getSourceID(sourceName){
    const abi = ethers.utils.defaultAbiCoder;
  
    let sourceNameBytes = abi.encode(["string"], [sourceName]);
  
    const sourceID = ethers.utils.keccak256(sourceNameBytes);

    return sourceID;
}

function getTopKAgents(agentsIDs) {
  const abi = ethers.utils.defaultAbiCoder;
  let bytes = abi.encode(["uint16[]"], [agentsIDs]);
  return bytes;
}

// Mumbai
const _oracle = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";
const _forwarderAddress = "0xA5706f43A9fDBA635Ddda9E1a81101cbc5aabaA6";
const _unlockContract = "0x1FF7e338d5E582138C46044dc238543Ce555C963";
const _donID = "0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000";
const _subscriptionId = 785;


const codeString = `
  const apiResponse = await Functions.makeHttpRequest({
    url: 'https://constellation-opal.vercel.app/api/functions/getTopAgents'
  });

  if (apiResponse.error) {
    console.error(apiResponse.error);
    throw Error('Request failed');
  }

  const { data } = apiResponse;

  // Return tok agents IDs encoded as a hexadecimal string
  return Functions.encodeString(data.encodedIDs);
`;


const distributionRewards = [200,100];
const sourceForwarder =""
const deployment_config = [
  _oracle,
  _unlockContract,
  _donID,
  _subscriptionId,
];


module.exports = {
  getAgentID,
  getTopKAgents,
  deployment_config,
  codeString,
  distributionRewards,
  getSourceID,
  _forwarderAddress
};
