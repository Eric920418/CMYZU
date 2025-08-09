'use client';

import { useState, useEffect } from 'react';
import { AnnualReport } from '@/types/dashboard';

// 年報資料 Hook
export function useAnnualReports() {
  const [reports, setReports] = useState<AnnualReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入年報資料
  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/annual-reports');
      if (!response.ok) {
        throw new Error('載入年報失敗');
      }

      const data = await response.json();
      if (data.success) {
        setReports(data.data || []);
      } else {
        throw new Error(data.error || '載入年報失敗');
      }
    } catch (err) {
      console.error('Load annual reports error:', err);
      setError(err instanceof Error ? err.message : '載入年報失敗');
      setReports([]); // 設定空陣列作為 fallback
    } finally {
      setIsLoading(false);
    }
  };

  // 重新載入
  const reload = () => {
    loadReports();
  };

  useEffect(() => {
    loadReports();
  }, []);

  return {
    reports,
    isLoading,
    error,
    reload,
  };
}
