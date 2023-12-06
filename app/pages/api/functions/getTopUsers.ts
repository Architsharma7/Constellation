import {
    concatenateAddresses,
  } from "@/utils/chainlinkFunctions"; // Import your utility functions
  import type { NextApiRequest, NextApiResponse } from "next";
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    // if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  
    try {
      // Assuming your API response returns an array of strings
      const apiResponse: string[] = await getTopK_UserEngagement(
        req.body
      );
  
      // Encode the agent IDs using RLE
      const encodedIDs: string = concatenateAddresses(apiResponse);
  
      res.status(200).json({ encodedIDs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  }
  
  // Replace yourApiFunction with the actual function that fetches data from the external API.
  async function getTopK_UserEngagement(
    data: any
  ): Promise<string[]> {
    // Implement your logic to fetch data from the external API here
    // Return an array of strings as per your API response
    return ["0x9C5e3cAC8166eD93F76BC0469b8Bf3ca715bA6B7", "0x9C5e3cAC8166eD93F76BC0469b8Bf3ca715bA6B7"];
  }
  