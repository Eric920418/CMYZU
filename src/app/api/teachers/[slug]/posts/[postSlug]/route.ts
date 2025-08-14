import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 取得指定教師的單篇文章（前台公開 API）
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; postSlug: string } }
) {
  try {
    const { slug: teacherSlug, postSlug } = params;

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

    // 查詢文章
    const post = await prisma.teacherPost.findFirst({
      where: {
        slug: postSlug,
        authorId: teacherProfile.userId,
        published: true, // 只顯示已發布的文章
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: '找不到指定的文章',
        },
        { status: 404 }
      );
    }

    // 增加瀏覽次數
    await prisma.teacherPost.update({
      where: { id: post.id },
      data: {
        views: { increment: 1 },
      },
    });

    // 取得相關文章（同作者的其他文章）
    const relatedPosts = await prisma.teacherPost.findMany({
      where: {
        authorId: teacherProfile.userId,
        published: true,
        id: { not: post.id }, // 排除當前文章
        OR: [
          { category: post.category || '' },
          { tags: { hasSome: post.tags } },
        ],
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
        post: {
          ...post,
          views: post.views + 1, // 返回更新後的瀏覽次數
        },
        teacher: {
          id: teacherProfile.id,
          displayName: teacherProfile.displayName,
          slug: teacherProfile.slug,
          bio: teacherProfile.bio,
          avatar: teacherProfile.avatar,
          coverImage: teacherProfile.coverImage,
          socialLinks: teacherProfile.socialLinks,
          researchAreas: teacherProfile.researchAreas,
        },
        relatedPosts,
      },
    });
  } catch (error: any) {
    console.error('取得教師文章失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取得教師文章失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
