import { NextRequest, NextResponse } from 'next/server';
import { annualReportsStorage } from '@/lib/annual-reports-storage-prisma';
import jwt from 'jsonwebtoken';

// 驗證 JWT Token 和權限
function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any;
    if (!['ADMIN', 'TEACHER'].includes(decoded.role)) {
      throw new Error('Insufficient permissions');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET /api/dashboard/annual-reports - 獲取所有年報
export async function GET(request: NextRequest) {
  try {
    // 驗證權限
    verifyAuth(request);

    const reports = await annualReportsStorage.getAll();

    return NextResponse.json({
      success: true,
      data: reports,
      total: reports.length,
    });
  } catch (error: any) {
    console.error('GET /api/dashboard/annual-reports error:', error);

    if (
      error.message.includes('authorization') ||
      error.message.includes('token') ||
      error.message.includes('permissions')
    ) {
      return NextResponse.json(
        { success: false, error: '未授權訪問' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: '獲取年報列表失敗' },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/annual-reports - 創建新年報
export async function POST(request: NextRequest) {
  try {
    // 驗證權限
    const user = verifyAuth(request);

    const body = await request.json();
    const {
      year,
      title,
      titleEn,
      description,
      descriptionEn,
      fileUrl,
      fileName,
      fileSize,
    } = body;

    // 驗證必要欄位
    if (!year || !title || !fileUrl || !fileName) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位' },
        { status: 400 }
      );
    }

    // 驗證年度格式
    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 1) {
      return NextResponse.json(
        { success: false, error: '年度格式不正確' },
        { status: 400 }
      );
    }

    const newReport = await annualReportsStorage.create({
      year: parseInt(year),
      title,
      titleEn,
      description,
      descriptionEn,
      fileUrl,
      fileName,
      fileSize: fileSize ? parseInt(fileSize) : undefined,
      authorId: user.userId,
    });

    return NextResponse.json({
      success: true,
      data: newReport,
      message: '年報創建成功',
    });
  } catch (error: any) {
    console.error('POST /api/dashboard/annual-reports error:', error);

    if (
      error.message.includes('authorization') ||
      error.message.includes('token') ||
      error.message.includes('permissions')
    ) {
      return NextResponse.json(
        { success: false, error: '未授權訪問' },
        { status: 401 }
      );
    }

    if (error.message.includes('已存在')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: '創建年報失敗' },
      { status: 500 }
    );
  }
}

// PATCH /api/dashboard/annual-reports - 批量操作
export async function PATCH(request: NextRequest) {
  try {
    // 驗證權限
    verifyAuth(request);

    const body = await request.json();
    const { action, ids, data } = body;

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: '批量操作參數不正確' },
        { status: 400 }
      );
    }

    let result;
    let message;

    switch (action) {
      case 'toggleActive':
        // 批量切換狀態
        result = await annualReportsStorage.batchUpdate(ids, {
          isActive: data.isActive,
        });
        message = `成功更新 ${result} 個年報狀態`;
        break;

      case 'delete':
        // 批量刪除
        result = await annualReportsStorage.batchDelete(ids);
        message = `成功刪除 ${result} 個年報`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: '不支援的批量操作' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message,
      affected: result,
    });
  } catch (error: any) {
    console.error('PATCH /api/dashboard/annual-reports error:', error);

    if (
      error.message.includes('authorization') ||
      error.message.includes('token') ||
      error.message.includes('permissions')
    ) {
      return NextResponse.json(
        { success: false, error: '未授權訪問' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: '批量操作失敗' },
      { status: 500 }
    );
  }
}
