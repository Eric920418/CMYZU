// 主視覺內容 Hook
import { useState, useEffect } from 'react';
import { HeroContent } from '@/types/dashboard';

interface UseHeroResult {
  heroContent: HeroContent | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useHero(locale: string = 'zh'): UseHeroResult {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/hero?locale=${locale}`);
      const data = await response.json();

      if (data.success && data.data) {
        setHeroContent(data.data);
      } else {
        setError(data.error || '載入主視覺內容失敗');
      }
    } catch (error) {
      console.error('載入主視覺內容失敗:', error);
      setError('載入主視覺內容失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroContent();
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    heroContent,
    loading,
    error,
    reload: fetchHeroContent,
  };
}
