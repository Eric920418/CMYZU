import express, { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router: Router = express.Router();

// 所有路由都需要認證
router.use(authenticateToken);

// 用戶更新資料驗證 schema
const updateUserSchema = z.object({
  name: z.string().min(2, '姓名至少需要 2 個字元').optional(),
  image: z.string().url('無效的圖片 URL').optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
  active: z.boolean().optional()
});

// 獲取用戶列表（僅管理員）
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { page = '1', limit = '10', role, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // 建立查詢條件
    const where: any = {};
    
    if (role && typeof role === 'string') {
      where.role = role.toUpperCase();
    }
    
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // 查詢用戶和總數
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { posts: true }
          }
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// 獲取特定用戶資訊
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // 檢查權限：用戶只能查看自己的資料，管理員可以查看所有
    if (req.user!.role !== 'ADMIN' && req.user!.id !== id) {
      throw new AppError('權限不足', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { posts: true }
        }
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

// 更新用戶資訊
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 檢查權限：用戶只能更新自己的資料，管理員可以更新所有
    if (req.user!.role !== 'ADMIN' && req.user!.id !== id) {
      throw new AppError('權限不足', 403);
    }

    // 驗證輸入資料
    const validatedData = updateUserSchema.parse(req.body);

    // 非管理員不能修改角色和啟用狀態
    if (req.user!.role !== 'ADMIN') {
      delete validatedData.role;
      delete validatedData.active;
    }

    // 檢查用戶是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new AppError('用戶不存在', 404);
    }

    // 更新用戶資料
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
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

    res.json({
      success: true,
      message: '用戶資訊更新成功',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
});

// 刪除用戶（僅管理員）
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    // 不能刪除自己
    if (req.user!.id === id) {
      throw new AppError('不能刪除自己的帳號', 400);
    }

    // 檢查用戶是否存在
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('用戶不存在', 404);
    }

    // 軟刪除：將用戶設為非活躍狀態
    await prisma.user.update({
      where: { id },
      data: { active: false }
    });

    res.json({
      success: true,
      message: '用戶已被停用'
    });
  } catch (error) {
    next(error);
  }
});

export default router;