import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 獲取統計數字
export async function GET() {
  try {
    let stats = await prisma.worldMapStats.findUnique({
      where: { id: 'main' },
    });

    // 如果沒有資料，建立預設資料
    if (!stats) {
      stats = await prisma.worldMapStats.create({
        data: {
          id: 'main',
          schools: 10,
          students: 925,
          countries: 8,
          continents: 4,
        },
      });
    }

    return NextResponse.json({
      schools: stats.schools,
      students: stats.students,
      countries: stats.countries,
      continents: stats.continents,
    });
  } catch (error) {
    console.error('獲取世界地圖統計數據失敗:', error);
    return NextResponse.json(
      { error: '獲取統計數據失敗: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// 更新統計數字
export async function PUT(request: NextRequest) {
  try {
    const { schools, students, countries, continents } = await request.json();

    const stats = await prisma.worldMapStats.upsert({
      where: { id: 'main' },
      update: {
        schools,
        students,
        countries,
        continents,
      },
      create: {
        id: 'main',
        schools,
        students,
        countries,
        continents,
      },
    });

    return NextResponse.json({
      schools: stats.schools,
      students: stats.students,
      countries: stats.countries,
      continents: stats.continents,
    });
  } catch (error) {
    console.error('更新世界地圖統計數據失敗:', error);
    return NextResponse.json(
      { error: '更新統計數據失敗: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
