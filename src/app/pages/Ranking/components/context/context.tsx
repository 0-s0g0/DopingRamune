import Image from "next/image"
import styles from "./context.module.css"
import { FC } from "react";

interface ListBlockProps{
    file_name: string;
    name: string;
    text: string;
}

const Context: FC<ListBlockProps> = ({
    file_name,
    name,
    text
}) => {
    return(
        <div className={styles.wrapper}>
            <div className={styles.thumbnail}>
                <Image
                    src={`/images/user/user_id.test.png`}
                    width={1000}
                    height={1000}
                    alt={name} />
            </div>
            <div className={styles.name}>
                <h3>{name}</h3>
            </div>
            {/* <div className={styles.text}>
                <p>{text}</p>
            </div> */}
        </div>
    )
}

export default Context