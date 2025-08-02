import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

// 擴展 Request 介面以包含用戶資訊
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// JWT 驗證中介軟體
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: '未提供認證令牌' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // 驗證用戶是否存在且有效
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, active: true }
    });

    if (!user || !user.active) {
      res.status(401).json({ error: '無效的認證令牌' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    res.status(403).json({ error: '令牌驗證失敗' });
  }
};

// 權限檢查中介軟體
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: '未認證' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: '權限不足' });
      return;
    }

    next();
  };
};

// 管理員權限
export const requireAdmin = requireRole(['ADMIN']);

// 教師或管理員權限
export const requireTeacher = requireRole(['ADMIN', 'TEACHER']);