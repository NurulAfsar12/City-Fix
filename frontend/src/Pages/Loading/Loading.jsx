import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        className="w-64 h-64"
      />
    </div>
  );
};

export default Loading;
