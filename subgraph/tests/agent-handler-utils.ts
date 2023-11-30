import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  OwnershipTransferred,
  RequestFulfilled,
  RequestSent,
  Response,
  Transfer,
  agentRegistered,
  agentSubscriptionPurchased,
  agentVersionRegistered,
  rewardMechanismRegistered
} from "../generated/AgentHandler/AgentHandler"

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

export function createResponseEvent(
  requestId: Bytes,
  response: Bytes
): Response {
  let responseEvent = changetype<Response>(newMockEvent())

  responseEvent.parameters = new Array()

  responseEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  responseEvent.parameters.push(
    new ethereum.EventParam("response", ethereum.Value.fromBytes(response))
  )

  return responseEvent
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
  agentID: i32,
  creator: Address,
  UnlockSubscriptionContract: Address,
  KeyPrice: BigInt,
  basisPoint: BigInt,
  categories: string,
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
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(agentID))
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "UnlockSubscriptionContract",
      ethereum.Value.fromAddress(UnlockSubscriptionContract)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "KeyPrice",
      ethereum.Value.fromUnsignedBigInt(KeyPrice)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "basisPoint",
      ethereum.Value.fromUnsignedBigInt(basisPoint)
    )
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam("categories", ethereum.Value.fromString(categories))
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
  agentID: i32,
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
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(agentID))
    )
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
  agentID: i32,
  agentVersionName: string,
  agentVersionID: i32,
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
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(agentID))
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
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(agentVersionID))
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
  rewardDistributions: Array<i32>
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
      ethereum.Value.fromI32Array(rewardDistributions)
    )
  )

  return rewardMechanismRegisteredEvent
}
