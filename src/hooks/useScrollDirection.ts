import { useState, useEffect, useRef } from 'react';

interface ScrollDirectionOptions {
  threshold?: number; // 最小滾動距離才觸發
}

/**
 * 檢測滾動方向的Hook - 精簡版
 * @param options 配置選項
 * @returns { isVisible: boolean } - header是否可見
 */
export function useScrollDirection(options: ScrollDirectionOptions = {}) {
  const { threshold = 10 } = options;
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const difference = currentScrollY - lastScrollY.current;

        // 如果滾動距離小於閾值，不處理
        if (Math.abs(difference) < threshold) {
          return;
        }

        // 向上滾動或離頂部 < 30px 時顯示
        setIsVisible(difference < 0 || currentScrollY < 30);
        lastScrollY.current = currentScrollY;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return { isVisible };
}
