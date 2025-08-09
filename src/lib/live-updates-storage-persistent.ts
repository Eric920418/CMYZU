// 帶持久化的即時動態資料存儲（使用檔案系統）
import { LiveUpdate } from '@/types/dashboard';
import fs from 'fs';
import path from 'path';

// 數據文件路径
const DATA_FILE = path.join(process.cwd(), 'data', 'live-updates.json');

// 確保數據目錄存在
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// 初始數據
const initialData: LiveUpdate[] = [
  {
    id: '1',
    title: '2025學年招生開始',
    content:
      '本校2025學年度招生作業正式啟動，歡迎優秀學子踴躍報名。招生簡章已於官網公布，報名截止日期為3月31日。',
    date: new Date('2025-01-15'),
    priority: 'high',
    tags: ['招生', '重要公告'],
    isPublished: true,
    order: 1,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    title: '校園網路維護通知',
    content:
      '為提升網路服務品質，將於本週六凌晨2點至6點進行系統維護，期間可能影響網路連線。',
    date: new Date('2025-01-10'),
    priority: 'medium',
    tags: ['維護', '通知'],
    isPublished: true,
    order: 2,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: '3',
    title: '圖書館延長開放時間',
    content:
      '配合期末考試期間，圖書館自下週起延長開放至晚間11點，提供同學更多讀書空間。',
    date: new Date('2025-01-08'),
    priority: 'low',
    tags: ['圖書館', '服務'],
    isPublished: true,
    order: 3,
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08'),
  },
];

// 從文件加載數據
const loadData = (): LiveUpdate[] => {
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
    console.error('載入即時動態數據失敗:', error);
    return initialData;
  }
};

// 保存數據到文件
const saveData = (data: LiveUpdate[]) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存即時動態數據失敗:', error);
  }
};

// 加載初始數據
let liveUpdatesStore: LiveUpdate[] = loadData();

// 即時動態管理器 - 統一的數據操作介面（帶持久化）
export const liveUpdatesStoragePersistent = {
  // 獲取所有即時動態
  getAll(): LiveUpdate[] {
    return [...liveUpdatesStore]; // 返回副本避免直接修改
  },

  // 根據ID獲取即時動態
  findById(id: string): LiveUpdate | undefined {
    return liveUpdatesStore.find((item) => item.id === id);
  },

  // 新增即時動態
  add(liveUpdate: LiveUpdate): void {
    // 檢查ID是否已存在
    if (liveUpdatesStore.find((item) => item.id === liveUpdate.id)) {
      throw new Error('即時動態ID已存在');
    }
    liveUpdatesStore.unshift(liveUpdate);
    saveData(liveUpdatesStore);
  },

  // 更新即時動態
  update(id: string, updates: Partial<LiveUpdate>): LiveUpdate | null {
    const index = liveUpdatesStore.findIndex((item) => item.id === id);
    if (index === -1) return null;

    liveUpdatesStore[index] = {
      ...liveUpdatesStore[index],
      ...updates,
      updatedAt: new Date(),
    };
    saveData(liveUpdatesStore);
    return liveUpdatesStore[index];
  },

  // 刪除即時動態
  delete(id: string): boolean {
    const index = liveUpdatesStore.findIndex((item) => item.id === id);
    if (index === -1) return false;

    liveUpdatesStore.splice(index, 1);
    saveData(liveUpdatesStore);
    return true;
  },

  // 批量操作
  bulkUpdate(
    action: 'publish' | 'unpublish' | 'delete',
    ids: string[]
  ): boolean {
    try {
      if (action === 'delete') {
        liveUpdatesStore = liveUpdatesStore.filter(
          (item) => !ids.includes(item.id)
        );
      } else {
        const isPublished = action === 'publish';
        liveUpdatesStore.forEach((item) => {
          if (ids.includes(item.id)) {
            item.isPublished = isPublished;
            item.updatedAt = new Date();
          }
        });
      }
      saveData(liveUpdatesStore);
      return true;
    } catch {
      return false;
    }
  },

  // 重新排序
  reorder(orderedIds: string[]): boolean {
    try {
      const reorderedItems: LiveUpdate[] = [];
      orderedIds.forEach((id, index) => {
        const item = liveUpdatesStore.find((u) => u.id === id);
        if (item) {
          reorderedItems.push({ ...item, order: index + 1 });
        }
      });

      // 添加未在排序列表中的項目
      liveUpdatesStore.forEach((item) => {
        if (!orderedIds.includes(item.id)) {
          reorderedItems.push(item);
        }
      });

      liveUpdatesStore = reorderedItems;
      saveData(liveUpdatesStore);
      return true;
    } catch {
      return false;
    }
  },

  // 獲取統計資料
  getStats() {
    const highPriorityCount = liveUpdatesStore.filter(
      (item) => item.priority === 'high'
    ).length;
    const mediumPriorityCount = liveUpdatesStore.filter(
      (item) => item.priority === 'medium'
    ).length;
    const lowPriorityCount = liveUpdatesStore.filter(
      (item) => item.priority === 'low'
    ).length;

    return {
      total: liveUpdatesStore.length,
      published: liveUpdatesStore.filter((item) => item.isPublished).length,
      unpublished: liveUpdatesStore.filter((item) => !item.isPublished).length,
      highPriority: highPriorityCount,
      mediumPriority: mediumPriorityCount,
      lowPriority: lowPriorityCount,
    };
  },

  // 重新載入數據（用於同步）
  reload() {
    liveUpdatesStore = loadData();
  },
};
