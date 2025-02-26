"use client";
import React, { useState, useRef } from 'react';

const Edit = () => {
  const [image, setImage] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-8 w-full flex flex-col gap-4 justify-center items-center">
      {!image ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 border rounded-lg cursor-pointer"
        />
      ) : (
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="border rounded-lg shadow-md"
        />
      )}
    </div>
  );
};

export default Edit;
