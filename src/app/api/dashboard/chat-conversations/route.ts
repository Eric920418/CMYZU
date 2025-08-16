import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/dashboard/chat-conversations
 * 取得所有聊天對話記錄，用於後台學生問題管理
 */
export async function GET() {
  try {
    // 從資料庫取得所有聊天對話，包含關聯的訊息
    const conversations = await prisma.chatConversation.findMany({
      include: {
        messages: {
          orderBy: {
            timestamp: 'asc', // 依時間排序訊息
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc', // 最新更新的對話在前面
      },
    });

    // 回傳對話資料
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching chat conversations:', error);

    return NextResponse.json(
      { error: '無法載入聊天對話資料' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dashboard/chat-conversations
 * 刪除特定對話記錄（可選功能）
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');

    if (!conversationId) {
      return NextResponse.json({ error: '缺少對話 ID' }, { status: 400 });
    }

    // 刪除對話（會自動級聯刪除相關訊息）
    await prisma.chatConversation.delete({
      where: {
        id: conversationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat conversation:', error);

    return NextResponse.json({ error: '無法刪除對話記錄' }, { status: 500 });
  }
}

/**
 * PATCH /api/dashboard/chat-conversations
 * 更新對話狀態（如標記為已處理）
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, isActive, title } = body;

    if (!conversationId) {
      return NextResponse.json({ error: '缺少對話 ID' }, { status: 400 });
    }

    // 更新對話資訊
    const updatedConversation = await prisma.chatConversation.update({
      where: {
        id: conversationId,
      },
      data: {
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(title && { title }),
      },
      include: {
        messages: {
          orderBy: {
            timestamp: 'asc',
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error('Error updating chat conversation:', error);

    return NextResponse.json({ error: '無法更新對話資訊' }, { status: 500 });
  }
}
