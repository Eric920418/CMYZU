import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 取得已發布的 YouTube 影片（前台用）
export async function GET() {
  try {
    const videos = await prisma.youTubeVideo.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        titleEn: true, // 英文版標題
        videoId: true,
        thumbnail: true,
        duration: true,
        views: true,
        url: true,
        description: true,
        descriptionEn: true, // 英文版描述
        createdAt: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching published YouTube videos:', error);
    return NextResponse.json(
      { error: '取得 YouTube 影片失敗' },
      { status: 500 }
    );
  }
}
