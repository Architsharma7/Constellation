import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";

const AgentId = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedBack] = useState<string>("");
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
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
              {/* <p className="text-xl text-black font-semibold mt-2">1.1.0</p> */}
              <select className="mt-2 px-2 py-1 rounded-lg bg-violet-100">
                <option className="text-xl text-black font-semibold">
                  1.1.0
                </option>
              </select>
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
              <button
                onClick={() => onOpen()}
                className="font-semibold text-xl bg-pink-100 px-10 py-2 border border-black border-b-4 rounded-xl cursor-pointer"
              >
                Use Agent
              </button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Buy Subscription</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <div className="flex flex-col">
                      <p className="text-xl font-semibold">
                        Seems like you don't have the subscription of this model
                      </p>
                      <p className="mt-4 font-md font-mono">
                        Buy Subscription at
                      </p>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <p className="text-sm">Agent Price</p>
                          <p className="mt-1 font-semibold text-lg">
                            0.01 Ethers
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">Duration</p>
                          <p className="mt-1 font-semibold text-lg">1 Month</p>
                        </div>
                      </div>
                      <button className="mt-5 cursor-pointer mb-3 px-10 py-2 bg-green-100 border border-black border-b-4 rounded-xl text-x font-semibold text-black">
                        Subscribe
                      </button>
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <button className="font-semibold cursor-pointer mt-4 text-xl bg-violet-200 px-10 py-2 border border-black border-b-4 rounded-xl">
                Contribute
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 w-5/6 mx-auto flex">
          <div className="w-1/3 border flex flex-col border-black mx-6 rounded-xl px-10 py-3 h-[420px] overflow-scroll">
            <p className="text-xl font-mono font-thin text-gray-600">
              Rating and Feedback
            </p>
            <div className="mt-4">
              <p className="text-lg font-semibold">Rate the agent</p>
              <div className="flex items-center space-x-2 mt-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRatingChange(value)}
                    className={`text-2xl focus:outline-none ${
                      value <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    {value <= rating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">Feedback</p>
              <textarea
                placeholder=""
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold h-40 border border-black"
                value={feedback}
                onChange={(e) => setFeedBack(e.target.value)}
              ></textarea>
            </div>
            <div className="mt-2 mx-auto">
              <button className="cursor-pointer mb-3 px-10 py-2 bg-green-100 border border-black border-b-4 rounded-xl text-x font-semibold text-black">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentId;
