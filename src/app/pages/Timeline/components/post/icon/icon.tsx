import { FC } from "react"
import styles from "./icon.module.css"
import icon_json from "./icon.json"

interface IconProps{
    value: string;
    children: React.ReactNode;
}

const Icon: FC<IconProps> = ({
    value,
    children,
}) => {
    const matchedIcon = icon_json.find(icon => icon.value === value);
    return(
        <div className={styles.icon}>
            <div className={styles.icon_box}>
                {matchedIcon ? (
                        // JSONのコードを表示
                        <div dangerouslySetInnerHTML={{ __html: matchedIcon.code }} />
                    ) : (
                        // デフォルトのアイコン
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                        <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path>
                    </svg>
                )} </div>
            <div className={styles.icon_data}>
                <p>{children}</p>
            </div>
        </div>
    )
}

export default Icon;