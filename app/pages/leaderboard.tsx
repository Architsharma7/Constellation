import React from "react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";

const Leaderboard = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="w-5/6 flex flex-col justify-center mx-auto mb-2">
        <div className="mt-10 mx-auto items-center">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-indigo-200 to bg-indigo-500 text-center">
            LEADERBOARD
          </p>
          <p className="text-center font-md font-mono text-gray-600 mt-2 items-center w-2/3 mx-auto">
            Leaderboards are based on either revenue or ratings and feedbacks of
            the agent
          </p>
        </div>
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
