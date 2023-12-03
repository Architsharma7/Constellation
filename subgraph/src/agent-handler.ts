// import {
//   agentRegistered as agentRegisteredEvent,
//   agentSubscriptionPurchased as agentSubscriptionPurchasedEvent,
//   agentVersionRegistered as agentVersionRegisteredEvent,
//   rewardMechanismRegistered as rewardMechanismRegisteredEvent,
// } from "../generated/AgentHandler/AgentHandler";
// import { Agent, Creator, SubscriptionEntity, User } from "../generated/schema";
// import { BigInt, Bytes } from "@graphprotocol/graph-ts";

// export function handleagentRegistered(event: agentRegisteredEvent): void {
//   let creator = Creator.load(event.params.creator);
//   if (creator == null) {
//     creator = new Creator(event.params.creator);
//     creator.address = event.params.creator;
//     creator.save();
//   }

//   let entity = new Agent(Bytes.fromI32(event.params.agentID));
//   entity.assistantId = event.params.agentName;
//   entity.agentID = event.params.agentID;
//   entity.creator = creator.id;
//   entity.unlockSubAddress = event.params.UnlockSubscriptionContract;
//   entity.KeyPrice = event.params.KeyPrice;
//   entity.basisPoint = event.params.basisPoint;
//   entity.categories = event.params.categories;
//   entity.isOpenForContributions = event.params.isOpenForContributions;
//   entity.isImprovedVersion = false;

//   entity.save();
// }

// export function handleagentSubscriptionPurchased(
//   event: agentSubscriptionPurchasedEvent
// ): void {
//   //UserAddress-AgentId
//   let entity = new SubscriptionEntity(
//     event.params.subscriber.concatI32(event.params.agentID)
//   );
//   let agent = Agent.load(Bytes.fromI32(event.params.agentID));
//   if (agent == null) {
//     return;
//   }
//   entity.agent = agent.id;

//   let creator = Creator.load(event.params.agentCreator);
//   if (creator == null) {
//     return;
//   }

//   entity.agentCreator = creator.id;

//   let user = User.load(event.params.subscriber);
//   if (user == null) {
//     user = new User(event.params.subscriber);
//     user.address = event.params.subscriber;
//     user.save();
//   }

//   entity.buyer = user.id;
//   entity.createdAt = event.block.timestamp;
//   entity.expiresAt = BigInt.fromI32(event.block.timestamp.toI32() + 2592000);

//   entity.save();
// }

// export function handleagentVersionRegistered(
//   event: agentVersionRegisteredEvent
// ): void {
//   let creator = Creator.load(event.params.creator);
//   if (creator == null) {
//     creator = new Creator(event.params.creator);
//     creator.address = event.params.creator;
//     creator.save();
//   }

//   let entity = new Agent(Bytes.fromI32(event.params.agentVersionID));

//   let agent = Agent.load(Bytes.fromI32(event.params.agentID));
//   if (agent == null) {
//     return;
//   }

//   // may need to add the new agent in the array of AgentVersions

//   entity.parentAgent = agent.id;

//   entity.assistantId = event.params.agentVersionName;
//   entity.agentID = event.params.agentVersionID;

//   entity.creator = creator.id;
//   entity.metadataCID = event.params.agentMetadataCID;
//   entity.unlockSubAddress = agent.unlockSubAddress;
//   entity.KeyPrice = agent.KeyPrice;
//   entity.basisPoint = agent.basisPoint;
//   entity.categories = agent.categories;
//   entity.isOpenForContributions = agent.isOpenForContributions;
//   entity.isImprovedVersion = true;

//   entity.save();
// }

// // export function handlerewardMechanismRegistered(
// //   event: rewardMechanismRegisteredEvent
// // ): void {
// //   let entity = new rewardMechanismRegistered(
// //     event.transaction.hash.concatI32(event.logIndex.toI32())
// //   );
// //   entity.sourceName = event.params.sourceName;
// //   entity.sourceCode = event.params.sourceCode;
// //   entity.sourceID = event.params.sourceID;
// //   entity.rewardDistributions = event.params.rewardDistributions;

// //   entity.blockNumber = event.block.number;
// //   entity.blockTimestamp = event.block.timestamp;
// //   entity.transactionHash = event.transaction.hash;

// //   entity.save();
// // }
