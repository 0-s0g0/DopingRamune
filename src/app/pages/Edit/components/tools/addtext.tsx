import React from 'react';
import styles from './../../styles/edit.module.css';
import { ShapeType } from './../../page';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont} from "@fortawesome/free-solid-svg-icons";


interface AddtextProps {

  addText: () => void;
  addShape: (shapeType: ShapeType) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Addtext: React.FC<AddtextProps> = ({
  addText,
  addShape,
  handleImageUpload,
}) => {
  return (
      <div className={styles.toolGroup}>
        <h3>オブジェクト追加</h3>
        <div className={styles.addGroup}>
            <div className={styles.maintext}>テキスト追加</div>
            <button onClick={addText} className={styles.objectbutton}>テキストボックス</button>
            <div className={styles.maintext}>図形追加</div>
            <div className={styles.rectanglebox}>
                <button className={styles.objectbutton2} onClick={() => addShape('rectangle')}>■:四角形</button>
                <button className={styles.objectbutton2} onClick={() => addShape('circle')}>●：円形</button>
                <button className={styles.objectbutton2} onClick={() => addShape('triangle')}>▲：三角形</button>
            </div>
            <div className={styles.maintext}>画像追加</div>
            <input className={styles.objectbutton} type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>
      
  );
};

export default Addtext;