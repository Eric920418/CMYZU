import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserById } from '@/lib/user-storage';
import { prisma } from '@/lib/prisma';

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

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/rankings/[id] - 取得單個排名
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const ranking = await prisma.ranking.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!ranking) {
      return NextResponse.json(
        { message: '找不到該排名項目' },
        { status: 404 }
      );
    }

    return NextResponse.json(ranking);
  } catch (error) {
    console.error('取得排名詳情錯誤:', error);
    return NextResponse.json({ message: '取得排名詳情失敗' }, { status: 500 });
  }
}

// PUT /api/rankings/[id] - 更新排名
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyToken(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json({ message: '請先登入' }, { status: 401 });
    }

    const body = await request.json();
    const {
      rank,
      category,
      subtitle,
      description,
      logoUrl,
      logoAlt,
      organization,
      year,
      isActive,
    } = body;

    // 驗證必填欄位
    if (!rank || !category || !organization) {
      return NextResponse.json(
        { message: '排名、類別和評鑑機構為必填欄位' },
        { status: 400 }
      );
    }

    // 檢查排名是否存在
    const existingRanking = await prisma.ranking.findUnique({
      where: { id: params.id },
    });

    if (!existingRanking) {
      return NextResponse.json(
        { message: '找不到該排名項目' },
        { status: 404 }
      );
    }

    const ranking = await prisma.ranking.update({
      where: { id: params.id },
      data: {
        rank,
        category,
        subtitle: subtitle || null,
        description: description || null,
        logoUrl: logoUrl || null,
        logoAlt: logoAlt || null,
        organization,
        year,
        isActive: Boolean(isActive),
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(ranking);
  } catch (error) {
    console.error('更新排名錯誤:', error);
    return NextResponse.json({ message: '更新排名失敗' }, { status: 500 });
  }
}

// PATCH /api/rankings/[id] - 部分更新排名（如狀態切換）
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyToken(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json({ message: '請先登入' }, { status: 401 });
    }

    const body = await request.json();

    // 檢查排名是否存在
    const existingRanking = await prisma.ranking.findUnique({
      where: { id: params.id },
    });

    if (!existingRanking) {
      return NextResponse.json(
        { message: '找不到該排名項目' },
        { status: 404 }
      );
    }

    const ranking = await prisma.ranking.update({
      where: { id: params.id },
      data: body,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(ranking);
  } catch (error) {
    console.error('更新排名狀態錯誤:', error);
    return NextResponse.json({ message: '更新排名狀態失敗' }, { status: 500 });
  }
}

// DELETE /api/rankings/[id] - 刪除排名
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyToken(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json({ message: '請先登入' }, { status: 401 });
    }

    // 檢查排名是否存在
    const existingRanking = await prisma.ranking.findUnique({
      where: { id: params.id },
    });

    if (!existingRanking) {
      return NextResponse.json(
        { message: '找不到該排名項目' },
        { status: 404 }
      );
    }

    await prisma.ranking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '排名項目已刪除' });
  } catch (error) {
    console.error('刪除排名錯誤:', error);
    return NextResponse.json({ message: '刪除排名失敗' }, { status: 500 });
  }
}
