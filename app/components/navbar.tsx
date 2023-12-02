import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const router = useRouter()
  return (
    <div className="w-screen mt-4 bg-gradient-to-r from-white via-white to-rose-100">
      <div className="flex justify-between mx-6">
        <div className="">
          <p className="font-semibold text-2xl">ProjectName</p>
        </div>
        <div className="flex justify-center mx-auto">
          <div className="bg-neutral-200 opacity-60 px-1 py-1 rounded-3xl flex">
            <div onClick={() => router.push("/agents")} className="bg-white rounded-3xl px-2 py-1 mx-1 cursor-pointer">
              <p className="text-center text-md font-semibold my-auto text-black">
                Agents
              </p>
            </div>
            <div onClick={() => router.push("/dashboard")} className="bg-white rounded-3xl px-2 py-1 mx-1 cursor-pointer">
              <p className="text-center text-md font-semibold my-auto text-black">
                Dashboard
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <ConnectButton accountStatus="address" showBalance={false} chainStatus="none"/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
