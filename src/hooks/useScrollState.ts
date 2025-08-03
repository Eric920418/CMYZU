'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 滾動狀態檢測 hook
 * 檢測用戶是否正在滾動，在滾動期間禁用 hover 效果
 */
export function useScrollState() {
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    // 用戶開始滾動時設為 true
    setIsScrolling(true);
  }, []);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScrollEnd = () => {
      // 清除之前的 timeout
      clearTimeout(scrollTimeout);

      // 設置新的 timeout，滾動停止 150ms 後認為滾動結束
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const scrollHandler = () => {
      handleScroll();
      handleScrollEnd();
    };

    // 監聽滾動事件
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // 清理函數
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll]);

  return isScrolling;
}
