import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "twitter-api-sdk";
import { createHash, randomBytes } from "crypto";
import axios from "axios";

const authClient = new auth.OAuth2User({
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
  client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
  callback: `http://localhost:3000/callback`,
  scopes: ["tweet.read", "users.read", "tweet.write"],
});

const STATE = "mystate";

let codeVerifier: string;

export default async function Callbackhandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code, state } = req.body;
    const data = req.body.file;
    console.log(code);
    console.log(state);
    console.log(data);
    if (state !== STATE) return res.status(500).send("State isn't matching");
    // Generate code verifier
    const codeVerifier =
      "baa75e667d6786150f7b083350a2858febe53e6f664c3d13e41aaf0a1fba27d5";
    const codeChallenge = "l3fxMSGUVEW7iMj4hvRi6Sza6J6SFbjrdD0QeJzZyNQ=";

    const authUrl = authClient.generateAuthURL({
      state: "mystate",
      code_challenge: codeChallenge,
      code_challenge_method: "plain",
    });

    // Request access token
    const tokenData = await authClient.requestAccessToken(code as string);
    // Handle the tokenData as needed
    console.log("Access Token Data:", tokenData);

    const tweetText = "Hello, Twitter! This is a test tweet.";
    const mediaData = Buffer.from()  //either a base64 encode string or a raw binary of the image 
    await postTweet(tokenData.token.access_token, tweetText, mediaData);

    res.redirect("/tweets");
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
}

async function postTweet(
  accessToken: any,
  tweetText: string,
  mediaData: Buffer
): Promise<any> {
  try {
    const mediaId = await uploadMedia(accessToken, mediaData);
    const tweetEndpoint = "https://api.twitter.com/2/tweets";
    const tweetData = {
      text: tweetText,
      media_ids: [mediaId],
    };

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "user-agent": "v2CreateTweetJS",
      "content-type": "application/json",
      accept: "application/json",
    };

    const response = await axios.post(tweetEndpoint, tweetData, { headers });
    console.log("Tweet Posted:", response.data);
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw error;
  }
}

async function uploadMedia(
  accessToken: any,
  mediaData: Buffer
): Promise<string> {
  try {
    const uploadEndpoint = "https://upload.twitter.com/1.1/media/upload.json";

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "multipart/form-data",
    };

    const mediaUploadResponse = await axios.post(uploadEndpoint, mediaData, {
      headers: {
        ...headers,
        "content-type": "application/x-www-form-urlencoded",
      },
      params: {
        command: "INIT",
        media_type: "image/jpg",
        total_bytes: mediaData.length,
      },
    });

    const mediaId = mediaUploadResponse.data.media_id_string;
    console.log(mediaId);

    await axios.post(uploadEndpoint, null, {
      headers: {
        ...headers,
        "content-type": "multipart/form-data",
      },
      params: {
        command: "APPEND",
        media_id: mediaId,
        segment_index: 0,
        data: mediaData,
      },
    });

    await axios.post(uploadEndpoint, null, {
      headers: {
        ...headers,
        "content-type": "multipart/form-data",
      },
      params: {
        command: "FINALIZE",
        media_id: mediaId,
      },
    });

    return mediaId;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
}
