import React from 'react';
import styles from './../styles/objectlist.module.css';
import { EditorObject } from '../page';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp,faAngleDown } from "@fortawesome/free-solid-svg-icons";


interface ObjectListProps {
  objects: EditorObject[];
  selectedObject: string | null;
  setSelectedObject: (id: string) => void;
  moveObjectUp: (id: string) => void;
  moveObjectDown: (id: string) => void;
}

const ObjectList: React.FC<ObjectListProps> = ({
  objects,
  selectedObject,
  setSelectedObject,
  moveObjectUp,
  moveObjectDown
}) => {

  // オブジェクト種類の表示名を取得
  const getObjectTypeName = (obj: EditorObject): string => {
    if (obj.type === 'text') return 'テキスト';
    if (obj.type === 'image') return '画像';
    if (obj.type === 'shape') {
      if (obj.shapeType === 'rectangle') return '四角形';
      if (obj.shapeType === 'circle') return '円';
      if (obj.shapeType === 'triangle') return '三角形';
    }
    return 'オブジェクト';
  };

  return (
    <div className={styles.objectListContainer}>
      <div className={styles.objectTitle}>
        オブジェクト一覧
        </div>
      <div className={styles.objectList}>
        {[...objects]
          .sort((a, b) => b.zIndex - a.zIndex) // zIndexの降順（大きい値＝前面が上）
          .map((obj) => (
            <div 
              key={obj.id} 
              className={`${styles.objectListItem} ${selectedObject === obj.id ? styles.selectedListItem : ''}`}
              onClick={() => setSelectedObject(obj.id)}
            >
              <div className={styles.objectTypeIcon}>
                {obj.type === 'text' && 'T'}
                {obj.type === 'image' && '🖼️'}
                {obj.type === 'shape' && obj.shapeType === 'rectangle' && '■'}
                {obj.type === 'shape' && obj.shapeType === 'circle' && '●'}
                {obj.type === 'shape' && obj.shapeType === 'triangle' && '▲'}
              </div>
              <div className={styles.objectName}>
                {obj.name || getObjectTypeName(obj)}
              </div>
              <div className={styles.objectListButtons}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    moveObjectUp(obj.id);
                  }}
                  disabled={obj.zIndex === Math.max(...objects.map(o => o.zIndex))}
                  title="上へ移動（前面へ）"
                >
                  <FontAwesomeIcon icon={faAngleUp} className={styles.icon}/>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    moveObjectDown(obj.id);
                  }}
                  disabled={obj.zIndex === Math.min(...objects.map(o => o.zIndex))}
                  title="下へ移動（背面へ）"
                >
                  <FontAwesomeIcon icon={faAngleDown}  className={styles.icon}/>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ObjectList;