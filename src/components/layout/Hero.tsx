'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

// Hero 區塊組件 - 現代建築風格主視覺區域
export default function Hero() {
  const t = useTranslations('HomePage');

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-16">
      {/* 現代玻璃幕牆效果 - 保持建築感 */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent">
        <div className="h-full w-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:40px_100%] animate-pulse" />
      </div>

      <div className="relative z-10 container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 主標題 - 建築感字體設計 */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="block text-white drop-shadow-lg">
              {t('title', { defaultValue: 'CMYZU' })}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-300 to-white drop-shadow-lg">
              {t('subtitle_highlight', { defaultValue: '學校' })}
            </span>
          </h1>

          {/* 副標題 - 企業級專業描述 */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/20 shadow-lg">
            {t('subtitle', {
              defaultValue:
                '致力於培養具有國際視野、創新思維與社會責任感的優秀人才，為學生提供最優質的教育環境與學習資源。',
            })}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
