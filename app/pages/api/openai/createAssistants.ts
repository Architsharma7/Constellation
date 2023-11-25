import { createAssistant } from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") return res.status(405).send("Method Not Allowed");

  // we might have to add other checks here in case of authentication if the user is allowed to create the or not
  const { assistantName, assistantDesc, tools, fileIds } = req.body;

  try {
    const result = await createAssistant(
      assistantName,
      assistantDesc,
      tools,
      fileIds
    );
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
