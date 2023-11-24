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

function getTopKAgents(agentsIDs) {
  const abi = ethers.utils.defaultAbiCoder;
  let bytes = abi.encode(["uint16[]"], [agentsIDs]);
  return bytes;
}

// Mumbai
const _oracle = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";
const _forwarderAddress = "";
const _unlockContract = "0x1FF7e338d5E582138C46044dc238543Ce555C963";
const _donID = "0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000";
const _subscriptionId = 785;

const _source =`return Functions.encodeString("0x0001b5970001b14d");`;
const _gasLimit = 300000;
const _topK = 2;
const _splits = [200,100];

const config = [
  _oracle,
  _unlockContract,
  _donID,
  _subscriptionId,
  _source,
  _gasLimit,
  _topK,
  _splits,
];

function encodeUint16ArrayRLE(agentsIDs) {
    // Ensure agentsIDs is an array of uint16 values
    if (!Array.isArray(agentsIDs) || agentsIDs.some(id => typeof id !== 'number' || id < 0 || id > 65535)) {
      throw new Error('Input must be an array of uint16 values');
    }
  
    // Initialize the encoded array
    const encodedArray = [];
  
    // Initialize variables for the current value and count
    let currentValue = agentsIDs[0];
    let count = 1;
  
    // Start from the second element and perform RLE encoding
    for (let i = 1; i < agentsIDs.length; i++) {
      if (agentsIDs[i] === currentValue) {
        // If the current value is the same as the previous, increase the count
        count++;
      } else {
        // If the current value is different, push the count and value to the encoded array
        // Ensure both count and currentValue are encoded as uint16
        encodedArray.push(count & 0xFFFF, currentValue & 0xFFFF);
        currentValue = agentsIDs[i];
        count = 1;
      }
    }
  
    // Push the final count and value, encoded as uint16
    encodedArray.push(count & 0xFFFF, currentValue & 0xFFFF);
  
    // Convert the encoded array to a hexadecimal string
    const hexString = '0x' + encodedArray.map(item => item.toString(16).padStart(4, '0')).join('');
  
    return hexString;
  }

module.exports = {
  getAgentID,
  getTopKAgents,
  config,
  encodeUint16ArrayRLE
};
