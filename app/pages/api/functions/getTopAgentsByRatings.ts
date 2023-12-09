import {
  getAgentID,
  encodeUint32ArrayToBytes,
} from "@/utils/chainlinkFunctions"; // Import your utility functions
import type { NextApiRequest, NextApiResponse } from "next";
import { getAllAgents } from "@/utils/graphFunctions";
import { getAvgRating, getRatingsRank } from "@/firebase/firebaseFunctions";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    let topK = 2;
    const agents = await getAllAgents(100);
    let agentRatings = [];

    for (const agent of agents.agents) {
      const avgRating = await getAvgRating(agent.agentID);
      agentRatings.push({ agentID: Number(agent.agentID), rating: avgRating });
    }

    // Sort agents based on ratings in descending order
    // @ts-ignore
    agentRatings.sort((a, b) => b.rating - a.rating);

    // Select top K agents
    const topKAgents = agentRatings.slice(0, topK);

    // Extract IDs for encoding
    const agentIDs = topKAgents.map((agent) => agent.agentID);

    // Encode the agent IDs using RLE
    const encodedIDs = encodeUint32ArrayToBytes(agentIDs);

    res.status(200).json({ encodedIDs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}
