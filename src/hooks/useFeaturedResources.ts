import { useState, useEffect } from 'react';

interface FeaturedResource {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  order: number;
}

export function useFeaturedResources() {
  const [resources, setResources] = useState<FeaturedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // 調用前台 API（不需要認證的公開端點）
        const response = await fetch('/api/featured-resources');

        if (!response.ok) {
          throw new Error('獲取特色資源失敗');
        }

        const data = await response.json();

        if (data.success && data.data) {
          // 只顯示已啟用的資源，並按順序排序
          const activeResources = data.data
            .filter((resource: FeaturedResource) => resource.isActive)
            .sort(
              (a: FeaturedResource, b: FeaturedResource) => a.order - b.order
            );

          setResources(activeResources);
        } else {
          throw new Error(data.error || '獲取特色資源失敗');
        }
      } catch (err) {
        console.error('獲取特色資源錯誤:', err);
        setError(err instanceof Error ? err.message : '未知錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return { resources, loading, error };
}
