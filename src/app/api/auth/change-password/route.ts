import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { changePassword } from '@/lib/user-storage';

// 變更密碼資料驗證 schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '請輸入當前密碼'),
  newPassword: z.string().min(6, '新密碼至少需要 6 個字元'),
});

export async function PUT(request: NextRequest) {
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

    const body = await request.json();

    // 驗證輸入資料
    const validatedData = changePasswordSchema.parse(body);

    // 變更密碼
    const result = await changePassword(decoded.userId, validatedData);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('變更密碼錯誤:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: '資料驗證失敗',
          message: error.errors[0]?.message || '輸入資料格式錯誤',
        },
        { status: 400 }
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        {
          success: false,
          error: '令牌驗證失敗',
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '系統錯誤',
        message: '變更密碼時發生未知錯誤',
      },
      { status: 500 }
    );
  }
}
