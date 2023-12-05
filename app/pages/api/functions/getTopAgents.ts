import {
  getAgentID,
  encodeUint32ArrayToBytes,
} from "@/utils/chainlinkFunctions"; // Import your utility functions
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    // Assuming your API response returns an array of strings
    const apiResponse: string[] = await getTopKagentIDsFromTwitterEngagement(
      req.body
    );

    // Create an array of agent IDs from the strings
    const agentIDs: number[] = apiResponse.map((string) => getAgentID(string));

    // Encode the agent IDs using RLE
    const encodedIDs: string = encodeUint32ArrayToBytes(agentIDs);

    res.status(200).json({ encodedIDs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}

// Replace yourApiFunction with the actual function that fetches data from the external API.
async function getTopKagentIDsFromTwitterEngagement(
  data: any
): Promise<string[]> {
  // Implement your logic to fetch data from the external API here
  // Return an array of strings as per your API response
  return ["Solidity Auditor", "Solidity Auditor V2"];
}
