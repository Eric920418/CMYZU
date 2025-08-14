import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 取得統計數據內容（公開 API）
export async function GET() {
  try {
    // 取得統計數據內容
    let stats = await prisma.statsContent.findUnique({
      where: { id: 'main' },
    });

    // 如果沒有資料，回傳預設資料
    if (!stats) {
      stats = {
        id: 'main',
        title: '國際化商管教育領航者',
        descriptionPart1:
          '為幫助學生銜接國際職場，我們積極建構國際化環境，國際學生比例超過10%，並持續成長。',
        descriptionPart2:
          '與歐美、亞洲及大陸地區的海外學校積極建立合作關係，擴展雙聯學位、銜接學位及交換學生等，',
        descriptionPart3:
          '目前已擁有超過100所以上的國外合作學校，知名學校包含:美國密西根大學、美國明尼蘇達大學、英國艾賽克斯大學、英國諾丁漢特倫特大學、法國雷恩商學院、德國佛茨海姆大學及澳洲昆士蘭大學等，',
        descriptionPart4:
          '遍佈全球近30個國家，多達千位以上學生具備國外交流經驗。',
        stat1: '北台灣唯一英語標竿學院',
        stat2: '企業最愛EMBA',
        stat3: '隨意highlight',
        stat4: '隨意highlight',
        updatedAt: new Date(),
      };
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('取得統計數據失敗:', error);
    return NextResponse.json({ error: '取得統計數據失敗' }, { status: 500 });
  }
}
