import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Create the Assistant first
// NOTE : Actions and Function calling , add extra functions
// Files can be added for this assistant to add context
const createAssistant = async () => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Data visualizer",
      description:
        "You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.",
      model: "gpt-4-1106-preview",
      tools: [{ type: "code_interpreter" }], // can also pass extra functions

      //   file_ids: [file.id],
    });

    // {
    //     type: "function",
    //     function: {
    //       name: "get_current_weather",
    //       description: "Get the current weather in a given location",
    //       parameters: {
    //         type: "object",
    //         properties: {
    //           location: {
    //             type: "string",
    //             description: "The city and state, e.g. San Francisco, CA",
    //           },
    //           unit: { type: "string", enum: ["celsius", "fahrenheit"] },
    //         },
    //         required: ["location"],
    //       },
    //     },
    //   },
  } catch (error) {
    console.log(error);
  }
};

// 2. Create a thread for a user using a particular assistant
const createThread = async () => {
  try {
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content:
            "Create 3 data visualizations based on the trends in this file.",
          //   file_ids: [file.id],
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};

// 3. Send Messages to these thread
const createMessage = async () => {
  try {
    const threadMessages = await openai.beta.threads.messages.create(
      "thread_abc123", // thread_id
      { role: "user", content: "How does AI work? Explain it in simple terms." }
    );
  } catch (error) {
    console.log(error);
  }
};

// 4. Run the thread
const runThread = async () => {
  try {
    const run = await openai.beta.threads.runs.create("thread_abc123", {
      assistant_id: "asst_abc123",
      instructions:
        "Please address the user as Jane Doe. The user has a premium account.",
    });
  } catch (error) {
    console.log(error);
  }
};

// 5. Check the Run status , if actions needed , take the JSON response , and call the function from your side
const checkRun = async () => {
  try {
    const run = await openai.beta.threads.runs.retrieve(
      "thread_abc123",
      "run_abc123"
    );
    // run.required_action?.submit_tool_outputs.tool_calls
    // If needs run , call the function and submit
  } catch (error) {
    console.log(error);
  }
};

// 6. Return the functions output to run
const submitToolOuput = async () => {
  try {
    const run = await openai.beta.threads.runs.submitToolOutputs(
      "thread_abc123",
      "run_abc123",
      {
        tool_outputs: [
          {
            tool_call_id: "call_abc123",
            output: "28C",
          },
        ],
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getThreadMessage = async () => {
  try {
    const messages = await openai.beta.threads.messages.list("thread_abc123");
  } catch (error) {
    console.log(error);
  }
};
