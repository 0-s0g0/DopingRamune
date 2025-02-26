'use client';
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles/edit.module.css';

// 編集可能なオブジェクトの型定義
type ObjectType = 'text' | 'image' | 'shape';
type ShapeType = 'rectangle' | 'circle' | 'triangle';

interface EditorObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  content?: string;
  color?: string;
  fontSize?: number;
  backgroundColor?: string;
  imageUrl?: string;
  shapeType?: ShapeType;
  name?: string; // オブジェクト名を追加
}

const PosterEditor: React.FC = () => {
  // 編集用キャンバスのサイズ
  const CANVAS_SIZE = 300;
  
  // 状態管理
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [objects, setObjects] = useState<EditorObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [showObjectList, setShowObjectList] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 背景画像のアップロード処理
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // オブジェクト名を生成する関数
  const generateObjectName = (type: ObjectType, shapeType?: ShapeType): string => {
    const count = objects.filter(obj => {
      if (type === 'shape' && obj.type === 'shape') {
        return obj.shapeType === shapeType;
      }
      return obj.type === type;
    }).length + 1;
    
    if (type === 'text') return `テキスト ${count}`;
    if (type === 'image') return `画像 ${count}`;
    if (type === 'shape') {
      if (shapeType === 'rectangle') return `四角形 ${count}`;
      if (shapeType === 'circle') return `円 ${count}`;
      if (shapeType === 'triangle') return `三角形 ${count}`;
    }
    return `オブジェクト ${count}`;
  };

  // テキストの追加
  const addText = () => {
    const newText: EditorObject = {
      id: uuidv4(),
      type: 'text',
      x: 50,
      y: 50,
      width: 100,
      height: 30,
      zIndex: getNextZIndex(),
      content: 'テキストを入力',
      color: '#000000',
      fontSize: 16,
      backgroundColor: 'transparent',
      name: generateObjectName('text'),
    };
    setObjects([...objects, newText]);
    setSelectedObject(newText.id);
  };

  // 次のzIndexを取得
  const getNextZIndex = (): number => {
    if (objects.length === 0) return 1;
    return Math.max(...objects.map(obj => obj.zIndex)) + 1;
  };

  // 図形の追加
  const addShape = (shapeType: ShapeType) => {
    const newShape: EditorObject = {
      id: uuidv4(),
      type: 'shape',
      shapeType,
      x: 50,
      y: 50,
      width: 80,
      height: shapeType === 'circle' ? 80 : 60,
      zIndex: getNextZIndex(),
      color: '#FF5733',
      backgroundColor: '#FFCCCB',
      name: generateObjectName('shape', shapeType),
    };
    setObjects([...objects, newShape]);
    setSelectedObject(newShape.id);
  };

  // 画像の追加
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: EditorObject = {
          id: uuidv4(),
          type: 'image',
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          zIndex: getNextZIndex(),
          imageUrl: event.target?.result as string,
          name: generateObjectName('image'),
        };
        setObjects([...objects, newImage]);
        setSelectedObject(newImage.id);
      };
      reader.readAsDataURL(file);
    }
  };

  // オブジェクトの選択
  const selectObject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedObject(id);
  };

  // キャンバスクリック時の処理（選択解除）
  const handleCanvasClick = () => {
    setSelectedObject(null);
  };

  // ドラッグ開始
  const startDrag = (e: React.MouseEvent) => {
    if (!selectedObject) return;
    e.stopPropagation();
    setIsDragging(true);
    
    const clientRect = (e.target as HTMLElement).getBoundingClientRect();
    setDragStart({
      x: e.clientX - clientRect.left,
      y: e.clientY - clientRect.top,
    });
  };

  // リサイズ開始
  const startResize = (e: React.MouseEvent) => {
    if (!selectedObject) return;
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // マウス移動時の処理
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return;
    if (!selectedObject || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const objectIndex = objects.findIndex(obj => obj.id === selectedObject);
    if (objectIndex === -1) return;

    const newObjects = [...objects];
    const obj = { ...newObjects[objectIndex] };

    if (isDragging) {
      // ドラッグ処理
      obj.x = Math.max(0, Math.min(e.clientX - canvasRect.left - dragStart.x, CANVAS_SIZE - obj.width));
      obj.y = Math.max(0, Math.min(e.clientY - canvasRect.top - dragStart.y, CANVAS_SIZE - obj.height));
    } else if (isResizing) {
      // リサイズ処理
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      obj.width = Math.max(20, obj.width + deltaX);
      obj.height = Math.max(20, obj.height + deltaY);
      
      // 範囲制限
      if (obj.x + obj.width > CANVAS_SIZE) {
        obj.width = CANVAS_SIZE - obj.x;
      }
      if (obj.y + obj.height > CANVAS_SIZE) {
        obj.height = CANVAS_SIZE - obj.y;
      }
      
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }

    newObjects[objectIndex] = obj;
    setObjects(newObjects);
  };

  // マウスアップ時の処理
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // テキスト内容の変更
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const objectIndex = objects.findIndex(obj => obj.id === id);
    if (objectIndex === -1) return;

    const newObjects = [...objects];
    newObjects[objectIndex] = {
      ...newObjects[objectIndex],
      content: e.target.value,
    };
    setObjects(newObjects);
  };

  // オブジェクト名の変更
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const objectIndex = objects.findIndex(obj => obj.id === id);
    if (objectIndex === -1) return;

    const newObjects = [...objects];
    newObjects[objectIndex] = {
      ...newObjects[objectIndex],
      name: e.target.value,
    };
    setObjects(newObjects);
  };

  // 色の変更
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const objectIndex = objects.findIndex(obj => obj.id === id);
    if (objectIndex === -1) return;

    const newObjects = [...objects];
    newObjects[objectIndex] = {
      ...newObjects[objectIndex],
      color: e.target.value,
    };
    setObjects(newObjects);
  };

  // 背景色の変更
  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const objectIndex = objects.findIndex(obj => obj.id === id);
    if (objectIndex === -1) return;

    const newObjects = [...objects];
    newObjects[objectIndex] = {
      ...newObjects[objectIndex],
      backgroundColor: e.target.value,
    };
    setObjects(newObjects);
  };

  // フォントサイズの変更
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const objectIndex = objects.findIndex(obj => obj.id === id);
    if (objectIndex === -1) return;

    const newObjects = [...objects];
    newObjects[objectIndex] = {
      ...newObjects[objectIndex],
      fontSize: parseInt(e.target.value),
    };
    setObjects(newObjects);
  };

  // オブジェクトリストでのZ-indexの変更（上に移動）
  const moveObjectUp = (id: string) => {
    const sortedObjects = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const index = sortedObjects.findIndex(obj => obj.id === id);
    
    // 既に最前面の場合は何もしない
    if (index === sortedObjects.length - 1) return;
    
    // 入れ替え
    const currentZIndex = sortedObjects[index].zIndex;
    const upperZIndex = sortedObjects[index + 1].zIndex;
    
    const newObjects = [...objects];
    const currentObjIndex = newObjects.findIndex(obj => obj.id === id);
    const upperObjIndex = newObjects.findIndex(obj => obj.zIndex === upperZIndex);
    
    newObjects[currentObjIndex].zIndex = upperZIndex;
    newObjects[upperObjIndex].zIndex = currentZIndex;
    
    setObjects(newObjects);
  };

  // オブジェクトリストでのZ-indexの変更（下に移動）
  const moveObjectDown = (id: string) => {
    const sortedObjects = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const index = sortedObjects.findIndex(obj => obj.id === id);
    
    // 既に最背面の場合は何もしない
    if (index === 0) return;
    
    // 入れ替え
    const currentZIndex = sortedObjects[index].zIndex;
    const lowerZIndex = sortedObjects[index - 1].zIndex;
    
    const newObjects = [...objects];
    const currentObjIndex = newObjects.findIndex(obj => obj.id === id);
    const lowerObjIndex = newObjects.findIndex(obj => obj.zIndex === lowerZIndex);
    
    newObjects[currentObjIndex].zIndex = lowerZIndex;
    newObjects[lowerObjIndex].zIndex = currentZIndex;
    
    setObjects(newObjects);
  };

  // 最前面に移動
  const bringToFront = (id: string) => {
    const highestZIndex = Math.max(...objects.map(obj => obj.zIndex)) + 1;
    const newObjects = [...objects];
    const index = newObjects.findIndex(obj => obj.id === id);
    
    if (index !== -1) {
      newObjects[index].zIndex = highestZIndex;
      setObjects(newObjects);
    }
  };

  // 最背面に移動
  const sendToBack = (id: string) => {
    const lowestZIndex = Math.min(...objects.map(obj => obj.zIndex)) - 1;
    const newObjects = [...objects];
    const index = newObjects.findIndex(obj => obj.id === id);
    
    if (index !== -1) {
      newObjects[index].zIndex = lowestZIndex;
      setObjects(newObjects);
    }
  };

  // オブジェクトの削除
  const deleteObject = (id: string) => {
    setObjects(objects.filter(obj => obj.id !== id));
    setSelectedObject(null);
  };

  // マウスイベントの設定と解除
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // 図形レンダリング関数
  const renderShape = (obj: EditorObject) => {
    if (obj.shapeType === 'rectangle') {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: obj.backgroundColor,
            border: `2px solid ${obj.color}`,
          }}
        />
      );
    } else if (obj.shapeType === 'circle') {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: obj.backgroundColor,
            border: `2px solid ${obj.color}`,
            borderRadius: '50%',
          }}
        />
      );
    } else if (obj.shapeType === 'triangle') {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '0',
              height: '0',
              borderLeft: `${obj.width / 2}px solid transparent`,
              borderRight: `${obj.width / 2}px solid transparent`,
              borderBottom: `${obj.height}px solid ${obj.backgroundColor}`,
              position: 'absolute',
            }}
          />
        </div>
      );
    }
    return null;
  };

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
    <div className={styles.editorContainer}>
      <h1>ポスター編集ツール</h1>
      
      <div className={styles.toolbarSection}>
        <div className={styles.toolGroup}>
          <h3>背景</h3>
          <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
        </div>
        
        <div className={styles.toolGroup}>
          <h3>オブジェクト追加</h3>
          <button onClick={addText}>テキスト追加</button>
          <button onClick={() => addShape('rectangle')}>四角形追加</button>
          <button onClick={() => addShape('circle')}>円追加</button>
          <button onClick={() => addShape('triangle')}>三角形追加</button>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        
        <div className={styles.toolGroup}>
          <h3>レイヤー管理</h3>
          <button onClick={() => setShowObjectList(!showObjectList)}>
            {showObjectList ? 'オブジェクト一覧を隠す' : 'オブジェクト一覧を表示'}
          </button>
        </div>
      </div>
      
      {showObjectList && (
        <div className={styles.objectListContainer}>
          <h3>オブジェクト一覧（上が前面、下が背面）</h3>
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
                      ↑
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        moveObjectDown(obj.id);
                      }}
                      disabled={obj.zIndex === Math.min(...objects.map(o => o.zIndex))}
                      title="下へ移動（背面へ）"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      <div className={styles.editorWorkspace}>
        <div 
          ref={canvasRef}
          className={styles.canvas}
          style={{
            width: `${CANVAS_SIZE}px`,
            height: `${CANVAS_SIZE}px`,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {objects
            .sort((a, b) => a.zIndex - b.zIndex) // zIndexの昇順でレンダリング
            .map((obj) => (
              <div
                key={obj.id}
                className={`${styles.editorObject} ${selectedObject === obj.id ? styles.selected : ''}`}
                style={{
                  left: `${obj.x}px`,
                  top: `${obj.y}px`,
                  width: `${obj.width}px`,
                  height: `${obj.height}px`,
                  zIndex: obj.zIndex,
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onClick={(e) => selectObject(obj.id, e)}
                onMouseDown={startDrag}
              >
                {obj.type === 'text' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      color: obj.color,
                      fontSize: `${obj.fontSize}px`,
                      backgroundColor: obj.backgroundColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      textAlign: 'center',
                      padding: '2px',
                    }}
                  >
                    {obj.content}
                  </div>
                )}
                
                {obj.type === 'image' && (
                  <img
                    src={obj.imageUrl}
                    alt="アップロード画像"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                
                {obj.type === 'shape' && renderShape(obj)}
                
                {selectedObject === obj.id && (
                  <div
                    className={styles.resizeHandle}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      startResize(e);
                    }}
                  />
                )}
              </div>
            ))}
        </div>
        
        {selectedObject && (
          <div className={styles.propertyPanel}>
            <h3>プロパティ</h3>
            
            <div>
              <label>名前:</label>
              <input
                type="text"
                value={objects.find(obj => obj.id === selectedObject)?.name || ''}
                onChange={(e) => handleNameChange(e, selectedObject)}
              />
            </div>
            
            {objects.find(obj => obj.id === selectedObject)?.type === 'text' && (
              <>
                <div>
                  <label>テキスト:</label>
                  <input
                    type="text"
                    value={objects.find(obj => obj.id === selectedObject)?.content || ''}
                    onChange={(e) => handleTextChange(e, selectedObject)}
                  />
                </div>
                <div>
                  <label>フォントサイズ:</label>
                  <input
                    type="range"
                    min="8"
                    max="72"
                    value={objects.find(obj => obj.id === selectedObject)?.fontSize || 16}
                    onChange={(e) => handleFontSizeChange(e, selectedObject)}
                  />
                </div>
              </>
            )}
            
            {(objects.find(obj => obj.id === selectedObject)?.type === 'text' || 
              objects.find(obj => obj.id === selectedObject)?.type === 'shape') && (
              <>
                <div>
                  <label>色:</label>
                  <input
                    type="color"
                    value={objects.find(obj => obj.id === selectedObject)?.color || '#000000'}
                    onChange={(e) => handleColorChange(e, selectedObject)}
                  />
                </div>
                <div>
                  <label>背景色:</label>
                  <input
                    type="color"
                    value={objects.find(obj => obj.id === selectedObject)?.backgroundColor || '#ffffff'}
                    onChange={(e) => handleBgColorChange(e, selectedObject)}
                  />
                </div>
              </>
            )}
            
            <div>
              <label>レイヤー:</label>
              <div className={styles.zIndexButtons}>
                <button onClick={() => bringToFront(selectedObject)} title="最前面へ">
                  ⬆️ 最前面
                </button>
                <button onClick={() => moveObjectUp(selectedObject)} title="1つ前へ">
                  ↑ 前へ
                </button>
                <button onClick={() => moveObjectDown(selectedObject)} title="1つ後ろへ">
                  ↓ 後ろへ
                </button>
                <button onClick={() => sendToBack(selectedObject)} title="最背面へ">
                  ⬇️ 最背面
                </button>
              </div>
            </div>
            
            <button 
              className={styles.deleteButton}
              onClick={() => deleteObject(selectedObject)}>
              削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterEditor;