import Lottie from "lottie-react";
import blocks from "./animation.json";

export default function HeroAnimation() {
  return (
    <div className="flex flex-col items-center w-50 h-50">
      {" "}
      <Lottie animationData={blocks} />
    </div>
  );
}
