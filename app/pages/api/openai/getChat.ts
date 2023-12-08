import { createMessage, getThreadMessage } from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") return res.status(405).send("Method Not Allowed");

  const { threadId } = req.query;
  if (!threadId) return res.status(400).send("bad request -  threadID missing");
  if (typeof threadId != "string")
    return res.status(400).send("bad request -  threadID missing");

  const thread: OpenAI.Beta.Threads.Thread = {
    id: threadId,
    object: "thread",
    created_at: 1701697285,
    metadata: null,
  };
  try {
    const result = await getThreadMessage(thread);
    // console.log(result);

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
