import React from 'react';
import Markdown from 'react-markdown';
// Other imports if needed

interface ThreadMessage {
  content: { type: string; text: { value: string } }[];
  role: string;
}

interface UserAgentsProps {
  threadMessages: ThreadMessage[];
}

export const ThreadMessagesMarkdown: React.FC<UserAgentsProps> = ({ threadMessages }) => {
  return (
    <div>
      {threadMessages &&
        threadMessages
          .slice()
          .reverse()
          .map((message, index) => {
            const isUser = message.role === "user";
            const messageContent = message.content[0]?.text;
            let messageContentValue;
            if(isUser){
              messageContentValue = "### User: " + messageContent?.value
            }else{
              messageContentValue = "### Agent: " + messageContent?.value
              messageContentValue = messageContentValue.replace("```", "\n \n ### Code : \n \n ```");
            }
            return (
              <div
                key={index}
                className={`flex flex-col items-center ${isUser ? 'mb-3' : 'mb-10'} ${isUser ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 mb-10 ${isUser ? 'bg-yellow-100 border border-yellow-300' : 'bg-blue-100 border border-blue-300'}`}
                >
                  <Markdown className="text-md font-semibold">
                    {messageContentValue}
                  </Markdown>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ThreadMessagesMarkdown;
