// 帶持久化的新聞資料存儲（使用檔案系統）
import { News } from '@/types/dashboard';
import fs from 'fs';
import path from 'path';

// 數據文件路径
const DATA_FILE = path.join(process.cwd(), 'data', 'news.json');

// 確保數據目錄存在
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// 初始數據
const initialData: News[] = [
  {
    id: '1',
    title: '歡迎使用新聞管理系統',
    excerpt:
      '這是一個測試新聞，用於展示新聞管理功能。您可以在後台管理中新增、編輯或刪除新聞。',
    content:
      '這是一個測試新聞的完整內容。在實際使用中，您可以透過後台管理介面來管理所有新聞內容，包括新增、編輯、刪除以及控制發佈狀態。',
    date: new Date(),
    image: '/4.webp',
    isPublished: true,
    order: 1,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 從文件加載數據
const loadData = (): News[] => {
  try {
    ensureDataDir();

    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(fileContent);

      // 將日期字符串轉換為Date對象
      return data.map((item: any) => ({
        ...item,
        date: new Date(item.date),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    } else {
      // 如果文件不存在，創建初始數據
      saveData(initialData);
      return initialData;
    }
  } catch (error) {
    console.error('載入新聞數據失敗:', error);
    return initialData;
  }
};

// 保存數據到文件
const saveData = (data: News[]) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存新聞數據失敗:', error);
  }
};

// 加載初始數據
let newsDataStore: News[] = loadData();

// 新聞管理器 - 統一的數據操作介面（帶持久化）
export const newsStoragePersistent = {
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
    saveData(newsDataStore);
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
    saveData(newsDataStore);
    return newsDataStore[index];
  },

  // 刪除新聞
  delete(id: string): boolean {
    const index = newsDataStore.findIndex((n) => n.id === id);
    if (index === -1) return false;

    newsDataStore.splice(index, 1);
    saveData(newsDataStore);
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
            news.isPublished = isPublished;
            news.updatedAt = new Date();
          }
        });
      }
      saveData(newsDataStore);
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
      saveData(newsDataStore);
      return true;
    } catch {
      return false;
    }
  },

  // 獲取統計資料
  getStats() {
    return {
      total: newsDataStore.length,
      published: newsDataStore.filter((n) => n.isPublished).length,
      unpublished: newsDataStore.filter((n) => !n.isPublished).length,
      totalViews: newsDataStore.reduce((sum, n) => sum + n.views, 0),
    };
  },

  // 重新載入數據（用於同步）
  reload() {
    newsDataStore = loadData();
  },
};
