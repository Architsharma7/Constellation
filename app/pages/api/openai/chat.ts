import { createMessage } from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") return res.status(405).send("Method Not Allowed");

  const { thread, messageContent, fileIds } = req.body;

  try {
    const result = await createMessage(thread, messageContent, fileIds);
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
