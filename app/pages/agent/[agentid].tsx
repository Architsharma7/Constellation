import React from "react";

const AgentId = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="flex flex-col">
        <div className="mx-auto">
          <div className="grid grid-flow-col grid-cols-4 grid-rows-1 gap-x-10 w-full mt-10">
            <div className="border-2 bg-pink-100 border-b-8 flex flex-col px-14 py-3 border-black shadow-2xl">
              <p className="text-sm font-mono font-thin text-gray-500">
                Agent Name
              </p>
              <p className="text-xl text-black font-semibold mt-2">ElonAgent</p>
            </div>
            <div className="border-2 bg-white border-b-8 flex flex-col px-14 py-3 border-black shadow-2xl">
              <p className="text-sm font-mono font-thin text-gray-500">
                Agent Category
              </p>
              <p className="text-xl text-black font-semibold mt-2">Chatbot</p>
            </div>
            <div className="border-2 bg-blue-100 border-b-8 flex flex-col px-14 py-3 border-black shadow-2xl">
              <p className="text-sm font-mono font-thin text-gray-500">
                Agent Creator
              </p>
              <p className="text-xl text-black font-semibold mt-2">Archit</p>
            </div>
            <div className="border-2 bg-violet-100 border-b-8 flex flex-col px-14 py-3 border-black shadow-2xl">
              <p className="text-sm font-mono font-thin text-gray-500">
                Agent Version
              </p>
              <p className="text-xl text-black font-semibold mt-2">1.1.0</p>
            </div>
          </div>
        </div>
        <div className="mt-16 w-5/6 mx-auto flex">
          <div className="w-2/3 border bg-orange-100 flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-96 overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Description
            </p>
            <p className="text-lg font-semibold text-black mt-4">
              ElonAgent is an innovative AI companion designed to enhance
              productivity and streamline decision-making. Embodying the
              visionary spirit of Elon Musk, this intelligent virtual assistant
              integrates cutting-edge natural language processing and machine
              learning algorithms to provide personalized assistance. From
              automating tasks and answering queries to offering insightful
              recommendations, ElonAgent adapts to user preferences, fostering
              efficiency in both personal and professional spheres. With a
              user-friendly interface and continuous learning capabilities,
              ElonAgent mirrors the forward-thinking approach of its namesake,
              empowering users to navigate complexities effortlessly. Elevate
              your digital experience with ElonAgent, a smart and intuitive AI
              partner for the modern era.
            </p>
          </div>
          <div className="w-1/3 border flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-96 overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Agent Details
            </p>
            <div className="mt-4 flex justify-between">
              <div>
                <p className="text-sm">Agent Price</p>
                <p className="mt-1 font-semibold text-lg">0.01 Ethers</p>
              </div>
              <div>
                <p className="text-sm">Duration</p>
                <p className="mt-1 font-semibold text-lg">1 Month</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm">Agent Basis Point</p>
              <p className="mt-1 font-semibold text-lg">30%</p>
            </div>
            <div className="mt-4">
              <p className="text-sm">Agent Open for Contribution</p>
              <p className="mt-1 font-semibold text-lg">True</p>
            </div>
            <div className="mt-4 flex flex-col">
              <button className="font-semibold text-xl bg-pink-100 px-10 py-2 border border-black border-b-4 rounded-xl">
                Use Agent
              </button>
              <button className="font-semibold mt-4 text-xl bg-violet-200 px-10 py-2 border border-black border-b-4 rounded-xl">
                Contribute
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentId;
