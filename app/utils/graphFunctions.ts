import {
  allAgentsQuery,
  allCreatorsQuery,
  allRoundsQuery,
  indivAgentQuery,
  indivCreatorQuery,
  indivLockQuery,
  indivRoundQuery,
  indivSubscriptionQuery,
  indivUserQuery,
} from "@/constants/graphQuery";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
// import {} from "wagmi";
import { getPublicClient } from "wagmi/actions";
// import { Bytes } from "@graphprotocol/graph-ts";

const publicClient = getPublicClient();
const chainId = publicClient.chain.id;

const AVALANCHE_APIURL =
  "https://api.studio.thegraph.com/query/59864/rocketai-avalanche-graph/version/latest";
const MUMBAI_APIURL =
  "https://api.studio.thegraph.com/query/59864/c-demo/version/latest";

const APIURL = chainId === 43114 ? AVALANCHE_APIURL : MUMBAI_APIURL;

const UNLOCK_APIURL_MUMBAI =
  "https://api.thegraph.com/subgraphs/name/unlock-protocol/mumbai-v2";

const UNLOCK_APIURL_AVLANCHE =
  "https://api.thegraph.com/subgraphs/name/unlock-protocol/avalanche-v2";

const UNLOCK_APIURL =
  chainId === 43114 ? UNLOCK_APIURL_AVLANCHE : UNLOCK_APIURL_MUMBAI;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const unlockClient = new ApolloClient({
  uri: UNLOCK_APIURL,
  cache: new InMemoryCache(),
});

export const getAllAgents = async (agentsToFetch: number) => {
  return await client
    .query({
      query: allAgentsQuery,
      variables: {
        first: agentsToFetch,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

// id has to be the agent Id which is Bytes V of agentId
export const getAgent = async (id: string) => {
  return await client
    .query({
      query: indivAgentQuery,
      variables: {
        id: id,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

export const getAllCreators = async (creatorsToFetch: number) => {
  return await client
    .query({
      query: allCreatorsQuery,
      variables: {
        first: creatorsToFetch,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

// Creator Address
export const getCreator = async (id: string) => {
  return await client
    .query({
      query: indivCreatorQuery,
      variables: {
        id: id,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

//User address
export const getUser = async (id: string) => {
  return await client
    .query({
      query: indivUserQuery,
      variables: {
        id: id,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

export const getRound = async (id: string) => {
  return await client
    .query({
      query: indivRoundQuery,
      variables: {
        id: id,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

export const getSubscription = async (id: string) => {
  return await client
    .query({
      query: indivSubscriptionQuery,
      variables: {
        id: id,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

export const getLockData = async (id: string) => {
  return await unlockClient
    .query({
      query: indivLockQuery,
      variables: {
        id: id,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

export const getAllRounds = async (roundsToFetch: number) => {
  return await client
    .query({
      query: allRoundsQuery,
      variables: {
        first: roundsToFetch,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};
