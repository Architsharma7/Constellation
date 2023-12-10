import { handleSendEmail } from "./email";

// via twitter API
const createTweet = (tweetContent: string, tweetImage: string) => {};

// via DALL e
const generateImage = async (imagePrompt: string) => {
  try {
    console.log("Submitting too Output... Calling OpenAI");

    if (!imagePrompt) {
      console.log("thread Details missing");
      return;
    }

    const data = await fetch("/api/openai/createImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: imagePrompt,
      }),
    })
      .then(async (res) => {
        console.log(res);
        const data = await res.json();
        console.log(data);
        const finalData = data.data[0].url;
        return finalData;
      })
      .catch((err) => {
        console.log(err);
      });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export { createTweet, generateImage, handleSendEmail };
