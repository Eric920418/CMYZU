import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getNewsById,
  updateNews,
  deleteNews,
  toggleNewsPublished,
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

// GET - 獲取單個新聞
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 查找指定ID的新聞
    const news = await getNewsById(id);

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          error: '新聞不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('GET /api/dashboard/news/[id] error:', error);
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

// PUT - 更新新聞
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();

    // 檢查新聞是否存在
    const existingNews = await getNewsById(id);
    if (!existingNews) {
      return NextResponse.json(
        {
          success: false,
          error: '新聞不存在',
        },
        { status: 404 }
      );
    }

    // 檢查權限 - 只有作者或管理員可以編輯
    if (user.role !== 'ADMIN' && existingNews.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限編輯此新聞',
        },
        { status: 403 }
      );
    }

    // 更新新聞
    const updatedNews = await updateNews(id, {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      titleEn: body.titleEn,
      contentEn: body.contentEn,
      excerptEn: body.excerptEn,
      imageUrl: body.imageUrl,
      published: body.published,
      featured: body.featured,
      publishedAt: body.publishedAt,
    });

    if (!updatedNews) {
      return NextResponse.json(
        {
          success: false,
          error: '更新新聞失敗',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedNews,
      message: '新聞更新成功',
    });
  } catch (error) {
    console.error('PUT /api/dashboard/news/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新新聞失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - 刪除新聞
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 檢查新聞是否存在
    const existingNews = await getNewsById(id);
    if (!existingNews) {
      return NextResponse.json(
        {
          success: false,
          error: '新聞不存在',
        },
        { status: 404 }
      );
    }

    // 檢查權限 - 只有作者或管理員可以刪除
    if (user.role !== 'ADMIN' && existingNews.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限刪除此新聞',
        },
        { status: 403 }
      );
    }

    // 刪除新聞
    const success = await deleteNews(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '刪除新聞失敗',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '新聞刪除成功',
    });
  } catch (error) {
    console.error('DELETE /api/dashboard/news/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '刪除新聞失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH - 切換發布狀態
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 檢查新聞是否存在
    const existingNews = await getNewsById(id);
    if (!existingNews) {
      return NextResponse.json(
        {
          success: false,
          error: '新聞不存在',
        },
        { status: 404 }
      );
    }

    // 檢查權限 - 只有作者或管理員可以改變發布狀態
    if (user.role !== 'ADMIN' && existingNews.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '無權限修改此新聞狀態',
        },
        { status: 403 }
      );
    }

    // 切換發布狀態
    const updatedNews = await toggleNewsPublished(id);

    if (!updatedNews) {
      return NextResponse.json(
        {
          success: false,
          error: '切換發布狀態失敗',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedNews,
      message: `新聞已${updatedNews.published ? '發布' : '取消發布'}`,
    });
  } catch (error) {
    console.error('PATCH /api/dashboard/news/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '切換發布狀態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
