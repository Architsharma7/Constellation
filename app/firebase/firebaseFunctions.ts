// agentId => Tweets[] , If need to store anything else in the firebase , can be done

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

// AgentId is the uint16 id recorded in the contracts
export const addTweets = async (agentId: number, tweetId: string) => {
  const docsRef = doc(db, "AgentTweets", `${agentId}`);

  await updateDoc(docsRef, {
    tweets: arrayUnion(tweetId),
  });

  //NOTE: if update doesn't work then use setDoc
};

export const getTweets = async (agentId: number) => {
  const docsRef = doc(db, "AgentTweets", `${agentId}`);
  const docSnap = await getDoc(docsRef);
  const data = docSnap.data();
  return data;
};
