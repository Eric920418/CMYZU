import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// 允許的圖片格式
const ALLOWED_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // 檢查檔名安全性，防止路徑遍歷攻擊
    if (
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: '無效的檔案名稱',
        },
        { status: 400 }
      );
    }

    // 取得檔案副檔名
    const fileExtension = path.extname(filename).toLowerCase();

    // 檢查是否為允許的圖片格式
    if (!ALLOWED_TYPES[fileExtension as keyof typeof ALLOWED_TYPES]) {
      return NextResponse.json(
        {
          success: false,
          error: '不支援的檔案格式',
        },
        { status: 400 }
      );
    }

    // 從環境變數取得存儲目錄
    const uploadDir =
      process.env.UPLOADS_DIR || path.join(process.cwd(), 'storage', 'uploads');
    const filePath = path.join(uploadDir, filename);

    // 檢查檔案是否存在
    if (!existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          error: '檔案不存在',
        },
        { status: 404 }
      );
    }

    // 讀取檔案
    const fileBuffer = await readFile(filePath);
    const contentType =
      ALLOWED_TYPES[fileExtension as keyof typeof ALLOWED_TYPES];

    // 基於檔案修改時間生成 ETag
    const fs = await import('fs');
    const stats = fs.statSync(filePath);
    const etag = `"${filename}-${stats.mtime.getTime()}"`;

    // 檢查 If-None-Match 頭部，支援條件請求
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }

    // 回傳檔案
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600, must-revalidate', // 1小時緩存，但必須重新驗證
        ETag: etag,
        'Last-Modified': stats.mtime.toUTCString(),
      },
    });
  } catch (error) {
    console.error('圖片服務錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '讀取圖片失敗',
      },
      { status: 500 }
    );
  }
}
