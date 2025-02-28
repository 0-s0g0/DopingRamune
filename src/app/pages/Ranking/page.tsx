"use client";

import { useState, useEffect } from "react";
import ListBlock from "./components/ListBlock/listBlock";
import styles from "./page.module.css";
import Tab from "./components/tab/tab";

// 型定義をここに書いてもOK (または別ファイルに分けても良い)
type ApiUser = {
  id: number;
  user_id: string;
  possession_point: number;
  assignment_point: number;
  cheer_point: number;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  users: ApiUser[];
};

export default function Ranking() {
  const [activeIndex, setActiveIndex] = useState(0);

  // ランキング表示用の二次元配列
  const [rankingData, setRankingData] = useState<
    Array<
      Array<{
        rank_num: number;
        point_count: number;
        file_name: string;
        name: string;
        text: string;
      }>
    >
  >([
    [], // タブ0用 (APIから取得)
    [
      // タブ1用（仮の固定データ）
      {
        rank_num: 1,
        point_count: 12000,
        file_name: "user_id.test",
        name: "Company A",
        text: "Company Aの詳細情報1",
      },
      {
        rank_num: 2,
        point_count: 8000,
        file_name: "user_id.test",
        name: "Company A",
        text: "Company Aの詳細情報2",
      },
      {
        rank_num: 3,
        point_count: 6000,
        file_name: "user_id.test",
        name: "Company A",
        text: "Company Aの詳細情報3",
      },
    ],
  ]);

  useEffect(() => {
    // /pages/Ranking にリクエストし、レスポンス型を ApiResponse だと明示
    fetch("/api/ranking")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fetch error");
        }
        // 「(data: ApiResponse) => {...}」と書いて data.users を型推論させる
        return res.json() as Promise<ApiResponse>;
      })
      .then((data: ApiResponse) => {
        // data.users を rankingData[0] に変換
        if (data.users && Array.isArray(data.users)) {
          const mapped = data.users.map((user, index) => {
            return {
              rank_num: index + 1,
              point_count: user.possession_point, // possession_pointをpoint_countに
              file_name: "/images/user/user_id.test.png",
              name: user.user_id,
              text: `所持ポイント: ${user.possession_point}`,
            };
          });

          // タブ0に反映
          setRankingData((prev) => {
            const newData = [...prev];
            newData[0] = mapped;
            return newData;
          });
        }
      })
      .catch((err) => {
        console.error("Ranking fetch error:", err);
      });
  }, []);

  return (
    <div className={styles.ranking}>
      <div className={styles.tab}>
        <Tab activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </div>
      <div className={styles.wrapper}>
        {rankingData[activeIndex].map((data, index) => (
          <ListBlock key={index} {...data} />
        ))}
      </div>
    </div>
  );
}