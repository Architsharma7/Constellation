import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
// import { utils } from "ethers";

// export const createSourceId = (sourceName: string): string => {
//   const abiCoder = utils.defaultAbiCoder;
//   const encodedData = abiCoder.encode(["string"], [sourceName]);
//   const hashedValue = utils.keccak256(encodedData);
//   return hashedValue;
// };

export const convertIdtoBytes = (topkAgents: BigInt[]): string[] => {
  let topAgentIds: string[] = [];
  for (let i = 0; i < topkAgents.length; i++) {
    let agentId = topkAgents[i].toString();
    topAgentIds.push(agentId);
  }
  return topAgentIds;
};

export const convertAddresstoBytes = (topkUsers: Address[]): Bytes[] => {
  let topAddresses: Bytes[] = [];
  for (let i = 0; i < topkUsers.length; i++) {
    let agentAddress = Bytes.fromHexString(topkUsers[i].toHexString());
    topAddresses.push(agentAddress);
  }
  return topAddresses;
};
