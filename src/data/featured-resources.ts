import { FeaturedResource } from '@/types/dashboard';

// 共享的特色資源數據源 - 元智大學學術資源
export const featuredResourcesData: FeaturedResource[] = [
  {
    id: '1',
    title: '智慧校園系統',
    description:
      '整合校務資訊、課程選修、成績查詢等功能，提供學生便利的數位校園體驗。支援行動裝置，隨時隨地掌握校園資訊。',
    image: '/4.webp',
    category: '數位服務',
    backgroundColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
    textColor: 'text-white',
    isActive: true,
    order: 1,
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-08-15'),
  },
  {
    id: '2',
    title: '圖書館學習資源',
    description:
      '豐富的電子書籍、期刊資料庫和學術搜尋平台。提供24小時線上學習空間，支援研究論文撰寫與學術資料檢索。',
    image: '/Image.webp',
    category: '學術研究',
    backgroundColor: 'bg-gradient-to-br from-green-500 to-green-700',
    textColor: 'text-white',
    isActive: true,
    order: 2,
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-08-15'),
  },
  {
    id: '3',
    title: '創新創業中心',
    description:
      '提供創業諮詢、技術轉移、產學合作等服務。協助學生將創意轉化為實際商業價值，培養未來企業家精神。',
    image: '/er.webp',
    category: '創新育成',
    backgroundColor: 'bg-gradient-to-br from-purple-500 to-purple-700',
    textColor: 'text-white',
    isActive: true,
    order: 3,
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-08-15'),
  },
  {
    id: '4',
    title: '國際交流計畫',
    description:
      '多元化的海外學習機會，包含交換學生、雙聯學位、暑期研習等國際教育計畫，拓展全球視野。',
    image: '/4.webp',
    category: '國際教育',
    backgroundColor: 'bg-gradient-to-br from-orange-500 to-red-600',
    textColor: 'text-white',
    isActive: true,
    order: 4,
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-08-15'),
  },
  {
    id: '5',
    title: '職涯發展中心',
    description:
      '提供就業輔導、履歷健檢、企業實習媒合等服務。協助學生規劃職涯發展，提升就業競爭力。',
    image: '/Image.webp',
    category: '職涯輔導',
    backgroundColor: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    textColor: 'text-white',
    isActive: true,
    order: 5,
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-08-15'),
  },
  {
    id: '6',
    title: '學生生活支援',
    description:
      '涵蓋住宿服務、社團活動、心理諮商、課業輔導等全方位學生事務支援系統，讓校園生活更充實。',
    image: '/er.webp',
    category: '學生事務',
    backgroundColor: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    textColor: 'text-white',
    isActive: true,
    order: 6,
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-08-15'),
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
