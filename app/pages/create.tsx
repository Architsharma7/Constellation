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
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Switch } from "@chakra-ui/react";
import { useRef } from "react";
import { Badge } from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";
import { FaTwitter } from "react-icons/fa6";
import { MdOutlineAttachFile } from "react-icons/md";
import { IoIosMail } from "react-icons/io";

const Create = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [agentDetails, setAgentDetails] = useState<any>({
    agentName: "",
    agentDesc: "",
    agentPrice: "",
    agentBP: "",
    agentImage: null,
  });
  const [agentOpenFor, setAgentOpenFor] = useState<boolean>(false);
  const [tweet, setTweet] = useState<boolean>(false);
  const [mail, setMail] = useState<boolean>(false);
  const [agentInstructions, setAgentInstructions] = useState<string>();
  const [file, setFile] = useState("");
  const [codeInterpreter, setCodeInterpreter] = useState<boolean>(false);
  const [fileInterpreter, setFileInterpreter] = useState<boolean>(false);
  const [imageGeneration, setImageGeneration] = useState<boolean>(false);

  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput?.current?.click();
  };
  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    setFile(fileUploaded);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-white to-rose-100">
      <div className="flex justify-between mx-10 pt-3 pb-2">
        <p className="text-orange-600 text-2xl font-bold">Create an Agent</p>
        <div>
          <Button
            ref={btnRef}
            className="mx-3 bg-orange-600 border border-b-4 border-black"
            colorScheme=""
            onClick={onOpen}
          >
            Configure
          </Button>
          <Button className="mx-3 border border-b-4 border-black">Save</Button>
        </div>
      </div>
      <hr className="h-0.5 bg-black" />
      <div className="flex h-full">
        <div className="w-1/3 bg-orange-100 px-10 flex flex-col overflow-scroll border-r-8 border-t-2 border-black rounded-2xl">
          <div className="mt-5">
            <p className="text-black text-2xl font-semibold text-center">
              Agent Details
            </p>
          </div>
          <div className="mx-auto mt-6">
            <Wrap>
              <WrapItem>
                <Avatar
                  name="A I"
                  colorScheme="pink"
                  size="lg"
                  src={agentDetails.agentImage}
                  color="black"
                />
              </WrapItem>
            </Wrap>
            {/* <input
              type="image"
              className="rounded-xl border mx-auto items-center border-white px-2 py-1 mt-4"
              onChange={(e) =>
                setAgentDetails({ ...agentDetails, agentImage: e.target.value })
              }
              alt="select"
            ></input> */}
          </div>
          <div>
            <div className="mt-7">
              <p className="text-xl text-black font-semibold">Agent Name</p>
              <input
                type="text"
                placeholder="be creative ..."
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold border border-black"
                onChange={(e) =>
                  setAgentDetails({
                    ...agentDetails,
                    agentName: e.target.value,
                  })
                }
                value={agentDetails.agentName}
              ></input>
            </div>
            <div className="mt-7">
              <p className="text-xl text-black font-semibold">
                Agent Instructions
              </p>
              <textarea
                placeholder="You are a helpful assistant"
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold h-32 border border-black"
                onChange={(e) => setAgentInstructions(e.target.value)}
                value={agentInstructions}
              ></textarea>
            </div>
            <div className="mt-5">
              <p className="text-xl text-black font-semibold">
                Agent Description
              </p>
              <textarea
                placeholder="tell what the agent does ..."
                className="px-5 py-2 rounded-xl mt-2 w-full font-semibold h-36 border border-black"
                onChange={(e) =>
                  setAgentDetails({
                    ...agentDetails,
                    agentDesc: e.target.value,
                  })
                }
                value={agentDetails.agentDesc}
              ></textarea>
            </div>
            <div className="mt-4 w-full flex justify-between">
              <p className="font-semibold text-md">Code Interpreter</p>
              <Switch
                onChange={() => setCodeInterpreter(!codeInterpreter)}
                size="lg"
                colorScheme="blue"
              />
            </div>
            <div className="mt-4 mb-3 w-full flex justify-between">
              <p className="font-semibold text-md">File Interpreter</p>
              <Switch
                onChange={() => setFileInterpreter(!fileInterpreter)}
                size="lg"
                colorScheme="blue"
              />
            </div>
            <div className="mt-4 mb-3 w-full flex justify-between">
              <p className="font-semibold text-md">Files</p>
              <div className="">
                <MdOutlineAttachFile className="text-2xl cursor-pointer text-green-500"></MdOutlineAttachFile>
                <input type="file" style={{ display: "none" }} />
                {file && (
                  <p className="text-xs w-20 h-5 overflow-clip">{file?.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-100"></div> */}
        <div className="w-2/3 mt-6 px-10 flex flex-col">
          <div className="w-full flex justify-between">
            <div>
              <p className="text-xl text-black font-semibold mt-1">
                Lets set up the agent !!
              </p>
            </div>
            <div>
              <button className="px-6 py-1.5 bg-blue-100 rounded-lg font-semibold mx-3">
                Run
              </button>
              <button className="px-6 py-1.5 bg-green-100 rounded-lg font-semibold mx-3">
                Clear
              </button>
            </div>
          </div>
          <div>
            <Tabs
              className="mt-7"
              align="center"
              isFitted
              colorScheme="orange"
              variant="soft-rounded"
            >
              <TabList>
                <Tab textColor="black">Thread</Tab>
                <Tab textColor="black">Review</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="flex flex-col">
                    {/* <div className="w-full h-[93%] border border-black"></div> */}
                    <div className="flex mx-auto w-full">
                      <div className="fixed bottom-0 mb-3 py-3 px-3 rounded-xl w-[60%]">
                        <InputGroup>
                          <Input
                            variant="outline"
                            borderColor="black"
                            borderWidth="initial"
                            focusBorderColor="black"
                            size="lg"
                            bgColor="white"
                            type="text"
                            className="font-semibold"
                            placeholder="enter prompt for training agent ..."
                          ></Input>
                          <InputRightAddon
                            bgColor="white"
                            borderColor="white"
                            height="inherit"
                          >
                            <>
                              <MdOutlineAttachFile
                                onClick={handleClick}
                                className="text-xl cursor-pointer"
                              ></MdOutlineAttachFile>
                              <input
                                type="file"
                                onChange={handleChange}
                                ref={hiddenFileInput}
                                style={{ display: "none" }}
                              />
                              {file && (
                                <p className="text-xs w-20 overflow-clip">
                                  {file?.name}
                                </p>
                              )}
                            </>
                          </InputRightAddon>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="flex flex-col">
                    <div className="flex mx-auto w-full">
                      <div className="fixed bottom-0 mb-3 py-3 px-3 rounded-xl w-[60%]">
                        <InputGroup>
                          <Input
                            variant="outline"
                            borderColor="black"
                            borderWidth="initial"
                            focusBorderColor="black"
                            size="lg"
                            bgColor="white"
                            type="text"
                            className="font-semibold"
                            placeholder="enter prompt for training agent ..."
                          ></Input>
                          <InputRightAddon
                            bgColor="white"
                            borderColor="white"
                            height="inherit"
                          >
                            <IoIosSend className="text-xl cursor-pointer"></IoIosSend>
                          </InputRightAddon>
                        </InputGroup>
                      </div>
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
        onClose={onClose}
        colorScheme="orange"
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="bg-orange-100" fontSize="x-large">
            Configure Your Agent
          </DrawerHeader>
          <DrawerBody className="bg-orange-100">
            <div className="flex flex-col">
              <div>
                <p className="text-xl text-black font-semibold">
                  Price of Agent
                </p>
                <input
                  type="number"
                  className="mt-2 px-5 w-full rounded-xl py-2 border border-black"
                  placeholder="in ethers"
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      agentPrice: e.target.value,
                    })
                  }
                  value={agentDetails.agentPrice}
                ></input>
              </div>
              <div className="mt-6">
                <p className="text-xl text-black font-semibold">Basis point</p>
                <input
                  type="number"
                  className="mt-2 px-5 w-full rounded-xl py-2 border border-black"
                  placeholder="in ethers"
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      agentBP: e.target.value,
                    })
                  }
                  value={agentDetails.agentBP}
                ></input>
              </div>
              <div className="mt-6">
                <p className="text-xl text-black font-semibold">Category</p>
                <input
                  type="number"
                  className="mt-2 px-5 w-full rounded-xl py-2 border border-black"
                  placeholder=""
                ></input>
              </div>
              <div className="mt-6">
                <p className="text-xl text-black font-semibold">
                  Allow to Update
                </p>
                <div className="mt-2">
                  <Badge colorScheme="red" className="mx-3">
                    no
                  </Badge>
                  <Switch
                    size="lg"
                    onChange={() => setAgentOpenFor(!agentOpenFor)}
                    colorScheme="orange"
                  />
                  <Badge colorScheme="green" className="mx-3">
                    yes
                  </Badge>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xl text-black font-semibold">Actions</p>
                <div className="mt-2 flex">
                  <div className="mx-3">
                    <p className="text-sm font-mono">Post on </p>
                    <div
                      className={` ${
                        tweet === true && "border-2 border-blue-500"
                      } border-2 border-black rounded-full px-3 py-2.5 w-12 mt-3 cursor-pointer`}
                      onClick={() => setTweet(!tweet)}
                    >
                      <FaTwitter
                        className={`${
                          tweet === true && "text-blue-500 text-2xl"
                        } text-black text-2xl`}
                      />
                    </div>
                  </div>
                  <div className="mx-3">
                    <p className="text-sm font-mono">Send</p>
                    <div
                      className={` ${
                        mail === true && "border-2 border-red-500"
                      } border-2 border-black rounded-full px-2.5 py-2.5 w-12 mt-3 cursor-pointer`}
                      onClick={() => setMail(!mail)}
                    >
                      <IoIosMail
                        className={`${
                          mail === true && "text-red-500 text-2xl text-center"
                        } text-black text-2xl text-center`}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-sm font-mono">Tools</p>
                  <div className="flex justify-between w-full mt-2">
                    <p className="text-md font-semibold">Image Generation</p>
                    <Switch
                      size="lg"
                      onChange={() => setImageGeneration(!imageGeneration)}
                      colorScheme="orange"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className="bg-orange-100">
            <button className="mx-auto px-10 py-2 bg-pink-200 border-b-4 text-black font-semibold text-xl border border-black rounded-xl">
              Save Configuration
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Create;
