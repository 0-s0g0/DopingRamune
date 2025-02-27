import React from 'react';
import styles from '../styles/propertypannel.module.css';
import { EditorObject } from '../page';

interface PropertyPanelProps {
  selectedObject: string;
  objects: EditorObject[];
  handlePropertyChange: (id: string, property: string, value: any) => void;
  bringToFront: (id: string) => void;
  moveObjectUp: (id: string) => void;
  moveObjectDown: (id: string) => void;
  sendToBack: (id: string) => void;
  deleteObject: (id: string) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedObject,
  objects,
  handlePropertyChange,
  bringToFront,
  moveObjectUp,
  moveObjectDown,
  sendToBack,
  deleteObject
}) => {
  const selectedObj = objects.find(obj => obj.id === selectedObject);
  if (!selectedObj) return null;

  // テキスト内容の変更
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePropertyChange(selectedObject, 'content', e.target.value);
  };

  // オブジェクト名の変更
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePropertyChange(selectedObject, 'name', e.target.value);
  };

  // 色の変更
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePropertyChange(selectedObject, 'color', e.target.value);
  };

  // 背景色の変更
  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePropertyChange(selectedObject, 'backgroundColor', e.target.value);
  };

  // フォントサイズの変更
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePropertyChange(selectedObject, 'fontSize', parseInt(e.target.value));
  };

  return (
    <div className={styles.propertyPanel}>
      <div className={styles.propertyTitle}>プロパティ</div>
      
      <div className={styles.items}>
        <label>Object name:</label>
        <input
          type="text"
          value={selectedObj.name || ''}
          onChange={handleNameChange}
        />
      </div>
      
      {selectedObj.type === 'text' && (
        <>
          <div className={styles.items}>
            <label>Text contect:</label>
            <input
              type="text"
              value={selectedObj.content || ''}
              onChange={handleTextChange}
            />
          </div>
          <div className={styles.items}>
            <label>Font size:</label>
            <input
              type="range"
              min="8"
              max="72"
              value={selectedObj.fontSize || 16}
              onChange={handleFontSizeChange}
            />
          </div>
        </>
      )}
      
      {(selectedObj.type === 'text' || selectedObj.type === 'shape') && (
        <>
          <div className={styles.items2}>
            <label>Main color:</label>
            <input
              type="color"
              value={selectedObj.color || '#000000'}
              onChange={handleColorChange}
            />
          </div>
          <div className={styles.items2}>
            <label>Background Color:</label>
            <input
              type="color"
              value={selectedObj.backgroundColor || '#ffffff'}
              onChange={handleBgColorChange}
            />
          </div>
        </>
      )}
      
      <div className={styles.items}>
        <label>layour:</label>
        <div className={styles.zIndexButtons}>

          <button onClick={() => moveObjectUp(selectedObject)} title="1つ前へ" className={styles.buttons1}>
          ↑ 前へ
          </button>
          <button onClick={() => moveObjectDown(selectedObject)} title="1つ後ろへ" className={styles.buttons1}>
          ↓ 後ろへ
          </button>
          <button onClick={() => bringToFront(selectedObject)} title="最前面へ" className={styles.buttons2}>
            ↑最前面
          </button>
          <button onClick={() => sendToBack(selectedObject)} title="最背面へ" className={styles.buttons2}>
          ↓ 最背面
          </button>
        </div>
      </div>
            
            <button 
              className={styles.buttons3}
              onClick={() => deleteObject(selectedObject)}>
              削除
            </button>
        </div>
    );
};

export default PropertyPanel;