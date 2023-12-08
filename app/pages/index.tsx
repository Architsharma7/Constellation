import React, { useEffect, useState } from "react";
import { Avatar, Wrap, WrapItem, calc } from "@chakra-ui/react";
import {
  getAllAgents,
  getAllRounds,
  getLockData,
} from "@/utils/graphFunctions";
import { getRatingsRank } from "@/firebase/firebaseFunctions";
import Navbar from "@/components/navbar";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import HeroAnimation from "@/components/Animation/HeroAnimation";

export default function Home() {
  const [roundData, setRoundData] = useState<any[]>();
  const [agentsData, setAgentsData] = useState<any[]>();
  // fetch the data
  // 1. Overall filter based on different filters , Ratings , Revenue ,  no of Rounds Won
  // 2. Round based

  useEffect(() => {
    if (!roundData) {
      getRounds();
    }
    if (!agentsData) {
      getLeaderboardRatings();
    }
  }, []);

  const getLeaderboardRatings = async () => {
    try {
      const data = await getRatingsRank();
      console.log(data);
      setAgentsData(data);
      // we'll get the orderedData , just display it when user's select on the basis of Ratings
    } catch (error) {
      console.log(error);
    }
  };

  const getLeadeboardData = async () => {
    try {
      // get EachAgent's record
      const data = await getAllAgents(25);
      console.log(data);
      console.log(data.agents);

      // getLeaderboardRevenue(data.agents);
      // getLeaderboardTotalRounds(data.agents);
    } catch (error) {
      console.log(error);
    }
  };

  const getLeaderboardRevenue = async () => {
    try {
      const data = await getAllAgents(25);
      console.log(data);
      console.log(data.agents);
      let agents = data.agents;
      let promises: any[] = [];
      for (let i = 0; i < agents.length; i++) {
        const totalRevenue = calculateRevenue(agents[i].unlockSubAddress);
        const newAgent = {
          ...agents[i],
          totalRevenue: totalRevenue,
        };
        promises.push(newAgent);
      }
      const agentsData = await Promise.all(promises);
      //sort the agentsData on the basis of totalRevenue
      agentsData.sort((a, b) => {
        return b.totalRevenue - a.totalRevenue;
      });

      console.log(agentsData);
      setAgentsData(agentsData);

      // TODO : Need to display the agent's name here , so find a way to fetch it from OpenAi for each agent
      // return agentsData;
    } catch (error) {
      console.log(error);
    }
  };

  const calculateRevenue = async (
    lockAddress: string
  ): Promise<number | undefined> => {
    try {
      const data = await getLockData(lockAddress);
      const totalRevenue =
        Number(data?.lock.price) * Number(data?.lock.totalKeys);
      console.log(totalRevenue);
      return totalRevenue;
    } catch (error) {
      console.log(error);
    }
  };

  const getLeaderboardTotalRounds = async () => {
    try {
      const data = await getAllAgents(25);
      console.log(data);
      console.log(data.agents);
      let agents = data.agents;
      let agentsData: any[] = [];
      for (let i = 0; i < agents.length; i++) {
        const newAgent = {
          ...agents[i],
          totalRoundsWon: agents[i].roundsWon.length,
        };
        agentsData.push(newAgent);
      }
      console.log(agentsData);
      // sort the agentsData on the basis of totalRoundsWon
      agentsData.sort((a, b) => {
        return b.totalRoundsWon - a.totalRoundsWon;
      });
      console.log(agentsData);

      setAgentsData(agentsData);

      // return agentsData;
      // calculate the totalRounds they have won
    } catch (error) {
      console.log(error);
    }
  };

  const getRounds = async () => {
    const data = await getAllRounds(5);
    console.log(data);
    setRoundData(data.rounds);
    // an array of Round data is returend here
  };

  const handleFilter = (choice: string) => {
    if (choice == "rating") {
      getLeaderboardRatings();
    } else if (choice == "revenue") {
      getLeaderboardRevenue();
    } else if (choice == "rounds") {
      getLeaderboardTotalRounds();
    } else {
      getLeadeboardData();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
        <div className="w-5/6 flex flex-col justify-center mx-auto mb-2">
          <div className="mt-20 mx-auto items-center">
            <p className="text-4xl font-bold bg-clip-text bg-gradient-to-b from-indigo-200 to bg-indigo-500 text-center">
              RocketAI🚀
            </p>

            <p className="text-center font-md font-mono text-gray-600 mt-2 items-center w-2/3 mx-auto">
              RocketAI, is a platform that revolutionizes the creation,
              fine-tuning, and utilization of AI agents. Our platform fosters
              collaboration among creators, fine-tuners, and users, enhancing
              and utilizing AI agents for varied tasks, thus creating a dynamic
              and rewarding experience for all involved.
            </p>
          </div>

          <HeroAnimation></HeroAnimation>

          {/* Use Cases Section */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {/* Box 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h3 className="text-lg font-semibold mb-2">Agent Creation</h3>
              <p className="text-sm text-gray-600">
                Utilize GPT-4 and other advanced models to create diverse and
                capable AI agents.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h3 className="text-lg font-semibold mb-2">
                Collaborative Ecosystem
              </h3>
              <p className="text-sm text-gray-600">
                Encourage collaboration between creators and users for
                continuous improvement of agents.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h3 className="text-lg font-semibold mb-2">Subscription Model</h3>
              <p className="text-sm text-gray-600">
                Generate sustainable income via subscriptions with the Unlock
                Protocol.
              </p>
            </div>

            {/* Box 4 */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h3 className="text-lg font-semibold mb-2">
                Rewarding Excellence
              </h3>
              <p className="text-sm text-gray-600">
                Reward top agents and contributors using Chainlink automation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
