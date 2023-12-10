import { useRouter } from "next/router";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";
import { getCreator, getUser } from "@/utils/graphFunctions";
import React, { use, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getRatingsRank } from "@/firebase/firebaseFunctions";
import { toBytes, toHex } from "viem";
import Navbar from "@/components/navbar";
import { ThreadMessagesMarkdown } from "@/components/ThreadMessagesMarkdown";
import { createTweet, generateImage, handleSendEmail } from "@/utils/tools";
import { Spinner } from "@chakra-ui/react";
export default function UserAgents() {
  const { address: userAccount } = useAccount();

  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [threadMessages, setthreadMessages] = useState<any[]>();

  // NOTE : Set the thread ID and assistantID according to whatever agent user selects from the usage section

  const [threadID, setThreadID] = useState<string>();
  const [assistantID, setAssistantID] = useState<string>();
  const [inputPrompt, setInputPrompt] = useState<string>();
  const [subscriptionsData, setSubscriptionsData] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const getAssistant = async (assistantID: string) => {
    console.log("Fetching Assistant... Calling OpenAI");
    if (!assistantID) {
      console.log("Agent Details missing");
      return;
    }

    if (!assistantID.startsWith("asst_")) {
      return null;
    }

    const data = await fetch(
      `/api/openai/getAssistant?assistantId=${assistantID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        // console.log(res);
        const data = await res.json();
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  };

  const getUserData = async () => {
    if (!userAccount) {
      console.log("User Account not found");
      return;
    }

    const data = await getUser(userAccount);
    console.log(data);
    const agentsSubscribedTo = data.user?.agentsSubscribedTo;
    let agentSubscriptionData = [];
    for (let i = 0; i < agentsSubscribedTo?.length; i++) {
      const assistantId = agentsSubscribedTo[i].agent.assistantId;

      // TODO : Remove this hardcoded assistant ID
      const assistantData = await getAssistant(assistantId);

      console.log(assistantData);
      const agentSubscription = {
        agentName: assistantData?.name,
        agentId: agentsSubscribedTo[i].agent.agentID,
        assistantId: agentsSubscribedTo[i].agent.assistantId,
        threadID: agentsSubscribedTo[i].threadID,
      };
      agentSubscriptionData.push(agentSubscription);
    }

    setSubscriptionsData(agentSubscriptionData);
  };

  useEffect(() => {
    if (userAccount && !subscriptionsData) {
      getUserData();
    }
    // getRatingsRank();
  }, [userAccount]);

  useEffect(() => {
    console.log("done");
    // getRatingsRank();
  }, [threadMessages]);

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
      // setthreadMessages(threadMessages?.push(inputPrompt));

      setLoading(true);

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
          await runThread();
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
          // getThread(threadID, assistantID);
          await pollRun(threadID, data.id, assistantID);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const pollRun = async (
    _threadID: string,
    _runId: string,
    _assistantID: string
  ) => {
    if (!_runId) {
      console.log("Run Details missing");
      return;
    }
    if (!_threadID) {
      console.log("thread Details missing");
      return;
    }
    const _run = await getRun(_threadID, _runId);
    if (_run) {
      if (_run?.status === "requires_action") {
        console.log("thread Run requires action");
        // 4. If needed perform functions and return result
        const toolCalls = _run.required_action?.submit_tool_outputs.tool_calls;
        toolCalls.forEach(async (toolCall: any) => {
          console.log(toolCall);
          const toolOutput = await performToolCall(toolCall);
          if (toolOutput) {
            const toolOutputs = {
              tool_call_id: toolCall.id,
              output: toolOutput,
            };
            // 5. Submit tool output if there via the API
            await submitToolOutput(_threadID, _runId, toolOutputs);
          }
        });

        return;
      } else if (_run?.status === "completed") {
        console.log("thread Run completed");

        // 6. Get the thread and return
        const threadContent = await getThread(_threadID, _assistantID);
        return;
      } else if (_run?.status === "in_progress" || _run?.status === "queued") {
        // Re call Poll run and wait for it until the status is completed
        console.log("thread Run in progress");
        setTimeout(async () => {
          await pollRun(_threadID, _runId, _assistantID);
        }, 2000);
      } else {
        console.log("thread Run invalid");
        return;
      }
    }
  };

  const availableFunctions = {
    create_email: handleSendEmail,
    tweet_ads: createTweet,
    generate_image: generateImage,
  };

  const performToolCall = async (toolCall: any): Promise<any | undefined> => {
    try {
      const functionToCall = availableFunctions[toolCall.function.name];
      console.log(functionToCall);
      const functionArgs = JSON.parse(toolCall.function.arguments);
      console.log(functionArgs);
      // functionArgs is an object
      if (functionToCall == "create_email") {
        console.log("Sending Email");
        const functionResponse = await functionToCall(
          functionArgs.emailContent,
          functionArgs.emailSubject,
          "hello@gmail.com"
        );
        console.log(functionResponse);
        return functionResponse;
      } else if (functionToCall == "tweet_ads") {
        console.log("Tweeting");
        const functionResponse = functionToCall(
          functionArgs.tweetContent,
          functionArgs.tweetImage
        );
        console.log(functionResponse);
        return functionResponse;
      } else if (functionToCall == "generate_image") {
        console.log("Generating Image");
        const functionResponse = await functionToCall(functionArgs.imagePrompt);
        console.log(functionResponse);
        return functionResponse;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  interface toolOutputsType {
    tool_call_id: string;
    output: string;
  }
  [];

  const submitToolOutput = async (
    _threadID: string,
    _runID: string,
    toolOutputs: toolOutputsType
  ) => {
    try {
      console.log("Submitting too Output... Calling OpenAI");

      if (!_threadID) {
        console.log("thread Details missing");
        return;
      }

      if (!_runID) {
        console.log("thread Details missing");
        return;
      }

      return await fetch("/api/openai/submitToolOutput", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadID: _threadID,
          runID: _runID,
          toolOutputs: toolOutputs,
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
          return data;
          // getThread(threadID, assistantID);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getRun = async (
    _threadID: string,
    _runId: string
  ): Promise<any | undefined> => {
    console.log("Fetching Run... Calling OpenAI");
    if (!_runId) {
      console.log("Run Details missing");
      return;
    }

    if (!_threadID) {
      console.log("thread Details missing");
      return;
    }
    console.log(_threadID, _runId);
    const data = await fetch(
      `/api/openai/checkRun?threadID=${_threadID}&runID=${_runId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        console.log(res);
        const data = await res.json();
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  };

  const getThread = async (_threadID: string, _assistantID: string) => {
    console.log("Fetching thread... Calling OpenAI");
    if (!_assistantID) {
      console.log("Agent Details missing");
      return;
    }

    if (!_threadID) {
      console.log("thread Details missing");
      return;
    }
    // body: JSON.stringify({
    //   threadId: threadID,
    // }),
    const data = await fetch(`/api/openai/getChat?threadId=${_threadID}`, {
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
        setthreadMessages(messages);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  };

  // "thread_nf2kCoESw6fyC9jvGlgKl6Fv";
  // "run_uhHtsA6BWnu47j888RCX4ICJ"
  // "asst_ieJL0i6m3WHNmjLcZnDSvAAV"
  const useThread = async () => {
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
          assistantId: assistantID,
          instructions: "",
          fileIds: [],
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
          await runThread();
          // setTimeout(() => {
          //   // Code to execute after 2 seconds
          // }, 2000); // 2000 milliseconds = 2 seconds
          // let tm = await getThread(threadID, assistantID);
          // if (tm !== undefined) {
          //   setthreadMessages(tm);
          // }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="fixed z-50 top-0 left-0 w-full ">
        {" "}
        <Navbar />
      </div>
      <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100 ">
        <div className="flex w-screen ">
          <div className="w-1/3 justify-start h-full mt-5">
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 mt-14">
              <div className="h-full px-3 py-4 overflow-y-auto bg-indigo-100 border-r-2  border-t-2 border-black">
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

                  {/* <li>
                    <button
                      type="button"
                      className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-orange-200"
                      onClick={() => {
                        // TODO

                        // setAssistantID(subscription.assistantId);
                        setAssistantID("asst_4YruN6LyHritMXIFQX0NGmht");

                        // setThreadID(subscription.threadID);
                        setThreadID("thread_0xBV2sYKFkHvwbD6IQefwc9B");

                        // change this to the thread id  &  assistant Id of the agent
                        getThread(
                          "thread_0xBV2sYKFkHvwbD6IQefwc9B",
                          "asst_4YruN6LyHritMXIFQX0NGmht"
                        );
                      }}
                    >
                      <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                        ElonAgent
                      </span>
                    </button>
                  </li> */}
                  {subscriptionsData &&
                    subscriptionsData.map((subscription: any) => {
                      return (
                        <li>
                          <button
                            type="button"
                            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-orange-200"
                            onClick={() => {
                              setAssistantID(subscription.assistantId);

                              setThreadID(subscription.threadID);

                              getThread(
                                subscription.threadID,
                                subscription.assistantId
                              );
                            }}
                          >
                            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                              {subscription.agentName}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </aside>
          </div>
          <div className="w-2/3 h-full fixed top-8 mt-10 flex flex-col justify-center items-center relative">
            <div className="mt-6 mr-60 mb-15 w-[70%] flex flex-col">
              {/* {threadMessages &&
              threadMessages
                .filter((message: any) => message.role === "user")
                .map((userMessage: any) => {
                  const content = userMessage.content[0];
                  return (
                    <div className="justify-start flex flex-col bg-indigo-100 px-4 py-1 rounded-xl">
                      <p className="text-md font-semibold">
                        {content &&
                          content.type === "text" &&
                          content.text.value}
                      </p>
                    </div>
                  );
                })} */}

              {threadMessages && (
                <div className="mb-10">
                  {loading ? (
                    <Spinner size="xl" />
                  ) : (
                    <ThreadMessagesMarkdown threadMessages={threadMessages} />
                  )}
                </div>
              )}
            </div>
            {/* <div className="mt-6 flex">
            {threadMessages &&
              threadMessages
                .filter((message: any) => message.role === "assistant")
                .map((assistantMessage: any) => {
                  const content = assistantMessage.content[0];
                  return (
                    <div className="justify-start flex flex-cols bg-pink-100 px-4 py-1 rounded-xl">
                      <p className="text-md font-semibold">
                        {content &&
                          content.type === "text" &&
                          content.text.value}
                      </p>
                    </div>
                  );
                })}
          </div> */}
            <div className="fixed mr-40 bottom-0  py-3 px-3 mx-10 w-[calc(70%-2.5rem)] rounded-xl bg-white">
              {/* <div className="fixed mr-40 bottom-0 mb-3 py-3 my-10 px-3 w-[70%] rounded-xl"> */}
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
                  onChange={(e) => setInputPrompt(e.target.value)}
                />
                <InputRightAddon
                  bgColor="white"
                  borderColor="white"
                  height="inherit"
                >
                  <IoIosSend
                    className="text-xl cursor-pointer"
                    onClick={() => {
                      sendMessage();
                      // pollRun(
                      //   "thread_nf2kCoESw6fyC9jvGlgKl6Fv",
                      //   "run_uhHtsA6BWnu47j888RCX4ICJ",
                      //   "asst_ieJL0i6m3WHNmjLcZnDSvAAV"
                      // );
                      // ("thread_nf2kCoESw6fyC9jvGlgKl6Fv");
                      // ("run_uhHtsA6BWnu47j888RCX4ICJ");
                      // ("asst_ieJL0i6m3WHNmjLcZnDSvAAV");
                      // generateImage(inputPrompt);
                      // getRun(
                      //   "thread_SZ9JRy28i9QQS2o8yu0wXJ5R",
                      //   "run_wMAAyvAia73ugun5W0noNrGW"
                      // );
                    }}
                  />
                </InputRightAddon>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

{
  /* <button onClick={() => router.push("/api/twitter/authenticate")}>
        post
      </button> */
}
