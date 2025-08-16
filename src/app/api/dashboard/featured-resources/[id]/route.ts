import { NextRequest, NextResponse } from 'next/server';
import { FeaturedResource } from '@/types/dashboard';
import { prisma } from '@/lib/prisma';

// GET - 獲取單個特色資源
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const rawResource = await prisma.featuredResource.findUnique({
      where: { id },
    });

    if (!rawResource) {
      return NextResponse.json(
        {
          success: false,
          error: '特色資源不存在',
        },
        { status: 404 }
      );
    }

    // 轉換資料格式
    const resource: FeaturedResource = {
      id: rawResource.id,
      title: rawResource.title,
      description: rawResource.description,
      titleEn: rawResource.titleEn,
      descriptionEn: rawResource.descriptionEn,
      image: rawResource.imageUrl || '',
      category: rawResource.category,
      categoryEn: rawResource.categoryEn,
      backgroundColor: rawResource.bgColor,
      textColor: 'text-white',
      isActive: rawResource.enabled,
      order: rawResource.order,
      createdAt: rawResource.createdAt,
      updatedAt: rawResource.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error('獲取特色資源詳情錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取特色資源詳情失敗',
      },
      { status: 500 }
    );
  }
}

// PUT - 更新特色資源
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // 檢查資源是否存在
    const existingResource = await prisma.featuredResource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json(
        {
          success: false,
          error: '特色資源不存在',
        },
        { status: 404 }
      );
    }

    // 更新資源
    const rawUpdatedResource = await prisma.featuredResource.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        titleEn: body.titleEn || null,
        descriptionEn: body.descriptionEn || null,
        category: body.category,
        categoryEn: body.categoryEn || null,
        imageUrl: body.image,
        bgColor: body.backgroundColor,
        enabled: body.isActive,
        order: body.order,
      },
    });

    // 轉換資料格式
    const updatedResource: FeaturedResource = {
      id: rawUpdatedResource.id,
      title: rawUpdatedResource.title,
      description: rawUpdatedResource.description,
      titleEn: rawUpdatedResource.titleEn,
      descriptionEn: rawUpdatedResource.descriptionEn,
      image: rawUpdatedResource.imageUrl || '',
      category: rawUpdatedResource.category,
      categoryEn: rawUpdatedResource.categoryEn,
      backgroundColor: rawUpdatedResource.bgColor,
      textColor: 'text-white',
      isActive: rawUpdatedResource.enabled,
      order: rawUpdatedResource.order,
      createdAt: rawUpdatedResource.createdAt,
      updatedAt: rawUpdatedResource.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: updatedResource,
      message: '特色資源更新成功',
    });
  } catch (error) {
    console.error('更新特色資源錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新特色資源失敗',
      },
      { status: 500 }
    );
  }
}

// DELETE - 刪除特色資源
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // 刪除資源
    const deletedResource = await prisma.featuredResource
      .delete({
        where: { id },
      })
      .catch(() => null);

    if (!deletedResource) {
      return NextResponse.json(
        {
          success: false,
          error: '特色資源不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '特色資源刪除成功',
    });
  } catch (error) {
    console.error('刪除特色資源錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '刪除特色資源失敗',
      },
      { status: 500 }
    );
  }
}
