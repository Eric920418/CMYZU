import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 檢查環境變數
    const appId = process.env.FACEBOOK_APP_ID;
    const clientToken = process.env.FACEBOOK_CLIENT_TOKEN;

    if (!appId || !clientToken) {
      return NextResponse.json(
        { error: '缺少 Facebook API 設定' },
        { status: 500 }
      );
    }

    // 預設的 Instagram 貼文 URL 列表（可以從後台管理或資料庫獲取）
    const instagramPostUrls = [
      'https://www.instagram.com/p/CwB7ZjTALcJ/', // 範例 URL，需要替換為真實的貼文
      'https://www.instagram.com/p/CwA2XjTALcK/', // 範例 URL，需要替換為真實的貼文
      'https://www.instagram.com/p/CwA1XjTALcL/', // 範例 URL，需要替換為真實的貼文
    ];

    const accessToken = `${appId}|${clientToken}`;
    const results = [];

    // 依序處理每個 Instagram 貼文
    for (const url of instagramPostUrls) {
      try {
        const oembedUrl = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&omitscript=true&access_token=${accessToken}`;

        const response = await fetch(oembedUrl, {
          headers: {
            'User-Agent': 'CMYZU-Website/1.0',
          },
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            success: true,
            url: url,
            data: data,
          });
        } else {
          console.error(`無法獲取貼文 ${url}:`, response.status);
          results.push({
            success: false,
            url: url,
            error: `API 錯誤: ${response.status}`,
          });
        }
      } catch (error) {
        console.error(`處理貼文 ${url} 時發生錯誤:`, error);
        results.push({
          success: false,
          url: url,
          error: error instanceof Error ? error.message : '未知錯誤',
        });
      }
    }

    return NextResponse.json({
      success: true,
      posts: results.filter((result) => result.success),
      total: results.length,
      successCount: results.filter((result) => result.success).length,
    });
  } catch (error) {
    console.error('獲取 Instagram 貼文時發生錯誤:', error);

    return NextResponse.json(
      {
        error: '獲取 Instagram 貼文失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
      },
      { status: 500 }
    );
  }
}
