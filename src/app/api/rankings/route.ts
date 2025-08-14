import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserById } from '@/lib/user-storage';
import { prisma } from '@/lib/prisma';

// 驗證 JWT Token (使用與其他 API 一致的模式)
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

// GET /api/rankings - 取得所有排名
export async function GET() {
  try {
    const rankings = await prisma.ranking.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(rankings);
  } catch (error) {
    console.error('取得排名清單錯誤:', error);
    return NextResponse.json({ message: '取得排名清單失敗' }, { status: 500 });
  }
}

// POST /api/rankings - 建立新排名
export async function POST(request: NextRequest) {
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

    // 取得最大順序值
    const maxOrderRanking = await prisma.ranking.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = (maxOrderRanking?.order || 0) + 1;

    const ranking = await prisma.ranking.create({
      data: {
        rank,
        category,
        subtitle: subtitle || null,
        description: description || null,
        logoUrl: logoUrl || null,
        logoAlt: logoAlt || null,
        organization,
        year,
        order: nextOrder,
        isActive: Boolean(isActive),
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(ranking, { status: 201 });
  } catch (error) {
    console.error('建立排名錯誤:', error);
    return NextResponse.json({ message: '建立排名失敗' }, { status: 500 });
  }
}
