import { getCreator } from "@/utils/graphFunctions";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";

const creator = () => {
  const { address: userAccount } = useAccount();

  // display the Creator Data like rounds they have won , and the agents they have created
  // NOTE : Could also add more start for the agents , but perhaps not need as of now
  const getCreatorData = async () => {
    if (!userAccount) {
      console.log("User Account not found");
      return;
    }

    const data = await getCreator(userAccount);
    console.log(data);
  };

  useEffect(() => {
    if (userAccount) {
      getCreatorData();
    }
  }, [userAccount]);
  return <div>creator</div>;
};

export default creator;
