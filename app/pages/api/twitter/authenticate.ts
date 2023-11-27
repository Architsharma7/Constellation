import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "twitter-api-sdk";
import { createHash, randomBytes } from "crypto";

const authClient = new auth.OAuth2User({
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
  client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
  callback: "http://localhost:3000/callback",
  scopes: ["tweet.read", "users.read", "tweet.write"],
});

// const codeVerifier = randomBytes(32).toString("hex");
const codeVerifier =
  "baa75e667d6786150f7b083350a2858febe53e6f664c3d13e41aaf0a1fba27d5";

const codeChallenge = `l3fxMSGUVEW7iMj4hvRi6Sza6J6SFbjrdD0QeJzZyNQ=`;

const authUrl = authClient.generateAuthURL({
  state: "mystate",
  code_challenge: codeChallenge,
  code_challenge_method: "plain",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.redirect(authUrl);
}
