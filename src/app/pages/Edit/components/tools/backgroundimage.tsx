import Link from "next/link";
import styles from './../../styles/edit.module.css'

interface BackgroundImage {
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BackgroundImage: React.FC<BackgroundImage> = ({
    handleBackgroundUpload,
  }) => {
    return (
        <div className={styles.toolGroup}>
          <h3>背景</h3>
          <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
        </div>
    );
  };
  
  export default BackgroundImage;
