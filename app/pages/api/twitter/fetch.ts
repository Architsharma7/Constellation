import { NextResponse } from "next/server";
import { NextApiResponse, NextApiRequest } from "next";

const token = process.env.NEXT_PUBLIC_BEARER_TOKEN;

const endpointURL = "https://api.twitter.com/2/tweets";

export default async function GetHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const params = {
    ids: "1723706110987698333",
    "tweet.fields": "lang,author_id",
    "user.fields": "created_at",
  };

  const result = await fetch(endpointURL + "?" + new URLSearchParams(params), {
    method: "GET",
    headers: {
      "User-Agent": "v2TweetLookupJS",
      authorization: `Bearer ${token}`,
    },
  });

  if (result) {
    res.status(200).json(result);
  } else {
    throw new Error("Unsuccessful request");
  }
}
