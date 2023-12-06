import React from "react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { getCreator, getUser } from "@/utils/graphFunctions";

const User = () => {
  const { address: creatorAccount } = useAccount();

  // display the Creator Data like rounds they have won , and the agents they have created
  // NOTE : Could also add more start for the agents , but perhaps not need as of now
  const getCreatorData = async () => {
    if (!creatorAccount) {
      console.log("User Account not found");
      return;
    }

    const data = await getCreator(creatorAccount);
    console.log(data);
  };
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
      getCreatorData();
    }
    if (userAccount) {
      getUserData();
    }
  }, [userAccount, creatorAccount]);
  return (
    <div>
      <Navbar />
      <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
        <div className="flex flex-col w-full">
          <div className="flex flex-col justify-center mx-auto mt-10">
            <div className="mx-auto">
              <Wrap>
                <WrapItem>
                  <Avatar colorScheme="pink" size="lg" color="black" />
                </WrapItem>
              </Wrap>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold mt-3">
                0x9B855D0Edb3111891a6A0059273904232c74815D
              </p>
            </div>
          </div>
          <div className="mt-10 mx-auto flex">
            <div className="border flex justify-between items-center border-black rounded-3xl px-7 py-2">
              <p className="text-lg font-mono mx-3">Total Revenue Yet</p>
              <p className="text-2xl font-semibold mx-3">$104</p>
            </div>
          </div>
          <div className="mt-10 mx-auto flex">
            <div className="border flex flex-col mx-3 border-b-8 border-black px-10 py-3 bg-indigo-100 shadow-2xl">
              <div className="">
                <p className="text-xl font-mono text-black">
                  Subscriptions Purchased
                </p>
              </div>
              <div className="mt-4">
                <div className="flex border border-indigo-200 bg-indigo-300 px-4 py-1 rounded-lg">
                  <p className="text-lg font-semibold">ElonAgent</p>
                </div>
              </div>
            </div>
            <div className="border flex mx-3 flex-col border-b-8 border-black px-10 py-3 bg-green-100 shadow-2xl">
              <div className="">
                <p className="text-xl font-mono text-black">Agents Created</p>
              </div>
              <div className="mt-4">
                <div className="flex border border-green-200 bg-green-300 px-4 py-1 rounded-lg">
                  <p className="text-lg font-semibold">ElonAgent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
