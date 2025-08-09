import { NextRequest, NextResponse } from 'next/server';
import { FeaturedResource } from '@/types/dashboard';
import {
  getFeaturedResources,
  createFeaturedResource,
} from '@/data/featured-resources';

// GET - 獲取特色資源列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'order';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const search = searchParams.get('search') || '';

    // 過濾搜尋
    const filteredResources = getFeaturedResources().filter(
      (resource) =>
        search === '' ||
        resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase()) ||
        resource.category.toLowerCase().includes(search.toLowerCase())
    );

    // 排序
    filteredResources.sort((a, b) => {
      const aValue = a[sortBy as keyof FeaturedResource];
      const bValue = b[sortBy as keyof FeaturedResource];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 分頁
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResources = filteredResources.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedResources,
      pagination: {
        current: page,
        total: Math.ceil(filteredResources.length / pageSize),
        pageSize,
        totalItems: filteredResources.length,
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

    // 在實際專案中，這裡應該保存到資料庫
    const createdResource = createFeaturedResource({
      title: body.title,
      description: body.description,
      category: body.category,
      image: body.image,
      backgroundColor: body.backgroundColor,
      textColor: body.textColor,
      isActive: body.isActive,
      order: body.order || getFeaturedResources().length + 1,
    });

    return NextResponse.json({
      success: true,
      data: createdResource,
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
