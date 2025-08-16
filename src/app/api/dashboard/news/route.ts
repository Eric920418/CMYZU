import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getAllNews,
  createNews,
  batchDeleteNews,
} from '@/lib/news-storage-prisma';
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

// GET - 獲取新聞列表
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

    // 獲取所有新聞
    let allNews = await getAllNews();

    // 搜尋過濾
    if (search) {
      allNews = allNews.filter(
        (news) =>
          news.title.toLowerCase().includes(search.toLowerCase()) ||
          news.excerpt?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 分頁
    const total = allNews.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedNews = allNews.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      success: true,
      data: paginatedNews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('GET /api/dashboard/news error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取新聞失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - 創建新聞
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

    // 創建新聞
    const newNews = await createNews({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      titleEn: body.titleEn,
      contentEn: body.contentEn,
      excerptEn: body.excerptEn,
      imageUrl: body.imageUrl,
      published: body.published || false,
      featured: body.featured || false,
      authorId: user.id,
      publishedAt: body.publishedAt,
    });

    return NextResponse.json({
      success: true,
      data: newNews,
      message: '新聞創建成功',
    });
  } catch (error) {
    console.error('POST /api/dashboard/news error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '創建新聞失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - 批量刪除新聞
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
          error: '請提供要刪除的新聞ID',
        },
        { status: 400 }
      );
    }

    const deletedCount = await batchDeleteNews(ids);

    return NextResponse.json({
      success: true,
      message: `成功刪除 ${deletedCount} 則新聞`,
      data: { deletedCount },
    });
  } catch (error) {
    console.error('DELETE /api/dashboard/news error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '批量刪除新聞失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
