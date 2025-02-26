'use client';
import React, { useState } from 'react';

// TextStyle型を定義
interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
}

interface AddTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddText: (text: string, style: TextStyle) => void;
}

const AddTextModal: React.FC<AddTextModalProps> = ({ isOpen, onClose, onAddText }) => {
  const [text, setText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [color, setColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const handleSubmit = () => {
    const style: TextStyle = { fontSize, fontFamily, color, backgroundColor };
    onAddText(text, style); // 追加してモーダルを閉じる
    onClose();
  };

  return (
    isOpen ? (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-10">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl mb-4">テキストを追加</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="テキストを入力"
          />
          <div className="mb-4">
            <label>フォントサイズ:</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full p-2 mt-2 border rounded"
              min={10}
              max={100}
            />
          </div>
          <div className="mb-4">
            <label>フォントファミリー:</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
            >
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label>文字色:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label>背景色:</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <button onClick={onClose} className="p-2 bg-gray-300 rounded">
              閉じる
            </button>
            <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded">
              追加
            </button>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default AddTextModal;
