import React, { useEffect, useState } from "react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import HeroAnimation from "@/components/Animation/HeroAnimation";

export default function Home() {
  // useState and useEffect to fetch and set dynamic data

  return (
    <div>
      <div className="fixed z-50 top-0 left-0 w-full">
        <Navbar />
      </div>
      <div className="w-screen h-screen  bg-gradient-to-r from-white via-white to-rose-100">
        <div className="w-5/6 mt-20 flex flex-col justify-center mx-auto mb-2">
          <div className="mt-20 mx-auto p-6 bg-white shadow-xl rounded-lg max-w-4xl">
            <div className="items-center text-center">
              <p className="text-4xl font-bold bg-clip-text bg-gradient-to-b from-indigo-200 to bg-indigo-500">
                RocketAI🚀
              </p>

              <p className="font-md font-mono text-black font-bold mt-2">
                Revolutionizing AI agent development with collaborative
                creation, fine-tuning, and diverse applications. Incentivizes
                top-performing agents and users using Chainlink automation and functions for
                rewards in RAI tokens rocketAI's ERC20 standard.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={() => window.open('https://github.com/Architsharma7/Constellation', '_blank')} className="mt-5 bg-gradient-to-r from-indigo-200 to bg-indigo-500 hover:from-indigo-500 hover:to-indigo-200 text-white font-bold py-2 px-4 rounded-full">Source Code</button>
            </div>
          </div>

          {/* <HeroAnimation></HeroAnimation> */}

          {/* Use Cases Section */}
          <div className="mt-10 grid grid-cols-2 mx-[20%] gap-6">
            {/* Box 1 - Agent Creation */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">Agent Creation</h3>
              <p className="text-sm text-gray-600">
                RocketAI leverages GPT-4 and other cutting-edge AI models to
                enable the creation of diverse and sophisticated AI agents.
                These agents can perform a variety of tasks, ranging from simple
                automation to complex problem-solving.
              </p>
            </div>

            {/* Box 2 - Collaborative Ecosystem */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">
                Collaborative Ecosystem
              </h3>
              <p className="text-sm text-gray-600">
                Our platform fosters a vibrant ecosystem where creators and
                users collaborate, leading to the continuous enhancement and
                evolution of AI agents. This collaborative approach ensures that
                our agents remain cutting-edge and relevant.
              </p>
            </div>

            {/* Box 3 - Subscription Model */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">Subscription Model</h3>
              <p className="text-sm text-gray-600">
                RocketAI introduces a novel subscription model, powered by the
                Unlock Protocol, enabling agent creators to generate sustainable
                revenue while providing users with access to high-quality AI
                services.
              </p>
            </div>

            {/* Box 4 - Rewarding Excellence */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">
                Rewarding Excellence
              </h3>
              <p className="text-sm text-gray-600">
                We employ Chainlink automation to reward excellence within our
                community. Top-performing agents and their contributors are
                recognized and rewarded, encouraging a culture of quality and
                innovation.
              </p>
            </div>
          </div>

          {/* Powered By Section */}
          <div className="mt-5 text-center">
            <h2 className="text-2xl font-bold mb-4">Powered By</h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div>
                <img
                  src={
                    "https://gateway.lighthouse.storage/ipfs/QmZcWkCK3maJYVAvSij2ZWMfHgLQnVVhnM8c7VdZcMLy8h"
                  }
                  alt="Chainlink"
                  className="h-16"
                />
                <p>Chainlink</p>
              </div>
              <div>
                <img
                  src="https://gateway.lighthouse.storage/ipfs/QmTKQi6S4mRGwVjAceJgYQu3Ki599Ckw5qtLj2dpbX7GK7"
                  alt="The Graph"
                  className="h-16"
                />
                <p>The Graph</p>
              </div>
              <div>
                <img
                  src="https://gateway.lighthouse.storage/ipfs/QmVarpFFheqPGPcn5RdRC7S2S45UZ638A3kNiRLSUsiamt"
                  alt="OpenAI"
                  className="h-16"
                />
                <p>OpenAI</p>
              </div>
              <div>
                <img
                  src="https://gateway.lighthouse.storage/ipfs/QmVSVS65JTmPTZUSwueqvvCAJxPaKb41FvdxQ467KPfsLM"
                  alt="Unlock"
                  className="h-16"
                />
                <p>Unlock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}