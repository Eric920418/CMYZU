import { NextResponse } from 'next/server';
import { FeaturedResource } from '@/types/dashboard';
import { prisma } from '@/lib/prisma';

// GET - 獲取前台特色資源列表（公開端點，不需要認證）
export async function GET() {
  try {
    // 從資料庫取得所有啟用的特色資源並按順序排序
    const rawResources = await prisma.featuredResource.findMany({
      where: {
        enabled: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // 轉換資料格式
    const activeResources: FeaturedResource[] = rawResources.map(
      (resource) => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        titleEn: resource.titleEn,
        descriptionEn: resource.descriptionEn,
        image: resource.imageUrl || '',
        category: resource.category,
        categoryEn: resource.categoryEn,
        backgroundColor: resource.bgColor,
        textColor: 'text-white',
        isActive: resource.enabled,
        order: resource.order,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
      })
    );

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
