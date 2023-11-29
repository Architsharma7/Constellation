import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [fileInput, setFileInput] = useState<any>(null);

  const handleFormSubmit = async () => {
    try {
      console.log(fileInput);
      let formdata = new FormData();
      await formdata.append("image",fileInput)
      const response = await axios.post("/api/twitter/callback", {data : formdata}, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <button onClick={() => router.push("/api/twitter/authenticate")}>
        post
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFileInput(e.target.files[0])}
      />
      <button onClick={() => handleFormSubmit()}>submit</button>
    </div>
  );
}
