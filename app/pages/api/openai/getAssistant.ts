import {
  createMessage,
  getAssitant,
  getThreadMessage,
} from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") return res.status(405).send("Method Not Allowed");

  const { assistantId } = req.query;
  if (!assistantId)
    return res.status(400).send("bad request -  threadID missing");
  if (typeof assistantId != "string")
    return res.status(400).send("bad request -  threadID missing");

  try {
    const result = await getAssitant(assistantId);
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
