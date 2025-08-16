import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 獲取所有合作學校
export async function GET() {
  try {
    const schools = await prisma.partnerSchool.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        nameEn: true,
        students: true,
        flag: true,
        latitude: true,
        longitude: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error('獲取合作學校資料失敗:', error);
    return NextResponse.json(
      { error: '獲取合作學校資料失敗: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// 新增合作學校
export async function POST(request: NextRequest) {
  try {
    // 這裡需要實際的用戶認證，暫時使用固定ID
    const authorId = 'cme475m500000lwvbwwlb3gqa'; // 使用系統管理員 ID，實際應用中需要從 session 獲取

    const { name, nameEn, students, flag, latitude, longitude } =
      await request.json();

    if (!name || !flag) {
      return NextResponse.json(
        { error: '學校名稱和國家旗幟為必填項目' },
        { status: 400 }
      );
    }

    const school = await prisma.partnerSchool.create({
      data: {
        name,
        nameEn: nameEn || null,
        students: students || 0,
        flag,
        latitude: latitude || 0,
        longitude: longitude || 0,
        authorId,
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('新增合作學校失敗:', error);

    // 處理特定的 Prisma 錯誤
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: '學校名稱已存在，請使用不同的名稱' },
        { status: 400 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: '用戶權限錯誤，請聯繫系統管理員' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: '新增學校失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
