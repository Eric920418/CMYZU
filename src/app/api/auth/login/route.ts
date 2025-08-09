import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { validateUser, getSafeUserData } from '@/lib/user-storage';

// 登入資料驗證 schema
const loginSchema = z.object({
  email: z.string().email('無效的電子郵件格式'),
  password: z.string().min(1, '密碼不能為空'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 驗證輸入資料
    const validatedData = loginSchema.parse(body);

    // 驗證用戶
    const user = await validateUser(validatedData);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '登入失敗',
          message: '帳號或密碼錯誤，或無權限登錄系統',
        },
        { status: 401 }
      );
    }

    // 生成 JWT 令牌
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // 返回成功響應
    return NextResponse.json({
      success: true,
      message: '登入成功',
      data: {
        user: getSafeUserData(user),
        token,
      },
    });
  } catch (error) {
    console.error('登入錯誤:', error);

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

    return NextResponse.json(
      {
        success: false,
        error: '系統錯誤',
        message: '登入時發生未知錯誤',
      },
      { status: 500 }
    );
  }
}
