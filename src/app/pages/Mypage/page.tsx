"use client";

import { useState, useEffect } from "react";
import Userdata from "./components/userdata";

const Mypage = () => {
  const [userId] = useState("user_id.test");
  // 初期値はpropsの値と同じものを設定しておく（APIからの更新を待つ）
  const [userData, setUserData] = useState({
    total_mypoint: 200,
    total_cherrpoint: 100,
  });

  useEffect(() => {
    // APIエンドポイントにuser_idをクエリパラメータとして渡す
    fetch(`/api/users?user_id=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("ネットワークエラー");
        }
        return response.json();
      })
      .then((data) => {
        // APIから返ってきたデータに合わせてstateを更新
        setUserData({
          total_mypoint: data.total_mypoint,
          total_cherrpoint: data.total_cherrpoint,
        });
      })
      .catch((error) => {
        console.error("ユーザーデータ取得時のエラー:", error);
      });
  }, [userId]);

  return (
    <div className="mt-8 w-full flex flex-col gap-8 justify-center items-center">
      <Userdata 
        user_id={userId}
        total_mypoint={userData.total_mypoint}
        total_cherrpoint={userData.total_cherrpoint}
      />
    </div>
  );
};

export default Mypage;
