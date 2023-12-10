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
import { useToast } from '@chakra-ui/react'
import { useState } from "react";
import { useRouter } from "next/router";
import {
  addReview,
  getAgentFirebase,
  getReviews,
} from "@/firebase/firebaseFunctions";
import { getAgent, getSubscription, getUser } from "@/utils/graphFunctions";
import {
  useContractWrite,
  useChainId,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { useAccount } from "wagmi";
import { CONTRACT_ADDRESSES, CONTRACT_ABI } from "@/constants/contracts";
import { formatEther } from "ethers";
import Navbar from "@/components/navbar";
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
  const _agentId = router.query.agentid;
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [agentData, setAgentData] = useState<agentDataType>();
  const [agentsRoundsWon, setAgentsRoundsWon] = useState<any>();
  const [agentReviews, setAgentReviews] = useState<any[]>();
  const [rating, setRating] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [feedback, setFeedBack] = useState<string>("");
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const {
    write: purchaseSubscription,
    data,
    isLoading,
    isSuccess,
    isError,
  } = useContractWrite({
    // @ts-ignore
    address: CONTRACT_ADDRESSES,
    // @ts-ignore
    abi: CONTRACT_ABI,
    functionName: "purchaseSubscription",
  });

  const isUserSubscribed = async (agentID: number) => {
    if (!userAccount) {
      console.log("User Account not found");
      return;
    }

    const data = await getUser(userAccount);
    console.log(data);
    const agentsSubscribedTo = data.user?.agentsSubscribedTo;
    let subscribed = false;
    for (let i = 0; i < agentsSubscribedTo?.length; i++) {
      const assistantId = agentsSubscribedTo[i].agent.agentID;
      if (assistantId == agentID) {
        subscribed = true;
        break;
      }
    }
    setIsSubscribed(subscribed);
  };

  useEffect(() => {
    console.log(_agentId, typeof _agentId);
    if (_agentId && !agentData) {
      if (typeof _agentId == "string") {
        getAgentData(_agentId);
        if (userAccount) {
          checkSubscription(_agentId);
          // isUserSubscribed(Number(_agentId));
        }
      }
    }
  }, [router, userAccount]);

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

  // get Assistant Data
  const getAgentData = async (
    agentId: string
  ): Promise<agentDataType | undefined> => {
    if (!agentId) {
      console.log("No agent Id found");
      return;
    }

    // TODO Convert AgentID to Bytes form
    // NO need now , graph can fetch data for this given agentID
    const agentIdBytes = agentId;
    console.log(agentIdBytes);
    const agentGraphData = (await getAgent(agentIdBytes)).agent;
    console.log(agentGraphData);
    await setAgentsRoundsWon(agentGraphData.roundsWon);

    // TODO , Convert the agent ID to the one given in params
    // get partial data from firebase
    const firebaseData = await getAgentFirebase(Number(agentId));
    console.log(firebaseData);

    // get Reviews
    const firebaseReviews = await getReviews(Number(agentId));
    console.log(firebaseReviews);
    /// only pass firebaseReviews who has review content in the object and not just rating

    const filteredReviews = firebaseReviews?.filter((review) => {
      if (review?.review) {
        return review;
      }
    });
    const reviews = firebaseReviews?.slice(0, 3);
    console.log(filteredReviews);
    setAgentReviews(reviews);

    // other partial from openAI

    // TODO : update the assistantID we get from graphQl
    // const assitantData = await getAssistant(agentGraphData?.assistantId);
    const assitantData: any = await getAssistant(agentGraphData?.assistantId);

    console.log(assitantData);
    const agentData: agentDataType = {
      agentId: agentGraphData?.agentID,
      assistantId: agentGraphData?.assistantId,
      agentName: agentGraphData?.agentName,
      agentDesciption: assitantData?.description,
      agentInstructions: assitantData?.instructions,
      agentRating: firebaseData?.avgRating,
      agentCategory: agentGraphData?.agentCategory,
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
    const bpPercent = basisPoint / 100;
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

      // // TODO : Check the subID again after the new graph V

      // console.log(subId);
      const subId = `${userAccount.toLowerCase()}-${agentId}`;
      // console.log(subId);
      const subscriptionData = await getSubscription(subId);
      // console.log("here: ", subscriptionData);
      // or Unlock protocol graphQl
      // Or contract balance ERC721 method
      const isSubscribed = subscriptionData?.subscriptionEntity ? true : false;
      setIsSubscribed(isSubscribed);
    } catch (error) {
      console.log(error);
    }
  };

  // if not then subscribe via Model
  const subscribeAgent = async () => {
    try {
      if (agentData?.agentPrice === undefined) {
        console.log("Agent Price not found");
        return;
      }
      if (agentData?.agentId === undefined) {
        console.log("Agent Price not found");
        return;
      }
      const threadId = await createThread();
      console.log(threadId?.id);
      if (threadId?.id == undefined) {
        console.log("Thread Id could not be created");
        return;
      }

      const data = await publicClient?.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "purchaseSubscription",
        args: [agentData?.agentId, agentData?.agentPrice, threadId?.id],
        value: agentData?.agentPrice,
      });

      console.log(data);
      if (!walletClient) {
        console.log("Wallet client not found");
        return;
      }
      const hash = await walletClient.writeContract(data.request);
      console.log("Transaction Sent");
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      console.log(transaction);
      await toast({
        title: 'Agent Subscribed',
        description: "Your agent has been created subscribed",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
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

  const getTime = (timestamp: number) => {
    var d = new Date(1382086394000);
    return d.toLocaleString();
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="fixed z-50 top-0 left-0 w-full ">
        {" "}
        <Navbar />
      </div>
      <div className="flex flex-col mt-14">
        <div className="mx-auto">
          <div className="grid grid-flow-col grid-cols-4 grid-rows-1 gap-x-10 w-11/12 justify-center mx-auto mt-10">
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
                {agentData && agentData.agentCreator?.slice(0, 4)}...{" "}
                {agentData && agentData.agentCreator?.slice(-4)}
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
                  agentData.agentVersions?.map((agentV) => {
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
          <div className="w-2/3 border bg-indigo-100 flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-96 overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Description
            </p>
            <p className="text-lg font-semibold text-black mt-4">
              {agentData && agentData.agentDesciption}
            </p>

            <p className="mt-10 text-xl font-mono font-thin text-gray-600">
              Instructions
            </p>
            <p className="text-lg font-semibold text-black mt-4">
              {agentData && agentData.agentInstructions}
            </p>
          </div>
          {/* <div className="w-2/3 border bg-indigo-100 flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-96 overflow-scroll">
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
              <div className="w-1/2">
                <p className="text-sm">Agent Price</p>
                <p className="mt-1 font-semibold text-md">
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
                {agentData && agentData.openForContribution ? "Yes" : "No"}
              </p>
            </div>
            <div className="mt-4 flex flex-col">
              <button
                onClick={() => {
                  isSubscribed ? router.push(`/userAgents`) : onOpen();
                }}
                className="font-semibold text-xl bg-pink-100 px-10 py-2 border border-black border-b-4 rounded-xl cursor-pointer"
              >
                {isSubscribed ? "Use Agent" : "Buy Subscription"}
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

                      <button
                        onClick={() => subscribeAgent()}
                        className="mt-5 cursor-pointer mb-3 px-10 py-2 bg-green-100 border border-black border-b-4 rounded-xl text-x font-semibold text-black"
                      >
                        Subscribe
                      </button>
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <button
                onClick={() => {
                  router.push(`/contribute/${_agentId}`);
                }}
                className="font-semibold cursor-pointer mt-4 text-xl bg-violet-200 px-10 py-2 border border-black border-b-4 rounded-xl"
              >
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

          <div className="w-2/3 border flex flex-col border-black mx-3 rounded-xl px-10 py-3 h-[420px] overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              User Feedbacks
            </p>
            <div className="grid grid-cols-3 grid-rows-1 gap-x-1 grid-flow-row overflow-x-scroll">
              {agentReviews &&
                agentReviews.map((review) => {
                  return (
                    <div className="mt-10">
                      <div className="w-11/12 flex flex-col px-3 py-1 h-72 rounded-xl bg-white border border-zinc-200">
                        <div className="flex justify-between">
                          <p className="font-semibold text-black mt-3">
                            {review?.user.slice(0, 6)}...{" "}
                            {review?.user.slice(-4)}
                          </p>
                          <Tag
                            size="sm"
                            className="ml-2 mt-0.5"
                            colorScheme="yellow"
                          >
                            ★ {review?.rating}
                          </Tag>
                        </div>
                        <p className="mt-3 text-md text-black">
                          {review?.review}
                        </p>
                      </div>
                    </div>
                  );
                })}{" "}
            </div>
            {/* <div className="mt-4">
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
            </div> */}
          </div>
        </div>
        <div className="mt-10 w-5/6 mx-auto flex">
          <div className="w-2/3 border bg-violet-100 flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-96 overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Previous Rounds Won
            </p>
            <div className="mt-10">
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Round Id</Th>
                      <Th>Round End Time</Th>
                      <Th>Transaction hash</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {agentsRoundsWon &&
                      agentsRoundsWon.map((round: any) => (
                        <Tr key={round.id}>
                          <Td>{round.id.slice(0, 16)}...</Td>
                          <Td>{getTime(round.blockTimestamp)}</Td>
                          <Td>
                            <a
                              href={`https://mumbai.polygonscan.com/tx/${round.transactionHash}`}
                              target="_blank"
                              className="text-blue-500"
                            >
                              https://mumbai.polygonscan.com/tx/
                              {round.transactionHash}
                            </a>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentId;
