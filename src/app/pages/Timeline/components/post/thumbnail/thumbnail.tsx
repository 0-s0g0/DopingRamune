import { FC } from "react"
import Image from "next/image"
import styles from "./thumbnail.module.css"

interface ThumbnailProps{
    file_name: string;
    alt: string
}

const Thumbnail: FC<ThumbnailProps> = ({
    file_name,
    alt
}) => {
    return(
        <div className={styles.thumbnail}>
            <Image
                src={`/images/post/${file_name}.png`}
                width={600}
                height={600}
                alt={alt}
            />
        </div>
    )
}

export default Thumbnail