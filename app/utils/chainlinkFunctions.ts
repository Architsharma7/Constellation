import { AbiCoder, keccak256 } from "ethers";

export const getAgentID = (agentNameID: string) => {
  const abi = new AbiCoder;

  let agentId_bytes = abi.encode(["string"], [agentNameID]);

  const agent_bytes32 = keccak256(agentId_bytes);
  // Convert the bytes32 value to a BigInt
  const uint256Value = BigInt(agent_bytes32);

  // Perform the uint64 conversion
  const uint64Value = uint256Value & BigInt("0xFFFFFFFFFFFFFFFF");

  // Perform the uint16 conversion
  const uint16Value = Number(uint64Value & BigInt("0xFFFF"));

  return uint16Value;
};

export const encodeUint16ArrayRLE = (agentsIDs: any[]) => {
  // Ensure agentsIDs is an array of uint16 values
  if (
    !Array.isArray(agentsIDs) ||
    agentsIDs.some((id) => typeof id !== "number" || id < 0 || id > 65535)
  ) {
    throw new Error("Input must be an array of uint16 values");
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
      encodedArray.push(count & 0xffff, currentValue & 0xffff);
      currentValue = agentsIDs[i];
      count = 1;
    }
  }

  // Push the final count and value, encoded as uint16
  encodedArray.push(count & 0xffff, currentValue & 0xffff);

  // Convert the encoded array to a hexadecimal string
  const hexString =
    "0x" +
    encodedArray.map((item) => item.toString(16).padStart(4, "0")).join("");

  return hexString;
};
