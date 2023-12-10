const { ethers } = require("hardhat");

function getAgentID(agentNameID) {
  const abi = ethers.utils.defaultAbiCoder;

  let agentId_bytes = abi.encode(["string"], [agentNameID]);
  const agent_bytes32 = ethers.utils.keccak256(agentId_bytes);

  // Convert the bytes32 value to a BigInt
  const uint256Value = BigInt(agent_bytes32);

  // Perform the uint64 conversion
  const uint64Value = uint256Value & BigInt("0xFFFFFFFFFFFFFFFF");

  // Perform the uint32 conversion
  const uint32Value = Number(uint64Value & BigInt("0xFFFFFFFF"));

  return uint32Value;
}

function getSourceID(sourceName) {
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
const _oracleAvax = "0x9f82a6A0758517FD0AfA463820F586999AF314a0"
const _forwRatings = "0xA5706f43A9fDBA635Ddda9E1a81101cbc5aabaA6";
const _forwUsers = "0xb61AEa6C66fF253D14d0fa853D6F116E1df5f608"
const _forwTwitter = "0x55504F116EB8051a6401Aa64398E29BB9A29BD66"
const _unlockContract = "0x1FF7e338d5E582138C46044dc238543Ce555C963";
const _unlockAvalance = "0x70cBE5F72dD85aA634d07d2227a421144Af734b3"
const _donID =
  "0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000";
const _donIDAVax ="0x66756e2d6176616c616e6368652d6d61696e6e65742d31000000000000000000"
const _subscriptionIdAvax = 14;
const _subscriptionId = 785;

const codeStringT = `
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

const codeStringR = `
  const apiResponse = await Functions.makeHttpRequest({
    url: 'https://constellation-opal.vercel.app/api/functions/getTopAgentsByRatingsAvalance'
  });

  if (apiResponse.error) {
    console.error(apiResponse.error);
    throw Error('Request failed');
  }

  const { data } = apiResponse;

  // Return tok agents IDs encoded as a hexadecimal string
  return Functions.encodeString(data.encodedIDs);
`;

const codeStringU = `
  const apiResponse = await Functions.makeHttpRequest({
    url: 'https://constellation-opal.vercel.app/api/functions/getTopUsers'
  });

  if (apiResponse.error) {
    console.error(apiResponse.error);
    throw Error('Request failed');
  }

  const { data } = apiResponse;

  // Return tok agents IDs encoded as a hexadecimal string
  return Functions.encodeString(data.encodedIDs);
`;

const distributionRewards = [100, 50];
const sourceForwarder = "";
const deployment_config = [_oracle, _unlockContract, _donID, _subscriptionId];

const deployment_config_avax = [_oracleAvax, _unlockAvalance, _donIDAVax, _subscriptionIdAvax];
module.exports = {
  getAgentID,
  getTopKAgents,
  deployment_config,
  codeStringT,
  codeStringR,
  codeStringU,
  distributionRewards,
  getSourceID,
  _forwRatings,
  _forwUsers,
  _forwTwitter,
  codeStringR,
  deployment_config_avax
};
