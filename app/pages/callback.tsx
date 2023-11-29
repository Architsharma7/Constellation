import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.state && router.query.code) {
      handleCallback(router.query);
    }
  }, [router.query]);

  const handleCallback = async (query: any) => {
    try {
      console.log(query);
      await fetch("/api/twitter/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });
    } catch (error) {
      console.log(error);
    }
  };
  return <div>
   redirecting ...
  </div>;
};

export default Callback;
