import { NextRequest, NextResponse } from 'next/server';
import { getPublishedNews } from '@/lib/news-storage-prisma';

// GET - 獲取已發布的新聞（前台使用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    // 獲取已發布的新聞
    let publishedNews = await getPublishedNews();

    // 搜尋過濾
    if (search) {
      publishedNews = publishedNews.filter(
        (news) =>
          news.title.toLowerCase().includes(search.toLowerCase()) ||
          news.excerpt?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 限制數量
    if (limit > 0) {
      publishedNews = publishedNews.slice(0, limit);
    }

    // 將資料庫欄位名稱對應到前台組件期望的欄位名稱，包含英文欄位
    const mappedNews = publishedNews.map((news) => ({
      ...news,
      image:
        news.imageUrl && news.imageUrl.trim() !== '' ? news.imageUrl : null, // 確保空字串或空白字串轉為 null，讓前端使用 fallback
      date: news.publishedAt || news.createdAt, // 使用發布時間作為前台顯示時間
      // 確保英文欄位也被包含
      titleEn: news.titleEn,
      excerptEn: news.excerptEn,
      contentEn: news.contentEn,
    }));

    return NextResponse.json({
      success: true,
      data: mappedNews,
    });
  } catch (error) {
    console.error('GET /api/news error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '獲取新聞失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
