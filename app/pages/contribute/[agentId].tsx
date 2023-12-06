import { getAgent } from "@/utils/graphFunctions";
import { getAssitant } from "@/utils/openAIfunctions";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const contribute = () => {
  const router = useRouter();
  const _agentId = router.query.agentId;

  const [inputPrompt, setInputPrompt] = useState<string>();
  const [assistantID, setAssistantID] = useState<string>();
  const [agentDetails, setAgentDetails] = useState<{
    agentName: string;
    agentDesc: string;
    agentInstruc: string;
    agentPrice: string;
    agentBP: string;
    agentCategory: string;
    agentImage: string | undefined;
  }>({
    agentName: "",
    agentDesc: "",
    agentPrice: "",
    agentInstruc: "",
    agentBP: "",
    agentCategory: "",
    agentImage: undefined,
  });

  useEffect(() => {
    if (_agentId) {
      if (typeof _agentId == "string") {
        getAgentData(_agentId);
      }
    }
  }, [_agentId]);

  const [threadID, setThreadID] = useState<string>();
  const [openToContribution, setOpenToContribution] = useState<boolean>(false);
  const [file, setFile] = useState("");
  const [codeInterpreter, setCodeInterpreter] = useState<boolean>(false);
  const [fileInterpreter, setFileInterpreter] = useState<boolean>(false);
  const [imageGeneration, setImageGeneration] = useState<boolean>(false);

  const getAgentData = async (agentId: string) => {
    if (!agentId) {
      console.log("No agent Id found");
      return;
    }

    // TODO Convert AgentID to Bytes form
    const agentIdBytes = agentId;
    console.log(agentIdBytes);
    const agentGraphData = (await getAgent(agentIdBytes)).agent;
    console.log(agentGraphData);

    // other partial from openAI
    // TODO : update the assistantID we get from graphQl
    // const assitantData = await getAssistant(agentGraphData?.assistantId);
    const assitantData: any = await getAssitant(
      "asst_4YruN6LyHritMXIFQX0NGmht"
    );

    setAgentDetails({
      ...agentDetails,
      agentName: assitantData?.name,
      agentDesc: assitantData?.description,
      agentInstruc: assitantData?.instructions,
      agentCategory: agentGraphData?.agentGraphData,
      agentPrice: agentGraphData?.keyPrice,
      agentBP: agentGraphData?.basisPoint,
    });
    console.log(assitantData);
  };

  const getTools = (): any[] => {
    let tools: any[] = [];

    if (codeInterpreter) {
      tools.push({
        type: "code_interpreter",
      });
    }

    if (fileInterpreter) {
      tools.push({
        type: "retrieval",
      });
    }

    if (imageGeneration) {
      tools.push({
        type: "function",
        function: {
          name: "generate_image",
          description:
            "To generate Image using a prompt with the help of Dall-E and return an DALL-e response",
          parameters: {
            type: "object",
            properties: {
              imagePrompt: {
                type: "string",
                description: "prompt for Image creation via Dall-e ",
              },
            },
            required: ["imagePrompt"],
          },
        },
      });
    }

    return tools;
  };

  const createAssistant = () => {
    try {
      console.log("creating Assistant... Calling OpenAI");
      if (
        agentDetails.agentInstruc == "" &&
        agentDetails.agentDesc == "" &&
        agentDetails.agentName == ""
      ) {
        console.log("Agent Details missing");
        return;
      }
      const tools = getTools();
      fetch("/api/openai/createAssistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantName: agentDetails.agentName,
          assistantDesc: agentDetails.agentDesc,
          assistantInstruc: agentDetails.agentInstruc,
          tools: tools,
          fileIds: [],
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
          setAssistantID(data?.id);

          // peform the tx
          // do Agent V registeration

          // createAgent(agentId) // firebase for the new AgentID
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const createAndRunThread = async () => {
    try {
      console.log("Creating & running thread... Calling OpenAI");
      if (!assistantID) {
        console.log("Agent Details missing");
        return;
      }
      if (!inputPrompt) {
        console.log("Input prompt missing");
        return;
      }
      await fetch("/api/openai/createAndRunThread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageContent: inputPrompt,
          assistantId: assistantID,
          instructions: "",
          fileIds: [],
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
          setThreadID(data?.id);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    try {
      console.log("Sending msg... Calling OpenAI");
      if (!assistantID) {
        console.log("Agent Details missing");
        return;
      }
      if (!inputPrompt) {
        console.log("Input prompt missing");
        return;
      }

      if (!threadID) {
        console.log("Thread id missing...");
        return;
      }

      fetch("/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadID: threadID,
          messageContent: inputPrompt,
          fileIds: [],
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const runThread = async () => {
    try {
      console.log("running thread... Calling OpenAI");
      if (!assistantID) {
        console.log("Agent Details missing");
        return;
      }

      if (!threadID) {
        console.log("thread Details missing");
        return;
      }

      await fetch("/api/openai/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId: threadID,
          assistantId: assistantID,
          instructions: "",
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // create new assistant Version
  // register Agent With contract
  // process the firebase call
  return <div>contribute</div>;
};

export default contribute;
