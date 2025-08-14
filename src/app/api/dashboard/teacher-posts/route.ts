import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/api';

// 取得教師部落格文章列表
export async function GET(request: NextRequest) {
  try {
    // 驗證 JWT
    const authResult = await verifyJWT(request);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    const user = authResult.user;

    // 檢查是否為教師或管理員
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：只有教師可以存取部落格文章',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    const authorId = searchParams.get('authorId'); // 管理員可以查看指定教師的文章

    const skip = (page - 1) * pageSize;

    // 建立查詢條件
    const where: any = {};

    // 如果是教師，只能看自己的文章；管理員可以看所有或指定教師的文章
    if (user.role === 'TEACHER') {
      where.authorId = user.id;
    } else if (user.role === 'ADMIN' && authorId) {
      where.authorId = authorId;
    }

    // 搜尋條件
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // 發布狀態篩選
    if (published !== null && published !== undefined && published !== '') {
      where.published = published === 'true';
    }

    // 分類篩選
    if (category) {
      where.category = category;
    }

    // 查詢文章
    const [posts, total] = await Promise.all([
      prisma.teacherPost.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.teacherPost.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        current: page,
        pageSize,
        total: Math.ceil(total / pageSize),
        totalItems: total,
      },
    });
  } catch (error: any) {
    console.error('取得教師部落格文章失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取得教師部落格文章失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// 建立新的教師部落格文章
export async function POST(request: NextRequest) {
  try {
    // 驗證 JWT
    const authResult = await verifyJWT(request);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    const user = authResult.user;

    // 檢查是否為教師或管理員
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：只有教師可以創建部落格文章',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      published = false,
      featured = false,
      tags = [],
      category,
      authorId, // 管理員可以指定作者
    } = body;

    // 驗證必填欄位
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: '標題和內容為必填欄位',
        },
        { status: 400 }
      );
    }

    // 確定作者 ID
    const finalAuthorId =
      user.role === 'ADMIN' && authorId ? authorId : user.id;

    // 生成 slug（如果未提供）
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // 檢查 slug 是否已存在
    const existingPost = await prisma.teacherPost.findUnique({
      where: { slug: finalSlug },
    });

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL 路徑已被使用，請選擇不同的標題或手動設定路徑',
        },
        { status: 400 }
      );
    }

    // 建立文章
    const post = await prisma.teacherPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        published,
        featured,
        tags,
        category,
        authorId: finalAuthorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: '教師部落格文章已成功創建',
    });
  } catch (error: any) {
    console.error('創建教師部落格文章失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '創建教師部落格文章失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
