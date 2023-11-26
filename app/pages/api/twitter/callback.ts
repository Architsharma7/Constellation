import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "twitter-api-sdk";
import { createHash, randomBytes } from "crypto";
import axios from "axios";

const authClient = new auth.OAuth2User({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
  callback: `http://localhost:3000/api/twitter/callback`,
  scopes: ["tweet.read", "users.read", "tweet.write"],
});

const STATE = "my-state";

let codeVerifier: string;

export default async function Callbackhandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code, state } = req.query;
    if (state !== STATE) return res.status(500).send("State isn't matching");
    // Generate code verifier
    // codeVerifier = randomBytes(32).toString("hex");
    // const codeChallenge = createHash("sha256")
    //   .update(codeVerifier)
    //   .digest("base64");
    const codeVerifier =
      "baa75e667d6786150f7b083350a2858febe53e6f664c3d13e41aaf0a1fba27d5";
    const codeChallenge = "l3fxMSGUVEW7iMj4hvRi6Sza6J6SFbjrdD0QeJzZyNQ=";

    // Request access token
    const tokenData = await authClient.requestAccessToken(code as string);
    // Handle the tokenData as needed
    console.log("Access Token Data:", tokenData);

    const tweetText = "Hello, Twitter! This is a test tweet.";
    await postTweet(tokenData.token, tweetText);

    res.redirect("/tweets");
    return tokenData;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}

async function postTweet(accessToken: any, tweetText: string): Promise<any> {
  try {
    const tweetEndpoint = "https://api.twitter.com/2/tweets";
    const tweetData = {
      status: tweetText,
    };

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "user-agent": "v2CreateTweetJS",
      "content-type": "application/json",
      accept: "application/json",
    };

    const response = await axios.post(tweetEndpoint, tweetData, { headers });
    console.log("Tweet Posted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw error;
  }
}
