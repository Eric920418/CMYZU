import { useState, useEffect, useCallback } from 'react';
import { News, ApiResponse } from '@/types/dashboard';

interface UseNewsReturn {
  news: News[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// 自定義 hook 用於獲取新聞數據
export function useNews(params?: {
  page?: number;
  pageSize?: number;
  published?: boolean;
}): UseNewsReturn {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 使用公開 API 端點獲取新聞
      const apiUrl = params?.published
        ? '/api/news' // 前台公開 API
        : '/api/dashboard/news'; // 後台管理 API

      const queryParams = new URLSearchParams();
      if (params?.pageSize)
        queryParams.append('limit', params.pageSize.toString());

      const url = `${apiUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const fetchResponse = await fetch(url);

      if (!fetchResponse.ok) {
        throw new Error(
          `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`
        );
      }

      const response: ApiResponse<News[]> = await fetchResponse.json();

      if (response.success && response.data) {
        // 轉換日期字串為Date物件
        const newsWithDates = response.data.map((item) => ({
          ...item,
          date: new Date(item.date),
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));

        setNews(newsWithDates);

        // 如果沒有任何新聞數據，設置為空陣列
        if (newsWithDates.length === 0) {
          setNews([]);
        }
      } else {
        throw new Error(response.error || '獲取新聞失敗');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '網路錯誤，請重試';
      setError(errorMessage);
      console.error('獲取新聞錯誤:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.pageSize, params?.published]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
  };
}

// 專門獲取已發布新聞的 hook
export function usePublishedNews(params?: {
  page?: number;
  pageSize?: number;
}) {
  return useNews({ ...params, published: true });
}
