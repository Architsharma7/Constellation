import { checkRun, createMessage, runThread } from "@/utils/openAIfunctions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") return res.status(405).send("Method Not Allowed");

  const { thread, runObj } = req.body;

  try {
    const result = await checkRun(thread, runObj);
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
