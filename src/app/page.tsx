"use client";

import { redirect } from "next/navigation";

export default function Start() {
  //遷移先指定
  const handleRedirect = () => {
    redirect("/pages/Timeline");
  };

  return (
    <div className="text-center flex flex-col justify-center ">
      <div
        className="fixed top-0 w-screen sm:w-[420px] min-h-svh bg-pink-vivid z-[1000] text-white"
        onClick={handleRedirect}
      >
        <div className="mt-[40vh] text-lg  font-bold ">
          <h1 className="flex justify-center items-end text-6xl mt-1 mb-2">
            DreamShare
          </h1>
        </div>

        <h1 className="mt-[20vh] font-bold text-2xl text-yellow animate-bounce">
          タップで始める
        </h1>
      </div>
    </div>
  );
}
