import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getAlumniById,
  updateAlumni,
  deleteAlumni,
  toggleAlumniStatus,
} from '@/lib/alumni-storage-prisma';
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

// GET - 獲取單一校友
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

    const alumni = await getAlumniById(params.id);

    if (!alumni) {
      return NextResponse.json(
        {
          success: false,
          error: '校友資料不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    console.error('GET /api/dashboard/alumni/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取校友資料失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT - 更新校友
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

    const body = await request.json();

    // 檢查校友是否存在
    const existingAlumni = await getAlumniById(params.id);
    if (!existingAlumni) {
      return NextResponse.json(
        {
          success: false,
          error: '校友資料不存在',
        },
        { status: 404 }
      );
    }

    // 更新校友
    const updatedAlumni = await updateAlumni(params.id, {
      name: body.name,
      position: body.position,
      description: body.description,
      nameEn: body.nameEn,
      positionEn: body.positionEn,
      descriptionEn: body.descriptionEn,
      imageUrl: body.imageUrl,
      achievements: body.achievements,
      achievementsEn: body.achievementsEn,
      isActive: body.isActive,
    });

    return NextResponse.json({
      success: true,
      data: updatedAlumni,
      message: '校友資料更新成功',
    });
  } catch (error) {
    console.error('PUT /api/dashboard/alumni/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新校友資料失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - 刪除校友
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

    // 檢查校友是否存在
    const existingAlumni = await getAlumniById(params.id);
    if (!existingAlumni) {
      return NextResponse.json(
        {
          success: false,
          error: '校友資料不存在',
        },
        { status: 404 }
      );
    }

    await deleteAlumni(params.id);

    return NextResponse.json({
      success: true,
      message: '校友資料刪除成功',
    });
  } catch (error) {
    console.error('DELETE /api/dashboard/alumni/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '刪除校友資料失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH - 切換校友狀態
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

    const updatedAlumni = await toggleAlumniStatus(params.id);

    return NextResponse.json({
      success: true,
      data: updatedAlumni,
      message: `校友狀態已${updatedAlumni.isActive ? '啟用' : '停用'}`,
    });
  } catch (error) {
    console.error('PATCH /api/dashboard/alumni/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '切換校友狀態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
