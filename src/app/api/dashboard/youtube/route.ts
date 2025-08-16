import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 取得所有 YouTube 影片（後台管理用）
export async function GET() {
  try {
    const videos = await prisma.youTubeVideo.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { error: '取得 YouTube 影片失敗' },
      { status: 500 }
    );
  }
}

// 新增 YouTube 影片
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      titleEn,
      videoId,
      thumbnail,
      duration,
      views = 0,
      url,
      description,
      descriptionEn,
      published = true,
      order = 0,
      authorId,
    } = body;

    // 基本驗證
    if (!title || !thumbnail || !url || !authorId) {
      return NextResponse.json({ error: '必填欄位不能為空' }, { status: 400 });
    }

    const video = await prisma.youTubeVideo.create({
      data: {
        title,
        titleEn,
        videoId,
        thumbnail,
        duration,
        views: parseInt(views) || 0,
        url,
        description,
        descriptionEn,
        published,
        order: parseInt(order) || 0,
        authorId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating YouTube video:', error);
    return NextResponse.json(
      { error: '新增 YouTube 影片失敗' },
      { status: 500 }
    );
  }
}
