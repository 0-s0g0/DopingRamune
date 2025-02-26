import { FC } from "react";
import styles from "./rank.module.css"

interface RankProps{
    rank_num: number;
    point_count: number;
}

const Rank: FC<RankProps> = ({
    rank_num,
    point_count,
}) => {
    return(
        <div className={styles.rank}>
            <p>{rank_num}位:<span>{point_count}pt</span></p>
        </div>
    )
}


export default Rank