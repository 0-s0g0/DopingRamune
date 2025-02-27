import Image from "next/image";
import styles from "./post.module.css"
import Icon from "./icon/icon";
import Thumbnail from "./thumbnail/thumbnail";
import Header from "./header/header";
import { FC } from "react";

interface PostProps{
    user_id: string;
    post_id: number;
    text: string;
    like_count: number;
    comment_count: number;
}

const Post: FC<PostProps> = ({
    user_id,
    post_id,
    text,
    like_count,
    comment_count,
}) => {
    const thumbnail_file_name = String(post_id) + user_id;
    console.log(thumbnail_file_name)
    return(
        <div className={styles.post}>
            <div className={styles.wrapper}>
                <div className={styles.alignment}>
                    <Header
                        user_id={user_id} 
                        alt={user_id} />
                    </div>
                <article>
                    <div className={styles.thumbnail}>
                        <Thumbnail
                            file_name={String(thumbnail_file_name)}
                            alt={user_id} />
                        </div>
                    <div className={`${styles.context} ${styles.alignment}`}>
                        <div className={styles.icon_wrapper}>
                            <Icon value="like">{String(like_count)}</Icon>
                            <Icon value="comment">{String(comment_count)}</Icon>
                        </div>
                        <div className={styles.text}>
                            <p>{text}</p>
                        </div>
                        <div className={styles.reply}></div>
                    </div>
                </article>
            </div>
        </div>
    )
}

export default Post;