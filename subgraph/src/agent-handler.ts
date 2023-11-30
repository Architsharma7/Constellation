import {
  Approval as ApprovalEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RequestFulfilled as RequestFulfilledEvent,
  RequestSent as RequestSentEvent,
  Response as ResponseEvent,
  Transfer as TransferEvent,
  agentRegistered as agentRegisteredEvent,
  agentSubscriptionPurchased as agentSubscriptionPurchasedEvent,
  agentVersionRegistered as agentVersionRegisteredEvent,
  rewardMechanismRegistered as rewardMechanismRegisteredEvent
} from "../generated/AgentHandler/AgentHandler"
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
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestFulfilled(event: RequestFulfilledEvent): void {
  let entity = new RequestFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.AgentHandler_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestSent(event: RequestSentEvent): void {
  let entity = new RequestSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.AgentHandler_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleResponse(event: ResponseEvent): void {
  let entity = new Response(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.response = event.params.response

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleagentRegistered(event: agentRegisteredEvent): void {
  let entity = new agentRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.agentName = event.params.agentName
  entity.agentID = event.params.agentID
  entity.creator = event.params.creator
  entity.UnlockSubscriptionContract = event.params.UnlockSubscriptionContract
  entity.KeyPrice = event.params.KeyPrice
  entity.basisPoint = event.params.basisPoint
  entity.categories = event.params.categories
  entity.isOpenForContributions = event.params.isOpenForContributions

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleagentSubscriptionPurchased(
  event: agentSubscriptionPurchasedEvent
): void {
  let entity = new agentSubscriptionPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.agentID = event.params.agentID
  entity.agentCreator = event.params.agentCreator
  entity.subscriber = event.params.subscriber

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleagentVersionRegistered(
  event: agentVersionRegisteredEvent
): void {
  let entity = new agentVersionRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.agentID = event.params.agentID
  entity.agentVersionName = event.params.agentVersionName
  entity.agentVersionID = event.params.agentVersionID
  entity.creator = event.params.creator
  entity.agentMetadataCID = event.params.agentMetadataCID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlerewardMechanismRegistered(
  event: rewardMechanismRegisteredEvent
): void {
  let entity = new rewardMechanismRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sourceName = event.params.sourceName
  entity.sourceCode = event.params.sourceCode
  entity.sourceID = event.params.sourceID
  entity.rewardDistributions = event.params.rewardDistributions

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
