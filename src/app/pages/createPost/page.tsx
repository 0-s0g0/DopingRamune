'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const ImagePreviewPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const fileName = searchParams.get('fileName');
  const [text, setText] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!fileName || !text) {
      alert('画像と本文を入力してください');
      return;
    }

    // サーバーに送信するためのデータ
    const data = {
      fileName,
      text,
    };

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
        router.push('/'); // 送信後、他のページへ遷移
      } else {
        alert('投稿に失敗しました');
      }
    } catch (error) {
      console.error('エラー:', error);
      alert('投稿中にエラーが発生しました');
    }
  };

  if (!fileName) {
    return <div>画像が見つかりません。</div>;
  }

  return (
    <div>
      <h2>画像プレビュー</h2>
      <div>
        {/* public/images に保存された画像を表示 */}
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
