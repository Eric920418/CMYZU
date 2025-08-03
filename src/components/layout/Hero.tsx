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
        {/* 主標題動畫 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 主標題 - 建築感字體設計 */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight relative">
            <span className="block text-white drop-shadow-lg absolute bottom-10 left-0">
              YZU
            </span>
            <span className="text-[80px] block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-white drop-shadow-lg absolute bottom-[-30px] left-0">
              {t('title_main')}
            </span>
          </h1>
        </motion.div>

        {/* 副標題動畫 - 獨立控制 */}
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[20px] w-[500px] text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed backdrop-blur-sm bg-amber-600/40 p-3 rounded-2xl border border-amber-500/20 shadow-lg absolute top-40 left-20 text-left"
        >
          {t('subtitle')}
        </motion.p>

        {/* 右側裝飾方塊動畫 - 獨立控制 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-[-100px] left-[105%] bg-amber-600 h-[300px] w-[200px]"
        />
      </div>
    </section>
  );
}
