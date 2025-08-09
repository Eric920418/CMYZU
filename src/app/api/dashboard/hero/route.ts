// 主視覺後台管理 API 路由
import { NextRequest, NextResponse } from 'next/server';
import { heroStoragePrisma } from '@/lib/hero-storage-prisma';
import type { ApiResponse, HeroContent } from '@/types/dashboard';

// 獲取主視覺列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || undefined;
    const isActive =
      searchParams.get('isActive') === 'true'
        ? true
        : searchParams.get('isActive') === 'false'
          ? false
          : undefined;

    const heroContents = await heroStoragePrisma.searchHero({
      locale,
      isActive,
    });

    const response: ApiResponse<HeroContent[]> = {
      success: true,
      data: heroContents,
      message: `成功獲取 ${heroContents.length} 個主視覺內容`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('獲取主視覺列表失敗:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '獲取主視覺列表失敗',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// 創建新主視覺
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const requiredFields = ['locale', 'titleMain', 'subtitle'];
    for (const field of requiredFields) {
      if (!data[field]) {
        const response: ApiResponse<null> = {
          success: false,
          error: `缺少必要欄位: ${field}`,
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    const heroContent = await heroStoragePrisma.createHero({
      locale: data.locale,
      titlePrefix: data.titlePrefix || 'YZU',
      titleMain: data.titleMain,
      subtitle: data.subtitle,
      backgroundImage: data.backgroundImage,
      gradientFrom: data.gradientFrom || 'amber-600',
      gradientTo: data.gradientTo || 'white',
      glassEffect: data.glassEffect !== undefined ? data.glassEffect : true,
    });

    const response: ApiResponse<HeroContent> = {
      success: true,
      data: heroContent,
      message: '主視覺內容創建成功',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('創建主視覺失敗:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '創建主視覺失敗',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
