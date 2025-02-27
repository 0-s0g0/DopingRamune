import Image from "next/image";
import styles from "./../style/mypage.module.css"
import Header from "./userheader";
import UserPoint from "./userpoint";
import { FC } from "react";

interface UserdataProps{
    user_id: string;
    total_mypoint:number;
    total_cherrpoint:number;


}

const Userdata: FC<UserdataProps> = ({
    user_id,
    total_mypoint,
    total_cherrpoint,
}) => {
    return(
                <div className={styles.alignment}>
                    <Header
                        user_id={user_id} 
                        alt={user_id} />
                    <UserPoint
                        total_mypoint={total_mypoint}
                        total_cherrpoint={total_cherrpoint} 
                    />
                    </div>
                    

    )
}

export default Userdata;