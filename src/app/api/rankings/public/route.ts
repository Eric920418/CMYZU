import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/rankings/public - 取得公開的排名（前台使用，限制最多三張卡片）
export async function GET() {
  try {
    const rankings = await prisma.ranking.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      take: 3, // 限制最多返回三個排名
      select: {
        id: true,
        rank: true,
        category: true,
        subtitle: true,
        description: true,
        organization: true,
        // 英文欄位
        categoryEn: true,
        subtitleEn: true,
        descriptionEn: true,
        organizationEn: true,
        logoUrl: true,
        logoAlt: true,
        year: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(rankings);
  } catch (error) {
    console.error('取得公開排名清單錯誤:', error);
    return NextResponse.json({ message: '取得排名清單失敗' }, { status: 500 });
  }
}
