import {
  AgentHandlerV2,
  Approval as ApprovalEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RequestFulfilled as RequestFulfilledEvent,
  RequestSent as RequestSentEvent,
  RoundRewardsDistributed as RoundRewardsDistributedEvent,
  RoundWinners as RoundWinnersEvent,
  Transfer as TransferEvent,
  agentRegistered as agentRegisteredEvent,
  agentSubscriptionPurchased as agentSubscriptionPurchasedEvent,
  agentVersionRegistered as agentVersionRegisteredEvent,
  rewardMechanismRegistered as rewardMechanismRegisteredEvent,
} from "../generated/AgentHandlerV2/AgentHandlerV2";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

import {
  Agent,
  Creator,
  SubscriptionEntity,
  User,
  Round,
  RewardMechanism,
} from "../generated/schema";
import { convertIdtoBytes } from "./helpers";

export function handleRoundRewardsDistributed(
  event: RoundRewardsDistributedEvent
): void {
  let entity = new Round(event.params.requestId);

  let rewardMechanism = RewardMechanism.load(event.params.sourceID);
  if (rewardMechanism == null) {
    return;
  }
  entity.rewardMechanism = rewardMechanism.id;

  // we get agent Id in num form , we have to convert them to Bytes form for the Id
  entity.topkAgents = convertIdtoBytes(event.params.topkAgents);
  // directly can point to user or creator , as the user have same Ids
  entity.topkUsers = event.params.topkUsers;

  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlerewardMechanismRegistered(
  event: rewardMechanismRegisteredEvent
): void {
  let entity = new RewardMechanism(event.params.sourceID);
  entity.sourceName = event.params.sourceName;
  entity.sourceCode = event.params.sourceCode;
  entity.rewardDistributions = event.params.rewardDistributions;
  entity.save();
}

// export function handleRoundWinners(event: RoundWinnersEvent): void {
//   let entity = new RoundWinners(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.requestId = event.params.requestId
//   entity.sourceID = event.params.sourceID
//   entity.response = event.params.response

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }
export function handleagentRegistered(event: agentRegisteredEvent): void {
  let creator = Creator.load(event.params.creator);
  if (creator == null) {
    creator = new Creator(event.params.creator);
    creator.address = event.params.creator;
    creator.save();
  }
  let entity = new Agent(Bytes.fromI32(event.params.agentID.toI32()));
  entity.assistantId = event.params.agentName;
  entity.agentID = event.params.agentID;
  entity.creator = creator.id;
  entity.unlockSubAddress = event.params.unlockSubscriptionContract;
  entity.keyPrice = event.params.keyPrice;
  entity.basisPoint = event.params.basisPoint;
  entity.agentCategory = event.params.actualCategory;
  // need to convert the rewardCategory name to rewardCategory Id
  // if this does not work ,convert this off chain and pass only the sourceID in the place of rewardCategory name

  // const rewardMechanismId = createSourceId(event.params.rewardCategory);
  let rewardMechanism = RewardMechanism.load(
    Bytes.fromHexString(event.params.rewardCategory)
  );
  if (rewardMechanism == null) {
    return;
  }
  entity.rewardCategory = rewardMechanism.id;
  entity.isOpenForContributions = event.params.isOpenForContributions;
  entity.isImprovedVersion = false;

  entity.save();
}

export function handleagentSubscriptionPurchased(
  event: agentSubscriptionPurchasedEvent
): void {
  //UserAddress-AgentId
  let entity = new SubscriptionEntity(
    event.params.subscriber.concat(Bytes.fromI32(event.params.agentID.toI32()))
  );
  let agent = Agent.load(Bytes.fromI32(event.params.agentID.toI32()));
  if (agent == null) {
    return;
  }
  entity.agent = agent.id;

  let creator = Creator.load(event.params.agentCreator);
  if (creator == null) {
    return;
  }

  entity.agentCreator = creator.id;

  let user = User.load(event.params.subscriber);
  if (user == null) {
    user = new User(event.params.subscriber);
    user.address = event.params.subscriber;
    user.save();
  }

  entity.buyer = user.id;
  entity.threadID = event.params.threadID;
  entity.tokenId = event.params.tokenId;
  entity.createdAt = event.block.timestamp;
  entity.expiresAt = BigInt.fromI32(event.block.timestamp.toI32() + 2592000);

  entity.save();
}

export function handleagentVersionRegistered(
  event: agentVersionRegisteredEvent
): void {
  let creator = Creator.load(event.params.creator);
  if (creator == null) {
    creator = new Creator(event.params.creator);
    creator.address = event.params.creator;
    creator.save();
  }

  let entity = new Agent(Bytes.fromI32(event.params.agentVersionID.toI32()));

  let agent = Agent.load(Bytes.fromI32(event.params.agentID.toI32()));
  if (agent == null) {
    return;
  }

  // may need to add the new agent in the array of AgentVersions

  entity.parentAgent = agent.id;

  entity.assistantId = event.params.agentVersionName;
  entity.agentID = event.params.agentVersionID;

  entity.creator = creator.id;
  entity.metadataCID = event.params.agentMetadataCID;
  entity.unlockSubAddress = agent.unlockSubAddress;
  entity.keyPrice = agent.keyPrice;
  entity.basisPoint = agent.basisPoint;
  entity.agentCategory = agent.agentCategory;
  entity.rewardCategory = agent.rewardCategory;
  entity.isOpenForContributions = agent.isOpenForContributions;
  entity.isImprovedVersion = true;

  entity.save();
}
