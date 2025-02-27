import React from 'react';
import { EditorObject } from '../page';

interface ObjectRendererProps {
  object: EditorObject;
}

const ObjectRenderer: React.FC<ObjectRendererProps> = ({ object }) => {
  // テキストオブジェクトのレンダリング
  if (object.type === 'text') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          color: object.color,
          fontSize: `${object.fontSize}px`,
          backgroundColor: object.backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          textAlign: 'center',
          padding: '2px',
        }}
      >
        {object.content}
      </div>
    );
  }
  
  // 画像オブジェクトのレンダリング
  if (object.type === 'image') {
    return (
      <img
        src={object.imageUrl}
        alt="アップロード画像"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    );
  }
  
  // 図形オブジェクトのレンダリング
  if (object.type === 'shape') {
    if (object.shapeType === 'rectangle') {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: object.backgroundColor,
            border: `2px solid ${object.color}`,
          }}
        />
      );
    } else if (object.shapeType === 'circle') {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: object.backgroundColor,
            border: `2px solid ${object.color}`,
            borderRadius: '50%',
          }}
        />
      );
    } else if (object.shapeType === 'triangle') {
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
              borderLeft: `${object.width / 2}px solid transparent`,
              borderRight: `${object.width / 2}px solid transparent`,
              borderBottom: `${object.height}px solid ${object.backgroundColor}`,
              position: 'absolute',
            }}
          />
        </div>
      );
    }
  }
  
  return null;
};

export default ObjectRenderer;