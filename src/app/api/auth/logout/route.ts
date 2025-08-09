import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // 從 Authorization header 獲取 token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: '未提供認證令牌',
        },
        { status: 401 }
      );
    }

    // 驗證 JWT (確保是有效的 token)
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // 登出主要由前端處理 (清除 localStorage 中的 token)
    // 這裡我們只返回成功消息
    return NextResponse.json({
      success: true,
      message: '登出成功',
    });
  } catch (error) {
    console.error('登出錯誤:', error);

    // 即使 token 驗證失敗，也返回成功 (因為目標是登出)
    return NextResponse.json({
      success: true,
      message: '登出成功',
    });
  }
}
