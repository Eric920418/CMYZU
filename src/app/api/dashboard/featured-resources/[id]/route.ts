import { NextRequest, NextResponse } from 'next/server';
import {
  getFeaturedResource,
  updateFeaturedResource,
  deleteFeaturedResource,
} from '@/data/featured-resources';

// GET - 獲取單個特色資源
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const resource = getFeaturedResource(id);

    if (!resource) {
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

    const existingResource = getFeaturedResource(id);

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
    const updatedResource = updateFeaturedResource(id, body);

    if (!updatedResource) {
      return NextResponse.json(
        {
          success: false,
          error: '更新失敗',
        },
        { status: 500 }
      );
    }

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
    const deletedResource = deleteFeaturedResource(id);

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
