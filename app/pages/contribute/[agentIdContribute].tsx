import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Switch } from "@chakra-ui/react";
import { useRef } from "react";
import { Badge } from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";
import { FaTwitter } from "react-icons/fa6";
import { MdOutlineAttachFile } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { getAgent } from "@/utils/graphFunctions";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getAgentID } from "@/utils/chainlinkFunctions";
import {
  useContractWrite,
  usePrepareContractWrite,
  useChainId,
  useAccount,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { createAgent } from "@/firebase/firebaseFunctions";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/constants/contracts";

const AgentIdContribute = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [tweet, setTweet] = useState<boolean>(false);
  const { data: walletClient } = useWalletClient();
  const [mail, setMail] = useState<boolean>(false);
  const [file, setFile] = useState("");
  const [codeInterpreter, setCodeInterpreter] = useState<boolean>(false);
  const [fileInterpreter, setFileInterpreter] = useState<boolean>(false);
  const [inputPrompt, setInputPrompt] = useState<string>();
  const [openToContribution, setOpenToContribution] = useState<boolean>(false);

  const router = useRouter();
  const _agentId = router.query.agentIdContribute;

  const publicClient = usePublicClient();
  const [threadMessages, setThreadMessages] = useState<any>();

  const [assistantID, setAssistantID] = useState<string>();
  const [agentDetails, setAgentDetails] = useState<{
    agentName: string;
    agentDesc: string;
    agentInstruc: string;
    agentPrice: string;
    agentBP: string;
    agentCategory: string;
    agentImage: string | undefined;
    parentAgentId: string | undefined;
    agentVersion: string | undefined;
  }>({
    agentName: "",
    agentDesc: "",
    agentPrice: "",
    agentInstruc: "",
    agentBP: "",
    agentCategory: "",
    agentImage: undefined,
    parentAgentId: undefined,
    agentVersion: undefined,
  });

  useEffect(() => {
    if (_agentId && agentDetails.agentName == "") {
      if (typeof _agentId == "string") {
        getAgentData(_agentId);
      }
    }
  }, [_agentId]);

  const [threadID, setThreadID] = useState<string>();
  const [imageGeneration, setImageGeneration] = useState<boolean>(false);
  const { address: account } = useAccount();

  const getAssistant = async (assistantID: string) => {
    console.log("Fetching thread... Calling OpenAI");
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

  const getAgentData = async (agentId: string) => {
    if (!agentId) {
      console.log("No agent Id found");
      return;
    }

    // TODO Convert AgentID to Bytes form
    const agentIdBytes = agentId;
    console.log(agentIdBytes);
    const agentGraphData = (await getAgent(agentIdBytes)).agent;
    console.log(agentGraphData);

    // other partial from openAI
    // TODO : update the assistantID we get from graphQl
    const assitantData = await getAssistant(agentGraphData?.assistantId);
    // const assitantData: any = await getAssistant(
    //   "asst_4YruN6LyHritMXIFQX0NGmht"
    // );

    setAgentDetails({
      ...agentDetails,
      agentName: assitantData?.name,
      agentDesc: assitantData?.description,
      agentInstruc: assitantData?.instructions,
      agentCategory: agentGraphData?.agentGraphData,
      agentPrice: agentGraphData?.keyPrice,
      agentBP: agentGraphData?.basisPoint,
      parentAgentId: agentId,
    });
    console.log(assitantData);
  };

  const getTools = (): any[] => {
    let tools: any[] = [];

    if (codeInterpreter) {
      tools.push({
        type: "code_interpreter",
      });
    }

    if (fileInterpreter) {
      tools.push({
        type: "retrieval",
      });
    }

    if (imageGeneration) {
      tools.push({
        type: "function",
        function: {
          name: "generate_image",
          description:
            "To generate Image using a prompt with the help of Dall-E and return an DALL-e response",
          parameters: {
            type: "object",
            properties: {
              imagePrompt: {
                type: "string",
                description: "prompt for Image creation via Dall-e ",
              },
            },
            required: ["imagePrompt"],
          },
        },
      });
    }

    return tools;
  };

  const createAssistant = () => {
    try {
      console.log("creating Assistant... Calling OpenAI");
      if (
        agentDetails.agentInstruc == "" &&
        agentDetails.agentDesc == "" &&
        agentDetails.agentName == ""
      ) {
        console.log("Agent Details missing");
        return;
      }
      const tools = getTools();
      fetch("/api/openai/createAssistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantName: `${agentDetails.agentName} ${agentDetails.agentVersion}`,
          assistantDesc: agentDetails.agentDesc,
          assistantInstruc: agentDetails.agentInstruc,
          tools: tools,
          fileIds: [],
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
          setAssistantID(data?.id);

          // peform the tx
          // do Agent V registeration
          await registerNewAgentID(data?.id);

          createAgent(getAgentID(data?.id)); // firebase for the new AgentID
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const registerNewAgentID = async (_assistantId: string) => {
    try {
      if (!agentDetails.parentAgentId) {
        console.log("Agent Details missing");
        return;
      }

      const data = await publicClient?.simulateContract({
        account,
        // @ts-ignore
        address: CONTRACT_ADDRESSES,
        // @ts-ignore
        abi: CONTRACT_ABI,
        functionName: "registerAgentVersion",
        args: [
          Number(agentDetails.parentAgentId),
          getAgentID(_assistantId),
          _assistantId,
          "",
        ],
      });
      if (!walletClient) {
        console.log("wallletClient not found");
      }
      // @ts-ignore
      const hash = await walletClient.writeContract(data.request);
      console.log(hash);
    } catch (error) {
      console.log(error);
    }
  };

  const createAndRunThread = async () => {
    try {
      console.log("Creating & running thread... Calling OpenAI");
      if (!assistantID) {
        console.log("Agent Details missing");
        return;
      }
      if (!inputPrompt) {
        console.log("Input prompt missing");
        return;
      }
      await fetch("/api/openai/createAndRunThread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          setThreadID(data?.id);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="flex justify-between mx-10 pt-3 pb-2">
        <p className="text-black text-2xl font-bold">
          Contribute to {agentDetails && agentDetails.agentName}
        </p>
        <div>
          {/* <Button
            // @ts-ignore
            ref={btnRef}
            className="mx-3 bg-orange-600 border border-b-4 border-black"
            colorScheme=""
            onClick={onOpen}
          >
            Configure
          </Button> */}
          <Button
            onClick={() => createAssistant()}
            className="mx-3 border border-b-4 border-black"
          >
            Create
          </Button>
        </div>
      </div>
      <hr className="h-0.5 bg-black" />
      <div className="flex h-full">
        <div className="w-1/3 bg-indigo-100 px-10 flex flex-col overflow-scroll border-r-8 border-t-2 border-black rounded-2xl">
          <div className="mt-5">
            <p className="text-black text-2xl font-semibold text-center">
              Agent Details
            </p>
          </div>
          <div className="mx-auto mt-6">
            {/* <Wrap>
              <WrapItem>
                <Avatar name="A I" colorScheme="pink" size="lg" color="black" />
              </WrapItem>
            </Wrap> */}
            {/* <input
            type="image"
            className="rounded-xl border mx-auto items-center border-white px-2 py-1 mt-4"
            onChange={(e) =>
              setAgentDetails({ ...agentDetails, agentImage: e.target.value })
            }
            alt="select"
          ></input> */}
          </div>
          <div>
            <div className="mt-7">
              <p className="text-md text-black font-mono">Agent Name</p>
              <p className="text-xl font-semibold">
                {agentDetails && agentDetails.agentName}
              </p>
            </div>
            {/* <div className="mt-7">
              <p className="text-md text-black font-mono">Previous Version</p>
              <p className="text-xl font-semibold">1.1.0</p>
            </div> */}
            <div className="mt-7">
              <p className="text-md text-black font-mono">New Version</p>
              <input
                type="text"
                placeholder=""
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold border border-black"
                onChange={(e) =>
                  setAgentDetails({
                    ...agentDetails,
                    agentVersion: e.target.value,
                  })
                }
                value={agentDetails.agentVersion}
              ></input>
            </div>
            <div className="mt-7">
              <p className="text-xl text-black font-semibold">
                Agent Instructions
              </p>
              <textarea
                placeholder="You are a helpful assistant"
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold h-32 border border-black"
                onChange={(e) =>
                  setAgentDetails({
                    ...agentDetails,
                    agentInstruc: e.target.value,
                  })
                }
                value={agentDetails.agentInstruc}
              ></textarea>
            </div>
            <div className="mt-5">
              <p className="text-xl text-black font-semibold">
                Agent Description
              </p>
              <textarea
                placeholder="tell what the agent does ..."
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold h-36 border border-black"
                onChange={(e) =>
                  setAgentDetails({
                    ...agentDetails,
                    agentDesc: e.target.value,
                  })
                }
                value={agentDetails.agentDesc}
              ></textarea>
            </div>
            <div className="mt-4 w-full flex justify-between">
              <p className="font-semibold text-md">Code Interpreter</p>
              <Switch
                onChange={() => setCodeInterpreter(!codeInterpreter)}
                size="lg"
                colorScheme="blue"
              />
            </div>
            <div className="mt-4 mb-3 w-full flex justify-between">
              <p className="font-semibold text-md">File Retrieval</p>
              <Switch
                onChange={() => setFileInterpreter(!fileInterpreter)}
                size="lg"
                colorScheme="blue"
              />
            </div>
            <div className="mt-4 mb-3 w-full flex justify-between">
              <p className="font-semibold text-md">Files</p>
              <div className="">
                <MdOutlineAttachFile className="text-2xl cursor-pointer text-green-500"></MdOutlineAttachFile>
                <input type="file" style={{ display: "none" }} />
                {file && (
                  // @ts-ignore
                  <p className="text-xs w-20 h-5 overflow-clip">{file?.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-100"></div> */}
        <div className="w-2/3 mt-6 px-10 flex flex-col">
          <div className="w-full flex justify-between">
            <div>
              <p className="text-xl text-black font-semibold mt-1">
                Lets set up the agent !!
              </p>
            </div>
            <div>
              <button
                onClick={() => createAndRunThread()}
                className="px-6 py-1.5 bg-blue-100 rounded-lg font-semibold mx-3"
              >
                Run
              </button>
              <button className="px-6 py-1.5 bg-green-100 rounded-lg font-semibold mx-3">
                Clear
              </button>
            </div>
          </div>
          <div>
            <Tabs
              className="mt-7"
              align="center"
              isFitted
              colorScheme="pink"
              variant="soft-rounded"
            >
              <TabList>
                <Tab textColor="black">Train</Tab>
                <Tab textColor="black">Review</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="flex flex-col">
                    {/* <div className="w-full h-[93%] border border-black"></div> */}
                    <div className="flex mx-auto w-full">
                      <div className="fixed bottom-0 mb-3 py-3 px-3 rounded-xl w-[60%]">
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
                            placeholder="enter prompt for training agent ..."
                            onChange={(e) => setInputPrompt(e.target.value)}
                          ></Input>
                          <InputRightAddon
                            bgColor="white"
                            borderColor="white"
                            height="inherit"
                          >
                            <>
                              <MdOutlineAttachFile className="text-xl cursor-pointer"></MdOutlineAttachFile>
                              <input type="file" style={{ display: "none" }} />
                              {file && (
                                // @ts-ignore
                                <p className="text-xs w-20 overflow-clip">
                                  {/* @ts-ignore */}
                                  {file?.name}
                                </p>
                              )}
                            </>
                          </InputRightAddon>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="flex flex-col">
                    <div className="flex flex-col mx-auto w-full">
                      <div className="mt-6 flex flex-col">
                        {threadMessages &&
                          threadMessages
                            .slice()
                            .reverse()
                            .map((message: any, index: number) => {
                              const content = message.content[0];
                              const isUser = message.role === "user";

                              return (
                                <div
                                  key={index}
                                  className={`${
                                    isUser
                                      ? "justify-start mb-3"
                                      : "justify-end mb-10"
                                  } flex flex-col`}
                                >
                                  <div
                                    className={`${
                                      isUser ? "bg-indigo-100" : "bg-blue-100"
                                    } px-4 py-1 rounded-xl`}
                                  >
                                    <p className="text-md font-semibold">
                                      {content &&
                                        content.type === "text" &&
                                        content.text.value}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                      </div>
                      <div className="fixed bottom-0 mb-3 py-3 px-3 rounded-xl w-[60%]">
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
                            placeholder="enter prompt to interact with the agent ..."
                            onChange={(e) => setInputPrompt(e.target.value)}
                          ></Input>
                          <InputRightAddon
                            bgColor="white"
                            borderColor="white"
                            height="inherit"
                          >
                            <div onClick={() => sendMessage()}>
                              <IoIosSend className="text-xl cursor-pointer"></IoIosSend>
                            </div>
                          </InputRightAddon>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isOpen}
        placement="right"
        size="md"
        closeOnEsc={false}
        closeOnOverlayClick={false}
        onClose={onClose}
        colorScheme="pink"
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="bg-indigo-100" fontSize="x-large">
            Configure Your Agent
          </DrawerHeader>
          <DrawerBody className="bg-indigo-100">
            <div className="flex flex-col">
              <div>
                <p className="text-xl text-black font-semibold">
                  Price of Agent
                </p>
                <input
                  type="number"
                  className="mt-2 px-5 w-full rounded-xl py-2 border border-black"
                  placeholder="in ethers"
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      agentPrice: e.target.value,
                    })
                  }
                  value={agentDetails.agentPrice}
                ></input>
              </div>
              <div className="mt-6">
                <p className="text-xl text-black font-semibold">
                  Basis point ( BP )
                </p>
                <input
                  type="number"
                  className="mt-2 px-5 w-full rounded-xl py-2 border border-black"
                  placeholder="in range of 100-10000"
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      agentBP: e.target.value,
                    })
                  }
                  value={agentDetails.agentBP}
                ></input>
              </div>
              <div className="mt-6">
                <p className="text-xl text-black font-semibold">Category</p>
                <input
                  type="number"
                  className="mt-2 px-5 w-full rounded-xl py-2 border border-black"
                  placeholder="like coding , fitness"
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      agentCategory: e.target.value,
                    })
                  }
                ></input>
              </div>
              <div className="mt-6">
                <p className="text-xl text-black font-semibold">
                  Open to Contributions ( training )
                </p>
                <div className="mt-2">
                  <Badge colorScheme="red" className="mx-3">
                    no
                  </Badge>
                  <Switch
                    size="lg"
                    onChange={() => setOpenToContribution(!openToContribution)}
                    colorScheme="orange"
                  />
                  <Badge colorScheme="green" className="mx-3">
                    yes
                  </Badge>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xl text-black font-semibold">Actions</p>
                <div className="mt-2 flex">
                  <div className="mx-3">
                    <p className="text-sm font-mono">Post on </p>
                    <div
                      className={` ${
                        tweet === true && "border-2 border-blue-500"
                      } border-2 border-black rounded-full px-3 py-2.5 w-12 mt-3 cursor-pointer`}
                      onClick={() => setTweet(!tweet)}
                    >
                      <FaTwitter
                        className={`${
                          tweet === true && "text-blue-500 text-2xl"
                        } text-black text-2xl`}
                      />
                    </div>
                  </div>
                  <div className="mx-3">
                    <p className="text-sm font-mono">Send</p>
                    <div
                      className={` ${
                        mail === true && "border-2 border-red-500"
                      } border-2 border-black rounded-full px-2.5 py-2.5 w-12 mt-3 cursor-pointer`}
                      onClick={() => setMail(!mail)}
                    >
                      <IoIosMail
                        className={`${
                          mail === true && "text-red-500 text-2xl text-center"
                        } text-black text-2xl text-center`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className="bg-indigo-100">
            <button
              onClick={() => onClose()}
              className="mx-auto px-10 py-2 bg-pink-200 border-b-4 text-black font-semibold text-xl border border-black rounded-xl"
            >
              Save Configuration
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AgentIdContribute;
