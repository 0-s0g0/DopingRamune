'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const ImagePreviewPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId] = useState(window.localStorage.getItem("username"));

  // 初期値としてクエリパラメータから fileName を取得（アップロード後に更新する場合は setFileName を利用）
  const [fileName, setFileName] = useState<string | null>(searchParams.get('fileName'));
  const [text, setText] = useState('');

  // 例: 画像アップロードAPIを呼び出す関数（ここでは base64 文字列を送信する場合）
  // ※すでにアップロード済みの場合は不要ですが、アップロードAPIのレスポンスで fileName を取得して state に反映させます。
  const handleUploadImage = async (base64Image: string) => {
    try {
      const response = await fetch('/api/utils/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      if (response.ok) {
        const data = await response.json();
        setFileName(data.fileName);
      } else {
        alert('画像アップロードに失敗しました');
      }
    } catch (error) {
      console.error('アップロードエラー:', error);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!fileName || !text) {
      alert('画像と本文を入力してください');
      return;
    }
  
    // public フォルダはルートとして扱われるため、画像パスは /images/${fileName} となる
    const imagePath = fileName;
    console.log(imagePath);
  
    // user_id も含めて送信する
    const data = {
      user_id: userId, // ここは実際のユーザーIDを使用してください
      picture: imagePath,       // キーを picture にすることで、バックエンドの Post 構造体と対応させる
      text,
    };
    console.log(data);
  
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert('投稿が成功しました');
        router.push('/pages/Timeline'); // 送信後、トップページへ遷移
      } else {
        alert('投稿に失敗しました');
      }
    } catch (error) {
      console.error('エラー:', error);
      alert('投稿中にエラーが発生しました');
    }
  };
  
  return (
    <div>
      <h2>画像プレビュー</h2>
      <div>
        <Image 
          src={`/images/${fileName}`} 
          alt="プレビュー画像" 
          width={300} 
          height={200} 
        />
      </div>
      
      <div>
        <textarea
          placeholder="本文を入力してください"
          value={text}
          onChange={handleTextChange}
          rows={4}
          cols={50}
        />
      </div>

      <button onClick={handleSubmit}>投稿</button>
      <button onClick={() => router.push('/pages/Edit')}>戻る</button>
    </div>
  );
};

export default ImagePreviewPage;
