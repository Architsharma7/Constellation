import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  OwnershipTransferred,
  RequestFulfilled,
  RequestSent,
  RoundRewardsDistributed,
  RoundWinners,
  Transfer,
  agentRegistered,
  agentSubscriptionPurchased,
  agentVersionRegistered,
  rewardMechanismRegistered
} from "../generated/AgentHandlerV2/AgentHandlerV2"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRequestFulfilledEvent(id: Bytes): RequestFulfilled {
  let requestFulfilledEvent = changetype<RequestFulfilled>(newMockEvent())

  requestFulfilledEvent.parameters = new Array()

  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestFulfilledEvent
}

export function createRequestSentEvent(id: Bytes): RequestSent {
  let requestSentEvent = changetype<RequestSent>(newMockEvent())

  requestSentEvent.parameters = new Array()

  requestSentEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestSentEvent
}

export function createRoundRewardsDistributedEvent(
  requestId: Bytes,
  sourceID: Bytes,
  topkAgents: Array<BigInt>,
  topkUsers: Array<Address>
): RoundRewardsDistributed {
  let roundRewardsDistributedEvent = changetype<RoundRewardsDistributed>(
    newMockEvent()
  )

  roundRewardsDistributedEvent.parameters = new Array()

  roundRewardsDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  roundRewardsDistributedEvent.parameters.push(
    new ethereum.EventParam("sourceID", ethereum.Value.fromFixedBytes(sourceID))
  )
  roundRewardsDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "topkAgents",
      ethereum.Value.fromUnsignedBigIntArray(topkAgents)
    )
  )
  roundRewardsDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "topkUsers",
      ethereum.Value.fromAddressArray(topkUsers)
    )
  )

  return roundRewardsDistributedEvent
}

export function createRoundWinnersEvent(
  requestId: Bytes,
  sourceID: Bytes,
  response: Bytes
): RoundWinners {
  let roundWinnersEvent = changetype<RoundWinners>(newMockEvent())

  roundWinnersEvent.parameters = new Array()

  roundWinnersEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  roundWinnersEvent.parameters.push(
    new ethereum.EventParam("sourceID", ethereum.Value.fromFixedBytes(sourceID))
  )
  roundWinnersEvent.parameters.push(
    new ethereum.EventParam("response", ethereum.Value.fromBytes(response))
  )

  return roundWinnersEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createagentRegisteredEvent(
  agentName: string,
  agentID: BigInt,
  creator: Address,
  unlockSubscriptionContract: Address,
  keyPrice: BigInt,
  basisPoint: BigInt,
  rewardCategory: string,
  actualCategory: string,
  isOpenForContributions: boolean
): agentRegistered {
  let agentRegisteredEvent = changetype<agentRegistered>(newMockEvent())

  agentRegisteredEvent.parameters = new Array()

  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam("agentName", ethereum.Value.fromString(agentName))
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "agentID",
      ethereum.Value.fromUnsignedBigInt(agentID)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "unlockSubscriptionContract",
      ethereum.Value.fromAddress(unlockSubscriptionContract)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "keyPrice",
      ethereum.Value.fromUnsignedBigInt(keyPrice)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "basisPoint",
      ethereum.Value.fromUnsignedBigInt(basisPoint)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "rewardCategory",
      ethereum.Value.fromString(rewardCategory)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "actualCategory",
      ethereum.Value.fromString(actualCategory)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "isOpenForContributions",
      ethereum.Value.fromBoolean(isOpenForContributions)
    )
  )

  return agentRegisteredEvent
}

export function createagentSubscriptionPurchasedEvent(
  agentID: BigInt,
  tokenId: BigInt,
  threadID: string,
  agentCreator: Address,
  subscriber: Address
): agentSubscriptionPurchased {
  let agentSubscriptionPurchasedEvent = changetype<agentSubscriptionPurchased>(
    newMockEvent()
  )

  agentSubscriptionPurchasedEvent.parameters = new Array()

  agentSubscriptionPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "agentID",
      ethereum.Value.fromUnsignedBigInt(agentID)
    )
  )
  agentSubscriptionPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  agentSubscriptionPurchasedEvent.parameters.push(
    new ethereum.EventParam("threadID", ethereum.Value.fromString(threadID))
  )
  agentSubscriptionPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "agentCreator",
      ethereum.Value.fromAddress(agentCreator)
    )
  )
  agentSubscriptionPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )

  return agentSubscriptionPurchasedEvent
}

export function createagentVersionRegisteredEvent(
  agentID: BigInt,
  agentVersionName: string,
  agentVersionID: BigInt,
  creator: Address,
  agentMetadataCID: string
): agentVersionRegistered {
  let agentVersionRegisteredEvent = changetype<agentVersionRegistered>(
    newMockEvent()
  )

  agentVersionRegisteredEvent.parameters = new Array()

  agentVersionRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "agentID",
      ethereum.Value.fromUnsignedBigInt(agentID)
    )
  )
  agentVersionRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "agentVersionName",
      ethereum.Value.fromString(agentVersionName)
    )
  )
  agentVersionRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "agentVersionID",
      ethereum.Value.fromUnsignedBigInt(agentVersionID)
    )
  )
  agentVersionRegisteredEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  agentVersionRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "agentMetadataCID",
      ethereum.Value.fromString(agentMetadataCID)
    )
  )

  return agentVersionRegisteredEvent
}

export function createrewardMechanismRegisteredEvent(
  sourceName: string,
  sourceCode: string,
  sourceID: Bytes,
  rewardDistributions: Array<BigInt>
): rewardMechanismRegistered {
  let rewardMechanismRegisteredEvent = changetype<rewardMechanismRegistered>(
    newMockEvent()
  )

  rewardMechanismRegisteredEvent.parameters = new Array()

  rewardMechanismRegisteredEvent.parameters.push(
    new ethereum.EventParam("sourceName", ethereum.Value.fromString(sourceName))
  )
  rewardMechanismRegisteredEvent.parameters.push(
    new ethereum.EventParam("sourceCode", ethereum.Value.fromString(sourceCode))
  )
  rewardMechanismRegisteredEvent.parameters.push(
    new ethereum.EventParam("sourceID", ethereum.Value.fromFixedBytes(sourceID))
  )
  rewardMechanismRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "rewardDistributions",
      ethereum.Value.fromUnsignedBigIntArray(rewardDistributions)
    )
  )

  return rewardMechanismRegisteredEvent
}
