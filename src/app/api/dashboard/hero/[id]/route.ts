// 主視覺單項管理 API 路由
import { NextRequest, NextResponse } from 'next/server';
import { heroStoragePrisma } from '@/lib/hero-storage-prisma';
import type { ApiResponse, HeroContent } from '@/types/dashboard';

// 獲取單個主視覺
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const heroContents = await heroStoragePrisma.getAllHero();
    const heroContent = heroContents.find((h) => h.id === id);

    if (!heroContent) {
      const response: ApiResponse<null> = {
        success: false,
        error: '主視覺內容不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<HeroContent> = {
      success: true,
      data: heroContent,
      message: '成功獲取主視覺內容',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('獲取主視覺失敗:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '獲取主視覺失敗',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// 更新主視覺
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedHeroContent = await heroStoragePrisma.updateHero(id, {
      titlePrefix: data.titlePrefix,
      titleMain: data.titleMain,
      subtitle: data.subtitle,
      backgroundImage: data.backgroundImage,
      gradientFrom: data.gradientFrom,
      gradientTo: data.gradientTo,
      glassEffect: data.glassEffect,
    });

    if (!updatedHeroContent) {
      const response: ApiResponse<null> = {
        success: false,
        error: '主視覺內容不存在或更新失敗',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<HeroContent> = {
      success: true,
      data: updatedHeroContent,
      message: '主視覺內容更新成功',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('更新主視覺失敗:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '更新主視覺失敗',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// 刪除主視覺
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deleted = await heroStoragePrisma.deleteHero(id);

    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: '主視覺內容不存在或刪除失敗',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<null> = {
      success: true,
      message: '主視覺內容刪除成功',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('刪除主視覺失敗:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '刪除主視覺失敗',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// 切換主視覺狀態
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    if (data.action === 'toggle-status') {
      const updatedHeroContent = await heroStoragePrisma.toggleHeroStatus(id);

      if (!updatedHeroContent) {
        const response: ApiResponse<null> = {
          success: false,
          error: '主視覺內容不存在或狀態切換失敗',
        };
        return NextResponse.json(response, { status: 404 });
      }

      const response: ApiResponse<HeroContent> = {
        success: true,
        data: updatedHeroContent,
        message: `主視覺狀態已${updatedHeroContent.isActive ? '啟用' : '停用'}`,
      };

      return NextResponse.json(response);
    }

    const response: ApiResponse<null> = {
      success: false,
      error: '無效的操作',
    };
    return NextResponse.json(response, { status: 400 });
  } catch (error) {
    console.error('切換主視覺狀態失敗:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '切換主視覺狀態失敗',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
