// CMYZU 學校排名展示 Section - 顯示各項權威排名
'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// 動態載入世界地圖組件（避免 SSR 問題）
const WorldMap = dynamic(() => import('./WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gradient-to-br from-primary-800/50 to-primary-900/50 rounded-2xl p-6 backdrop-blur-sm border border-white/10 flex items-center justify-center">
      <div className="text-white/60">載入地圖中...</div>
    </div>
  ),
});

// 排名資料配置
const rankingData = [
  {
    id: 1,
    rank: '#1',
    category: '學習環境',
    subtitle: '（日本私立大學）',
    description: '2025年泰晤士高等教育日本大學排名',
    logo: '/ranking/the-logo.png',
    logoAlt: 'THE 世界大學排名 日本版',
  },
  {
    id: 2,
    rank: '#1',
    category: '西日本私立大學',
    subtitle: '',
    description: '2025年泰晤士高等教育日本大學排名',
    logo: '/ranking/the-logo.png',
    logoAlt: 'THE 世界大學排名 日本版',
  },
  {
    id: 3,
    rank: '#1',
    category: 'International Student Ratio and International Faculty Ratio',
    subtitle: 'in Japan',
    description: '',
    logo: '/ranking/qs-logo.png',
    logoAlt: 'QS World University Rankings',
  },
];

export default function RankingSection() {
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
            本校世界頂尖大學之一
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            以下信息截至20255月為最新。
          </p>
        </motion.div>

        {/* 排名卡片網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rankingData.map((ranking, index) => (
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
                  {ranking.category}
                  {ranking.subtitle && (
                    <span className="block text-lg font-medium text-gray-600 mt-1">
                      {ranking.subtitle}
                    </span>
                  )}
                </h3>

                {ranking.description && (
                  <p className="text-gray-600 text-sm">{ranking.description}</p>
                )}
              </div>

              {/* 評鑑機構 Logo */}
              <div className="flex justify-center mt-6">
                <div className="w-24 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {/* 這裡可以放實際的 logo 圖片 */}
                  <span className="text-xs text-gray-500 text-center px-2">
                    {ranking.logoAlt}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部說明 */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-primary-950 max-w-3xl mx-auto w-1/2">
            排名資訊來源於各大權威教育評鑑機構，包含泰晤士高等教育世界大學排名（THE）、QS世界大學排名等國際認可之評鑑系統。
            所有數據均定期更新，確保資訊準確性與時效性。
          </p>
        </motion.div>
      </div>

      {/* 世界地圖區塊 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-20"
      >
        <WorldMap />
      </motion.div>
    </section>
  );
}
