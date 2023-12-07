import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Select,
  Tag,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  addReview,
  getAgentFirebase,
  getReviews,
} from "@/firebase/firebaseFunctions";
import { getAgent, getSubscription } from "@/utils/graphFunctions";
import { useContractWrite, useChainId } from "wagmi";
import { CONTRACTS } from "@/constants/contracts";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
// import { Bytes } from "firebase/firestore";
// import { Bytes } from "@graphprotocol/graph-ts";
interface agentReviewType {}

interface agentDataType {
  agentId: number;
  assistantId: number;
  agentName: string;
  agentDesciption: string;
  agentInstructions: string;
  agentRating: string;
  agentCategory: string;
  agentCreator: string;
  agentVersions: any[];
  agentPrice: bigint;
  agentBP: string;
  openForContribution: boolean;
}

const AgentId = () => {
  const chainID = useChainId();

  const router = useRouter();
  const { address: userAccount } = useAccount();
  const _agentId = router.query.agentId;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [agentData, setAgentData] = useState<agentDataType>();
  const [rating, setRating] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [feedback, setFeedBack] = useState<string>("");
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const { write, data, isLoading, isSuccess, isError } = useContractWrite({
    // @ts-ignore
    address: CONTRACTS.AIMarket[chainID].contract,
    // @ts-ignore
    abi: CONTRACTS.AIMarket[chainID].abi,
    functionName: "purchaseSubscription",
  });

  useEffect(() => {
    // console.log(_agentId, typeof _agentId);
    if (_agentId && !agentData) {
      if (typeof _agentId == "string") {
        getAgentData(_agentId);
        if (userAccount && !isSubscribed) {
          checkSubscription(_agentId);
        }
      }
    }
  }, [_agentId]);

  const getAssistant = async (assistantID: string) => {
    console.log("Fetching thread... Calling OpenAI");
    if (!assistantID) {
      console.log("Agent Details missing");
      return;
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

  // get Assistant Data
  const getAgentData = async (
    agentId: string
  ): Promise<agentDataType | undefined> => {
    if (!agentId) {
      console.log("No agent Id found");
      return;
    }

    // TODO Convert AgentID to Bytes form
    const agentIdBytes = agentId;
    console.log(agentIdBytes);
    const agentGraphData = (await getAgent(agentIdBytes)).agent;
    console.log(agentGraphData);

    // TODO , Convert the agent ID to the one given in params
    // get partial data from firebase
    const firebaseData = await getAgentFirebase(agentGraphData?.agentID);
    console.log(firebaseData);

    // get Reviews
    const firebaseReviews = await getReviews(agentGraphData?.agentID);

    // other partial from openAI
    // TODO : update the assistantID we get from graphQl
    // const assitantData = await getAssistant(agentGraphData?.assistantId);
    const assitantData: any = await getAssistant(
      "asst_4YruN6LyHritMXIFQX0NGmht"
    );
    console.log(assitantData);
    const agentData: agentDataType = {
      agentId: agentGraphData?.agentID,
      assistantId: agentGraphData?.assistantId,
      agentName: assitantData?.name,
      agentDesciption: assitantData?.description,
      agentInstructions: assitantData?.instructions,
      agentRating: firebaseData?.avgRating,
      agentCategory: agentGraphData?.agentGraphData,
      agentPrice: agentGraphData?.keyPrice, // convert to Ethers
      agentBP: agentGraphData?.basisPoint, // convert into %
      agentCreator: agentGraphData?.creator?.address,
      agentVersions: agentGraphData?.AgentVersions,
      openForContribution: agentGraphData?.isOpenForContributions,
    };
    console.log(agentData);
    setAgentData(agentData);
  };

  const formatBP = (basisPoint: number): number => {
    const bpPercent = 10000 / basisPoint;
    return bpPercent;
  };

  // check For Subscription when user hit useAgent
  const checkSubscription = async (agentId: string) => {
    try {
      // maybe possible via graphQl
      if (!userAccount) {
        console.log("user not found");
        return;
      }

      // TODO : Check the subID again after the new graph V
      const subId = userAccount.concat(agentId?.slice(2));
      // console.log(subId);
      const subscriptionData = await getSubscription(subId);
      console.log(subscriptionData);
      // or Unlock protocol graphQl
      // Or contract balance ERC721 method
      setIsSubscribed(subscriptionData?.subscriptionEntity);
    } catch (error) {
      console.log(error);
    }
  };

  // if not then subscribe via Model
  const subscribeAgent = async () => {
    try {
      const threadId = await createThread();
      console.log(threadId?.id);

      // TODO: call contract to complete the contract flow
      // @ts-ignore
      write({
        args: [agentData?.agentId, agentData?.agentPrice, threadId?.id],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createThread = async (): Promise<void | { id: string } | undefined> => {
    try {
      console.log("creating thread... Calling OpenAI");
      if (!agentData?.assistantId) {
        console.log("Agent Details missing");
        return;
      }
      const data = await fetch("/api/openai/createThreads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
          return {
            id: data?.id,
          };
        })
        .catch((err) => {
          console.log(err);
        });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="flex flex-col">
        <div className="mx-auto">
          <div className="grid grid-flow-col grid-cols-4 grid-rows-1 gap-x-10 w-full mt-10">
            <div className="border-2 bg-pink-100 border-b-8 flex flex-col px-14 py-3 border-black shadow-2xl">
              <p className="text-sm font-mono font-thin text-gray-500">
                Agent Name
              </p>
              <p className="text-xl text-black font-semibold mt-2">
                {agentData && agentData.agentName}
              </p>
            </div>
            <div className="border-2 bg-white border-b-8 flex flex-col px-14 py-3 border-black shadow-2xl">
              <p className="text-sm font-mono font-thin text-gray-500">
                Agent Category
              </p>
              <p className="text-xl text-black font-semibold mt-2">
                {agentData && agentData.agentCategory}
              </p>
            </div>
            <div className="border-2 bg-blue-100 border-b-8 flex flex-col px-14 py-3 border-black shadow-2xl">
              <p className="text-sm font-mono font-thin text-gray-500">
                Agent Creator
              </p>
              <p className="text-xl text-black font-semibold mt-2">
                {agentData && agentData.agentCreator.slice(0, 4)}...{" "}
                {agentData && agentData.agentCreator.slice(-4)}
              </p>
            </div>
            <div className="border-2 bg-violet-100 border-b-8 flex flex-col px-14 py-3 border-black shadow-2xl">
              <p className="text-sm font-mono font-thin text-gray-500">
                Agent Version
              </p>
              {/* <p className="text-xl text-black font-semibold mt-2">1.1.0</p> */}
              <select className="mt-2 px-2 py-1 rounded-lg bg-violet-100">
                <option className="text-xl text-black font-semibold">
                  1.0.0
                </option>
                {agentData &&
                  agentData.agentVersions.map((agentV) => {
                    return (
                      <option className="text-xl text-black font-semibold">
                        {agentV?.agentID}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-16 w-5/6 mx-auto flex">
          <div className="w-2/3 border bg-orange-100 flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-96 overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Description
            </p>
            <p className="text-lg font-semibold text-black mt-4">
              {agentData && agentData.agentDesciption}
            </p>
          </div>
          {/* <div className="w-2/3 border bg-orange-100 flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-96 overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Instructions (Prompt)
            </p>
            <p className="text-lg font-semibold text-black mt-4">
              {agentData && agentData.agentInstructions}
            </p>
          </div> */}
          <div className="w-1/3 border flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-96 overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Agent Details
            </p>
            <div className="mt-4 flex justify-between">
              <div>
                <p className="text-sm">Agent Price</p>
                <p className="mt-1 font-semibold text-lg">
                  {agentData && formatEther(agentData.agentPrice)} Ethers
                </p>
              </div>
              <div>
                <p className="text-sm">Duration</p>
                <p className="mt-1 font-semibold text-lg">1 Month</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm">Agent Basis Point</p>
              <p className="mt-1 font-semibold text-lg">
                {agentData && formatBP(Number(agentData.agentBP))}{" "}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm">Agent Open for Contribution</p>
              <p className="mt-1 font-semibold text-lg">
                {agentData && agentData.openForContribution}{" "}
              </p>
            </div>
            <div className="mt-4 flex flex-col">
              <button
                onClick={() => {
                  !isSubscribed ? onOpen() : router.push(`dashboard`);
                }}
                className="font-semibold text-xl bg-pink-100 px-10 py-2 border border-black border-b-4 rounded-xl cursor-pointer"
              >
                Use Agent
              </button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Buy Subscription</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <div className="flex flex-col">
                      <p className="text-xl font-semibold">
                        Seems like you don't have the subscription of this model
                      </p>
                      <p className="mt-4 font-md font-mono">
                        Buy Subscription at
                      </p>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <p className="text-sm">Agent Price</p>
                          <p className="mt-1 font-semibold text-lg">
                            {agentData && formatEther(agentData.agentPrice)}{" "}
                            Ethers
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">Duration</p>
                          <p className="mt-1 font-semibold text-lg">1 Month</p>
                        </div>
                      </div>
                      <button className="mt-5 cursor-pointer mb-3 px-10 py-2 bg-green-100 border border-black border-b-4 rounded-xl text-x font-semibold text-black">
                        Subscribe
                      </button>
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <button className="font-semibold cursor-pointer mt-4 text-xl bg-violet-200 px-10 py-2 border border-black border-b-4 rounded-xl">
                Contribute
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 w-5/6 mx-auto flex">
          <div className="w-1/3 border flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-[420px] overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Rating and Feedback
            </p>
            <div className="mt-4">
              <p className="text-lg font-semibold">Rate the agent</p>
              <div className="flex items-center space-x-2 mt-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRatingChange(value)}
                    className={`text-2xl focus:outline-none ${
                      value <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    {value <= rating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">Feedback</p>
              <textarea
                placeholder=""
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold h-40 border border-black"
                value={feedback}
                onChange={(e) => setFeedBack(e.target.value)}
              ></textarea>
            </div>
            <div className="mt-2 mx-auto">
              <button
                onClick={() =>
                  addReview(
                    Number(_agentId),
                    rating,
                    feedback,
                    `${userAccount}`
                  )
                }
                className="cursor-pointer mb-3 px-10 py-2 bg-green-100 border border-black border-b-4 rounded-xl text-x font-semibold text-black"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="w-2/3 border flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-[420px] overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              User Feedbacks
            </p>
            <div className="mt-4">
              <div className="w-5/6 flex flex-col px-6 py-1 rounded-xl bg-white border border-zinc-200">
                <div className="flex justify-between">
                  <p className="font-semibold text-black">
                    0x9B855D0Edb3111891a6A0059273904232c74815D
                  </p>
                  <Tag size="sm" className="ml-2 mt-0.5" colorScheme="yellow">
                    ★ 3.3
                  </Tag>
                </div>
                <p className="mt-3 text-md text-black">
                  ElonAgent impresses with its innovative approach to artificial
                  intelligence. Seamlessly integrating Elon Musk's visionary
                  ideas, it offers unparalleled problem-solving and creativity.
                  Its adaptability and quick learning make it a standout AI,
                  embodying Musk's forward-thinking mindset. ElonAgent is a
                  remarkable leap towards intelligent systems aligned with the
                  future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentId;
