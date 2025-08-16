'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useScrollState } from '@/hooks/useScrollState';
import { usePublishedNews } from '@/hooks/useNews';
import { News } from '@/types/dashboard';

// 日期格式化函數 - 添加locale參數支援多語系
const formatDate = (
  dateInput: string | Date,
  locale: string = 'zh-TW'
): string => {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return isNaN(date.getTime())
      ? locale === 'en'
        ? 'Invalid Date'
        : '無效日期'
      : date.toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-TW');
  } catch {
    return locale === 'en' ? 'Invalid Date' : '無效日期';
  }
};

// 共用的標題區塊 - 移到組件外部避免重複渲染
const TitleSection = ({
  t,
}: {
  t: (key: string, options?: { defaultValue: string }) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="text-center mb-12"
  >
    <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
      {t('title', { defaultValue: '最新消息' })}
    </h2>
    <p className="text-xl text-primary-100 max-w-3xl mx-auto">
      {t('description', { defaultValue: '掌握學院最新動態與重要資訊' })}
    </p>
  </motion.div>
);

export default function NewsSection() {
  const t = useTranslations('News');
  const locale = useLocale(); // 使用 next-intl 的 useLocale hook
  const isScrolling = useScrollState();

  // 根據語系選擇顯示的新聞內容
  const getLocalizedContent = (item: News) => {
    const isEnglish = locale === 'en';

    return {
      title: isEnglish && item.titleEn ? item.titleEn : item.title,
      excerpt: isEnglish && item.excerptEn ? item.excerptEn : item.excerpt,
      // 如果沒有對應語系的內容，fallback 到中文版本
    };
  };

  const {
    news: newsItems,
    loading,
    error,
    refetch,
  } = usePublishedNews({ pageSize: 20 });

  // 輪播狀態
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);

  // 響應式顯示數
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleItems(1);
      else if (window.innerWidth < 1024) setVisibleItems(2);
      else setVisibleItems(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 實際可見數（關鍵）
  const effectiveVisible = Math.min(visibleItems, newsItems.length || 1);

  // 資料變更時重置索引
  useEffect(() => {
    if (currentIndex >= newsItems.length) setCurrentIndex(0);
  }, [newsItems.length, currentIndex]);

  // 自動輪播
  useEffect(() => {
    if (!isAutoPlay || newsItems.length <= effectiveVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + effectiveVisible;
        return nextIndex >= newsItems.length ? 0 : nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, newsItems.length, effectiveVisible]);

  // 翻頁
  // const nextSlide = () => {
  //   setCurrentIndex((prev) => {
  //     const nextIndex = prev + effectiveVisible;
  //     return nextIndex >= newsItems.length ? 0 : nextIndex;
  //   });
  // };
  // const prevSlide = () => {
  //   setCurrentIndex((prev) => {
  //     if (prev === 0) {
  //       const lastPageStart =
  //         Math.floor((newsItems.length - 1) / effectiveVisible) *
  //         effectiveVisible;
  //       return lastPageStart;
  //     }
  //     return Math.max(0, prev - effectiveVisible);
  //   });
  // };

  // 記憶化的當前可視新聞項目
  const currentVisibleItems = useMemo(() => {
    if (newsItems.length === 0) return [];
    const startIndex = currentIndex;
    const actualVisible = Math.min(
      effectiveVisible,
      newsItems.length - startIndex
    );
    return newsItems.slice(startIndex, startIndex + actualVisible);
  }, [newsItems, currentIndex, effectiveVisible]);

  // Skeleton
  const LoadingCards = () => (
    <div className="flex">
      {Array.from({ length: effectiveVisible }).map((_, index) => (
        <div
          key={index}
          className={`flex-shrink-0 px-3 ${
            effectiveVisible === 1
              ? 'w-full'
              : effectiveVisible === 2
                ? 'w-1/2'
                : 'w-1/3'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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

  // 如果沒有新聞內容
  if (!loading && newsItems.length === 0) {
    return (
      <section className="py-16" data-section="news">
        <div className="container mx-auto">
          <TitleSection t={t} />
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
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t('no_news')}
              </h3>
              <p className="text-gray-500 text-sm">
                {t('no_news_description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 如果有錯誤且沒有新聞
  if (error && newsItems.length === 0) {
    return (
      <section className="py-16" data-section="news">
        <div className="container mx-auto">
          <TitleSection t={t} />
          <ErrorDisplay />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" data-section="news">
      <div className="container mx-auto">
        <TitleSection t={t} />

        {/* 新聞輪播容器 */}
        <div
          className={`relative mx-auto ${newsItems.length === 1 ? 'max-w-4xl' : 'max-w-7xl'}`}
        >
          <div
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <motion.div
              className={`flex ${newsItems.length === 1 ? 'justify-center' : ''}`}
            >
              {loading ? (
                <LoadingCards />
              ) : (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex"
                >
                  {currentVisibleItems.map((item) => {
                    // 取得當前語系對應的內容
                    const localizedContent = getLocalizedContent(item);

                    const date =
                      item.date instanceof Date
                        ? item.date
                        : new Date(item.date);
                    const year = !isNaN(date.getTime())
                      ? date.getFullYear()
                      : new Date().getFullYear();
                    const month = !isNaN(date.getTime())
                      ? date.getMonth() + 1
                      : new Date().getMonth() + 1;
                    const day = !isNaN(date.getTime())
                      ? date.getDate()
                      : new Date().getDate();

                    return (
                      <div
                        key={item.id}
                        className={`flex-shrink-0 px-2 transition-opacity duration-300 h-[450px] ${
                          newsItems.length === 1
                            ? 'w-[30%]'
                            : currentVisibleItems.length === 1
                              ? 'w-full'
                              : currentVisibleItems.length === 2
                                ? 'w-1/2'
                                : 'w-1/3'
                        }`}
                      >
                        <Link href={`/news/${item.id}`}>
                          <div
                            className={`group bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col ${
                              isScrolling ? '' : 'hover:shadow-2xl'
                            }`}
                            style={{ height: '450px' }}
                          >
                            {/* 新聞圖片 */}
                            <div
                              className={`relative ${newsItems.length === 1 ? 'h-48 md:h-64 lg:h-72' : 'h-48'} overflow-hidden`}
                            >
                              <Image
                                src={
                                  item.image && item.image.trim() !== ''
                                    ? item.image.startsWith('/api/images/')
                                      ? `${item.image}?t=${item.updatedAt?.getTime() || Date.now()}`
                                      : item.image
                                    : '/placeholder-news.svg'
                                }
                                alt={item.title}
                                fill
                                className={`object-cover transition-transform duration-500 ${isScrolling ? '' : 'group-hover:scale-110'}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                onError={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  if (
                                    !img.src.includes('/placeholder-news.svg')
                                  )
                                    img.src = '/placeholder-news.svg';
                                }}
                              />
                              <div className="absolute top-4 left-4">
                                <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  {t('news_type')}
                                </div>
                              </div>
                              <div className="absolute top-4 right-4">
                                <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {year}/{month}/{day}
                                </div>
                              </div>
                            </div>

                            {/* 新聞內容 */}
                            <div className="p-6 flex flex-col justify-between flex-1">
                              <div className="flex-1">
                                <h3
                                  className={`text-lg font-bold text-gray-900 mb-3 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] ${
                                    isScrolling
                                      ? ''
                                      : 'group-hover:text-primary-600'
                                  }`}
                                >
                                  {localizedContent.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[4.5rem]">
                                  {localizedContent.excerpt}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-sm text-gray-500">
                                  {formatDate(item.date, locale)}
                                </span>
                                <div
                                  className={`flex items-center text-primary-600 font-medium text-sm transition-transform duration-300 ${
                                    isScrolling
                                      ? ''
                                      : 'group-hover:translate-x-2'
                                  }`}
                                >
                                  {t('read_more')}
                                  <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* 指示器 */}
        {!loading && newsItems.length > effectiveVisible && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {Array.from({
              length: Math.ceil(newsItems.length / effectiveVisible),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * effectiveVisible)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / effectiveVisible) === index
                    ? 'bg-primary-600 scale-125'
                    : `bg-gray-300 ${isScrolling ? '' : 'hover:bg-gray-400'}`
                }`}
                aria-label={`切換到第 ${index + 1} 頁`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
