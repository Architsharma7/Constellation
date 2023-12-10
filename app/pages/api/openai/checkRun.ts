import { checkRun, createMessage, runThread } from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") return res.status(405).send("Method Not Allowed");

  const query = req.query;
  const threadID = query["threadID"];
  const runID = query["runID"];

  // console.log(threadID, runID);
  if (!threadID)
    return res.status(400).json({ message: "bad request -  threadID missing" });
  if (typeof threadID != "string")
    return res
      .status(400)
      .json({ message: "bad request -  threadID not string" });

  if (!runID)
    return res.status(400).json({ message: "bad request -  runId missing" });

  if (typeof runID != "string")
    return res.status(400).json({ message: "bad request -  runId not string" });

  const thread: OpenAI.Beta.Threads.Thread = {
    id: threadID,
    object: "thread",
    created_at: 1701697285,
    metadata: null,
  };

  try {
    const result = await checkRun(thread, runID);
    console.log(result);

    // after checking , we'll might have to run the function , and submit the Output here or directly in the
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
