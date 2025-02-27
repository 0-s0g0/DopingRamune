"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Start() {
  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  // 「タップで始める」が押されたとき
  const handleTap = () => {
    setShowInput(true);
  };

  // ユーザー名が入力されたとき
  const handleSubmit = () => {
    if (username) {
      router.push(`/pages/Timeline?username=${encodeURIComponent(username)}`);
    } else {
      alert("ユーザー名を入力してください");
    }
  };

  // 花びらをランダムに生成する
  useEffect(() => {
    const sakuraContainer = document.getElementById("sakura-container");

    for (let i = 0; i < 100; i++) {
      const sakura = document.createElement("div");
      sakura.classList.add("sakura");
      sakura.style.left = `${Math.random() * 100}vw`;
      sakura.style.animationDuration = `${Math.random() * 5 + 5}s`;
      sakura.style.animationDelay = `${Math.random() * 5}s`;
      sakuraContainer?.appendChild(sakura);
    }
  }, []);

  return (
    <div className="text-center flex flex-col justify-center">
      <div
        id="sakura-container"
        className="fixed top-0 w-screen sm:w-[420px] min-h-svh bg-[url('/images/back/sakuraback.png')] bg-cover z-[1000] text-white"
      >
        <div className="mt-[40vh] text-lg font-bold">
          <h1 className="flex justify-center items-end text-6xl mt-1 mb-2">
            DreamShare
          </h1>
        </div>

        {!showInput ? (
          <h1
            className="mt-[20vh] font-bold text-2xl text-yellow animate-bounce cursor-pointer"
            onClick={handleTap}
          >
            タップで始める
          </h1>
        ) : (
          <div className="mt-[20vh] flex flex-col items-center">
            <input
              type="text"
              placeholder="ユーザー名を入力"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-black p-2 rounded"
            />
            <button
              onClick={handleSubmit}
              className="mt-4 text-white p-2 rounded"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
