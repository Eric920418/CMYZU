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

// PATCH /api/rankings/[id]/reorder - 調整排名順序
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyToken(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json({ message: '請先登入' }, { status: 401 });
    }

    const body = await request.json();
    const { direction } = body;

    if (!['up', 'down'].includes(direction)) {
      return NextResponse.json({ message: '無效的移動方向' }, { status: 400 });
    }

    // 取得當前排名項目
    const currentRanking = await prisma.ranking.findUnique({
      where: { id: params.id },
    });

    if (!currentRanking) {
      return NextResponse.json(
        { message: '找不到該排名項目' },
        { status: 404 }
      );
    }

    const currentOrder = currentRanking.order;

    // 根據方向找到要交換的項目
    let targetRanking;
    if (direction === 'up') {
      // 往上移動：找到 order 小於當前且最接近的項目
      targetRanking = await prisma.ranking.findFirst({
        where: {
          order: {
            lt: currentOrder,
          },
        },
        orderBy: {
          order: 'desc',
        },
      });
    } else {
      // 往下移動：找到 order 大於當前且最接近的項目
      targetRanking = await prisma.ranking.findFirst({
        where: {
          order: {
            gt: currentOrder,
          },
        },
        orderBy: {
          order: 'asc',
        },
      });
    }

    if (!targetRanking) {
      return NextResponse.json(
        { message: '已經是第一個或最後一個項目' },
        { status: 400 }
      );
    }

    // 交換兩個項目的 order 值
    const targetOrder = targetRanking.order;

    // 使用事務確保數據一致性
    await prisma.$transaction([
      // 先將其中一個設為臨時值避免唯一性衝突
      prisma.ranking.update({
        where: { id: currentRanking.id },
        data: { order: -1 },
      }),
      // 將目標項目設為當前項目的 order
      prisma.ranking.update({
        where: { id: targetRanking.id },
        data: { order: currentOrder },
      }),
      // 將當前項目設為目標項目的 order
      prisma.ranking.update({
        where: { id: currentRanking.id },
        data: { order: targetOrder },
      }),
    ]);

    return NextResponse.json({ message: '順序調整成功' });
  } catch (error) {
    console.error('調整排名順序錯誤:', error);
    return NextResponse.json({ message: '調整排名順序失敗' }, { status: 500 });
  }
}
