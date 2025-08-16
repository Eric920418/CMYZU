import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// 更新合作學校
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const {
      name,
      nameEn,
      students,
      flag,
      latitude,
      longitude,
      isActive,
      order,
    } = await request.json();

    const school = await prisma.partnerSchool.update({
      where: { id: params.id },
      data: {
        name,
        nameEn: nameEn !== undefined ? nameEn || null : undefined,
        students,
        flag,
        latitude,
        longitude,
        isActive: isActive !== undefined ? isActive : true,
        order: order !== undefined ? order : 0,
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('更新合作學校失敗:', error);
    return NextResponse.json(
      { error: '更新合作學校失敗: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// 刪除合作學校
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.partnerSchool.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('刪除合作學校失敗:', error);
    return NextResponse.json(
      { error: '刪除合作學校失敗: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
