import { getCreator, getUser } from "@/utils/graphFunctions";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const user = () => {
  const { address: userAccount } = useAccount();

  // display the User Data like the agents they have subscribed too
  // NOTE : Could also add more start for the agents , but perhaps not need as of now
  const getUserData = async () => {
    if (!userAccount) {
      console.log("User Account not found");
      return;
    }

    const data = await getUser(userAccount);
    console.log(data);
  };

  useEffect(() => {
    if (userAccount) {
      getUserData();
    }
  }, [userAccount]);

  // NOTE : Set the thread ID and assistantID according to whatever agent user selects from the usage section

  const [threadID, setThreadID] = useState<string>();
  const [assistantID, setAssistantID] = useState<string>();
  const [inputPrompt, setInputPrompt] = useState<string>();

  const handleChat = async () => {
    try {
      // send Message
      // run thread
      // pooling run
      // perform the required internal functions
    } catch (error) {
      console.log(error);
    }
  };

  // code to chat with a party using a threadID
  const sendMessage = async () => {
    try {
      console.log("Sending msg... Calling OpenAI");
      if (!assistantID) {
        console.log("Agent Details missing");
        return;
      }
      if (!inputPrompt) {
        console.log("Input prompt missing");
        return;
      }

      if (!threadID) {
        console.log("Thread id missing...");
        return;
      }
      fetch("/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadID: threadID,
          messageContent: inputPrompt,
          fileIds: [],
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const runThread = async () => {
    try {
      console.log("running thread... Calling OpenAI");
      if (!assistantID) {
        console.log("Agent Details missing");
        return;
      }

      if (!threadID) {
        console.log("thread Details missing");
        return;
      }

      await fetch("/api/openai/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId: threadID,
          assistantId: assistantID,
          instructions: "",
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getThread = async () => {
    console.log("Fetching thread... Calling OpenAI");
    if (!assistantID) {
      console.log("Agent Details missing");
      return;
    }

    if (!threadID) {
      console.log("thread Details missing");
      return;
    }
    // body: JSON.stringify({
    //   threadId: threadID,
    // }),
    const data = await fetch(`/api/openai/getChat?threadId=${threadID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log(res);
        const data = await res.json();
        console.log(data);
        const messages = data.data;
        console.log(messages);
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  };

  return <div>user</div>;
};

export default user;
