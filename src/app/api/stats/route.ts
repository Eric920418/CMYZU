import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 取得統計數據內容（公開 API）
export async function GET(request: NextRequest) {
  try {
    // 從 URL 參數或 Accept-Language 標頭取得語系
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'zh';

    // 取得統計數據內容
    let statsData = await prisma.statsContent.findUnique({
      where: { id: 'main' },
    });

    // 如果沒有資料，創建預設資料
    if (!statsData) {
      statsData = await prisma.statsContent.create({
        data: {
          id: 'main',
        },
      });
    }

    // 根據語系回傳對應內容
    const stats = {
      title: locale === 'en' ? statsData.titleEn : statsData.titleZh,
      descriptionPart1:
        locale === 'en'
          ? statsData.descriptionPart1En
          : statsData.descriptionPart1Zh,
      descriptionPart2:
        locale === 'en'
          ? statsData.descriptionPart2En
          : statsData.descriptionPart2Zh,
      descriptionPart3:
        locale === 'en'
          ? statsData.descriptionPart3En
          : statsData.descriptionPart3Zh,
      descriptionPart4:
        locale === 'en'
          ? statsData.descriptionPart4En
          : statsData.descriptionPart4Zh,
      stat1: locale === 'en' ? statsData.stat1En : statsData.stat1Zh,
      stat2: locale === 'en' ? statsData.stat2En : statsData.stat2Zh,
      stat3: locale === 'en' ? statsData.stat3En : statsData.stat3Zh,
      stat4: locale === 'en' ? statsData.stat4En : statsData.stat4Zh,
      updatedAt: statsData.updatedAt,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('取得統計數據失敗:', error);
    return NextResponse.json(
      {
        error:
          locale === 'en' ? 'Failed to get stats data' : '取得統計數據失敗',
      },
      { status: 500 }
    );
  }
}
