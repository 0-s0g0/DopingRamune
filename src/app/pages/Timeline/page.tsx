"use client";

import { useEffect, useState } from "react";
import Post from "@/app/pages/Timeline/components/post/post";

const TimeLine = () => {
  const [userId] = useState(window.localStorage.getItem("username"));
  // 投稿データを保持する状態を定義
  interface PostType {
    id: number;
    user_id: string;
    picture: string;
    text: string;
    assignment_point: number;
  }

  const [posts, setPosts] = useState<PostType[]>([]);

  // コンポーネントのマウント時にバックエンドからデータを取得
  useEffect(() => {
    fetch(`/pages/Timeline/users?user_id=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("ネットワークレスポンスが正常ではありません");
        }
        return response.json();
      })
      .then((data) => {
        // 取得したデータを state にセット
        setPosts(data);
      })
      .catch((error) => {
        console.error("投稿の取得に失敗しました:", error);
      });
  }, []);

  return (
    <div className="mt-8 w-full flex flex-col gap-8 justify-center items-center">
      {posts.map((post) => (
        <Post
          key={post.id}
          user_id={post.user_id}
          post_id={post.id} // Go の構造体ではIDフィールドが使えます
          picture={post.picture}
          text={post.text}
          like_count={post.assignment_point} // ここはバックエンドの assignment_point をいいね数として利用
          comment_count={0} // コメント数があればバックエンド側で返すように変更してください
        />
      ))}
    </div>
  );
};

export default TimeLine;
