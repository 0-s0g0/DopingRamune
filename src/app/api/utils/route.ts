import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  const { image } = await request.json();

  // Base64 データから画像データを抽出
  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  const fileName = `${Date.now()}.png`; // 一意なファイル名を生成
  const filePath = join(process.cwd(), 'public', 'images', fileName);

  // 画像ファイルを保存
  await writeFile(filePath, base64Data, 'base64');

  return NextResponse.json({ fileName });
}
