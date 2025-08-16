import { NextResponse } from 'next/server';

// 暫時返回系統管理員資訊，未來可整合真實的認證系統
export async function GET() {
  try {
    // TODO: 整合真實的 JWT 或 Session 認證
    // 目前返回系統管理員作為預設用戶
    const currentUser = {
      id: 'cme475m500000lwvbwwlb3gqa',
      name: '系統管理員',
      email: 'admin@cmyzu.edu.tw',
      role: 'ADMIN',
    };

    return NextResponse.json(currentUser);
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json({ error: '取得用戶資訊失敗' }, { status: 500 });
  }
}
