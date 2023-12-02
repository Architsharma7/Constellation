import { BigInt, Bytes } from "@graphprotocol/graph-ts";
// import { utils } from "ethers";

// export const createSourceId = (sourceName: string): string => {
//   const abiCoder = utils.defaultAbiCoder;
//   const encodedData = abiCoder.encode(["string"], [sourceName]);
//   const hashedValue = utils.keccak256(encodedData);
//   return hashedValue;
// };

export const convertIdtoBytes = (topkAgents: BigInt[]): Bytes[] => {
  let topAgentIds: Bytes[] = [];
  for (let i = 0; i < topkAgents.length; i++) {
    let agentId = Bytes.fromBigInt(topkAgents[i]);
    topAgentIds.push(agentId);
  }
  return topAgentIds;
};
