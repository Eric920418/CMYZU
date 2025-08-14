import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/api';

// 取得單篇教師部落格文章
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證 JWT
    const authResult = await verifyJWT(request);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    const user = authResult.user;
    const postId = params.id;

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

    // 查詢文章
    const post = await prisma.teacherPost.findUnique({
      where: { id: postId },
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

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: '找不到指定的文章',
        },
        { status: 404 }
      );
    }

    // 檢查權限：教師只能查看自己的文章，管理員可以查看所有文章
    if (user.role === 'TEACHER' && post.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：您只能查看自己的文章',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
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

// 更新教師部落格文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證 JWT
    const authResult = await verifyJWT(request);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    const user = authResult.user;
    const postId = params.id;

    // 檢查是否為教師或管理員
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：只有教師可以編輯部落格文章',
        },
        { status: 403 }
      );
    }

    // 檢查文章是否存在
    const existingPost = await prisma.teacherPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: '找不到指定的文章',
        },
        { status: 404 }
      );
    }

    // 檢查權限：教師只能編輯自己的文章，管理員可以編輯所有文章
    if (user.role === 'TEACHER' && existingPost.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：您只能編輯自己的文章',
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
      published,
      featured,
      tags,
      category,
    } = body;

    // 如果更新 slug，檢查是否與其他文章重複
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.teacherPost.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'URL 路徑已被使用，請選擇不同的路徑',
          },
          { status: 400 }
        );
      }
    }

    // 更新文章
    const updatedPost = await prisma.teacherPost.update({
      where: { id: postId },
      data: {
        title: title || existingPost.title,
        slug: slug || existingPost.slug,
        excerpt,
        content: content || existingPost.content,
        published: published ?? existingPost.published,
        featured: featured ?? existingPost.featured,
        tags: tags || existingPost.tags,
        category,
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
      data: updatedPost,
      message: '教師部落格文章已成功更新',
    });
  } catch (error: any) {
    console.error('更新教師部落格文章失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新教師部落格文章失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// 刪除教師部落格文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證 JWT
    const authResult = await verifyJWT(request);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    const user = authResult.user;
    const postId = params.id;

    // 檢查是否為教師或管理員
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：只有教師可以刪除部落格文章',
        },
        { status: 403 }
      );
    }

    // 檢查文章是否存在
    const existingPost = await prisma.teacherPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: '找不到指定的文章',
        },
        { status: 404 }
      );
    }

    // 檢查權限：教師只能刪除自己的文章，管理員可以刪除所有文章
    if (user.role === 'TEACHER' && existingPost.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：您只能刪除自己的文章',
        },
        { status: 403 }
      );
    }

    // 刪除文章
    await prisma.teacherPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: '教師部落格文章已成功刪除',
    });
  } catch (error: any) {
    console.error('刪除教師部落格文章失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '刪除教師部落格文章失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// 切換文章發布狀態
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證 JWT
    const authResult = await verifyJWT(request);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    const user = authResult.user;
    const postId = params.id;

    // 檢查是否為教師或管理員
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：只有教師可以管理部落格文章',
        },
        { status: 403 }
      );
    }

    // 檢查文章是否存在
    const existingPost = await prisma.teacherPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: '找不到指定的文章',
        },
        { status: 404 }
      );
    }

    // 檢查權限：教師只能管理自己的文章，管理員可以管理所有文章
    if (user.role === 'TEACHER' && existingPost.authorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: '權限不足：您只能管理自己的文章',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, value } = body;

    const updateData: any = {};

    switch (action) {
      case 'toggle-publish':
        updateData.published = !existingPost.published;
        break;
      case 'toggle-featured':
        updateData.featured = !existingPost.featured;
        break;
      case 'set-publish':
        updateData.published = Boolean(value);
        break;
      case 'set-featured':
        updateData.featured = Boolean(value);
        break;
      case 'increment-views':
        updateData.views = existingPost.views + 1;
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: '不支援的操作類型',
          },
          { status: 400 }
        );
    }

    // 更新文章
    const updatedPost = await prisma.teacherPost.update({
      where: { id: postId },
      data: updateData,
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
      data: updatedPost,
      message: '文章狀態已成功更新',
    });
  } catch (error: any) {
    console.error('更新文章狀態失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新文章狀態失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
