import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 取得所有教師列表（前台公開 API）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * pageSize;

    // 建立查詢條件
    const where: any = {
      // 只顯示有個人資料且啟用的教師
      teacherProfile: {
        isNot: null,
      },
      active: true,
      role: 'TEACHER',
    };

    // 搜尋條件
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        {
          teacherProfile: {
            displayName: { contains: search, mode: 'insensitive' },
          },
        },
        { teacherProfile: { bio: { contains: search, mode: 'insensitive' } } },
        { teacherProfile: { researchAreas: { has: search } } },
      ];
    }

    // 查詢教師
    const [teachers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          teacherProfile: {
            select: {
              id: true,
              displayName: true,
              slug: true,
              bio: true,
              avatar: true,
              coverImage: true,
              socialLinks: true,
              showContact: true,
              showResearch: true,
              showPosts: true,
              email: true,
              phone: true,
              office: true,
              researchAreas: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          _count: {
            select: {
              teacherPosts: {
                where: { published: true },
              },
            },
          },
        },
        orderBy: {
          teacherProfile: {
            updatedAt: 'desc',
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: teachers,
      pagination: {
        current: page,
        pageSize,
        total: Math.ceil(total / pageSize),
        totalItems: total,
      },
    });
  } catch (error: any) {
    console.error('取得教師列表失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取得教師列表失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
