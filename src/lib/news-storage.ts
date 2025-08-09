// 新聞資料共享存儲（實際專案中應替換為真實資料庫）
import { News } from '@/types/dashboard';

// 全域新聞數據存儲
let newsDataStore: News[] = [
  // 預設一些測試數據，確保有內容可以顯示
  {
    id: '1',
    title: '歡迎使用新聞管理系統',
    excerpt:
      '這是一個測試新聞，用於展示新聞管理功能。您可以在後台管理中新增、編輯或刪除新聞。',
    content:
      '這是一個測試新聞的完整內容。在實際使用中，您可以透過後台管理介面來管理所有新聞內容，包括新增、編輯、刪除以及控制發佈狀態。',
    date: new Date(),
    image: '/4.webp',
    imageUrl: '/4.webp',
    published: true,
    order: 1,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 新聞管理器 - 統一的數據操作介面
export const newsStorage = {
  // 獲取所有新聞
  getAll(): News[] {
    return [...newsDataStore]; // 返回副本避免直接修改
  },

  // 根據ID獲取新聞
  findById(id: string): News | undefined {
    return newsDataStore.find((n) => n.id === id);
  },

  // 新增新聞
  add(news: News): void {
    // 檢查ID是否已存在
    if (newsDataStore.find((n) => n.id === news.id)) {
      throw new Error('新聞ID已存在');
    }
    newsDataStore.unshift(news);
  },

  // 更新新聞
  update(id: string, updates: Partial<News>): News | null {
    const index = newsDataStore.findIndex((n) => n.id === id);
    if (index === -1) return null;

    newsDataStore[index] = {
      ...newsDataStore[index],
      ...updates,
      updatedAt: new Date(),
    };
    return newsDataStore[index];
  },

  // 刪除新聞
  delete(id: string): boolean {
    const index = newsDataStore.findIndex((n) => n.id === id);
    if (index === -1) return false;

    newsDataStore.splice(index, 1);
    return true;
  },

  // 批量操作
  bulkUpdate(
    action: 'publish' | 'unpublish' | 'delete',
    ids: string[]
  ): boolean {
    try {
      if (action === 'delete') {
        newsDataStore = newsDataStore.filter((n) => !ids.includes(n.id));
      } else {
        const isPublished = action === 'publish';
        newsDataStore.forEach((news) => {
          if (ids.includes(news.id)) {
            news.published = isPublished;
            news.updatedAt = new Date();
          }
        });
      }
      return true;
    } catch {
      return false;
    }
  },

  // 重新排序
  reorder(orderedIds: string[]): boolean {
    try {
      const reorderedNews: News[] = [];
      orderedIds.forEach((id, index) => {
        const news = newsDataStore.find((n) => n.id === id);
        if (news) {
          reorderedNews.push({ ...news, order: index + 1 });
        }
      });

      // 添加未在排序列表中的新聞
      newsDataStore.forEach((news) => {
        if (!orderedIds.includes(news.id)) {
          reorderedNews.push(news);
        }
      });

      newsDataStore = reorderedNews;
      return true;
    } catch {
      return false;
    }
  },

  // 獲取統計資料
  getStats() {
    return {
      total: newsDataStore.length,
      published: newsDataStore.filter((n) => n.published).length,
      unpublished: newsDataStore.filter((n) => !n.published).length,
      totalViews: newsDataStore.reduce((sum, n) => sum + n.views, 0),
    };
  },
};
