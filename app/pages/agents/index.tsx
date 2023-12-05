import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
} from "@chakra-ui/react";
import { getAllAgents } from "@/utils/graphFunctions";
import { getAgent } from "@/firebase/firebaseFunctions";

interface agentDataType {
  agentId: number;
  assistantId: number;
  agentName: string;
  agentDesciption: string;
  agentRating: string;
  agentCategory: string;
}

const Index = () => {
  const [agentsData, setAgentsData] = useState<agentDataType[] | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Explore agent page
  const getAgentData = async (
    agentGraphData: any
  ): Promise<agentDataType | undefined> => {
    if (!agentGraphData) {
      console.log("No agent Data found");
      return;
    }
    // get partial data from firebase
    const firebaseData = await getAgent(agentGraphData?.agentID);
    console.log(firebaseData);
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
      agentRating: firebaseData?.avgRating,
      agentCategory: agentGraphData?.agentCategory,
    };
    return agentData;
  };

  const getAgents = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAgents(10);
      console.log(data);
      console.log(data.agents);

      const promises = [];
      if (data.agents.length) {
        for (let i = 0; i < data.agents.length; i++) {
          const agentData = getAgentData(data?.agents[i]);
          promises.push(agentData);
        }
      }

      const agentsData = await Promise.all(promises);
      console.log(agentsData);
      if (agentsData) {
        setAgentsData(agentsData);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!agentsData) {
      getAgents();
    }
  }, []);
  const router = useRouter();
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="flex flex-col">
        <div className="mx-auto mt-10">
          <div
            onClick={() => router.push("/leaderboard")}
            className="border cursor-pointer align-middle flex border-gray-300 bg-blue-100 px-10 py-3 rounded-3xl"
          >
            <div className="flex items-center">
              <p className="font-semibold text-sm">
                Checkout the Leaderboard for best Agents
              </p>
              <div className="ml-5 m-0">
                <IoIosArrowRoundForward className="text-2xl" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-6">
          <form className="w-[400px] px-4">
            <div className="relative">
              <input
                type="text"
                className="w-full border h-12 shadow p-4 rounded-full"
                placeholder="search"
              />
              <button type="submit">
                <svg
                  className="text-black h-5 w-5 absolute top-3.5 right-3 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 56.966 56.966"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
        <div className="mt-10 w-5/6 mx-auto">
          <div className="grid grid-flow-row grid-cols-3 gap-x-10 gap-y-10">
            {/* TODO : Comment the default Component */}
            <div className="px-6 py-3 bg-white border-b-8 shadow-xl border border-black">
              <div className="flex mx-auto">
                <p className="text-center text-xl font-semibold">ElonAgent</p>
                <Tag size="sm" className="ml-2 mt-0.5" colorScheme="yellow">
                  ★ 3.3
                </Tag>
              </div>
              <p className="text-sm font-mono h-40 mt-3 overflow-clip overflow-ellipsis">
                ElonAgent is an innovative AI companion designed to enhance
                productivity and streamline decision-making. Embodying the
                visionary spirit of Elon Musk, this intelligent virtual
                assistant integrates cutting-edge natural language processing
                and machine learning algorithms to provide personalized
                assistance. From automating tasks and answering queries to
                offering insightful recommendations, ElonAgent adapts to user
                preferences, fostering efficiency in both personal and
                professional spheres. With a user-friendly interface and
                continuous learning capabilities, ElonAgent mirrors the
                forward-thinking approach of its namesake, empowering users to
                navigate complexities effortlessly. Elevate your digital
                experience with ElonAgent, a smart and intuitive AI partner for
                the modern era.
              </p>
              <div className="flex mt-3">
                <p className="font-sm font-semibold">Categories : </p>
                <Tag size="sm" className="ml-3 mt-1">
                  Problem solving
                </Tag>
              </div>
              <button className="px-12 mt-4 flex mx-auto border border-black font-semibold text-lg py-1.5 rounded-lg bg-green-100">
                Try it out
              </button>
            </div>
            {agentsData ? (
              agentsData.map((agent) => {
                return (
                  <div className="px-6 py-3 bg-white border-b-8 shadow-xl border border-black">
                    <div className="flex mx-auto">
                      <p className="text-center text-xl font-semibold">
                        {agent.agentName}
                      </p>
                      <Tag
                        size="sm"
                        className="ml-2 mt-0.5"
                        colorScheme="yellow"
                      >
                        ★{agent.agentRating}
                      </Tag>
                    </div>
                    <p className="text-sm font-mono h-40 mt-3 overflow-clip overflow-ellipsis">
                      {agent.agentDesciption}
                    </p>
                    <div className="flex mt-3">
                      <p className="font-sm font-semibold">Categories : </p>
                      <Tag size="sm" className="ml-3 mt-1">
                        {agent.agentCategory}
                      </Tag>
                    </div>
                    <button
                      onClick={() => {
                        router.push(`/agents/${agent.agentId}`);
                      }}
                      className="px-12 mt-4 flex mx-auto border border-black font-semibold text-lg py-1.5 rounded-lg bg-green-100"
                    >
                      Try it out
                    </button>
                  </div>
                );
              })
            ) : (
              <a>{isLoading ? <a> Loading .. </a> : <a>No Agents Found</a>}</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
