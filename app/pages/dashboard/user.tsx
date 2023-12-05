import { getCreator, getUser } from "@/utils/graphFunctions";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";

const user = () => {
  const { address: userAccount } = useAccount();

  // display the User Data like the agents they have subscribed too
  // NOTE : Could also add more start for the agents , but perhaps not need as of now
  const getUserData = async () => {
    if (!userAccount) {
      console.log("User Account not found");
      return;
    }

    const data = await getUser(userAccount);
    console.log(data);
  };

  useEffect(() => {
    if (userAccount) {
      getUserData();
    }
  }, [userAccount]);

  return <div>user</div>;
};

export default user;
