import { createAndRunThread } from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") return res.status(405).send("Method Not Allowed");
  const { messageContent, assistantId, instructions, fileIds } = req.body;

  // we might have to add other checks here in case of authentication if the user is allowed to use the assistant , meaning if they have paid for it or not
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
    const result = await createAndRunThread(
      messageContent,
      assistant,
      instructions,
      fileIds
    );
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
