"use client"

import { useState } from "react"
import ListBlock from "./components/ListBlock/listBlock"
import styles from "./page.module.css"
import Tab from "./components/tab/tab"

export default function Ranking(){
    const [activeIndex, setActiveIndex] = useState(0)

    const rankingData = [
        [
            { rank_num: 1, point_count: 9999, file_name: "user_id.test", name: "PR TIMES", text: "PR TIMESの詳細情報1" },
            { rank_num: 2, point_count: 7000, file_name: "user_id.test", name: "PR TIMES", text: "PR TIMESの詳細情報2" },
            { rank_num: 3, point_count: 5000, file_name: "user_id.test", name: "PR TIMES", text: "PR TIMESの詳細情報3" }
        ],
        [
            { rank_num: 1, point_count: 12000, file_name: "user_id.test", name: "Company A", text: "Company Aの詳細情報1" },
            { rank_num: 2, point_count: 8000, file_name: "user_id.test", name: "Company A", text: "Company Aの詳細情報2" },
            { rank_num: 3, point_count: 6000, file_name: "user_id.test", name: "Company A", text: "Company Aの詳細情報3" }
        ]
    ];

    return(
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
    )
}