import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserById, getSafeUserData } from '@/lib/user-storage';

export async function GET(request: NextRequest) {
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

    // 驗證 JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any;

    // 查找用戶
    const user = await findUserById(decoded.userId);

    if (!user || !user.active) {
      return NextResponse.json(
        {
          success: false,
          error: '無效的認證令牌',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: getSafeUserData(user),
      },
    });
  } catch (error) {
    console.error('認證驗證錯誤:', error);

    return NextResponse.json(
      {
        success: false,
        error: '令牌驗證失敗',
      },
      { status: 403 }
    );
  }
}
