import { AbiCoder, keccak256 } from "ethers";

export const getAgentID = (agentNameID: string) => {
  const abi = new AbiCoder();

  let agentId_bytes = abi.encode(["string"], [agentNameID]);

  const agent_bytes32 = keccak256(agentId_bytes);
  // Convert the bytes32 value to a BigInt
  const uint256Value = BigInt(agent_bytes32);

  // Perform the uint64 conversion
  const uint64Value = uint256Value & BigInt("0xFFFFFFFFFFFFFFFF");

  // Perform the uint32 conversion
  const uint32Value = Number(uint64Value & BigInt("0xFFFFFFFF"));

  return uint32Value;
};

export const encodeUint32ArrayToBytes = (uint32Array: any[]) => {
  if (!Array.isArray(uint32Array)) {
    throw new Error("Input must be an array");
  }

  let bytes = "0x";
  for (let i = 0; i < uint32Array.length; i++) {
    bytes += uint32Array[i].toString(16).padStart(8, "0");
  }
  return bytes;
};


export const concatenateAddresses = (addressArray: any[]) => {
  if (!Array.isArray(addressArray)) {
    throw new Error("Input must be an array of addresses");
  }

  let concatenatedBytes = "0x";
  for (const address of addressArray) {
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
      throw new Error("Invalid Ethereum address format");
    }
    concatenatedBytes += address.substring(2);
  }
  return concatenatedBytes;
};

export const getSourceID = (sourceName: string) => {
  if(!sourceName) return " ";
  const abi = new AbiCoder();

  let sourceNameBytes = abi.encode(["string"], [sourceName]);

  const sourceID = keccak256(sourceNameBytes);

  return sourceID;
};

export const getRewardCategory = (input: number) => {
  if (input === 0) {
    return "ratings";
  } else if (input === 1) {
    return "twitterIds";
  } else {
    return "ratings";
  }
};
