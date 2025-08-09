'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useScrollState } from '@/hooks/useScrollState';
import { useFeaturedResources } from '@/hooks/useFeaturedResources';

// 特色資源區塊 - 垂直排列的卡片展示
export default function FeaturedResourcesSection() {
  const t = useTranslations('FeaturedResources');
  const { resources, loading, error } = useFeaturedResources();
  const [selectedResource, setSelectedResource] = useState<
    (typeof resources)[0] | null
  >(null);
  const isScrolling = useScrollState();
  const [hasAnimated, setHasAnimated] = useState(false);

  // 當資源載入完成後，標記動畫已執行
  useEffect(() => {
    if (resources.length > 0 && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [resources.length, hasAnimated]);

  // 資源詳情彈窗
  const openDetail = (resource: (typeof resources)[0]) => {
    setSelectedResource(resource);
  };

  const closeDetail = () => {
    setSelectedResource(null);
  };

  // 資源卡片元件 - 簡單淡入動畫
  const ResourceCard = ({
    resource,
    index,
  }: {
    resource: (typeof resources)[0];
    index: number;
  }) => (
    <motion.div
      initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        hasAnimated
          ? { duration: 0 }
          : {
              duration: 0.3,
              delay: index * 0.1,
            }
      }
      whileHover={
        !isScrolling
          ? {
              y: -3,
              transition: { duration: 0.2 },
            }
          : {}
      }
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
      <div className="text-center mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-6">
            {t('title', { defaultValue: '特色資源' })}
          </h2>
          <p className="text-base sm:text-lg text-primary-100 max-w-3xl mx-auto leading-relaxed">
            {t('description', {
              defaultValue:
                '探索我們的特色資源與服務，為您的學習與發展提供全方位支持。',
            })}
          </p>
        </div>
      </div>

      {/* 資源卡片網格 - 3x2 佈局 */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">載入特色資源時發生錯誤</div>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">目前沒有特色資源可顯示</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {resources.map((resource, index) => (
              <ResourceCard
                key={`resource-${resource.id}`}
                resource={resource}
                index={index}
              />
            ))}
          </div>
        )}
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
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
