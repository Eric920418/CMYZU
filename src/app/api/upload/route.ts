import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 允許的圖片格式
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

// 允許的檔案副檔名（作為 MIME 類型檢查的後備）
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
// 最大檔案大小 (5MB)
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: '沒有選擇檔案',
        },
        { status: 400 }
      );
    }

    // 檢查檔案格式
    console.log('上傳檔案類型:', file.type, '檔案名稱:', file.name);
    const fileExtension = path.extname(file.name).toLowerCase();

    // 如果 MIME 類型正確，直接允許；否則檢查副檔名
    if (
      !ALLOWED_TYPES.includes(file.type) &&
      !ALLOWED_EXTENSIONS.includes(fileExtension)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `不支援的檔案格式 (${file.type}, ${fileExtension})，僅支援 JPG、PNG、GIF、WebP`,
        },
        { status: 400 }
      );
    }

    // 檢查檔案大小
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: '檔案大小超過限制 (5MB)',
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 使用環境變數指定的存儲目錄
    const uploadDir =
      process.env.UPLOADS_DIR || path.join(process.cwd(), 'storage', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 生成唯一檔名
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // 儲存檔案
    await writeFile(filePath, buffer);

    // 回傳檔案訪問路徑（透過 API 路由存取）
    const fileUrl = `/api/images/${fileName}`;

    return NextResponse.json({
      success: true,
      message: '檔案上傳成功',
      data: {
        filename: fileName,
        url: fileUrl,
        originalName: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error('圖片上傳錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '上傳失敗，請稍後再試',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '圖片上傳 API - 請使用 POST 方法',
    allowedTypes: ALLOWED_TYPES,
    maxSize: `${MAX_SIZE / 1024 / 1024}MB`,
  });
}
