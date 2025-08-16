import { prisma } from './prisma';
import type { LiveUpdate, User, LiveUpdatePriority } from '@prisma/client';

// 導出 LiveUpdate 類型
export type { LiveUpdate, LiveUpdatePriority } from '@prisma/client';

// 即時動態資料介面（帶作者資訊）
export interface LiveUpdateWithAuthor extends LiveUpdate {
  author: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

// 創建即時動態
export async function createLiveUpdate(data: {
  title: string;
  content: string;
  // 英文欄位
  titleEn?: string;
  contentEn?: string;
  priority?: LiveUpdatePriority;
  published?: boolean;
  tags?: string[];
  authorId: string;
}): Promise<LiveUpdateWithAuthor> {
  const liveUpdate = await prisma.liveUpdate.create({
    data: {
      title: data.title,
      content: data.content,
      // 英文欄位
      titleEn: data.titleEn,
      contentEn: data.contentEn,
      priority: data.priority || 'MEDIUM',
      published: data.published || false,
      tags: data.tags || [],
      authorId: data.authorId,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return liveUpdate;
}

// 獲取所有即時動態（管理後台使用）
export async function getAllLiveUpdates(): Promise<LiveUpdateWithAuthor[]> {
  return await prisma.liveUpdate.findMany({
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// 獲取已發佈即時動態（前台使用）
export async function getPublishedLiveUpdates(): Promise<
  LiveUpdateWithAuthor[]
> {
  return await prisma.liveUpdate.findMany({
    where: { published: true },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: [
      { priority: 'desc' }, // 優先級高的在前
      { createdAt: 'desc' }, // 時間新的在前
    ],
  });
}

// 根據 ID 獲取即時動態
export async function getLiveUpdateById(
  id: string
): Promise<LiveUpdateWithAuthor | null> {
  return await prisma.liveUpdate.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
}

// 更新即時動態
export async function updateLiveUpdate(
  id: string,
  data: Partial<Omit<LiveUpdate, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>
): Promise<LiveUpdateWithAuthor | null> {
  try {
    const updatedLiveUpdate = await prisma.liveUpdate.update({
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

    return updatedLiveUpdate;
  } catch (error) {
    console.error('更新即時動態失敗:', error);
    return null;
  }
}

// 刪除即時動態
export async function deleteLiveUpdate(id: string): Promise<boolean> {
  try {
    await prisma.liveUpdate.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('刪除即時動態失敗:', error);
    return false;
  }
}

// 切換即時動態發布狀態
export async function toggleLiveUpdatePublished(
  id: string
): Promise<LiveUpdateWithAuthor | null> {
  try {
    const liveUpdate = await prisma.liveUpdate.findUnique({ where: { id } });
    if (!liveUpdate) return null;

    const newPublished = !liveUpdate.published;

    return await updateLiveUpdate(id, { published: newPublished });
  } catch (error) {
    console.error('切換即時動態發布狀態失敗:', error);
    return null;
  }
}

// 批量刪除即時動態
export async function batchDeleteLiveUpdates(ids: string[]): Promise<number> {
  try {
    const result = await prisma.liveUpdate.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return result.count;
  } catch (error) {
    console.error('批量刪除即時動態失敗:', error);
    return 0;
  }
}

// 根據優先級獲取即時動態
export async function getLiveUpdatesByPriority(
  priority: LiveUpdatePriority,
  publishedOnly: boolean = true
): Promise<LiveUpdateWithAuthor[]> {
  return await prisma.liveUpdate.findMany({
    where: {
      priority,
      ...(publishedOnly && { published: true }),
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// 根據標籤搜尋即時動態
export async function searchLiveUpdatesByTags(
  tags: string[],
  publishedOnly: boolean = true
): Promise<LiveUpdateWithAuthor[]> {
  return await prisma.liveUpdate.findMany({
    where: {
      tags: { hasSome: tags },
      ...(publishedOnly && { published: true }),
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
