import { FC } from "react";
import styles from "./user.module.css"
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingHeart,faBullhorn} from "@fortawesome/free-solid-svg-icons";



interface UserPointProps{
    total_mypoint: number;
    total_cherrpoint: number;
}

const UserPoint: FC<UserPointProps> = ({
    total_mypoint,
    total_cherrpoint,
}) => {
    return(
        <div className={styles.pointback}>
            <div className={styles.item}>
                <div className={styles.title}><FontAwesomeIcon className={styles.icon2} icon={faHandHoldingHeart} />保有Point</div>
                <div className={styles.number}>{total_mypoint}</div>
            </div>
            <div className={styles.item}>
                <div className={styles.title}><FontAwesomeIcon className={styles.icon2} icon={faBullhorn} />応援Point</div>
                <div className={styles.number}>{total_cherrpoint}</div>
            </div>
        </div>
    )
}

export default UserPoint