import { prisma } from './prisma';
import type { News, User } from '@prisma/client';

// 導出 News 類型
export type { News } from '@prisma/client';

// 新聞資料介面（帶作者資訊）
export interface NewsWithAuthor extends News {
  author: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

// 創建新聞
export async function createNews(data: {
  title: string;
  content: string;
  excerpt?: string;
  titleEn?: string;
  contentEn?: string;
  excerptEn?: string;
  imageUrl?: string;
  published?: boolean;
  featured?: boolean;
  authorId: string;
  publishedAt?: Date;
}): Promise<NewsWithAuthor> {
  const news = await prisma.news.create({
    data: {
      ...data,
      publishedAt: data.published ? data.publishedAt || new Date() : null,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return news;
}

// 獲取所有新聞（管理後台使用）
export async function getAllNews(): Promise<NewsWithAuthor[]> {
  return await prisma.news.findMany({
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// 獲取已發佈新聞（前台使用）
export async function getPublishedNews(): Promise<NewsWithAuthor[]> {
  return await prisma.news.findMany({
    where: { published: true },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
  });
}

// 根據 ID 獲取新聞
export async function getNewsById(id: string): Promise<NewsWithAuthor | null> {
  return await prisma.news.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
}

// 更新新聞
export async function updateNews(
  id: string,
  data: Partial<Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>
): Promise<NewsWithAuthor | null> {
  try {
    // 如果設為發布但沒有發布時間，設定發布時間
    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    // 如果取消發布，清除發布時間
    if (data.published === false) {
      data.publishedAt = null;
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return updatedNews;
  } catch (error) {
    console.error('更新新聞失敗:', error);
    return null;
  }
}

// 刪除新聞
export async function deleteNews(id: string): Promise<boolean> {
  try {
    await prisma.news.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('刪除新聞失敗:', error);
    return false;
  }
}

// 切換新聞發布狀態
export async function toggleNewsPublished(
  id: string
): Promise<NewsWithAuthor | null> {
  try {
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) return null;

    const newPublished = !news.published;

    return await updateNews(id, {
      published: newPublished,
      publishedAt: newPublished ? new Date() : null,
    });
  } catch (error) {
    console.error('切換新聞發布狀態失敗:', error);
    return null;
  }
}

// 批量刪除新聞
export async function batchDeleteNews(ids: string[]): Promise<number> {
  try {
    const result = await prisma.news.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return result.count;
  } catch (error) {
    console.error('批量刪除新聞失敗:', error);
    return 0;
  }
}
