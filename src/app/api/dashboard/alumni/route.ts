import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getAllAlumni,
  createAlumni,
  batchDeleteAlumni,
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

// GET - 獲取校友列表
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

    // 獲取所有校友
    let allAlumni = await getAllAlumni();

    // 搜尋過濾
    if (search) {
      allAlumni = allAlumni.filter(
        (alumni) =>
          alumni.name.toLowerCase().includes(search.toLowerCase()) ||
          alumni.position.toLowerCase().includes(search.toLowerCase()) ||
          alumni.description.toLowerCase().includes(search.toLowerCase()) ||
          alumni.nameEn?.toLowerCase().includes(search.toLowerCase()) ||
          alumni.positionEn?.toLowerCase().includes(search.toLowerCase()) ||
          alumni.descriptionEn?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 分頁
    const total = allAlumni.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedAlumni = allAlumni.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      success: true,
      data: paginatedAlumni,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('GET /api/dashboard/alumni error:', error);
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

// POST - 創建校友
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

    // 創建校友
    const newAlumni = await createAlumni({
      name: body.name,
      position: body.position,
      description: body.description,
      nameEn: body.nameEn,
      positionEn: body.positionEn,
      descriptionEn: body.descriptionEn,
      imageUrl: body.imageUrl,
      achievements: body.achievements || [],
      achievementsEn: body.achievementsEn || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      authorId: user.id,
    });

    return NextResponse.json({
      success: true,
      data: newAlumni,
      message: '校友資料創建成功',
    });
  } catch (error) {
    console.error('POST /api/dashboard/alumni error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '創建校友資料失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - 批量刪除校友
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
          error: '請提供要刪除的校友ID',
        },
        { status: 400 }
      );
    }

    const deletedCount = await batchDeleteAlumni(ids);

    return NextResponse.json({
      success: true,
      message: `成功刪除 ${deletedCount} 位校友`,
      data: { deletedCount },
    });
  } catch (error) {
    console.error('DELETE /api/dashboard/alumni error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '批量刪除校友失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
