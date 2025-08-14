import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/api';

// 取得教師個人資料
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
          error: '權限不足：只有教師可以存取個人資料',
        },
        { status: 403 }
      );
    }

    let profile;

    // 如果是管理員，可以查看指定教師的資料
    if (user.role === 'ADMIN') {
      const { searchParams } = new URL(request.url);
      const teacherId = searchParams.get('teacherId');

      if (teacherId) {
        profile = await prisma.teacherProfile.findUnique({
          where: { userId: teacherId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        });
      }
    }

    // 如果沒有指定或是教師身份，取得自己的資料
    if (!profile) {
      profile = await prisma.teacherProfile.findUnique({
        where: { userId: user.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('取得教師個人資料失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取得教師個人資料失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// 建立或更新教師個人資料
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
          error: '權限不足：只有教師可以管理個人資料',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      displayName,
      slug,
      bio,
      avatar,
      coverImage,
      socialLinks,
      showContact,
      showResearch,
      showPosts,
      email,
      phone,
      office,
      researchAreas,
      targetUserId, // 管理員可以指定要更新的教師
    } = body;

    // 確定要更新的用戶 ID
    const profileUserId =
      user.role === 'ADMIN' && targetUserId ? targetUserId : user.id;

    // 生成 slug（如果未提供）
    const finalSlug =
      slug ||
      displayName
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // 檢查 slug 是否已存在（排除自己）
    const existingProfile = await prisma.teacherProfile.findFirst({
      where: {
        slug: finalSlug,
        userId: { not: profileUserId },
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL 路徑已被使用，請選擇不同的顯示名稱或手動設定路徑',
        },
        { status: 400 }
      );
    }

    // 使用 upsert 創建或更新
    const profile = await prisma.teacherProfile.upsert({
      where: { userId: profileUserId },
      update: {
        displayName,
        slug: finalSlug,
        bio,
        avatar,
        coverImage,
        socialLinks: socialLinks || {},
        showContact: showContact ?? true,
        showResearch: showResearch ?? true,
        showPosts: showPosts ?? true,
        email,
        phone,
        office,
        researchAreas: researchAreas || [],
      },
      create: {
        userId: profileUserId,
        displayName: displayName || user.name,
        slug: finalSlug,
        bio,
        avatar,
        coverImage,
        socialLinks: socialLinks || {},
        showContact: showContact ?? true,
        showResearch: showResearch ?? true,
        showPosts: showPosts ?? true,
        email,
        phone,
        office,
        researchAreas: researchAreas || [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: profile,
      message: '教師個人資料已成功更新',
    });
  } catch (error: any) {
    console.error('更新教師個人資料失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新教師個人資料失敗',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
