'use client';
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles/edit.module.css';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';

import Toolbar from './components/Toolbar';
import ObjectList from './components/ObjectList';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare} from "@fortawesome/free-solid-svg-icons";




// 編集可能なオブジェクトの型定義
export type ObjectType = 'text' | 'image' | 'shape';
export type ShapeType = 'rectangle' | 'circle' | 'triangle';

export interface EditorObject {
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

  // プロパティ変更ハンドラー
  const handlePropertyChange = (id: string, property: string, value: any) => {
    const objectIndex = objects.findIndex(obj => obj.id === id);
    if (objectIndex === -1) return;

    const newObjects = [...objects];
    newObjects[objectIndex] = {
      ...newObjects[objectIndex],
      [property]: value,
    };
    setObjects(newObjects);
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

  const router = useRouter();
  
  const handleSaveAsImage = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current, { backgroundColor: null });
    const dataUrl = canvas.toDataURL('image/png');

    // API経由で画像を保存し、ファイル名を取得
    const response = await fetch('/api/utils', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
    });

    const { fileName } = await response.json();

    // 画像ファイル名をURLクエリとして渡す
    router.push(`/pages/createPost?fileName=${fileName}`);
  };
    

  return (
    <div className={styles.editorContainer}>
      <div>Edit your Dream Image!</div>      

      
      
      <div className={styles.editorWorkspace}>
        <Canvas 
          objects={objects}
          backgroundImage={backgroundImage}
          canvasRef={canvasRef}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          dragStart={dragStart}
          setDragStart={setDragStart}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
          handleMouseMove={handleMouseMove}
          CANVAS_SIZE={CANVAS_SIZE}
        />

       
        
        {selectedObject && (
          <PropertyPanel 
            selectedObject={selectedObject}
            objects={objects}
            handlePropertyChange={handlePropertyChange}
            bringToFront={bringToFront}
            moveObjectUp={moveObjectUp}
            moveObjectDown={moveObjectDown}
            sendToBack={sendToBack}
            deleteObject={deleteObject}
          />
        )}
      </div>
      <div className={styles.buttons}>
      <Toolbar 
          handleBackgroundUpload={handleBackgroundUpload}
          addText={addText}
          addShape={addShape}
          handleImageUpload={handleImageUpload}
          showObjectList={showObjectList}
          setShowObjectList={setShowObjectList}
        />
         <button className={styles.savebutton} onClick={handleSaveAsImage}><FontAwesomeIcon icon={faShare} /></button>
         </div>
        
        {showObjectList && (
        <ObjectList 
          objects={objects}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          moveObjectUp={moveObjectUp}
          moveObjectDown={moveObjectDown}
        />
      )}
    </div>
  );
};

export default PosterEditor;