import { gql } from "@apollo/client";

// NOTE: Chances to also filter on the basis of Name, if we index that
// NOTE: Also add isImprovedVersion to only fetch the agents which are original
// NOTE: REWARDS thing could be added to the creators profile , to show who has what rank

// NOTE: Other filters also possible in case we want any of them

// Query for the explorer page
export const allAgentsQuery = gql`
  query ($first: Int) {
    agents(first: $first) {
      KeyPrice
      agentID
      id
      assistantId
      basisPoint
      categories
      isOpenForContributions
      parentAgent {
        agentID
      }
      unlockSubAddress
    }
  }
`;

// For a agent's info page
export const indivAgentQuery = gql`
  query ($id: String) {
    agent(id: $id) {
      KeyPrice
      agentID
      assistantId
      basisPoint
      categories
      isOpenForContributions
      id
      metadataCID
      unlockSubAddress
      parentAgent {
        id
        assistantId
        agentID
      }
      creator {
        address
      }
    }
  }
`;

//Could be used on Explore or Leaderboard
export const allCreatorsQuery = gql`
  query ($first: Int) {
    creators(first: $first) {
      address
      id
      agentdCreated {
        id
        assistantId
        agentID
        KeyPrice
        isOpenForContributions
      }
    }
  }
`;

export const indivCreatorQuery = gql`
  query ($id: String) {
    creator(id: $id) {
      address
      id
      agentsCreated {
        KeyPrice
        agentID
        assistantId
        id
        isOpenForContributions
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
        agent {
          agentID
          assistantId
          id
          metadataCID
          unlockSubAddress
        }
      }
    }
  }
`;
