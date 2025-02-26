'use client';
import React, { useState, useRef } from 'react';
import AddTextModal from './hooks/addTextmodal'; // AddTextModalコンポーネントをインポート

// TextStyle型を定義（テキストのスタイル設定用）
interface TextStyle {
  fontSize: number; // フォントサイズ
  fontFamily: string;
  color: string; 
  backgroundColor: string; 
}

// テキストのオブジェクト型を定義（位置とサイズも管理）
interface TextObject {
  text: string; // テキスト内容
  style: TextStyle; // スタイル
  x: number; // x座標
  y: number; // y座標
  width: number; // テキストの幅
  height: number; // テキストの高さ
}

const Edit = () => {
  // 状態管理
  const [image, setImage] = useState<File | null>(null); // アップロードされた画像
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示/非表示
  const [texts, setTexts] = useState<TextObject[]>([]); // 画面に描画されるテキスト
  const canvasRef = useRef<HTMLCanvasElement>(null); // キャンバスへの参照
  const [draggingTextIndex, setDraggingTextIndex] = useState<number | null>(null); // ドラッグ中のテキストインデックス

  // 画像アップロードの処理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // ファイル選択
    if (file) {
      setImage(file); // アップロードした画像をセット
      const reader = new FileReader(); // FileReaderを使用して画像を読み込む
      reader.onload = () => {
        const img = new Image(); // 新しいImageオブジェクトを作成
        img.src = reader.result as string; // 読み込んだデータを画像ソースに設定
        img.onload = () => {
          const canvas = canvasRef.current; // キャンバス参照を取得
          if (canvas) {
            const ctx = canvas.getContext('2d'); // 2D描画コンテキストを取得
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 画像をキャンバスに描画
            }
          }
        };
      };
      reader.readAsDataURL(file); // ファイルをData URLとして読み込む
    }
  };

  // テキスト追加の処理
  const handleAddText = (text: string, style: TextStyle) => {
    const canvas = canvasRef.current; // キャンバス参照を取得
    if (canvas) {
      const ctx = canvas.getContext('2d'); // 2D描画コンテキストを取得
      if (ctx) {
        ctx.font = `${style.fontSize}px ${style.fontFamily}`; // フォントを設定
        const width = ctx.measureText(text).width; // テキストの幅を測定
        const height = style.fontSize; // 高さはフォントサイズに合わせる

        // 新しいテキストオブジェクトを作成
        const newText: TextObject = {
          text,
          style,
          x: 50, // 初期位置x
          y: 50, // 初期位置y
          width,
          height,
        };

        setTexts((prevTexts) => [...prevTexts, newText]); // テキストを追加
        handleDrawTexts([...texts, newText]); // 追加したテキストを描画
      }
    }
  };

  // テキストをキャンバスに描画する処理
  const handleDrawTexts = (textsToDraw: TextObject[]) => {
    const canvas = canvasRef.current; // キャンバス参照を取得
    if (canvas) {
      const ctx = canvas.getContext('2d'); // 2D描画コンテキストを取得
      if (ctx) {
        textsToDraw.forEach((textObj) => {
          ctx.font = `${textObj.style.fontSize}px ${textObj.style.fontFamily}`; // テキストスタイルを設定
          ctx.fillStyle = textObj.style.color; // 文字色を設定
          ctx.fillText(textObj.text, textObj.x, textObj.y); // テキストをキャンバスに描画
        });
      }
    }
  };

  // キャンバスがクリックされた際にテキストを選択する処理
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; // キャンバス参照を取得
    if (canvas) {
      const rect = canvas.getBoundingClientRect(); // キャンバスの位置を取得
      const mouseX = e.clientX - rect.left; // マウスのx座標を取得
      const mouseY = e.clientY - rect.top; // マウスのy座標を取得

      // クリックされた位置にテキストがあるかを確認
      const clickedIndex = texts.findIndex(
        (textObj) =>
          mouseX >= textObj.x &&
          mouseX <= textObj.x + textObj.width &&
          mouseY >= textObj.y - textObj.height &&
          mouseY <= textObj.y
      );

      if (clickedIndex !== -1) {
        setDraggingTextIndex(clickedIndex); // テキストをドラッグ中にする
      }
    }
  };

  // マウス移動中にテキストをドラッグする処理
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingTextIndex !== null) { // ドラッグ中の場合
      const canvas = canvasRef.current; // キャンバス参照を取得
      if (canvas) {
        const rect = canvas.getBoundingClientRect(); // キャンバスの位置を取得
        const mouseX = e.clientX - rect.left; // マウスのx座標を取得
        const mouseY = e.clientY - rect.top; // マウスのy座標を取得

        const newTexts = [...texts]; // テキストの配列を複製
        const draggedText = newTexts[draggingTextIndex]; // ドラッグ中のテキストを取得

        draggedText.x = mouseX - draggedText.width / 2; // x座標を更新（中央に合わせる）
        draggedText.y = mouseY; // y座標を更新

        setTexts(newTexts); // 更新したテキスト配列を状態にセット
        handleDrawTexts(newTexts); // テキストを再描画
      }
    }
  };

  // マウスボタンが離されたときにドラッグを終了する処理
  const handleCanvasMouseUp = () => {
    setDraggingTextIndex(null); // ドラッグを終了
  };

  return (
    <div className="mt-8 w-full flex flex-col gap-4 justify-center items-center">
      {/* 画像がアップロードされていない場合、画像選択ボタンを表示 */}
      {!image ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload} // 画像選択時の処理
          className="p-2 border rounded-lg cursor-pointer"
        />
      ) : (
        <canvas
          ref={canvasRef} // キャンバスの参照を設定
          width={300} // キャンバスの幅
          height={300} // キャンバスの高さ
          className="border rounded-lg shadow-md"
          onClick={handleCanvasClick} // キャンバスクリック時の処理
          onMouseMove={handleCanvasMouseMove} // マウス移動時の処理
          onMouseUp={handleCanvasMouseUp} // マウスボタンアップ時の処理
        />
      )}

      {/* テキストを追加するボタン */}
      <button
        onClick={() => setIsModalOpen(true)} // モーダルを開く
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Add Text
      </button>

      {/* AddTextModalコンポーネント（モーダル） */}
      <AddTextModal
        isOpen={isModalOpen} // モーダルの表示状態
        onClose={() => setIsModalOpen(false)} // モーダルを閉じる
        onAddText={handleAddText} // テキスト追加の処理を渡す
      />
    </div>
  );
};

export default Edit; // コンポーネントをエクスポート
