import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 取得單個教師詳細資料（前台公開 API）
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const teacherSlug = params.slug;

    // 查詢教師資料
    const teacher = await prisma.teacherProfile.findUnique({
      where: { slug: teacherSlug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            active: true,
          },
        },
        _count: {
          select: {
            // 統計已發布的文章數量
            user: {
              teacherPosts: {
                where: { published: true },
              },
            },
          },
        },
      },
    });

    if (!teacher || !teacher.user.active) {
      return NextResponse.json(
        {
          success: false,
          error: '找不到指定的教師',
        },
        { status: 404 }
      );
    }

    // 取得最新的已發布文章
    const recentPosts = await prisma.teacherPost.findMany({
      where: {
        authorId: teacher.userId,
        published: true,
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        createdAt: true,
        views: true,
        tags: true,
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...teacher,
        recentPosts,
      },
    });
  } catch (error: any) {
    console.error('取得教師資料失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取得教師資料失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
