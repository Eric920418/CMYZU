'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Alumni } from '@/types/dashboard';

// 校友資料介面定義（擴展版）
interface AlumniHighlight extends Alumni {
  stats?: {
    label: string;
    value: string;
    icon: string;
  }[];
  detailContent?: {
    fullTitle: string;
    overview: string;
    achievements: string[];
    impact: string;
  };
}

export default function TalentDevelopmentSection() {
  const t = useTranslations('TalentDevelopment');
  const [alumni, setAlumni] = useState<AlumniHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHighlight, setSelectedHighlight] =
    useState<AlumniHighlight | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 載入校友資料
  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/alumni');
      const result = await response.json();

      if (result.success && result.data) {
        // 將資料庫資料轉換為前台使用格式
        const formattedAlumni: AlumniHighlight[] = result.data.map(
          (item: Alumni) => ({
            ...item,
            // 生成預設統計資料（可後續從資料庫擴展）
            stats: [
              { label: '資歷年資', value: '10+年', icon: '👔' },
              { label: '影響力', value: '廣泛', icon: '🌟' },
              { label: '專業領域', value: '領導', icon: '🎯' },
            ],
            // 生成預設詳細內容（可後續從資料庫擴展）
            detailContent: {
              fullTitle: `${item.name} - ${item.position}的卓越成就`,
              overview: item.description,
              achievements: item.achievements?.length
                ? item.achievements
                : [
                    '在專業領域取得重要成就',
                    '為組織發展做出重大貢獻',
                    '積極參與社會公益活動',
                    '持續推動產業創新發展',
                  ],
              impact: `${item.name}校友的卓越表現，不僅為母校增光，更為社會發展做出重要貢獻，是年輕學子學習的典範。`,
            },
          })
        );

        setAlumni(formattedAlumni);
      } else {
        setError(result.error || '載入校友資料失敗');
      }
    } catch (err) {
      console.error('載入校友資料錯誤:', err);
      setError('載入校友資料失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化載入資料
  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const handleIntersection = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    },
    [isVisible]
  );

  useEffect(() => {
    // 延遲初始化避免重複觸發
    const timer = setTimeout(() => {
      const sectionObserver = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
        rootMargin: '50px',
      });

      const currentSection = sectionRef.current;
      if (currentSection) {
        sectionObserver.observe(currentSection);
      }

      return () => {
        clearTimeout(timer);
        if (currentSection) {
          sectionObserver.unobserve(currentSection);
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [handleIntersection]);
  // 檢查裝置
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // 主要邏輯：垂直卷軸推動橫向輪播
  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current!;
    const scroller = scrollerRef.current!;

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const totalH = section.offsetHeight - viewH;

      // 滾動尚未進入區塊 或 已超過區塊
      if (rect.top > 0 || rect.bottom < viewH) return;

      // 捲動進度 0~1
      const progress = Math.min(Math.max(-rect.top / totalH, 0), 1);
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;

      scroller.scrollLeft = progress * maxScrollLeft;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // 初始
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  // 錯誤狀態
  if (error) {
    return (
      <section ref={sectionRef} className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              載入校友資料時發生錯誤
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchAlumni}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              重新載入
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 載入狀態
  if (loading) {
    return (
      <section ref={sectionRef} className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入校友資料中...</p>
          </div>
        </div>
      </section>
    );
  }

  // 無資料狀態
  if (alumni.length === 0) {
    return (
      <section ref={sectionRef} className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
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
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              尚無校友資料
            </h3>
            <p className="text-gray-600">目前沒有已啟用的傑出校友資料</p>
          </div>
        </div>
      </section>
    );
  }

  // ----------- 手機版 ----------
  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative py-20">
        <div className="text-center mb-12">
          <div
            className={`title-entrance text-2xl md:text-4xl lg:text-5xl font-bold text-primary-700 mb-4  ${isVisible ? 'visible' : ''}`}
          >
            <span className="text-primary-600 font-medium">傑出校友</span>
          </div>
          <h2
            className={`title-entrance text-base md:text-xl text-gray-700 max-w-3xl mx-auto px-4 md:px-0 ${isVisible ? 'visible' : ''}`}
          >
            {t('title', { defaultValue: '校友成就展現教育價值' })}
          </h2>
        </div>
        <div className="container">
          <div className="space-y-12">
            {alumni.map((highlight) => (
              <div key={highlight.id} className="relative">
                <HighlightCard
                  highlight={highlight}
                  openDetail={setSelectedHighlight}
                />
              </div>
            ))}
          </div>
          {/* 詳細介紹模態框... */}
          {selectedHighlight && (
            <DetailModal
              highlight={selectedHighlight}
              close={() => setSelectedHighlight(null)}
            />
          )}
        </div>
      </section>
    );
  }

  // ----------- 桌面版 ----------
  return (
    <>
      <style jsx>{`
        /* 浮誇標題進場動畫 */
        .title-entrance {
          opacity: 0;
          transform: translateY(0px) scale(0.7);
          transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .title-entrance.visible {
          opacity: 1;
          transform: translateY(-100px) scale(1);
        }

        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
      <section
        ref={sectionRef}
        className={`relative`}
        style={{ height: `${Math.ceil(alumni.length / 3) * 100}vh` }}
      >
        <div className="text-center mt-30 mb-[-100px]">
          <div
            className={`title-entrance text-2xl md:text-4xl lg:text-5xl font-bold text-primary-700 mb-4  ${isVisible ? 'visible' : ''}`}
          >
            <span className="text-primary-600 font-medium">傑出校友</span>
          </div>
          <h2
            className={`title-entrance text-base md:text-xl text-primary-100 max-w-3xl mx-auto px-4 md:px-0 ${isVisible ? 'visible' : ''}`}
          >
            {t('title', { defaultValue: '校友成就展現教育價值' })}
          </h2>
        </div>

        {/* sticky 水平卡片容器 */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-y-hidden z-10">
          <div
            ref={scrollerRef}
            className="flex h-full flex-nowrap overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth hide-scrollbar"
            style={{
              scrollSnapType: 'x mandatory',
            }}
          >
            {Array.from(
              { length: Math.ceil(alumni.length / 3) },
              (_, pageIndex) => {
                const pageAlumni = alumni.slice(
                  pageIndex * 3,
                  (pageIndex + 1) * 3
                );
                return (
                  <AlumniPageCard
                    key={pageIndex}
                    alumni={pageAlumni}
                    openDetail={setSelectedHighlight}
                  />
                );
              }
            )}
          </div>
        </div>
        {/* 詳細介紹模態框... */}
        {selectedHighlight && (
          <DetailModal
            highlight={selectedHighlight}
            close={() => setSelectedHighlight(null)}
          />
        )}
      </section>
    </>
  );
}

// 三人一頁的校友展示卡片 - 高端設計版
function AlumniPageCard({
  alumni,
  openDetail,
}: {
  alumni: AlumniHighlight[];
  openDetail: (h: AlumniHighlight) => void;
}) {
  return (
    <div
      className="flex-shrink-0 w-screen h-screen flex items-center justify-center min-w-[100vw] flex-none"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="container mx-auto px-4">
        <div className="h-full max-h-[90vh] flex flex-col justify-center py-8">
          {/* 三位校友卡片 - 豪華設計 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {alumni.map((alumnus) => (
              <div
                key={alumnus.id}
                className="group cursor-pointer relative"
                onClick={() => openDetail(alumnus)}
              >
                {/* 背景光暈效果 */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* 主要卡片容器 */}
                <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group-hover:shadow-3xl group-hover:border-white/30 transition-all duration-500 group-hover:-translate-y-2">
                  {/* 校友照片區域 */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={
                          alumnus.imageUrl ||
                          alumnus.image ||
                          '/default-avatar.webp'
                        }
                        alt={alumnus.name || alumnus.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* 漸層覆蓋層 - 減弱漸層效果 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                      {/* 底部姓名覆蓋 */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {alumnus.name || alumnus.title}
                        </h4>
                        <p className="text-white/90 text-base font-medium drop-shadow">
                          {alumnus.position}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 卡片內容區域 */}
                  <div className="p-6 space-y-4">
                    {/* 描述文字 */}
                    <p className="text-white/85 text-sm leading-relaxed line-clamp-3 group-hover:text-white transition-colors duration-300 font-medium">
                      {alumnus.description}
                    </p>

                    {/* 了解更多按鈕 */}
                    <div className="pt-2">
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          <span>了解更多</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
                        </span>
                        {/* 按鈕光暈效果 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 手機版優化卡片設計
function HighlightCard({
  highlight,
  openDetail,
}: {
  highlight: AlumniHighlight;
  openDetail: (h: AlumniHighlight) => void;
}) {
  return (
    <div
      key={highlight.id}
      className="relative group cursor-pointer"
      onClick={() => openDetail(highlight)}
    >
      {/* 背景光暈效果 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-secondary-500/30 to-primary-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      {/* 主要卡片容器 */}
      <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group-hover:shadow-3xl group-hover:border-white/30 transition-all duration-500">
        {/* 校友照片區域 */}
        <div className="relative overflow-hidden">
          <div className="aspect-[16/9] relative">
            <Image
              src={
                highlight.imageUrl || highlight.image || '/default-avatar.webp'
              }
              alt={highlight.name || highlight.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="100vw"
            />
            {/* 漸層覆蓋層 - 減弱效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

            {/* 底部姓名區域 */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                {highlight.name || highlight.title}
              </h4>
              <p className="text-white/90 text-base font-medium drop-shadow mb-2">
                {highlight.position}
              </p>
            </div>
          </div>
        </div>

        {/* 卡片內容區域 */}
        <div className="p-6 space-y-4">
          {/* 描述文字 */}
          <p className="text-white/85 text-sm leading-relaxed group-hover:text-white transition-colors duration-300 line-clamp-3 font-medium">
            {highlight.description}
          </p>

          {/* 了解更多按鈕 */}
          <div className="pt-2">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span className="text-base">了解更多</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
              </span>
              {/* 按鈕光暈效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 詳細介紹模態框（照你原本內容拆分）
function DetailModal({
  highlight,
  close,
}: {
  highlight: AlumniHighlight;
  close: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={close}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* 關閉按鈕 */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
          aria-label="關閉詳細介紹"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 模態框內容 */}
        <div className="p-8">
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
            <Image
              src={
                highlight.imageUrl || highlight.image || '/default-avatar.webp'
              }
              alt={highlight.name || highlight.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-block px-4 py-2 bg-primary-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                人才發展
              </span>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {highlight.detailContent?.fullTitle ||
                `${highlight.name || highlight.title} - ${highlight.position}`}
            </h2>
            <div className="text-lg text-gray-600 leading-relaxed">
              {highlight.detailContent?.overview || highlight.description}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                主要成就
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  highlight.detailContent?.achievements ||
                  highlight.achievements ||
                  []
                ).map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {achievement}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                重要數據
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {(highlight.stats || []).map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl"
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">影響與意義</h3>
              <p className="leading-relaxed">
                {highlight.detailContent?.impact ||
                  `${highlight.name || highlight.title}校友的卓越表現，為母校增光，也為社會發展做出重要貢獻。`}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
