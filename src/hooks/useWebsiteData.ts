'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  News,
  FeaturedResource,
  Alumni,
  YoutubeVideo,
  InstagramPost,
  Stat,
  StatsDescription,
} from '@/types/dashboard';

// 前台資料 hooks - 提供統一的資料獲取介面

// 新聞資料 hook
export function useNewsData() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 實作 API 調用
      // const response = await fetch('/api/public/news?published=true&limit=6');
      // const data = await response.json();

      // 暫時使用模擬資料
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockNews: News[] = [
        {
          id: '1',
          title: '元智管理學院榮獲教育部教學卓越計畫殊榮',
          excerpt:
            '本院持續推動創新教學，獲得教育部肯定，將投入更多資源提升教學品質...',
          content: '',
          date: new Date('2025-08-05'),
          image: '/4.webp',
          imageUrl: '/4.webp',
          published: true,
          order: 1,
          views: 1250,
          createdAt: new Date('2025-08-05'),
          updatedAt: new Date('2025-08-05'),
        },
        {
          id: '2',
          title: '國際商管認證AACSB延展通過 躋身全球頂尖商學院',
          excerpt:
            '經過嚴格評鑑，本院成功通過AACSB國際商管認證延展，彰顯教學研究水準...',
          content: '',
          date: new Date('2025-08-03'),
          image: '/Image.webp',
          imageUrl: '/Image.webp',
          published: true,
          order: 2,
          views: 892,
          createdAt: new Date('2025-08-03'),
          updatedAt: new Date('2025-08-03'),
        },
        {
          id: '3',
          title: '產學合作再創佳績 與科技業龍頭簽署策略夥伴協議',
          excerpt:
            '本院與多家知名企業建立深度合作關係，為學生提供更多實習與就業機會...',
          content: '',
          date: new Date('2025-08-01'),
          image: '/er.webp',
          imageUrl: '/er.webp',
          published: true,
          order: 3,
          views: 645,
          createdAt: new Date('2025-08-01'),
          updatedAt: new Date('2025-08-01'),
        },
        {
          id: '4',
          title: '2025年度MBA招生說明會圓滿落幕 報名人數創新高',
          excerpt:
            '本次招生說明會吸引近千位學員參與，展現本院MBA課程的強大吸引力...',
          content: '',
          date: new Date('2025-07-30'),
          image: '/hero-building.webp',
          imageUrl: '/hero-building.webp',
          published: true,
          order: 4,
          views: 1580,
          createdAt: new Date('2025-07-30'),
          updatedAt: new Date('2025-07-30'),
        },
        {
          id: '5',
          title: '國際交換學生計畫啟動 與歐美亞洲40所大學建立合作',
          excerpt:
            '擴大國際視野，本院與全球頂尖大學簽署交換協議，提供學生海外學習機會...',
          content: '',
          date: new Date('2025-07-28'),
          image: '/4.webp',
          imageUrl: '/4.webp',
          published: true,
          order: 5,
          views: 1235,
          createdAt: new Date('2025-07-28'),
          updatedAt: new Date('2025-07-28'),
        },
        {
          id: '6',
          title: '創新創業競賽頒獎典禮 學生團隊展現卓越創意',
          excerpt:
            '年度創業競賽結果揭曉，多個學生團隊獲得評審肯定，展現創新創業活力...',
          content: '',
          date: new Date('2025-07-25'),
          image: '/Image.webp',
          imageUrl: '/Image.webp',
          published: true,
          order: 6,
          views: 987,
          createdAt: new Date('2025-07-25'),
          updatedAt: new Date('2025-07-25'),
        },
      ];

      setNews(mockNews);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入新聞失敗');
      console.error('Failed to fetch news:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, isLoading, error, refetch: fetchNews };
}

