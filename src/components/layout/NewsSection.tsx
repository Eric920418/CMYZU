'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useScrollState } from '@/hooks/useScrollState';
import { useState, useEffect, useMemo } from 'react';

// 最新消息展示區塊
export default function NewsSection() {
  const t = useTranslations('News');
  const isScrolling = useScrollState();
  const [isPaused, setIsPaused] = useState(false);
  // 模擬數據 - 實際應用中會從資料庫獲取
  const news = useMemo(
    () => [
      {
        id: 1,
        title: t('news_1_title', {
          defaultValue:
            '從臺大出發 探索世界的勇氣 臺大D-School探索學習計畫獲《親子天下》教育創新100',
        }),
        excerpt: t('news_1_excerpt', {
          defaultValue: '歡迎新生加入CMYZU大家庭，將邀請國際知名學者主講...',
        }),
        date: '2025-07-30',
        category: t('category_event', { defaultValue: '活動' }),
        image: '/images/news-1.jpg',
      },
      {
        id: 2,
        title: t('news_2_title', {
          defaultValue:
            '臺大TPIDC x MIC x 數位轉型學院共同簽署MOU 3方攜手進行產學合作',
        }),
        excerpt: t('news_2_excerpt', {
          defaultValue: '回應市場需求，新增前沿科技領域研究生課程...',
        }),
        date: '2025-07-30',
        category: t('category_academic', { defaultValue: '學術' }),
        image: '/images/news-2.jpg',
      },
      {
        id: 3,
        title: t('news_3_title', {
          defaultValue: '謝豐舟教授紀念講座暨研討會 傳承跨領域教學研究熱忱',
        }),
        excerpt: t('news_3_excerpt', {
          defaultValue: '恭喜我校數學系學生在國際數學奧林匹亞中表現卓越...',
        }),
        date: '2025-07-30',
        category: t('category_achievement', { defaultValue: '榮譽' }),
        image: '/images/news-3.jpg',
      },
      {
        id: 4,
        title: t('news_4_title', {
          defaultValue:
            '臺大特色課程系列報導－國際學院「走出教室 走入實地災防與永續」',
        }),
        excerpt: t('news_4_excerpt', {
          defaultValue: '實地教學課程帶領學生深入了解災害防治...',
        }),
        date: '2025-07-30',
        category: t('category_academic', { defaultValue: '學術' }),
        image: '/images/news-4.jpg',
      },
      {
        id: 5,
        title: t('news_5_title', {
          defaultValue: '光影築夢 臺大「戲夢空間」首場燈光秀圓滿落幕',
        }),
        excerpt: t('news_5_excerpt', {
          defaultValue: '校園文化活動展現學生創意與藝術才華...',
        }),
        date: '2025-07-30',
        category: t('category_event', { defaultValue: '活動' }),
        image: '/images/news-5.jpg',
      },
      {
        id: 6,
        title: t('news_6_title', {
          defaultValue:
            '臺北市政府青年局X臺大D-School《跨越國界：國際交流與實習經驗分享》',
        }),
        excerpt: t('news_6_excerpt', {
          defaultValue: '青年國際交流經驗分享，拓展全球視野...',
        }),
        date: '2025-07-30',
        category: t('category_event', { defaultValue: '活動' }),
        image: '/images/news-6.jpg',
      },
    ],
    [t]
  );

  // 在 news 數組定義後初始化狀態
  const [displayNews, setDisplayNews] = useState(() => news.slice(0, 6));
  const [currentIndex, setCurrentIndex] = useState(6);
  const [isInView, setIsInView] = useState(false);

  // 堆積木動畫效果 - 底部抽離頂部新增
  useEffect(() => {
    if (isPaused || !isInView) return;

    const interval = setInterval(() => {
      setDisplayNews((prev) => {
        const newNews = [...prev];
        // 移除最後一個（底部）
        newNews.pop();
        // 在開頭添加新的（頂部）
        const nextItem = news[currentIndex % news.length];
        newNews.unshift({ ...nextItem, id: Date.now() + Math.random() });
        return newNews;
      });

      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000); // 每3秒執行一次堆積木動畫

    return () => clearInterval(interval);
  }, [isPaused, isInView, currentIndex, news]);

  return (
    <section className="pb-10" data-section="news">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          onViewportEnter={() => setIsInView(true)}
          onViewportLeave={() => setIsInView(false)}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {t('title', { defaultValue: '最新消息' })}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('description', { defaultValue: '即時掌握校園動態與重要消息' })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          onViewportEnter={() => setIsInView(true)}
          onViewportLeave={() => setIsInView(false)}
          className="text-center mb-8"
        >
          {/* 台大風格3欄Grid佈局 */}
          <div className="max-w-6xl mx-auto">
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="popLayout">
                {displayNews.map((item, index) => {
                  const date = new Date(item.date);
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  const day = date.getDate();

                  return (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{
                        opacity: 0,
                        y: index === 0 ? -100 : 100,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: index === displayNews.length - 1 ? 100 : -100,
                        scale: 0.8,
                      }}
                      transition={{
                        duration: 0.8,
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                      }}
                      className={`group ${isScrolling ? 'scroll-disabled' : ''}`}
                    >
                      <Link href={`/news/${item.id}`}>
                        <div className="flex items-start py-4 border-b border-gray-300 hover:bg-white/20 transition-all duration-300  px-4 min-h-[200px]">
                          {/* 左側圓形日期標記 */}
                          <div className="flex-shrink-0 mr-6">
                            <div className="w-16 h-16 rounded-full bg-gray-700 text-white flex flex-col items-center justify-center font-medium">
                              <div className="text-xs leading-none">{year}</div>
                              <div className="text-sm font-bold leading-none">
                                {month}/{day}
                              </div>
                            </div>
                          </div>

                          {/* 右側內容區域 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300 line-clamp-3 text-left">
                              {item.title}
                            </h3>

                            {/* 分類標籤 */}
                            <div className="flex mt-2">
                              <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          {/* 右側箭頭指示器 */}
                          <div className="flex-shrink-0 ml-3">
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300"
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
                      </Link>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* 查看更多按鈕 */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/news" className="group">
            <button className="btn-secondary text-lg px-8 py-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <span className="mr-2">
                {t('view_all', { defaultValue: '查看更多' })}
              </span>
              <svg
                className="w-5 h-5 inline-block group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
}
