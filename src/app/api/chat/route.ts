import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 系統提示詞，讓 AI 知道自己是元智大學的客服
const SYSTEM_PROMPT = `你是元智大學（Yuan Ze University）的AI客服助手。你的任務是幫助學生、家長和訪客解答關於元智大學的各種問題。

你應該：
1. 用繁體中文回答問題
2. 提供準確、友善且有幫助的資訊
3. 關於元智大學的學術課程、招生資訊、校園生活、設施服務等相關問題
4. 如果不確定某些具體資訊，建議聯繫相關部門
5. 保持專業和親切的語調

你不應該：
1. 提供不相關或不準確的資訊
2. 討論與元智大學無關的話題
3. 提供個人意見或建議（除非是關於學習和校園生活的一般建議）

如果有人問候你，請友善地介紹自己是元智大學的AI客服助手，願意協助解答相關問題。`;

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: '訊息內容不能為空' }, { status: 400 });
    }

    // 如果沒有對話ID，創建新對話
    let conversation;
    if (conversationId) {
      conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { timestamp: 'asc' } } },
      });
    }

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          sessionId: sessionId || undefined,
          title: message.substring(0, 50), // 使用前50個字符作為標題
        },
        include: { messages: true },
      });
    }

    // 儲存用戶訊息
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    });

    // 準備對話歷史給 OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // 加入最近的對話歷史（最多10組對話）
    const recentMessages = conversation.messages.slice(-20);
    recentMessages.forEach((msg) => {
      messages.push({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      });
    });

    // 加入當前用戶訊息
    messages.push({ role: 'user', content: message });

    // 調用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // 使用較便宜的模型
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('無法獲取 AI 回應');
    }

    // 儲存 AI 回應
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: assistantMessage,
      },
    });

    return NextResponse.json({
      message: assistantMessage,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('聊天 API 錯誤:', error);

    // 詳細錯誤處理
    let errorMessage = '抱歉，系統發生錯誤，請稍後再試';

    if (error instanceof Error) {
      // OpenAI API 錯誤
      if (error.message.includes('API key')) {
        errorMessage = 'AI 服務配置錯誤，請聯繫管理員';
      } else if (error.message.includes('quota')) {
        errorMessage = 'AI 服務暫時不可用，請稍後再試';
      } else if (error.message.includes('rate_limit')) {
        errorMessage = '請求過於頻繁，請稍等一下再試';
      } else {
        errorMessage = `系統錯誤：${error.message}`;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 獲取對話歷史
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const sessionId = searchParams.get('sessionId');

    if (!conversationId && !sessionId) {
      return NextResponse.json(
        { error: '需要提供對話ID或會話ID' },
        { status: 400 }
      );
    }

    let conversation;
    if (conversationId) {
      conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
          },
        },
      });
    } else if (sessionId) {
      // 獲取會話的最新對話
      conversation = await prisma.chatConversation.findFirst({
        where: { sessionId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!conversation) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({
      conversationId: conversation.id,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error('獲取對話歷史錯誤:', error);
    return NextResponse.json({ error: '無法獲取對話歷史' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
