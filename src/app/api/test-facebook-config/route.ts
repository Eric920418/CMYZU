import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const appId = process.env.FACEBOOK_APP_ID;
    const clientToken = process.env.FACEBOOK_CLIENT_TOKEN;

    return NextResponse.json({
      success: true,
      hasAppId: !!appId,
      hasClientToken: !!clientToken,
      appIdPreview: appId
        ? `${appId.substring(0, 4)}...${appId.substring(appId.length - 4)}`
        : 'Not found',
      clientTokenPreview: clientToken
        ? `${clientToken.substring(0, 4)}...${clientToken.substring(clientToken.length - 4)}`
        : 'Not found',
      message:
        appId && clientToken ? 'Facebook API 設定完成' : '缺少必要的環境變數',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: '檢查環境變數時發生錯誤',
        details: error instanceof Error ? error.message : '未知錯誤',
      },
      { status: 500 }
    );
  }
}
