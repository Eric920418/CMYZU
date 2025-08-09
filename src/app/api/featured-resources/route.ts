import { NextResponse } from 'next/server';
import { getFeaturedResources } from '@/data/featured-resources';

// GET - 獲取前台特色資源列表（公開端點，不需要認證）
export async function GET() {
  try {
    // 取得所有啟用的特色資源並按順序排序
    const allResources = getFeaturedResources();
    const activeResources = allResources
      .filter((resource) => resource.isActive)
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      data: activeResources,
    });
  } catch (error) {
    console.error('獲取前台特色資源錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取特色資源失敗',
      },
      { status: 500 }
    );
  }
}