// 特色資源資料 hook
export function useFeaturedResourcesData() {
  const [resources, setResources] = useState<FeaturedResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 實作 API 調用
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockResources: FeaturedResource[] = [
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
          createdAt: new Date(),
          updatedAt: new Date(),
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
          createdAt: new Date(),
          updatedAt: new Date(),
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
          createdAt: new Date(),
          updatedAt: new Date(),
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
          createdAt: new Date(),
          updatedAt: new Date(),
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
          createdAt: new Date(),
          updatedAt: new Date(),
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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setResources(mockResources);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入特色資源失敗');
      console.error('Failed to fetch featured resources:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return { resources, isLoading, error, refetch: fetchResources };
}

// 統計資料 hook
export function useStatsData() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [descriptions, setDescriptions] = useState<StatsDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 實作 API 調用
      await new Promise((resolve) => setTimeout(resolve, 200));

      const mockStats: Stat[] = [
        {
          id: '1',
          label: '北台灣唯一英語標竿學院',
          icon: `<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`,
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          label: '企業最愛EMBA',
          icon: `<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          label: '隨意highlight',
          icon: `<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>`,
          order: 3,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          label: '隨意highlight',
          icon: `<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>`,
          order: 4,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockDescriptions: StatsDescription[] = [
        {
          id: '1',
          content:
            '為幫助學生銜接國際職場，我們積極建構國際化環境，國際學生比例超過10%，並持續成長。',
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          content:
            '與歐美、亞洲及大陸地區的海外學校積極建立合作關係，擴展雙聯學位、銜接學位及交換學生等，',
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          content:
            '目前已擁有超過100所以上的國外合作學校，知名學校包含:美國密西根大學、美國明尼蘇達大學、英國艾賽克斯大學、英國諾丁漢特倫特大學、法國雷恩商學院、德國佛茨海姆大學及澳洲昆士蘭大學等，',
          order: 3,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          content: '遍佈全球近30個國家，多達千位以上學生具備國外交流經驗。',
          order: 4,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setStats(mockStats);
      setDescriptions(mockDescriptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入統計資料失敗');
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, descriptions, isLoading, error, refetch: fetchStats };
}

// 校友資料 hook
export function useAlumniData() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlumni = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 實作 API 調用
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 使用現有的校友資料（簡化版本）
      const mockAlumni: Alumni[] = [
        {
          id: '1',
          name: '林志明',
          position: '永豐金控董事長',
          description:
            '本校商學院85級校友，成功帶領集團轉型數位金融，創造卓越經營績效',
          imageUrl: '/4.webp',
          achievements: [
            '推動永豐金控數位轉型',
            '建立ESG永續經營體系',
            '擴展海外業務版圖',
            '培養新世代金融人才',
          ],
          authorId: 'system',
          imageUrl: '/4.webp',
          stats: [
            { label: '服務年資', value: '25年', icon: '👔' },
            { label: '管理資產', value: '2.8兆', icon: '💰' },
            { label: '團隊規模', value: '8000人', icon: '👥' },
          ],
          detailContent: {
            fullTitle: '林志明校友 - 永豐金控董事長的卓越領導之路',
            overview:
              '林志明校友於1985年畢業於本校商學院財務金融系，憑藉著紮實的專業知識與卓越的領導能力，成功帶領集團在數位金融時代的轉型與發展。',
            achievements: [
              '推動永豐金控數位轉型，打造領先業界的數位金融平台',
              '建立完善的ESG永續經營體系，獲得國際認證',
              '擴展海外業務版圖，成功進軍東南亞市場',
              '培養新世代金融人才，建立企業永續發展基礎',
            ],
            impact:
              '在林志明校友的帶領下，永豐金控不僅在營運績效上創新高，更在數位創新、永續經營等面向樹立標竿，為台灣金融業的發展注入新動能。',
          },
          isActive: true,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // 可以加入更多校友...
      ];

      setAlumni(mockAlumni);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入校友資料失敗');
      console.error('Failed to fetch alumni:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  return { alumni, isLoading, error, refetch: fetchAlumni };
}

// 社群媒體資料 hook
export function useSocialMediaData() {
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 實作 API 調用
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 使用現有的社群媒體資料...
      setYoutubeVideos([]);
      setInstagramPosts([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入社群媒體資料失敗');
      console.error('Failed to fetch social media:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSocialMedia();
  }, [fetchSocialMedia]);

  return {
    youtubeVideos,
    instagramPosts,
    isLoading,
    error,
    refetch: fetchSocialMedia,
  };
}

// 全站資料重新整理 hook
export function useRefreshData() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);

    try {
      // 觸發所有資料重新載入
      // 這裡可以調用各個 hook 的 refetch 方法
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 可以發出全域事件讓各個組件重新載入資料
      window.dispatchEvent(new CustomEvent('refresh-website-data'));
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return { refreshAll, isRefreshing };
}
