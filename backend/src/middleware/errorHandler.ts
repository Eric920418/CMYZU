import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// 自定義錯誤類別
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 全域錯誤處理中介軟體
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = '伺服器內部錯誤';
  let details: any = undefined;

  // Zod 驗證錯誤
  if (error instanceof ZodError) {
    statusCode = 400;
    message = '輸入驗證失敗';
    details = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));
  }
  // 自定義應用程式錯誤
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Prisma 錯誤
  else if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = '資料庫操作失敗';
    // 根據需要可以進一步細分 Prisma 錯誤類型
  }
  // 一般錯誤
  else if (error.message) {
    message = error.message;
  }

  // 開發環境顯示詳細錯誤
  if (process.env.NODE_ENV === 'development') {
    console.error('錯誤堆疊:', error.stack);
    details = {
      ...details,
      stack: error.stack
    };
  }

  // 回傳錯誤響應
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details })
  });
};