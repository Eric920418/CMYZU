import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getAllLiveUpdates,
  createLiveUpdate,
  batchDeleteLiveUpdates,
  type LiveUpdatePriority,
} from '@/lib/live-updates-storage-prisma';
import { findUserById } from '@/lib/user-storage';

// 驗證 JWT Token
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any;
    const user = await findUserById(decoded.userId);

    if (!user || !user.active) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// GET - 獲取即時動態列表
export async function GET(request: NextRequest) {
  try {
    // 驗證認證
    const user = await verifyToken(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限存取',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority') as LiveUpdatePriority;

    // 獲取所有即時動態
    let allLiveUpdates = await getAllLiveUpdates();

    // 搜尋過濾
    if (search) {
      allLiveUpdates = allLiveUpdates.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.content.toLowerCase().includes(search.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // 優先級過濾
    if (priority && ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(priority)) {
      allLiveUpdates = allLiveUpdates.filter(
        (item) => item.priority === priority
      );
    }

    // 分頁
    const total = allLiveUpdates.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedLiveUpdates = allLiveUpdates.slice(
      startIndex,
      startIndex + pageSize
    );

    return NextResponse.json({
      success: true,
      data: paginatedLiveUpdates,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('GET /api/dashboard/live-updates error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取即時動態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - 創建即時動態
export async function POST(request: NextRequest) {
  try {
    // 驗證認證
    const user = await verifyToken(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限存取',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 創建即時動態
    const newLiveUpdate = await createLiveUpdate({
      title: body.title,
      content: body.content,
      // 英文欄位
      titleEn: body.titleEn,
      contentEn: body.contentEn,
      priority: body.priority || 'MEDIUM',
      published: body.published || false,
      tags: body.tags || [],
      authorId: user.id,
    });

    return NextResponse.json({
      success: true,
      data: newLiveUpdate,
      message: '即時動態創建成功',
    });
  } catch (error) {
    console.error('POST /api/dashboard/live-updates error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '創建即時動態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - 批量刪除即時動態
export async function DELETE(request: NextRequest) {
  try {
    // 驗證認證
    const user = await verifyToken(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限存取',
        },
        { status: 401 }
      );
    }

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '請提供要刪除的即時動態ID',
        },
        { status: 400 }
      );
    }

    const deletedCount = await batchDeleteLiveUpdates(ids);

    return NextResponse.json({
      success: true,
      message: `成功刪除 ${deletedCount} 則即時動態`,
      data: { deletedCount },
    });
  } catch (error) {
    console.error('DELETE /api/dashboard/live-updates error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '批量刪除即時動態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
