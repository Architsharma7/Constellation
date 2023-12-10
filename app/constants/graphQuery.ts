import { gql } from "@apollo/client";

// NOTE: Chances to also filter on the basis of Name, if we index that
// NOTE: Also add isImprovedVersion to only fetch the agents which are original
// NOTE: REWARDS thing could be added to the creators profile , to show who has what rank

// NOTE: Other filters also possible in case we want any of them

// Query for the explorer page
export const allAgentsQuery = gql`
  query ($first: Int) {
    agents(first: 10) {
      agentCategory
      agentName
      versionNo
      agentID
      assistantId
      basisPoint
      rewardCategory {
        id
        rewardDistributions
        sourceName
      }
      roundsWon {
        id
        blockTimestamp
        transactionHash
      }
      isOpenForContributions
      keyPrice
      id
      unlockSubAddress
      isImprovedVersion
    }
  }
`;

// For a agent's info page
export const indivAgentQuery = gql`
  query ($id: String) {
    agent(id: $id) {
      agentCategory
      agentName
      versionNo
      AgentVersions {
        assistantId
        agentID
        creator {
          address
          id
        }
      }
      agentID
      assistantId
      basisPoint
      creator {
        address
        id
      }
      id
      isImprovedVersion
      isOpenForContributions
      keyPrice
      metadataCID
      parentAgent {
        agentID
        assistantId
      }
      unlockSubAddress
      rewardCategory {
        rewardDistributions
        id
        sourceName
      }
      roundsWon {
        id
        blockTimestamp
        transactionHash
      }
    }
  }
`;

//Could be used on Explore or Leaderboard
export const allCreatorsQuery = gql`
  query ($first: Int) {
    creators(first: $first) {
      id
      address
      agentsCreated {
        id
        assistantId
        agentID
        agentName
        agentCategory
        keyPrice
        unlockSubAddress
        isOpenForContributions
      }
      roundsWon {
        blockTimestamp
        id
        rewardMechanism {
          id
          sourceName
        }
        transactionHash
      }
    }
  }
`;

export const indivCreatorQuery = gql`
  query ($id: String) {
    creator(id: $id) {
      address
      id
      roundsWon {
        id
        blockTimestamp
        rewardMechanism {
          id
          sourceName
          rewardDistributions
        }
        transactionHash
      }
      agentsCreated {
        agentCategory
        agentID
        agentName
        versionNo
        assistantId
        basisPoint
        isOpenForContributions
        isImprovedVersion
        keyPrice
        unlockSubAddress
        rewardCategory {
          sourceName
          rewardDistributions
          id
        }
      }
    }
  }
`;

// For a User's profile
export const indivUserQuery = gql`
  query ($id: String) {
    user(id: $id) {
      address
      id
      agentsSubscribedTo {
        agentCreator {
          address
        }
        createdAt
        expiresAt
        id
        threadID
        tokenId
        agent {
          agentID
          assistantId
          agentName
          versionNo
          id
          unlockSubAddress
          isOpenForContributions
          agentCategory
          rewardCategory {
            sourceName
            rewardDistributions
            id
          }
          keyPrice
          basisPoint
        }
      }
    }
  }
`;

export const indivRoundQuery = gql`
  query ($id: String) {
    round(id: $id) {
      id
      blockTimestamp
      transactionHash
      rewardMechanism {
        id
        sourceName
        rewardDistributions
      }
      topkAgents {
        agentID
        assistantId
        agentCategory
      }
      topkUsers {
        address
        id
      }
    }
  }
`;

export const indivSubscriptionQuery = gql`
  query ($id: String) {
    subscriptionEntity(id: $id) {
      createdAt
      expiresAt
      id
      threadID
      tokenId
      agent {
        agentID
        versionNo
        assistantId
        id
      }
      agentCreator {
        address
        id
      }
      buyer {
        address
        id
      }
    }
  }
`;

export const allRoundsQuery = gql`
  query ($first: Int) {
    rounds(first: $first) {
      blockTimestamp
      id
      transactionHash
      topkUsers {
        address
        id
      }
      rewardMechanism {
        sourceName
        rewardDistributions
        id
      }
      topkAgents {
        agentID
        agentName
        assistantId
        agentCategory
      }
    }
  }
`;

export const indivLockQuery = gql`
  query ($id: String) {
    lock(id: $id) {
      address
      deployer
      id
      name
      price
      totalKeys
    }
  }
`;
