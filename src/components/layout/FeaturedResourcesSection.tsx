'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useScrollState } from '@/hooks/useScrollState';

// 特色資源區塊 - 垂直排列的卡片展示
export default function FeaturedResourcesSection() {
  const t = useTranslations('FeaturedResources');
  const [selectedResource, setSelectedResource] = useState<
    (typeof resources)[0] | null
  >(null);
  const isScrolling = useScrollState();

  // 特色資源數據 - 信用卡樣式
  const resources = [
    {
      id: 1,
      title: '新戶申辦享限定首刷好禮！',
      description: '星光箱伴 邁向全球數位新戶體驗',
      image: '/4.webp',
      category: '新戶專區',
      backgroundColor: 'bg-gradient-to-br from-green-500 to-green-700',
      textColor: 'text-white',
    },
    {
      id: 2,
      title: '百貨購物 星級回饋',
      description: '刷卡分期0%利率 滿額享好禮',
      image: '/Image.webp',
      category: '購物優惠',
      backgroundColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
      textColor: 'text-white',
    },
    {
      id: 3,
      title: '億萬星空任務',
      description: '月月刷卡來追星 回饋狂飆NT$9,000 再抽紐西蘭頂級觀星之旅',
      image: '/er.webp',
      category: '星空任務',
      backgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-800',
      textColor: 'text-white',
    },
    {
      id: 4,
      title: '揪好友辦星展卡',
      description: '解鎖星級寶箱',
      image: '/4.webp',
      category: '推薦好友',
      backgroundColor: 'bg-gradient-to-br from-teal-400 to-green-500',
      textColor: 'text-white',
    },
    {
      id: 5,
      title: '聚餐用星刷',
      description: '天天最高享12%回饋',
      image: '/Image.webp',
      category: '餐飲回饋',
      backgroundColor: 'bg-gradient-to-br from-red-500 to-red-700',
      textColor: 'text-white',
    },
    {
      id: 6,
      title: '網路購物刷星展卡',
      description: '滿額並登錄享優惠',
      image: '/er.webp',
      category: '網購優惠',
      backgroundColor: 'bg-gradient-to-br from-gray-400 to-gray-600',
      textColor: 'text-white',
    },
  ];

  // 資源詳情彈窗
  const openDetail = (resource: (typeof resources)[0]) => {
    setSelectedResource(resource);
  };

  const closeDetail = () => {
    setSelectedResource(null);
  };

  // 資源卡片元件 - 3x2 網格樣式
  const ResourceCard = ({
    resource,
    index,
  }: {
    resource: (typeof resources)[0];
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={!isScrolling ? { y: -5 } : {}}
      className="group cursor-pointer"
      onClick={() => openDetail(resource)}
    >
      <div
        className={`relative h-80 rounded-3xl overflow-hidden ${resource.backgroundColor} shadow-xl ${!isScrolling ? 'hover:shadow-2xl' : ''} transition-all duration-300`}
      >
        {/* 背景圖片 */}
        <div className="absolute inset-0">
          <Image
            src={resource.image}
            alt={resource.title}
            fill
            className={`object-cover opacity-30 ${!isScrolling ? 'group-hover:opacity-40' : ''} transition-opacity duration-300`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* 漸層遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* 分類標籤 */}
        <div className="absolute top-6 left-6">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
            {resource.category}
          </span>
        </div>

        {/* 內容區域 */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3
            className={`text-xl font-bold mb-3 leading-tight ${resource.textColor}`}
          >
            {resource.title}
          </h3>
          <p
            className={`text-sm leading-relaxed opacity-90 ${resource.textColor}`}
          >
            {resource.description}
          </p>
        </div>

        {/* Hover 效果箭頭 */}
        <div
          className={`absolute top-6 right-6 opacity-0 ${!isScrolling ? 'group-hover:opacity-100' : ''} transition-opacity duration-300`}
        >
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
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
      </div>
    </motion.div>
  );

  return (
    <section className="relative py-20">
      {/* 標題區域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('title', { defaultValue: '特色資源' })}
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-primary-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('description', {
              defaultValue:
                '探索我們的特色資源與服務，為您的學習與發展提供全方位支持。',
            })}
          </motion.p>
        </div>
      </motion.div>

      {/* 資源卡片網格 - 3x2 佈局 */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {resources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </div>
      </div>

      {/* 詳情彈窗 */}
      {selectedResource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeDetail}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={closeDetail}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
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

            {/* 彈窗內容 */}
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-primary-600/90 text-white text-sm rounded-full">
                {selectedResource.category}
              </span>
              <h3 className="text-2xl font-bold text-white">
                {selectedResource.title}
              </h3>
              <p className="text-primary-100 leading-relaxed">
                {selectedResource.description}
              </p>

              {/* 圖片預覽 */}
              <div className="relative h-40 rounded-lg overflow-hidden mt-6">
                <Image
                  src={selectedResource.image}
                  alt={selectedResource.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
