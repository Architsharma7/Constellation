import { createMessage, runThread } from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") return res.status(405).send("Method Not Allowed");

  const { threadId, assistantId, instructions } = req.body;
  const thread: OpenAI.Beta.Threads.Thread = {
    id: threadId,
    object: "thread",
    created_at: 1701697285,
    metadata: null,
  };
  const assistant: OpenAI.Beta.Assistants.Assistant = {
    id: assistantId,
    object: "assistant",
    created_at: 1701697285,
    name: "",
    description: null,
    model: "gpt-3.5-turbo-1106",
    instructions: "",
    tools: [],
    file_ids: [],
    metadata: {},
  };
  try {
    const result = await runThread(thread, assistant, instructions);
    console.log(result);

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
