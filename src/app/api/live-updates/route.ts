import { NextRequest, NextResponse } from 'next/server';
import {
  getPublishedLiveUpdates,
  getLiveUpdatesByPriority,
  type LiveUpdatePriority,
} from '@/lib/live-updates-storage-prisma';

// GET - 獲取已發布的即時動態（前台使用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const priority = searchParams.get('priority') as LiveUpdatePriority;

    let publishedUpdates;

    // 按重要程度篩選
    if (priority && ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(priority)) {
      publishedUpdates = await getLiveUpdatesByPriority(priority, true);
    } else {
      publishedUpdates = await getPublishedLiveUpdates();
    }

    // 限制數量
    if (limit > 0) {
      publishedUpdates = publishedUpdates.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: publishedUpdates,
    });
  } catch (error) {
    console.error('GET /api/live-updates error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取即時動態失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
