import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 取得指定教師的已發布文章列表（前台公開 API）
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const teacherSlug = params.slug;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    // 先查詢教師資料
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { slug: teacherSlug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            active: true,
          },
        },
      },
    });

    if (!teacherProfile || !teacherProfile.user.active) {
      return NextResponse.json(
        {
          success: false,
          error: '找不到指定的教師',
        },
        { status: 404 }
      );
    }

    const skip = (page - 1) * pageSize;

    // 建立查詢條件
    const where: any = {
      authorId: teacherProfile.userId,
      published: true, // 只顯示已發布的文章
    };

    // 搜尋條件
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 分類篩選
    if (category) {
      where.category = category;
    }

    // 標籤篩選
    if (tag) {
      where.tags = { has: tag };
    }

    // 查詢文章
    const [posts, total] = await Promise.all([
      prisma.teacherPost.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [
          { featured: 'desc' }, // 精選文章優先
          { createdAt: 'desc' },
        ],
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          published: true,
          featured: true,
          views: true,
          tags: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.teacherPost.count({ where }),
    ]);

    // 增加瀏覽次數（只對查詢到的文章）
    if (posts.length > 0) {
      await prisma.teacherPost.updateMany({
        where: {
          id: { in: posts.map((post) => post.id) },
        },
        data: {
          views: { increment: 1 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        teacher: {
          id: teacherProfile.id,
          displayName: teacherProfile.displayName,
          slug: teacherProfile.slug,
          bio: teacherProfile.bio,
          avatar: teacherProfile.avatar,
        },
        posts,
      },
      pagination: {
        current: page,
        pageSize,
        total: Math.ceil(total / pageSize),
        totalItems: total,
      },
    });
  } catch (error: any) {
    console.error('取得教師文章列表失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取得教師文章列表失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
