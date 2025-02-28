"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Userdata from "./components/userdata";

type ApiUser = {
  id: number;
  user_id: string;
  possession_point: number;
  assignment_point: number;
  cheer_point: number;
  created_at: string;
  updated_at: string;
};

type ApiPost = {
  id: number;
  user_id: string;
  post_id: number;
  picture: string;
  text: string;
  assignment_point: number;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  posts: ApiPost[];
  user: ApiUser[];
};

export default function Mypage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id") ?? "";

  // ユーザーデータの state
  const [userData, setUserData] = useState({
    possession_point: 0,
    cheer_point: 0,
  });
  // 投稿情報の state（ApiPost の配列）
  const [postsData, setPostsData] = useState<ApiPost[]>([]);

  useEffect(() => {
    // APIエンドポイントにuser_idをクエリパラメータとして渡す
    fetch(`/api/users?user_id=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("ネットワークエラー");
        }
        return response.json() as Promise<ApiResponse>;
      })
      .then((data: ApiResponse) => {
        // ユーザーデータは data.user の最初の要素を利用
        if (data.user && data.user.length > 0) {
          const userInfo = data.user[0];
          setUserData({
            possession_point: userInfo.possession_point,
            cheer_point: userInfo.cheer_point,
          });
        }
        // posts データがあれば state に保存
        if (data.posts && Array.isArray(data.posts)) {
          setPostsData(data.posts);
        }
      })
      .catch((error) => {
        console.error("ユーザーデータ取得時のエラー:", error);
      });
  }, [userId]);

  return (
    <div className="mt-8 w-full flex flex-col gap-8 justify-center items-start">
      <Userdata 
        user_id={userId}
        total_mypoint={userData.possession_point}
        total_cherrpoint={userData.cheer_point}
      />
      {/* ここで postsData を利用して投稿情報を表示する */}

      <div className="w-full max-w-2xl">
        {postsData.map((post) => (
          <div key={post.id} className="border p-4 my-2">
            <p className="text-xl">
            <strong className="text-2xl">投稿ID:</strong> <span className="text-2xl">{post.id}</span>
            </p>
            <p className="text-xl">
            <strong className="text-2xl">内容:</strong> <span className="text-2xl">{post.text}</span>
            </p>
            <p className="text-xl">
            <strong className="text-2xl">応援ポイント:</strong> <span className="text-2xl">{post.assignment_point}</span>
            </p>
            <p className="text-xl">
              <strong className="text-2xl">投稿日時:</strong>{" "}
              <span className="text-2xl">{new Date(post.created_at).toLocaleString()}</span>
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
