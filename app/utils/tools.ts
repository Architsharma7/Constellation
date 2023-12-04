import { handleSendEmail } from "./email";

// via twitter API
const createTweet = () => {};

// via DALL e
const generateImage = () => {};

const availableFunctions = {
  create_email: handleSendEmail,
  tweet_ads: createTweet,
  generate_image: generateImage,
};
