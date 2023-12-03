// agentId => Tweets[] , If need to store anything else in the firebase , can be done

import {
  addDoc,
  arrayUnion,
  average,
  collection,
  doc,
  getAggregateFromServer,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

export const createAgent = async (agentId: number) => {
  const docsRef = doc(db, "AgentTweets", `${agentId}`);

  await setDoc(docsRef, {
    avgRating: 0,
    tweets: [],
  });

  //NOTE: if update doesn't work then use setDoc
};

// AgentId is the uint16 id recorded in the contracts
export const addTweets = async (agentId: number, tweetId: string) => {
  const docsRef = doc(db, "AgentTweets", `${agentId}`);

  await updateDoc(docsRef, {
    tweets: arrayUnion(tweetId),
  });

  //NOTE: if update doesn't work then use setDoc
};

// we can store any other kind of data related to metrices off chain in firebase

export const getTweets = async (agentId: number) => {
  const docsRef = doc(db, "AgentTweets", `${agentId}`);
  const docSnap = await getDoc(docsRef);
  const data = docSnap.data();
  return data;
};

// AgentId is the uint16 id recorded in the contracts
export const addReview = async (
  agentId: number,
  newRating: number,
  newReview: string,
  userName: string
) => {
  const colRef = collection(db, "AgentTweets", `${agentId}`, "Reviews");

  await addDoc(colRef, {
    rating: newRating,
    review: newReview,
    user: userName,
  });

  // maybe want to also update the overall rating
  const snapshot = await getAggregateFromServer(colRef, {
    averageRating: average("rating"),
  });
  const docsRef = doc(db, "AgentTweets", `${agentId}`);

  await updateDoc(docsRef, {
    avgRating: snapshot.data().averageRating,
  });
};

export const getAvgRating = async (agentId: number): Promise<number | null> => {
  const colRef = collection(db, "AgentTweets", `${agentId}`, "Reviews");
  const snapshot = await getAggregateFromServer(colRef, {
    averageRating: average("rating"),
  });
  const averageRating = snapshot.data().averageRating;
  return averageRating;
};
