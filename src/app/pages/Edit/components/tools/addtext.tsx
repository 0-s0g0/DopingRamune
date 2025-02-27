import React from 'react';
import styles from './../../styles/edit.module.css';
import { ShapeType } from './../../page';

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
        <button onClick={addText}>テキスト追加</button>
        <button onClick={() => addShape('rectangle')}>四角形追加</button>
        <button onClick={() => addShape('circle')}>円追加</button>
        <button onClick={() => addShape('triangle')}>三角形追加</button>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      
  );
};

export default Addtext;