import React from 'react';
import styles from '../styles/edit.module.css';
import { EditorObject } from '../page';
import ObjectRenderer from './ObjectRenderer';

interface CanvasProps {
  objects: EditorObject[];
  backgroundImage: string | null;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  selectedObject: string | null;
  setSelectedObject: (id: string | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  dragStart: { x: number; y: number };
  setDragStart: (start: { x: number; y: number }) => void;
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  CANVAS_SIZE: number;
}

const Canvas: React.FC<CanvasProps> = ({
  objects,
  backgroundImage,
  canvasRef,
  selectedObject,
  setSelectedObject,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  isResizing,
  setIsResizing,
  handleMouseMove,
  CANVAS_SIZE
}) => {
  
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

  // マウスアップ時の処理
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };
  
  return (
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
            <ObjectRenderer object={obj} />
            
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
  );
};

export default Canvas;