import { NextResponse } from "next/server";
import { resolve } from "path";

const token = process.env.NEXT_PUBLIC_BEARER_TOKEN;

const endpointURL = "https://api.twitter.com/2/tweets";

export default async function GetHandler() {
  const params = {
    ids: "1723706110987698333",
    "tweet.fields": "lang,author_id",
    "user.fields": "created_at",
  };

  const res = await fetch(endpointURL + "?" + new URLSearchParams(params), {
    method: "GET",
    headers: {
      "User-Agent": "v2TweetLookupJS",
      authorization: `Bearer ${token}`,
    },
  });

  if (res.body) {
    NextResponse.json(res.body);
    resolve();
  } else {
    throw new Error("Unsuccessful request");
  }
}
