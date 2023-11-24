import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  Divider,
  Center,
} from "@chakra-ui/react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useRef } from "react";

const Create = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [agentImage, setAgentImage] = useState<any>();
  return (
    <div className="w-screen h-screen bg-black">
      <div>
        <p className="text-white text-xl font-semibold mx-10 pt-3 pb-2">
          Create an Agent
        </p>
      </div>
      <hr className="h-px border-t-0 bg-transparent bg-gradient-to-r from-neutral-800 via-neutral-500 to-neutral-800 opacity-100" />
      <div className="flex">
        <div className="w-1/3 mt-10 px-10 flex flex-col">
          <div>
            <p className="text-white text-2xl font-semibold text-center">
              Agent Details
            </p>
          </div>
          <div className="mx-auto mt-6">
            <Wrap>
              <WrapItem>
                <Avatar
                  name="A I"
                  colorScheme="teal"
                  size="lg"
                  src={agentImage}
                  color="white"
                />
              </WrapItem>
            </Wrap>
            <input
              type="image"
              className="rounded-xl border mx-auto items-center border-white px-2 py-1 mt-4"
              value={agentImage}
              onChange={(e) => setAgentImage(e.target.value)}
              alt="select"
            ></input>
          </div>
          <div>
            <div className="mt-7">
              <p className="text-xl text-white font-semibold">Agent Name</p>
              <input
                type="text"
                placeholder="be creative ..."
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold"
              ></input>
            </div>
            <div className="mt-7">
              <p className="text-xl text-white font-semibold">
                Agent Description
              </p>
              <textarea
                placeholder="tell what the agent does ..."
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold h-44"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-100"></div>
        <div className="w-2/3 mt-6 px-10 flex flex-col">
          <div className="w-full flex justify-between">
            <div>
              <p className="text-xl text-white font-semibold mt-1">
                Let's set up the agent !!
              </p>
            </div>
            <div>
              <Button
                ref={btnRef}
                className="mx-3"
                colorScheme="teal"
                onClick={onOpen}
              >
                Configure
              </Button>
              <Button className="mx-3" colorScheme="blue">
                Save
              </Button>
            </div>
          </div>
          <div>
            <Tabs
              className="mt-7"
              align="center"
              isFitted
              colorScheme="whatsapp"
              variant="soft-rounded"
            >
              <TabList>
                <Tab textColor="white">Create</Tab>
                <Tab textColor="white">Review</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="flex flex-col">
                    <div className="flex mx-auto w-full">
                      <input
                        type="text"
                        className="fixed bottom-0 mb-3 py-3 px-3 rounded-xl w-[60%] font-semibold"
                        placeholder="enter prompt for training agent ..."
                      ></input>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="flex flex-col">
                    <div className="flex mx-auto w-full">
                      <input
                        type="text"
                        className="fixed bottom-0 mb-3 py-3 px-3 rounded-xl w-[60%] font-semibold"
                        placeholder="enter prompt for reviewing agent ..."
                      ></input>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isOpen}
        placement="right"
        size="md"
        closeOnEsc={false}
        closeOnOverlayClick={false}
        colorScheme="blackAlpha"
        onClose={onClose}
      >
        <DrawerContent backgroundColor="">
          <DrawerCloseButton />
          <DrawerHeader>Configure Your Agent</DrawerHeader>
          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Create;
