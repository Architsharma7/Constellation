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
  agentVersionRegistered
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
  agentID: i32,
  creator: Address,
  UnlockSubscriptionContract: Address,
  isOpenForContributions: boolean
): agentRegistered {
  let agentRegisteredEvent = changetype<agentRegistered>(newMockEvent())

  agentRegisteredEvent.parameters = new Array()

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
      "isOpenForContributions",
      ethereum.Value.fromBoolean(isOpenForContributions)
    )
  )

  return agentRegisteredEvent
}

export function createagentVersionRegisteredEvent(
  agentID: i32,
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
