'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useScrollState } from '@/hooks/useScrollState';

// 新聞稿輪播展示區塊
export default function NewsSection() {
  const t = useTranslations('News');
  const isScrolling = useScrollState();

  // 新聞稿數據 - 按時間順序排列
  const newsItems = useMemo(
    () => [
      {
        id: 1,
        title: t('news_1_title', {
          defaultValue: '元智管理學院榮獲教育部教學卓越計畫殊榮',
        }),
        excerpt: t('news_1_excerpt', {
          defaultValue:
            '本院持續推動創新教學，獲得教育部肯定，將投入更多資源提升教學品質...',
        }),
        date: '2025-08-05',
        image: '/4.webp',
      },
      {
        id: 2,
        title: t('news_2_title', {
          defaultValue: '國際商管認證AACSB延展通過 躋身全球頂尖商學院',
        }),
        excerpt: t('news_2_excerpt', {
          defaultValue:
            '經過嚴格評鑑，本院成功通過AACSB國際商管認證延展，彰顯教學研究水準...',
        }),
        date: '2025-08-03',
        image: '/Image.webp',
      },
      {
        id: 3,
        title: t('news_3_title', {
          defaultValue: '產學合作再創佳績 與科技業龍頭簽署策略夥伴協議',
        }),
        excerpt: t('news_3_excerpt', {
          defaultValue:
            '本院與多家知名企業建立深度合作關係，為學生提供更多實習與就業機會...',
        }),
        date: '2025-08-01',
        image: '/er.webp',
      },
      {
        id: 4,
        title: t('news_4_title', {
          defaultValue: '2025年度MBA招生說明會圓滿落幕 報名人數創新高',
        }),
        excerpt: t('news_4_excerpt', {
          defaultValue:
            '本次招生說明會吸引近千位學員參與，展現本院MBA課程的強大吸引力...',
        }),
        date: '2025-07-30',
        image: '/hero-building.webp',
      },
      {
        id: 5,
        title: t('news_5_title', {
          defaultValue: '國際交換學生計畫啟動 與歐美亞洲40所大學建立合作',
        }),
        excerpt: t('news_5_excerpt', {
          defaultValue:
            '擴大國際視野，本院與全球頂尖大學簽署交換協議，提供學生海外學習機會...',
        }),
        date: '2025-07-28',
        image: '/4.webp',
      },
      {
        id: 6,
        title: t('news_6_title', {
          defaultValue: '創新創業競賽頒獎典禮 學生團隊展現卓越創意',
        }),
        excerpt: t('news_6_excerpt', {
          defaultValue:
            '年度創業競賽結果揭曉，多個學生團隊獲得評審肯定，展現創新創業活力...',
        }),
        date: '2025-07-25',
        image: '/Image.webp',
      },
    ],
    [t]
  );

  // 輪播狀態
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);

  // 響應式顯示項目數量
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 自動輪播
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, newsItems.length]);

  // 下一張/上一張控制
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  // 獲取當前顯示的新聞項目
  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < visibleItems; i++) {
      const index = (currentIndex + i) % newsItems.length;
      items.push({ ...newsItems[index], displayIndex: i });
    }
    return items;
  };

  return (
    <section className="py-16" data-section="news">
      <div className="container mx-auto px-4">
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

        {/* 輪播容器 */}
        <div className="relative max-w-7xl mx-auto">
          <div
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <motion.div className="flex">
              <AnimatePresence>
                {getVisibleItems().map((item) => {
                  const date = new Date(item.date);
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  const day = date.getDate();

                  return (
                    <motion.div
                      key={`${item.id}-${currentIndex}`}
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeInOut',
                        delay: item.displayIndex * 0.1,
                      }}
                      className={`flex-shrink-0 px-3 ${
                        visibleItems === 1
                          ? 'w-full'
                          : visibleItems === 2
                            ? 'w-1/2'
                            : 'w-1/3'
                      }`}
                    >
                      <Link href={`/news/${item.id}`}>
                        <div
                          className={`group bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden h-full border border-gray-100 ${
                            isScrolling ? '' : 'hover:shadow-2xl'
                          }`}
                        >
                          {/* 新聞圖片 */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className={`object-cover transition-transform duration-500 ${
                                isScrolling ? '' : 'group-hover:scale-110'
                              }`}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute top-4 left-4">
                              <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                新聞稿
                              </div>
                            </div>
                            <div className="absolute top-4 right-4">
                              <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                {year}/{month}/{day}
                              </div>
                            </div>
                          </div>

                          {/* 新聞內容 */}
                          <div className="p-6">
                            <h3
                              className={`text-lg font-bold text-gray-900 mb-3 transition-colors duration-300 line-clamp-2 ${
                                isScrolling
                                  ? ''
                                  : 'group-hover:text-primary-600'
                              }`}
                            >
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                              {item.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                {new Date(item.date).toLocaleDateString(
                                  'zh-TW'
                                )}
                              </span>
                              <div
                                className={`flex items-center text-primary-600 font-medium text-sm transition-transform duration-300 ${
                                  isScrolling ? '' : 'group-hover:translate-x-2'
                                }`}
                              >
                                閱讀更多
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* 輪播控制按鈕 */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 text-gray-600 transition-all duration-300 z-10 ${
              isScrolling ? '' : 'hover:shadow-xl hover:text-primary-600'
            }`}
            aria-label="上一張"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 text-gray-600 transition-all duration-300 z-10 ${
              isScrolling ? '' : 'hover:shadow-xl hover:text-primary-600'
            }`}
            aria-label="下一張"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        {/* 指示器 */}
        <div className="flex justify-center items-center mt-8 space-x-2">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary-600 scale-125'
                  : `bg-gray-300 ${isScrolling ? '' : 'hover:bg-gray-400'}`
              }`}
              aria-label={`切換到第 ${index + 1} 張`}
            />
          ))}
        </div>

        {/* 底部簡約最新消息輪播 */}
        <div className="mt-12 py-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl">
          <div
            className="flex items-center justify-between max-w-6xl mx-auto px-6"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {/* 左側標題 */}
            <div className="flex items-center flex-shrink-0">
              <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-4">
                即時動態
              </div>
            </div>

            {/* 中間輪播內容 */}
            <div className="flex-1 overflow-hidden mr-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`simple-${currentIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center"
                >
                  <Link
                    href={`/news/${newsItems[currentIndex].id}`}
                    className={`flex items-center transition-colors duration-300 group ${
                      isScrolling ? '' : 'hover:text-primary-600'
                    }`}
                  >
                    <span
                      className={`text-gray-800 font-medium mr-3 text-sm md:text-base ${
                        isScrolling ? '' : 'group-hover:text-primary-600'
                      }`}
                    >
                      {newsItems[currentIndex].title}
                    </span>
                    <span className="text-gray-500 text-xs md:text-sm flex-shrink-0">
                      {new Date(
                        newsItems[currentIndex].date
                      ).toLocaleDateString('zh-TW')}
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 右側控制 */}
            <div className="flex items-center flex-shrink-0 space-x-2">
              {/* 小型指示器 */}
              <div className="flex space-x-1">
                {newsItems.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex % 3
                        ? 'bg-primary-600'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
