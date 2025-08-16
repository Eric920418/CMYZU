import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 更新 YouTube 影片
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      title,
      videoId,
      thumbnail,
      duration,
      views,
      url,
      description,
      published,
      order,
    } = body;

    const video = await prisma.youTubeVideo.update({
      where: { id },
      data: {
        title,
        videoId,
        thumbnail,
        duration,
        views: views ? parseInt(views) : undefined,
        url,
        description,
        published,
        order: order !== undefined ? parseInt(order) : undefined,
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

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating YouTube video:', error);
    return NextResponse.json(
      { error: '更新 YouTube 影片失敗' },
      { status: 500 }
    );
  }
}

// 刪除 YouTube 影片
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.youTubeVideo.delete({
      where: { id },
    });

    return NextResponse.json({ message: '影片刪除成功' });
  } catch (error) {
    console.error('Error deleting YouTube video:', error);
    return NextResponse.json(
      { error: '刪除 YouTube 影片失敗' },
      { status: 500 }
    );
  }
}
