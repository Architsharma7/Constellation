     - event: rewardMechanismRegistered(string,string,bytes32,uint8[])
          handler: handlerewardMechanismRegistered

- kind: ethereum
  name: AgentHandler
  network: mumbai
  source:
  address: "0x0294e2aC7043c7d2D861F5C921ccec8f7A559188"
  abi: AgentHandler
  startBlock: 42987275
  mapping:
  kind: ethereum/events
  apiVersion: 0.0.7
  language: wasm/assemblyscript
  entities: - Creator - User - Agent - Subscription
  abis: - name: AgentHandler
  file: ./abis/AgentHandler.json
  eventHandlers: - event: agentRegistered(string,uint16,address,address,uint256,uint256,string,bool)
  handler: handleagentRegistered - event: agentSubscriptionPurchased(uint16,address,address)
  handler: handleagentSubscriptionPurchased - event: agentVersionRegistered(uint16,string,uint16,address,string)
  handler: handleagentVersionRegistered
  file: ./src/agent-handler.ts

- kind: ethereum
  name: AgentHandlerV2
  network: mumbai
  source:
  address: "0xBd1767206D13601f162cd18eA006B798775f798b"
  abi: AgentHandlerV2
  startBlock: 43095064
  mapping:
  kind: ethereum/events
  apiVersion: 0.0.7
  language: wasm/assemblyscript
  entities: - Creator - User - Agent - SubscriptionEntity - RewardMechanism - RoundWinners - Round
  abis: - name: AgentHandlerV2
  file: ./abis/AgentHandlerV2.json
  eventHandlers: - event: RoundRewardsDistributed(bytes32,bytes32,uint32[],address[])
  handler: handleRoundRewardsDistributed - event: agentRegistered(string,uint32,address,address,uint256,uint256,string,string,bool)
  handler: handleagentRegistered - event: agentSubscriptionPurchased(uint32,uint256,string,address,address)
  handler: handleagentSubscriptionPurchased - event: agentVersionRegistered(uint32,string,uint32,address,string)
  handler: handleagentVersionRegistered - event: rewardMechanismRegistered(string,string,bytes32,uint256[])
  handler: handlerewardMechanismRegistered
  file: ./src/agent-handler-v-2.ts
