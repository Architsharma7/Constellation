import {
  createImage,
  createMessage,
  submitToolOuput,
} from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") return res.status(405).send("Method Not Allowed");

  // toolOutputs: { tool_call_id: string; output: string }[]
  const { threadID, runID, toolOutputs } = req.body;
  const thread: OpenAI.Beta.Threads.Thread = {
    id: threadID,
    object: "thread",
    created_at: 1701697285,
    metadata: null,
  };
  try {
    const result = await submitToolOuput(thread, runID, toolOutputs);
    console.log(result);

    // we'll have to see if we want to run the Thread and produce the output
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Result undefined" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
}
