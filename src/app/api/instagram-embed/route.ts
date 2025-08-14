import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: '缺少 Instagram 貼文 URL' },
        { status: 400 }
      );
    }

    // 驗證是否為有效的 Instagram URL
    const instagramUrlPattern =
      /^https:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/;
    if (!instagramUrlPattern.test(url)) {
      return NextResponse.json(
        { error: '無效的 Instagram 貼文 URL' },
        { status: 400 }
      );
    }

    // 檢查環境變數
    const appId = process.env.FACEBOOK_APP_ID;
    const clientToken = process.env.FACEBOOK_CLIENT_TOKEN;

    if (!appId || !clientToken) {
      return NextResponse.json(
        {
          error:
            '缺少 Facebook API 設定，請檢查環境變數 FACEBOOK_APP_ID 和 FACEBOOK_CLIENT_TOKEN',
        },
        { status: 500 }
      );
    }

    // 使用 Facebook Graph API Instagram oEmbed
    const accessToken = `${appId}|${clientToken}`;
    const oembedUrl = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&omitscript=true&access_token=${accessToken}`;

    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'CMYZU-Website/1.0',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Facebook Graph API 回應錯誤: ${response.status} - ${errorData.error?.message || '未知錯誤'}`
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        html: data.html,
        url: data.url,
        title: data.title,
        author_name: data.author_name,
        author_url: data.author_url,
        width: data.width,
        height: data.height,
        thumbnail_url: data.thumbnail_url,
        provider_name: data.provider_name,
        provider_url: data.provider_url,
        type: data.type,
        version: data.version,
      },
    });
  } catch (error) {
    console.error('Instagram embed 錯誤:', error);

    return NextResponse.json(
      {
        error: 'Instagram 嵌入失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
      },
      { status: 500 }
    );
  }
}
