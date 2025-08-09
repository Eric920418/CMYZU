import { NextResponse } from 'next/server';
import { annualReportsStorage } from '@/lib/annual-reports-storage-prisma';

// GET /api/annual-reports - 獲取已發布的年報（前台使用）
export async function GET() {
  try {
    const reports = await annualReportsStorage.getPublished();

    return NextResponse.json({
      success: true,
      data: reports,
      total: reports.length,
    });
  } catch (error: any) {
    console.error('GET /api/annual-reports error:', error);

    return NextResponse.json(
      {
        success: false,
        error: '獲取年報列表失敗',
        data: [],
      },
      { status: 500 }
    );
  }
}
