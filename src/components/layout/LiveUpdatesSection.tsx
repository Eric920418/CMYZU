'use client';

// import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useScrollState } from '@/hooks/useScrollState';
import { usePublishedLiveUpdates } from '@/hooks/useLiveUpdates';

// 格式化日期函數
const formatDate = (dateInput: string | Date): string => {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return isNaN(date.getTime())
      ? '無效日期'
      : date.toLocaleDateString('zh-TW');
  } catch {
    return '無效日期';
  }
};

export default function LiveUpdatesSection() {
  // const t = useTranslations('LiveUpdates');
  const isScrolling = useScrollState();

  // 即時動態數據
  const { liveUpdates, loading, error, refetch } = usePublishedLiveUpdates({
    pageSize: 10,
  });

  // 即時動態輪播狀態
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 自動輪播
  useEffect(() => {
    if (!isAutoPlay || liveUpdates.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveUpdates.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlay, liveUpdates.length]);

  // 骨架加載動畫
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
          </div>
          <div className="bg-gray-200 animate-pulse px-3 py-1 rounded-full h-6 w-20"></div>
        </div>
        <div className="h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
        </div>
        <div className="h-6 bg-gray-200 animate-pulse rounded w-32"></div>
      </div>
    </div>
  );

  // 錯誤顯示組件
  const ErrorDisplay = () => (
    <div className="text-center py-16">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        <div className="text-red-600 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          載入即時動態失敗
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          重新載入
        </button>
      </div>
    </div>
  );

  // 如果沒有即時動態內容
  if (!loading && liveUpdates.length === 0) {
    return (
      <section className="py-16" data-section="live-updates">
        <div className="container mx-auto">
          <div className="text-center py-16">
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                暫無即時動態
              </h3>
              <p className="text-gray-500 text-sm">
                目前沒有發佈的即時動態內容
                <br />
                請稍後再查看或關注我們的最新動態
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 如果有錯誤且沒有即時動態
  if (error && liveUpdates.length === 0) {
    return (
      <section className="py-16" data-section="live-updates">
        <div className="container mx-auto">
          <ErrorDisplay />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" data-section="live-updates">
      <div className="container mx-auto">
        {/* 即時動態容器 */}
        <div className="relative max-w-4xl mx-auto">
          <div
            className="overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <Link
                      href={`/live-updates/${liveUpdates[currentIndex].id}`}
                      className="block group"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-primary-600 rounded-full mr-3 animate-pulse"></div>
                            <span className="text-sm font-medium text-primary-600">
                              {formatDate(
                                liveUpdates[currentIndex].date instanceof Date
                                  ? liveUpdates[currentIndex].date
                                  : new Date(liveUpdates[currentIndex].date)
                              )}
                            </span>
                          </div>
                          <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                            即時動態
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                          {liveUpdates[currentIndex].title}
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
                          {liveUpdates[currentIndex].content}
                        </p>
                        <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 group-hover:translate-x-2 transition-all duration-300">
                          查看完整動態
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* 指示器 */}
          {!loading && liveUpdates.length > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              {liveUpdates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-600 scale-150'
                      : `bg-gray-300 ${isScrolling ? '' : 'hover:bg-gray-400'}`
                  }`}
                  aria-label={`切換到第 ${index + 1} 則動態`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
