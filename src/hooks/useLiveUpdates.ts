import { useState, useEffect, useCallback } from 'react';
import { LiveUpdate, ApiResponse } from '@/types/dashboard';

interface UseLiveUpdatesReturn {
  liveUpdates: LiveUpdate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// 自定義 hook 用於獲取即時動態數據
export function useLiveUpdates(params?: {
  page?: number;
  pageSize?: number;
  published?: boolean;
  priority?: 'low' | 'medium' | 'high';
}): UseLiveUpdatesReturn {
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveUpdates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 使用公開 API 端點獲取即時動態
      const apiUrl = params?.published
        ? '/api/live-updates' // 前台公開 API
        : '/api/dashboard/live-updates'; // 後台管理 API

      const queryParams = new URLSearchParams();
      if (params?.pageSize)
        queryParams.append('limit', params.pageSize.toString());
      if (params?.priority) queryParams.append('priority', params.priority);

      const url = `${apiUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      // 獲取認證 token 並準備 headers
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // 如果使用後台 API，則需要認證標頭
      if (!params?.published && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const fetchResponse = await fetch(url, { headers });

      if (!fetchResponse.ok) {
        throw new Error(
          `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`
        );
      }

      const response: ApiResponse<LiveUpdate[]> = await fetchResponse.json();

      if (response.success && response.data) {
        // 轉換日期字串為Date物件
        const updatesWithDates = response.data.map((item) => ({
          ...item,
          date: new Date(item.date),
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));

        setLiveUpdates(updatesWithDates);

        // 除錯資訊
        if (typeof window !== 'undefined') {
          console.log('useLiveUpdates Debug:', {
            params,
            totalUpdates: response.data.length,
            updatesWithDates: updatesWithDates.length,
          });
        }

        // 如果沒有任何即時動態數據，設置為空陣列
        if (updatesWithDates.length === 0) {
          setLiveUpdates([]);
        }
      } else {
        throw new Error(response.error || '獲取即時動態失敗');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '網路錯誤，請重試';
      setError(errorMessage);
      console.error('獲取即時動態錯誤:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchLiveUpdates();
  }, [fetchLiveUpdates]);

  return {
    liveUpdates,
    loading,
    error,
    refetch: fetchLiveUpdates,
  };
}

// 專門獲取高重要程度即時動態的 hook
export function useHighPriorityLiveUpdates(params?: {
  page?: number;
  pageSize?: number;
  published?: boolean;
}) {
  return useLiveUpdates({ ...params, priority: 'high' });
}

// 專門獲取已發布即時動態的 hook
export function usePublishedLiveUpdates(params?: {
  page?: number;
  pageSize?: number;
  priority?: 'low' | 'medium' | 'high';
}) {
  return useLiveUpdates({ ...params, published: true });
}
