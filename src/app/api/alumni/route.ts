import { NextResponse } from 'next/server';
import { getActiveAlumni } from '@/lib/alumni-storage-prisma';

// GET - 獲取已啟用的校友資料（前台公開使用）
export async function GET() {
  try {
    // 獲取已啟用的校友資料
    const alumni = await getActiveAlumni();

    // 轉換資料格式以符合前台使用
    const formattedAlumni = alumni.map((item) => ({
      id: item.id,
      name: item.name,
      position: item.position,
      description: item.description,
      imageUrl: item.imageUrl,
      achievements: item.achievements,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      // 前台相容屬性
      title: item.name,
      image: item.imageUrl,
    }));

    return NextResponse.json({
      success: true,
      data: formattedAlumni,
    });
  } catch (error) {
    console.error('GET /api/alumni error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取校友資料失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
