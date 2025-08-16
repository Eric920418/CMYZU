import { NextRequest, NextResponse } from 'next/server';
import { FeaturedResource } from '@/types/dashboard';
import { prisma } from '@/lib/prisma';

// GET - 獲取特色資源列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'order';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const search = searchParams.get('search') || '';

    // 從資料庫獲取資料
    const whereClause = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            { category: { contains: search, mode: 'insensitive' as const } },
            { titleEn: { contains: search, mode: 'insensitive' as const } },
            {
              descriptionEn: { contains: search, mode: 'insensitive' as const },
            },
            { categoryEn: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const totalCount = await prisma.featuredResource.count({
      where: whereClause,
    });

    const rawResources = await prisma.featuredResource.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 轉換資料格式
    const paginatedResources: FeaturedResource[] = rawResources.map(
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
        textColor: 'text-white', // 預設值
        isActive: resource.enabled,
        order: resource.order,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
      })
    );

    return NextResponse.json({
      success: true,
      data: paginatedResources,
      pagination: {
        current: page,
        total: Math.ceil(totalCount / pageSize),
        pageSize,
        totalItems: totalCount,
      },
    });
  } catch (error) {
    console.error('特色資源 API 錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取特色資源失敗',
      },
      { status: 500 }
    );
  }
}

// POST - 創建特色資源
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 驗證必要欄位
    if (!body.title || !body.description || !body.category || !body.image) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要欄位：title, description, category, image',
        },
        { status: 400 }
      );
    }

    // 保存到資料庫
    const createdResource = await prisma.featuredResource.create({
      data: {
        title: body.title,
        description: body.description,
        titleEn: body.titleEn || null,
        descriptionEn: body.descriptionEn || null,
        category: body.category,
        categoryEn: body.categoryEn || null,
        imageUrl: body.image,
        bgColor:
          body.backgroundColor || 'bg-gradient-to-br from-blue-500 to-blue-700',
        enabled: body.isActive ?? true,
        order: body.order || 1,
      },
    });

    // 轉換資料格式
    const responseResource: FeaturedResource = {
      id: createdResource.id,
      title: createdResource.title,
      description: createdResource.description,
      titleEn: createdResource.titleEn,
      descriptionEn: createdResource.descriptionEn,
      image: createdResource.imageUrl || '',
      category: createdResource.category,
      categoryEn: createdResource.categoryEn,
      backgroundColor: createdResource.bgColor,
      textColor: 'text-white',
      isActive: createdResource.enabled,
      order: createdResource.order,
      createdAt: createdResource.createdAt,
      updatedAt: createdResource.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: responseResource,
      message: '特色資源創建成功',
    });
  } catch (error) {
    console.error('創建特色資源錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '創建特色資源失敗',
      },
      { status: 500 }
    );
  }
}
