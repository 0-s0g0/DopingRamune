import { FC } from "react";
import styles from "./header.module.css";
import Image from "next/image";

interface HeaderProps {
    user_id: string;
    alt: string;
}

const Header: FC<HeaderProps> = ({ user_id, alt }) => {
return (
    <div className={styles.header}>
    <div className={styles.icon}>
        <Image
        //   src={`/images/user/${user_id}.png`}
            src={`/images/user/user_id.test.png`}
            width={32}
            height={32}
            alt={alt}
        />
    </div>
    <div>
        <div className={styles.user_name}>
        <h4>{user_id}</h4>
        </div>
    </div>
    </div>
);
};

export default Header;
