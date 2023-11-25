import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Create the Assistant first
// NOTE : Actions and Function calling , add extra functions
// Files can be added for this assistant to add context
export const createAssistant = async (
  assistantName: string,
  assistantDesc: string,
  tools: any[],
  fileIds: []
): Promise<OpenAI.Beta.Assistants.Assistant | undefined> => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: assistantName,
      description: assistantDesc,
      model: "gpt-4-1106-preview",
      tools: tools, // can also pass extra functions
      file_ids: fileIds,
    });

    return assistant;
  } catch (error) {
    console.log(error);
  }
};

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

// 2. Create a thread for a user using a particular assistant
// store the thread Id for a particular user in some db
export const createThread = async (): Promise<
  OpenAI.Beta.Threads.Thread | undefined
> => {
  try {
    const thread = await openai.beta.threads.create();
    return thread;
  } catch (error) {
    console.log(error);
  }
};

// 3. Send Messages to these thread
export const createMessage = async (
  thread: OpenAI.Beta.Threads.Thread,
  messageContent: string,
  fileIds: any[]
): Promise<OpenAI.Beta.Threads.Messages.ThreadMessage | undefined> => {
  try {
    const threadMessages = await openai.beta.threads.messages.create(
      thread.id, // thread_id
      { role: "user", content: messageContent, file_ids: fileIds }
    );
    return threadMessages;
  } catch (error) {
    console.log(error);
  }
};

// 4. Run the thread, to perform the message
export const runThread = async (
  assistant: OpenAI.Beta.Assistants.Assistant,
  instructions: string
): Promise<OpenAI.Beta.Threads.Runs.Run | undefined> => {
  try {
    const run = await openai.beta.threads.runs.create("thread_abc123", {
      assistant_id: assistant.id,
      instructions: instructions,
    });
    return run;
  } catch (error) {
    console.log(error);
  }
};

// 5. Check the Run status , if actions needed , take the JSON response , and call the function from your side
export const checkRun = async (
  thread: OpenAI.Beta.Threads.Thread,
  runObj: OpenAI.Beta.Threads.Runs.Run
): Promise<OpenAI.Beta.Threads.Runs.Run | undefined> => {
  try {
    const run = await openai.beta.threads.runs.retrieve(thread.id, runObj.id);
    return run;
    // run.required_action?.submit_tool_outputs.tool_calls
    // If needs run , call the function and submit
  } catch (error) {
    console.log(error);
  }
};

// 6. Return the functions output to run
export const submitToolOuput = async (
  thread: OpenAI.Beta.Threads.Thread,
  runObj: OpenAI.Beta.Threads.Runs.Run,
  toolOutputs: { tool_call_id: string; output: string }[]
): Promise<OpenAI.Beta.Threads.Runs.Run | undefined> => {
  try {
    const run = await openai.beta.threads.runs.submitToolOutputs(
      thread.id,
      runObj.id,
      {
        tool_outputs: toolOutputs,
      }
    );
    return run;
  } catch (error) {
    console.log(error);
  }
};

export const getThreadMessage = async (
  thread: OpenAI.Beta.Threads.Thread
): Promise<OpenAI.Beta.Threads.Messages.ThreadMessagesPage | undefined> => {
  try {
    const messages = await openai.beta.threads.messages.list(thread.id);
    return messages;
  } catch (error) {
    console.log(error);
  }
};
