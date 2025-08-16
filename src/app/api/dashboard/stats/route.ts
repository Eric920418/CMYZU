import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 取得統計數據內容（返回所有語系）
export async function GET() {
  try {
    // 取得或建立預設的統計數據內容
    let stats = await prisma.statsContent.findUnique({
      where: { id: 'main' },
    });

    // 如果沒有資料，建立預設資料
    if (!stats) {
      stats = await prisma.statsContent.create({
        data: {
          id: 'main',
        },
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('取得統計數據失敗:', error);
    return NextResponse.json({ error: '取得統計數據失敗' }, { status: 500 });
  }
}

// PUT: 更新統計數據內容（支援多語系）
export async function PUT(request: NextRequest) {
  try {
    // 檢查用戶認證 (可選，依您的需求)
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: '未授權' }, { status: 401 });
    // }

    const body = await request.json();
    const {
      // 中文內容
      titleZh,
      descriptionPart1Zh,
      descriptionPart2Zh,
      descriptionPart3Zh,
      descriptionPart4Zh,
      stat1Zh,
      stat2Zh,
      stat3Zh,
      stat4Zh,
      // 英文內容
      titleEn,
      descriptionPart1En,
      descriptionPart2En,
      descriptionPart3En,
      descriptionPart4En,
      stat1En,
      stat2En,
      stat3En,
      stat4En,
    } = body;

    // 更新統計數據內容
    const updatedStats = await prisma.statsContent.upsert({
      where: { id: 'main' },
      update: {
        // 中文內容
        titleZh,
        descriptionPart1Zh,
        descriptionPart2Zh,
        descriptionPart3Zh,
        descriptionPart4Zh,
        stat1Zh,
        stat2Zh,
        stat3Zh,
        stat4Zh,
        // 英文內容
        titleEn,
        descriptionPart1En,
        descriptionPart2En,
        descriptionPart3En,
        descriptionPart4En,
        stat1En,
        stat2En,
        stat3En,
        stat4En,
      },
      create: {
        id: 'main',
        // 中文內容
        titleZh,
        descriptionPart1Zh,
        descriptionPart2Zh,
        descriptionPart3Zh,
        descriptionPart4Zh,
        stat1Zh,
        stat2Zh,
        stat3Zh,
        stat4Zh,
        // 英文內容
        titleEn,
        descriptionPart1En,
        descriptionPart2En,
        descriptionPart3En,
        descriptionPart4En,
        stat1En,
        stat2En,
        stat3En,
        stat4En,
      },
    });

    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error('更新統計數據失敗:', error);
    return NextResponse.json({ error: '更新統計數據失敗' }, { status: 500 });
  }
}
