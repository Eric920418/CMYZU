// CMYZU 學校排名展示 Section - 顯示各項權威排名
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

// 動態載入世界地圖組件（避免 SSR 問題）
const WorldMap = dynamic(() => import('./WorldMap'), {
  ssr: false,
});

// 排名數據類型
interface Ranking {
  id: string;
  rank: string;
  category: string;
  subtitle?: string;
  description?: string;
  organization: string;
  // 英文欄位
  categoryEn?: string;
  subtitleEn?: string;
  descriptionEn?: string;
  organizationEn?: string;
  logoUrl?: string;
  logoAlt?: string;
  year: number;
  order: number;
}

export default function RankingSection() {
  const t = useTranslations('Rankings');
  const locale = useLocale();
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入排名數據
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rankings/public');

        if (!response.ok) {
          throw new Error('Failed to fetch ranking data');
        }

        const data = await response.json();
        setRankings(data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Unknown error loading ranking data';
        setError(errorMessage);
        console.error('Error loading ranking data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // 錯誤狀態顯示
  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-600">
            {t('loading_error')}
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 標題 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        {/* 載入狀態 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">{t('loading')}</p>
          </div>
        )}

        {/* 排名卡片網格 - 固定最多三張卡片 */}
        {!loading && rankings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {rankings.slice(0, 3).map((ranking, index) => (
              <motion.div
                key={ranking.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                {/* 排名數字 */}
                <div className="text-center mb-6">
                  <span className="text-6xl font-bold text-gray-400 opacity-50">
                    {ranking.rank}
                  </span>
                </div>

                {/* 排名內容 */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {locale === 'en' && ranking.categoryEn
                      ? ranking.categoryEn
                      : ranking.category}
                    {((locale === 'en' && ranking.subtitleEn) ||
                      ranking.subtitle) && (
                      <span className="block text-lg font-medium text-gray-600 mt-1">
                        {locale === 'en' && ranking.subtitleEn
                          ? ranking.subtitleEn
                          : ranking.subtitle}
                      </span>
                    )}
                  </h3>

                  {((locale === 'en' && ranking.descriptionEn) ||
                    ranking.description) && (
                    <p className="text-gray-600 text-sm">
                      {locale === 'en' && ranking.descriptionEn
                        ? ranking.descriptionEn
                        : ranking.description}
                    </p>
                  )}

                  {/* 年度資訊 */}
                  <p className="text-xs text-gray-500">
                    {ranking.year} •{' '}
                    {locale === 'en' && ranking.organizationEn
                      ? ranking.organizationEn
                      : ranking.organization}
                  </p>
                </div>

                {/* 評鑑機構 Logo */}
                <div className="flex justify-center mt-6">
                  <div className="w-24 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {ranking.logoUrl ? (
                      <Image
                        src={ranking.logoUrl}
                        alt={ranking.logoAlt || ranking.organization}
                        width={96}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-500 text-center px-2">
                        {ranking.logoAlt || ranking.organization}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 無排名資料時的顯示 */}
        {!loading && rankings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('no_rankings')}</p>
          </div>
        )}

        {/* 底部說明 */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-primary-950 max-w-3xl mx-auto w-1/2">
            {t('bottom_note')}
          </p>
        </motion.div>
      </div>

      {/* 世界地圖區塊 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-40"
      >
        <div className="w-full h-[500px]  rounded-2xl p-6  flex items-center justify-center">
          <WorldMap />
        </div>
      </motion.div>
    </section>
  );
}
