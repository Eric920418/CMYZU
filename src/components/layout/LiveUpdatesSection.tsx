'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useScrollState } from '@/hooks/useScrollState';
import { usePublishedLiveUpdates } from '@/hooks/useLiveUpdates';

// 格式化日期函數 - 支援多語系
const formatDate = (
  dateInput: string | Date,
  locale: string = 'zh'
): string => {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) {
      return locale === 'zh' ? '無效日期' : 'Invalid Date';
    }

    const localeCode = locale === 'zh' ? 'zh-TW' : 'en-US';
    return date.toLocaleDateString(localeCode);
  } catch {
    return locale === 'zh' ? '無效日期' : 'Invalid Date';
  }
};

// 取得本地化內容函數
const getLocalizedContent = (
  item: any,
  field: 'title' | 'content',
  locale: string
) => {
  const englishField = field === 'title' ? 'titleEn' : 'contentEn';
  if (locale === 'en' && item[englishField]) {
    return item[englishField];
  }
  return item[field]; // 回退到中文版本
};

export default function LiveUpdatesSection() {
  const t = useTranslations('LiveUpdates');
  const locale = useLocale();
  const isScrolling = useScrollState();

  // 即時動態數據，增加防抖以避免頻繁請求
  const { liveUpdates, loading, error, refetch } = usePublishedLiveUpdates({
    pageSize: 10,
  });

  // 添加狀態記憶，減少不必要的重渲染
  const [prevLiveUpdates, setPrevLiveUpdates] = useState(liveUpdates);

  // 即時動態輪播狀態
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 檢查數據是否真的變更，避免不必要的重渲染
  useEffect(() => {
    if (JSON.stringify(liveUpdates) !== JSON.stringify(prevLiveUpdates)) {
      setPrevLiveUpdates(liveUpdates);
      if (currentIndex >= liveUpdates.length && liveUpdates.length > 0) {
        setCurrentIndex(0);
      }
    }
  }, [liveUpdates, prevLiveUpdates, currentIndex]);

  // 自動輪播，只在數據真正變更時重新設置
  useEffect(() => {
    if (!isAutoPlay || prevLiveUpdates.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % prevLiveUpdates.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlay, prevLiveUpdates.length]);

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
          {t('loading_failed')}
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          {t('reload')}
        </button>
      </div>
    </div>
  );

  // 如果沒有即時動態內容
  if (!loading && prevLiveUpdates.length === 0) {
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
                {t('no_updates')}
              </h3>
              <p className="text-gray-500 text-sm">
                {t('no_updates_description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 如果有錯誤且沒有即時動態
  if (error && prevLiveUpdates.length === 0) {
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
                      href={`/live-updates/${prevLiveUpdates[currentIndex]?.id || '#'}`}
                      className="block group"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-primary-600 rounded-full mr-3 animate-pulse"></div>
                            <span className="text-sm font-medium text-primary-600">
                              {formatDate(
                                prevLiveUpdates[currentIndex]?.date instanceof
                                  Date
                                  ? prevLiveUpdates[currentIndex].date
                                  : new Date(
                                      prevLiveUpdates[currentIndex]?.date ||
                                        new Date()
                                    ),
                                locale
                              )}
                            </span>
                          </div>
                          <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                            {t('section_title')}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                          {getLocalizedContent(
                            prevLiveUpdates[currentIndex],
                            'title',
                            locale
                          ) || t('loading')}
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
                          {getLocalizedContent(
                            prevLiveUpdates[currentIndex],
                            'content',
                            locale
                          ) || t('loading')}
                        </p>
                        <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 group-hover:translate-x-2 transition-all duration-300">
                          {t('view_full')}
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
          {!loading && prevLiveUpdates.length > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              {prevLiveUpdates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-600 scale-150'
                      : `bg-gray-300 ${isScrolling ? '' : 'hover:bg-gray-400'}`
                  }`}
                  aria-label={t('switch_indicator', { index: index + 1 })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
