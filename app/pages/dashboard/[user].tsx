import React, { useEffect, useState } from "react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import {
  useAccount,
  useEnsName,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { getCreator, getUser } from "@/utils/graphFunctions";
import { useRouter } from "next/router";

const User = () => {
  const router = useRouter();
  const { address: creatorAccount } = useAccount();
  const [creatorData, setCreatorData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [ens, setEns] = useState(null);
  const publicClient = usePublicClient({ chainId: 1 });
  const { data: walletClient } = useWalletClient();

  const fetchCreatorData = async () => {
    if (!creatorAccount) {
      console.log("Creator Account not found");
      return;
    }
    let ensName;
    try{
      ensName = await publicClient.getEnsName({
        address: creatorAccount,
      });
    }catch(err){
      console.log(err)
    }


    if (ensName) {
      // @ts-ignore 
      setEns(ensName);
      console.log(ensName);
    }
    const data = await getCreator(creatorAccount);

    setCreatorData(data);
  };

  const fetchUserData = async () => {
    if (!creatorAccount) {
      console.log("User Account not found");
      return;
    }
    const data = await getUser(creatorAccount);
    setUserData(data);
  };

  useEffect(() => {
    fetchCreatorData();
    fetchUserData();
  }, [creatorAccount]);

  const handleAgentClick = (agentID: any) => (event: any) => {
    event.preventDefault();
    // your redirect logic here
    router.push(`/agents/${agentID}`);
  };
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
              <p className="text-lg font-semibold mt-3">{ens?ens:creatorAccount}</p>
            </div>
          </div>
          <div className="mt-10 mx-auto flex">
            <div className="border flex justify-between items-center border-black rounded-3xl px-7 py-2">
              <p className="text-lg font-mono mx-3">Total Revenue Yet</p>
              <p className="text-2xl font-semibold mx-3">$104</p>
            </div>
          </div>
          <div className="mt-10 mx-auto flex flex-row">
            {/* Subscriptions Column */}
            <div className="flex-1 border border-b-8 border-black mx-10 px-10 py-3 bg-indigo-100 shadow-2xl">
              <p className="text-xl font-mono text-black mx-10">
                Subscriptions Purchased
              </p>
              <div className="mt-4">
                {userData &&
                  // @ts-ignore
                  userData?.user?.agentsSubscribedTo.map(
                    (subscription: any, index: any) => (
                      <div
                        key={index}
                        className="flex border border-indigo-200 bg-indigo-300 px-4 py-1  rounded-lg mb-2 cursor-pointer"
                        onClick={handleAgentClick(subscription?.agent?.agentID)}
                      >
                        <p className="text-lg font-semibold">
                          {subscription?.agent?.agentName}
                        </p>
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* Agents Created Column */}
            <div className="flex-1 mx-5 border border-b-8 border-black px-10 py-3 bg-green-100 shadow-2xl">
              <p className="text-xl font-mono text-black">Agents Created</p>
              <div className="mt-12">
                {creatorData &&
                  // @ts-ignore
                  creatorData?.creator?.agentsCreated.map(
                    (agent: any, index: any) => (
                      <div
                        key={index}
                        className="flex border border-green-200 bg-green-300 px-4 py-1 rounded-lg mb-2 cursor-pointer"
                      >
                        <div onClick={handleAgentClick(agent?.agentID)}>
                          <p className="text-lg font-semibold">
                            {agent?.agentName}
                          </p>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default User;
