// 前台主視覺內容 API 路由
import { NextRequest, NextResponse } from 'next/server';
import { heroStoragePrisma } from '@/lib/hero-storage-prisma';

// 獲取主視覺內容（根據語言）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'zh';

    const heroContent = await heroStoragePrisma.getHeroByLocale(locale);

    if (!heroContent) {
      return NextResponse.json(
        {
          success: false,
          error: '未找到主視覺內容',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: heroContent,
    });
  } catch (error) {
    console.error('獲取主視覺內容失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '獲取主視覺內容失敗',
      },
      { status: 500 }
    );
  }
}
