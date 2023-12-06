import React, { useEffect, useState } from "react";
import { Avatar, Wrap, WrapItem, calc } from "@chakra-ui/react";
import {
  getAllAgents,
  getAllRounds,
  getLockData,
} from "@/utils/graphFunctions";
import { getRatingsRank } from "@/firebase/firebaseFunctions";

const Leaderboard = () => {
  const [roundData, setRoundData] = useState<any[]>();
  const [agentsData, setAgentsData] = useState<any[]>();
  // fetch the data
  // 1. Overall filter based on different filters , Ratings , Revenue ,  no of Rounds Won
  // 2. Round based

  useEffect(() => {
    if (!roundData) {
      // getRounds();
    }
  }, []);

  const getLeaderboardRatings = async () => {
    try {
      const data = await getRatingsRank();
      console.log(data);
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

      getLeaderboardRevenue(data.agents);
      getLeaderboardTotalRounds(data.agents);
    } catch (error) {
      console.log(error);
    }
  };

  const getLeaderboardRevenue = async (agents: any[]) => {
    try {
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
      setAgentsData(agentsData);
      return agentsData;
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

  const getLeaderboardTotalRounds = (agents: any[]): any[] | undefined => {
    try {
      let agentsData: any[] = [];
      for (let i = 0; i < agents.length; i++) {
        const newAgent = {
          ...agents[i],
          totalRoundsWon: agents[i].roundsWon.length,
        };
        agentsData.push(newAgent);
      }
      setAgentsData(agentsData);
      return agentsData;
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

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="w-5/6 flex flex-col justify-center mx-auto mb-2">
        {/* <div className="flex"> */}
        <div className="mt-10 mx-auto items-center">
          <div className="flex justify-between w-full">
            <p></p>
            <p></p>
            <p></p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-indigo-200 to bg-indigo-500 text-center">
              LEADERBOARD
            </p>
            <div className="r-0 flex items-center">
              <div>
                <p className="font-semibold text-md mx-1">Sort</p>
              </div>
              <div>
                <select className="px-3 py-1 rounded-lg mx-1 font-semibold">
                  <option>Rating</option>
                  <option>Revenue</option>
                </select>
              </div>
            </div>
          </div>
          <p className="text-center font-md font-mono text-gray-600 mt-2 items-center w-2/3 mx-auto">
            Leaderboards are based on either revenue or ratings and feedbacks of
            the agent
          </p>
        </div>
        {/* <div className="r-0 mt-10 flex items-center">
          <div>
            <p className="font-semibold text-md mx-1">Sort</p>
          </div>
          <div>
            <select className="px-3 py-1 rounded-lg mx-1 font-semibold">
              <option>Rating</option>
              <option>Revenue</option>
            </select>
          </div>
        </div> */}
        {/* </div> */}
        {[1, 2, 3, 4, 5].map((value) => (
          <div className="mt-6 flex flex-col mx-auto">
            <div className="w-full flex">
              <div className="px-6 py-3.5 w-16 rounded-lg items-center border-orange-200 border-4 mx-3">
                <p className="text-2xl font-semibold text-center my-auto">
                  {value}
                </p>
              </div>
              <div className="px-4 cursor-pointer py-2 flex align-middle border border-white bg-gradient-to-r from-pink-100 to-orange-200  mx-3 rounded-lg w-96">
                <div className="flex items-center">
                  <div>
                    <Wrap>
                      <WrapItem>
                        <Avatar colorScheme="pink" size="md" color="black" />
                      </WrapItem>
                    </Wrap>
                  </div>
                  <div>
                    <p className="m-0 ml-3 font-semibold text-2xl">ElonAgent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
