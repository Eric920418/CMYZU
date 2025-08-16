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

// GET /api/dashboard/annual-reports/[id] - 獲取單個年報
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證權限
    verifyAuth(request);

    const report = await annualReportsStorage.getById(params.id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: '年報不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error(
      `GET /api/dashboard/annual-reports/${params.id} error:`,
      error
    );

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
      { success: false, error: '獲取年報詳情失敗' },
      { status: 500 }
    );
  }
}

// PUT /api/dashboard/annual-reports/[id] - 更新年報
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證權限
    verifyAuth(request);

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
      isActive,
    } = body;

    // 驗證年度格式（如果有提供）
    if (year) {
      const currentYear = new Date().getFullYear();
      if (year < 2000 || year > currentYear + 1) {
        return NextResponse.json(
          { success: false, error: '年度格式不正確' },
          { status: 400 }
        );
      }
    }

    const updatedReport = await annualReportsStorage.update(params.id, {
      year: year ? parseInt(year) : undefined,
      title,
      titleEn,
      description,
      descriptionEn,
      fileUrl,
      fileName,
      fileSize: fileSize ? parseInt(fileSize) : undefined,
      isActive,
    });

    return NextResponse.json({
      success: true,
      data: updatedReport,
      message: '年報更新成功',
    });
  } catch (error: any) {
    console.error(
      `PUT /api/dashboard/annual-reports/${params.id} error:`,
      error
    );

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
      { success: false, error: '更新年報失敗' },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/annual-reports/[id] - 刪除年報
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證權限
    verifyAuth(request);

    await annualReportsStorage.delete(params.id);

    return NextResponse.json({
      success: true,
      message: '年報刪除成功',
    });
  } catch (error: any) {
    console.error(
      `DELETE /api/dashboard/annual-reports/${params.id} error:`,
      error
    );

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
      { success: false, error: '刪除年報失敗' },
      { status: 500 }
    );
  }
}

// PATCH /api/dashboard/annual-reports/[id] - 切換年報狀態
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證權限
    verifyAuth(request);

    const updatedReport = await annualReportsStorage.toggleActive(params.id);

    return NextResponse.json({
      success: true,
      data: updatedReport,
      message: `年報${updatedReport.isActive ? '已啟用' : '已停用'}`,
    });
  } catch (error: any) {
    console.error(
      `PATCH /api/dashboard/annual-reports/${params.id} error:`,
      error
    );

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
      { success: false, error: '切換年報狀態失敗' },
      { status: 500 }
    );
  }
}
