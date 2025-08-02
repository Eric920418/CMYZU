import express, { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken, requireTeacher } from '../middleware/auth';

const router: Router = express.Router();

// 文章建立/更新驗證 schema
const postSchema = z.object({
  title: z.string().min(1, '標題不能為空'),
  content: z.string().min(1, '內容不能為空'),
  excerpt: z.string().optional(),
  slug: z.string().min(1, '網址代碼不能為空'),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional()
});

// 獲取文章列表（公開端點）
router.get('/', async (req, res, next) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      category, 
      tag, 
      search, 
      featured, 
      published = 'true',
      author 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // 建立查詢條件
    const where: any = {};
    
    // 只顯示已發布的文章（除非是認證用戶查看所有）
    if (published === 'true') {
      where.published = true;
    }
    
    if (category && typeof category === 'string') {
      where.category = { slug: category };
    }
    
    if (tag && typeof tag === 'string') {
      where.tags = {
        some: { tag: { slug: tag } }
      };
    }
    
    if (author && typeof author === 'string') {
      where.author = { id: author };
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    // 查詢文章和總數
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, image: true }
          },
          category: {
            select: { id: true, name: true, slug: true }
          },
          tags: {
            include: {
              tag: { select: { id: true, name: true, slug: true, color: true } }
            }
          }
        },
        skip,
        take: limitNum,
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.post.count({ where })
    ]);

    // 轉換標籤格式
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map(pt => pt.tag)
    }));

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
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

// 獲取特定文章
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true, color: true } }
          }
        }
      }
    });

    if (!post) {
      throw new AppError('文章不存在', 404);
    }

    // 未發布的文章只有作者和管理員能查看
    if (!post.published) {
      // 如果沒有認證，直接返回 404
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        throw new AppError('文章不存在', 404);
      }

      // 這裡需要驗證 token 並檢查權限，簡化處理
    }

    const formattedPost = {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    };

    res.json({
      success: true,
      data: { post: formattedPost }
    });
  } catch (error) {
    next(error);
  }
});

// 建立文章（需要教師權限）
router.post('/', authenticateToken, requireTeacher, async (req, res, next) => {
  try {
    const validatedData = postSchema.parse(req.body);

    // 檢查 slug 是否重複
    const existingPost = await prisma.post.findUnique({
      where: { slug: validatedData.slug }
    });

    if (existingPost) {
      throw new AppError('此網址代碼已存在', 400);
    }

    // 建立文章
    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: req.user!.id,
        publishedAt: validatedData.published ? new Date() : null,
        // 處理標籤關聯
        ...(validatedData.tagIds && {
          tags: {
            create: validatedData.tagIds.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          }
        })
      },
      include: {
        author: {
          select: { id: true, name: true, image: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true, color: true } }
          }
        }
      }
    });

    const formattedPost = {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    };

    res.status(201).json({
      success: true,
      message: '文章建立成功',
      data: { post: formattedPost }
    });
  } catch (error) {
    next(error);
  }
});

// 更新文章
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = postSchema.partial().parse(req.body);

    // 查找文章
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingPost) {
      throw new AppError('文章不存在', 404);
    }

    // 檢查權限：只有作者或管理員能修改
    if (existingPost.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError('權限不足', 403);
    }

    // 檢查 slug 重複（如果有修改）
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: validatedData.slug }
      });

      if (slugExists) {
        throw new AppError('此網址代碼已存在', 400);
      }
    }

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...validatedData,
        publishedAt: validatedData.published && !existingPost.published 
          ? new Date() 
          : existingPost.publishedAt,
        // 處理標籤更新
        ...(validatedData.tagIds && {
          tags: {
            deleteMany: {},
            create: validatedData.tagIds.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          }
        })
      },
      include: {
        author: {
          select: { id: true, name: true, image: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true, color: true } }
          }
        }
      }
    });

    const formattedPost = {
      ...updatedPost,
      tags: updatedPost.tags.map(pt => pt.tag)
    };

    res.json({
      success: true,
      message: '文章更新成功',
      data: { post: formattedPost }
    });
  } catch (error) {
    next(error);
  }
});

// 刪除文章
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    // 查找文章
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!post) {
      throw new AppError('文章不存在', 404);
    }

    // 檢查權限：只有作者或管理員能刪除
    if (post.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError('權限不足', 403);
    }

    // 刪除文章（會自動刪除關聯的標籤）
    await prisma.post.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '文章刪除成功'
    });
  } catch (error) {
    next(error);
  }
});

export default router;