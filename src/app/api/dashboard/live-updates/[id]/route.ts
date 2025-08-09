import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getLiveUpdateById,
  updateLiveUpdate,
  deleteLiveUpdate,
  toggleLiveUpdatePublished,
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

// GET - 獲取單個即時動態
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 查找指定ID的即時動態
    const liveUpdate = await getLiveUpdateById(id);

    if (!liveUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: '即時動態不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: liveUpdate,
    });
  } catch (error) {
    console.error('GET /api/dashboard/live-updates/[id] error:', error);
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

// PUT - 更新即時動態
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();

    // 檢查即時動態是否存在
    const existingLiveUpdate = await getLiveUpdateById(id);
    if (!existingLiveUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: '即時動態不存在',
        },
        { status: 404 }
      );
    }

    // 檢查權限 - 只有作者或管理員可以編輯
    if (user.role !== 'ADMIN' && existingLiveUpdate.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限編輯此即時動態',
        },
        { status: 403 }
      );
    }

    // 更新即時動態
    const updatedLiveUpdate = await updateLiveUpdate(id, {
      title: body.title,
      content: body.content,
      priority: body.priority,
      published: body.published,
      tags: body.tags,
    });

    if (!updatedLiveUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: '更新即時動態失敗',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedLiveUpdate,
      message: '即時動態更新成功',
    });
  } catch (error) {
    console.error('PUT /api/dashboard/live-updates/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新即時動態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - 刪除即時動態
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 檢查即時動態是否存在
    const existingLiveUpdate = await getLiveUpdateById(id);
    if (!existingLiveUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: '即時動態不存在',
        },
        { status: 404 }
      );
    }

    // 檢查權限 - 只有作者或管理員可以刪除
    if (user.role !== 'ADMIN' && existingLiveUpdate.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限刪除此即時動態',
        },
        { status: 403 }
      );
    }

    // 刪除即時動態
    const success = await deleteLiveUpdate(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '刪除即時動態失敗',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '即時動態刪除成功',
    });
  } catch (error) {
    console.error('DELETE /api/dashboard/live-updates/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '刪除即時動態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH - 切換發布狀態
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 檢查即時動態是否存在
    const existingLiveUpdate = await getLiveUpdateById(id);
    if (!existingLiveUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: '即時動態不存在',
        },
        { status: 404 }
      );
    }

    // 檢查權限 - 只有作者或管理員可以改變發布狀態
    if (user.role !== 'ADMIN' && existingLiveUpdate.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限修改此即時動態狀態',
        },
        { status: 403 }
      );
    }

    // 切換發布狀態
    const updatedLiveUpdate = await toggleLiveUpdatePublished(id);

    if (!updatedLiveUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: '切換發布狀態失敗',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedLiveUpdate,
      message: `即時動態已${updatedLiveUpdate.published ? '發布' : '取消發布'}`,
    });
  } catch (error) {
    console.error('PATCH /api/dashboard/live-updates/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '切換發布狀態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
