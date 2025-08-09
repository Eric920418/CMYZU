import { FeaturedResource } from '@/types/dashboard';

// 共享的特色資源數據源
export const featuredResourcesData: FeaturedResource[] = [
  {
    id: '1',
    title: '新戶申辦享限定首刷好禮！',
    description: '星光箱伴 邁向全球數位新戶體驗',
    image: '/4.webp',
    category: '新戶專區',
    backgroundColor: 'bg-gradient-to-br from-green-500 to-green-700',
    textColor: 'text-white',
    isActive: true,
    order: 1,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-08'),
  },
  {
    id: '2',
    title: '百貨購物 星級回饋',
    description: '刷卡分期0%利率 滿額享好禮',
    image: '/Image.webp',
    category: '購物優惠',
    backgroundColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
    textColor: 'text-white',
    isActive: true,
    order: 2,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-08'),
  },
  {
    id: '3',
    title: '億萬星空任務',
    description: '月月刷卡來追星 回饋狂飆NT$9,000 再抽紐西蘭頂級觀星之旅',
    image: '/er.webp',
    category: '星空任務',
    backgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-800',
    textColor: 'text-white',
    isActive: true,
    order: 3,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-08'),
  },
  {
    id: '4',
    title: '揪好友辦星展卡',
    description: '解鎖星級寶箱',
    image: '/4.webp',
    category: '推薦好友',
    backgroundColor: 'bg-gradient-to-br from-teal-400 to-green-500',
    textColor: 'text-white',
    isActive: true,
    order: 4,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-08'),
  },
  {
    id: '5',
    title: '聚餐用星刷',
    description: '天天最高享12%回饋',
    image: '/Image.webp',
    category: '餐飲回饋',
    backgroundColor: 'bg-gradient-to-br from-red-500 to-red-700',
    textColor: 'text-white',
    isActive: true,
    order: 5,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-08'),
  },
  {
    id: '6',
    title: '網路購物刷星展卡',
    description: '滿額並登錄享優惠',
    image: '/er.webp',
    category: '網購優惠',
    backgroundColor: 'bg-gradient-to-br from-gray-400 to-gray-600',
    textColor: 'text-white',
    isActive: true,
    order: 6,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-08'),
  },
];

// 數據管理函數
export const getFeaturedResources = () => featuredResourcesData;

export const getFeaturedResource = (id: string) =>
  featuredResourcesData.find((item) => item.id === id);

export const updateFeaturedResource = (
  id: string,
  updates: Partial<FeaturedResource>
) => {
  const index = featuredResourcesData.findIndex((item) => item.id === id);
  if (index !== -1) {
    featuredResourcesData[index] = {
      ...featuredResourcesData[index],
      ...updates,
      updatedAt: new Date(),
    };
    return featuredResourcesData[index];
  }
  return null;
};

export const deleteFeaturedResource = (id: string) => {
  const index = featuredResourcesData.findIndex((item) => item.id === id);
  if (index !== -1) {
    const deleted = featuredResourcesData.splice(index, 1);
    return deleted[0];
  }
  return null;
};

export const createFeaturedResource = (
  data: Omit<FeaturedResource, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const newId = String(
    Math.max(...featuredResourcesData.map((r) => parseInt(r.id))) + 1
  );
  const newResource: FeaturedResource = {
    ...data,
    id: newId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  featuredResourcesData.push(newResource);
  return newResource;
};
