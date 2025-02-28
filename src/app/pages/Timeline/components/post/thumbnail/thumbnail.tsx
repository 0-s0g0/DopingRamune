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
    console.log(file_name);
    return(
        <div className={styles.thumbnail}>
            <Image
                src={`/images/${file_name}`}
                width={600}
                height={600}
                alt={alt}
            />
        </div>
    )
}

export default Thumbnail