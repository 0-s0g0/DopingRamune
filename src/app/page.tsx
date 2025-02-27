"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Start() {
  //遷移先指定
  const handleRedirect = () => {
    redirect("/pages/Timeline");
  };

  // 花びらをランダムに生成する
  useEffect(() => {
    const sakuraContainer = document.getElementById("sakura-container");

    for (let i = 0; i < 100; i++) {
      const sakura = document.createElement("div");
      sakura.classList.add("sakura");
      sakura.style.left = `${Math.random() * 100}vw`;  // 横位置をランダムに
      sakura.style.animationDuration = `${Math.random() * 5 + 5}s`; // アニメーションの時間もランダムに
      sakura.style.animationDelay = `${Math.random() * 5}s`; // 遅延もランダムに
      sakuraContainer?.appendChild(sakura);
    }
  }, []);

  return (
    <div className="text-center flex flex-col justify-center">
      <div
        id="sakura-container"
        className="fixed top-0 w-screen sm:w-[420px] min-h-svh  bg-[url('/images/back/sakuraback.png')] bg-cover z-[1000] text-white"
        onClick={handleRedirect}
      >
        <div className="mt-[40vh] text-lg font-bold">
          <h1 className="flex justify-center items-end text-6xl mt-1 mb-2">DreamShare</h1>
        </div>

        <h1 className="mt-[20vh] font-bold text-2xl text-yellow animate-bounce">
          タップで始める
        </h1>
      </div>
    </div>
  );
}
