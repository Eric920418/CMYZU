import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// 登入資料驗證 schema
const loginSchema = z.object({
  email: z.string().email('無效的電子郵件格式'),
  password: z.string().min(1, '密碼不能為空')
});

// 變更密碼資料驗證 schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '請輸入當前密碼'),
  newPassword: z.string().min(6, '新密碼至少需要 6 個字元')
});

// 註冊功能已關閉 - 僅允許管理員和教師登錄
router.post('/register', (req, res) => {
  res.status(403).json({
    success: false,
    message: '註冊功能已關閉，僅限管理員和教師使用系統'
  });
});

// 登入端點
router.post('/login', async (req, res, next) => {
  try {
    // 驗證輸入資料
    const validatedData = loginSchema.parse(req.body);

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user || !user.active) {
      throw new AppError('無效的登入憑證', 401);
    }

    // 檢查用戶角色 - 只允許管理員和教師登錄
    if (user.role !== 'ADMIN' && user.role !== 'TEACHER') {
      throw new AppError('無權限登錄系統，僅限管理員和教師使用', 403);
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password!);

    if (!isPasswordValid) {
      throw new AppError('無效的登入憑證', 401);
    }

    // 生成 JWT 令牌
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // 更新最後登入時間
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    });

    res.json({
      success: true,
      message: '登入成功',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// 獲取當前用戶資訊
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError('用戶不存在', 404);
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// 變更密碼端點
router.put('/change-password', authenticateToken, async (req, res, next) => {
  try {
    // 驗證輸入資料
    const validatedData = changePasswordSchema.parse(req.body);

    // 查找當前用戶
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user) {
      throw new AppError('用戶不存在', 404);
    }

    // 驗證當前密碼
    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password!);

    if (!isCurrentPasswordValid) {
      throw new AppError('當前密碼錯誤', 400);
    }

    // 檢查新密碼不能與當前密碼相同
    const isSamePassword = await bcrypt.compare(validatedData.newPassword, user.password!);
    if (isSamePassword) {
      throw new AppError('新密碼不能與當前密碼相同', 400);
    }

    // 加密新密碼
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12);

    // 更新密碼
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: '密碼變更成功'
    });
  } catch (error) {
    next(error);
  }
});

// 登出端點（前端處理，清除 token）
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: '登出成功'
  });
});

export default router;