import Lottie from "lottie-react";
import blocks from "./animation.json";
import ai from "./AI.json";
import rocket from "./Rocket.json";

export default function HeroAnimation() {
  return (
    <div className="flex justify-center items-center ">
      <div
        style={{ height: "500px", width: "500px" }}
        className="flex flex-col items-center justify-center "
      >
        <Lottie animationData={rocket} />
      </div>
      <div
        style={{ height: "500px", width: "500px" }}
        className="flex flex-col items-center justify-center "
      >
        <Lottie animationData={ai} />
      </div>
    </div>
  );
}
