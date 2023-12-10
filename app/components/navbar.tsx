import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="w-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="flex justify-between mx-6 ml-10">
        <div onClick={() => router.push("/")} className="mt-4 cursor-pointer">
          <p className="font-semibold text-2xl">RocketAI🚀</p>
        </div>
        <div className="flex justify-center mx-auto">
          <div className="bg-neutral-200 opacity-60 px-1 py-1 rounded-3xl flex mt-4">
            <div
              onClick={() => router.push("/agents")}
              className="bg-white rounded-3xl px-2 py-1 mx-1 cursor-pointer"
            >
              <p className="text-center text-md font-semibold my-auto text-black">
                Agents
              </p>
            </div>
            <div
              onClick={() => router.push("/dashboard/1")}
              className="bg-white rounded-3xl px-2 py-1 mx-1 cursor-pointer"
            >
              <p className="text-center text-md font-semibold my-auto text-black">
                Dashboard
              </p>
            </div>
            <div
              onClick={() => router.push("/create")}
              className="bg-white rounded-3xl px-2 py-1 mx-1 cursor-pointer"
            >
              <p className="text-center text-md font-semibold my-auto text-black">
                CreateAgent
              </p>
            </div>
            <div
              onClick={() => router.push("/userAgents")}
              className="bg-white rounded-3xl px-2 py-1 mx-1 cursor-pointer"
            >
              <p className="text-center text-md font-semibold my-auto text-black">
                YourAgents
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ConnectButton
            accountStatus="address"
            showBalance={false}
            chainStatus="icon"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
