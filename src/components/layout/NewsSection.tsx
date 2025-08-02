'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';

// 最新消息展示區塊
export default function NewsSection() {
  const t = useTranslations('News');

  // 模擬數據 - 實際應用中會從資料庫獲取
  const news = [
    {
      id: 1,
      title: t('news_1_title', {
        defaultValue: '新學期開學典禮將於9月1日隆重登場',
      }),
      excerpt: t('news_1_excerpt', {
        defaultValue: '歡迎新生加入CMYZU大家庭，將邀請國際知名學者主講...',
      }),
      date: '2024-08-15',
      category: t('category_event', { defaultValue: '活動' }),
      image: '/images/news-1.jpg',
    },
    {
      id: 2,
      title: t('news_2_title', {
        defaultValue: '研究生院新增人工智慧與大數據硕士班',
      }),
      excerpt: t('news_2_excerpt', {
        defaultValue: '回應市場需求，新增前沿科技領域研究生課程...',
      }),
      date: '2024-08-10',
      category: t('category_academic', { defaultValue: '學術' }),
      image: '/images/news-2.jpg',
    },
    {
      id: 3,
      title: t('news_3_title', {
        defaultValue: '本校學生獲得國際數學競賽金牘',
      }),
      excerpt: t('news_3_excerpt', {
        defaultValue: '恭喜我校數學系學生在國際數學奧林匹亞中表現卓越...',
      }),
      date: '2024-08-05',
      category: t('category_achievement', { defaultValue: '榮譽' }),
      image: '/images/news-3.jpg',
    },
  ];

  return (
    <section>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title', { defaultValue: '最新消息' })}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('description', { defaultValue: '即時掌握校園動態與重要消息' })}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link href={`/news/${item.id}`}>
                <div className="backdrop-blur-sm bg-white/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform overflow-hidden border border-white/40">
                  {/* 圖片區域 */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                        {item.category}
                      </span>
                    </div>
                    {/* 暫時使用占位器，實際上會使用 Next.js Image 組件 */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* 內容區域 */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1M8 7h8M5 10h14l-1 7H6l-1-7z"
                        />
                      </svg>
                      {new Date(item.date).toLocaleDateString('zh')}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                      <span className="mr-2">
                        {t('read_more', { defaultValue: '閱讀更多' })}
                      </span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/news" className="group">
            <button className="btn-secondary text-lg px-8 py-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <span className="mr-2">
                {t('view_all', { defaultValue: '查看所有消息' })}
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
        </motion.div>
      </div>
    </section>
  );
}
