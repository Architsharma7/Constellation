import { useRouter } from "next/router";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";
import { getCreator, getUser } from "@/utils/graphFunctions";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getRatingsRank } from "@/firebase/firebaseFunctions";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [threadMessages, setthreadMessages] = useState<any>();

  // NOTE : Set the thread ID and assistantID according to whatever agent user selects from the usage section

  const [threadID, setThreadID] = useState<string>();
  const [assistantID, setAssistantID] = useState<string>();
  const [inputPrompt, setInputPrompt] = useState<string>();

  useEffect(() => {
    getRatingsRank();
  }, []);

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

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="flex w-screen">
        <div className="w-1/3 justify-start h-full">
          <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
            <div className="h-full px-3 py-4 overflow-y-auto bg-orange-100 border-r-2 border-black">
              <ul className="space-y-2 font-medium">
                <li>
                  <div
                    onClick={() => router.push("/agents")}
                    className="border cursor-pointer align-middle flex border-gray-300 bg-blue-100 px-6 py-1 rounded-3xl"
                  >
                    <div className="flex items-center">
                      <p className="font-semibold text-xs">
                        Checkout the Agents
                      </p>
                      <div className="ml-5 m-0">
                        <IoIosArrowRoundForward className="text-2xl" />
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-orange-200"
                    onClick={() => setOpen(!open)}
                  >
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      ElonAgent
                    </span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        </div>
        <div className="w-2/3 h-full flex flex-col justify-center items-center relative">
          <div className="mt-6 flex">
            {
              <div className="justify-start flex bg-orange-100 px-4 py-1 rounded-xl">
                {threadMessages &&
                  threadMessages
                    .filter((message: any) => message.role === "user")
                    .map((userMessage: any) => {
                      const content = userMessage.content[0];
                      return (
                        <p className="text-md font-semibold">
                          {content &&
                            content.type === "text" &&
                            content.text.value}
                        </p>
                      );
                    })}
              </div>
            }
          </div>
          <div className="mt-6 flex">
            {
              <div className="justify-start flex bg-pink-100 px-4 py-1 rounded-xl">
                {threadMessages &&
                  threadMessages
                    .filter((message: any) => message.role === "assistant")
                    .map((assistantMessage: any) => {
                      const content = assistantMessage.content[0];
                      return (
                        <p className="text-md font-semibold">
                          {content &&
                            content.type === "text" &&
                            content.text.value}
                        </p>
                      );
                    })}
              </div>
            }
          </div>
          <div className="fixed mr-40 bottom-0 mb-3 py-3 px-3 w-[70%] rounded-xl">
            <InputGroup>
              <Input
                variant="outline"
                borderColor="black"
                borderWidth="initial"
                focusBorderColor="black"
                size="lg"
                bgColor="white"
                type="text"
                className="font-semibold"
                placeholder="enter prompt for agent"
              />
              <InputRightAddon
                bgColor="white"
                borderColor="white"
                height="inherit"
              >
                <IoIosSend className="text-xl cursor-pointer" />
              </InputRightAddon>
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <button onClick={() => router.push("/api/twitter/authenticate")}>
        post
      </button> */
}
