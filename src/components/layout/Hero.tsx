'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useHero } from '@/hooks/useHero';

// Hero 區塊組件 - 現代建築風格主視覺區域
export default function Hero() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const { heroContent, loading, error } = useHero(locale);

  // 載入狀態
  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </section>
    );
  }

  // 錯誤狀態或無資料時使用翻譯檔案的預設內容
  const displayContent = heroContent || {
    titlePrefix: 'YZU',
    titleMain: t('title_main'),
    subtitle: t('subtitle'),
    gradientFrom: 'amber-600',
    gradientTo: 'white',
    glassEffect: true,
    backgroundImage: undefined,
  };

  const getGradientClasses = (from: string, to: string) => {
    const gradientMap: Record<string, string> = {
      'amber-600': 'rgb(217 119 6)',
      'blue-600': 'rgb(37 99 235)',
      'green-600': 'rgb(22 163 74)',
      'red-600': 'rgb(220 38 38)',
      'purple-600': 'rgb(147 51 234)',
      'indigo-600': 'rgb(79 70 229)',
      'pink-600': 'rgb(219 39 119)',
      'teal-600': 'rgb(13 148 136)',
      white: 'rgb(255 255 255)',
    };

    const fromColor = gradientMap[from] || gradientMap['amber-600'];
    const toColor = gradientMap[to] || gradientMap['white'];

    return `linear-gradient(135deg, ${fromColor}, ${toColor})`;
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-16">
      <div className="relative z-10 h-full w-full flex items-center">
        {/* 左側主標題區域 - 非對稱布局 */}
        <div className="w-full lg:w-2/3 px-4 sm:px-6 lg:px-8 lg:pl-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* 動態前綴小標 - 左上角定位 */}
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block text-white drop-shadow-lg text-lg md:text-2xl lg:text-3xl mb-4 font-light tracking-widest"
            >
              {displayContent.titlePrefix}
            </motion.span>

            {/* 動態主標題 - 錯位排列 */}
            <h1 className="relative">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block text-4xl md:text-6xl lg:text-[80px] xl:text-[100px] font-bold text-transparent bg-clip-text drop-shadow-lg leading-none break-words max-w-full"
                style={{
                  backgroundImage: getGradientClasses(
                    displayContent.gradientFrom,
                    displayContent.gradientTo
                  ),
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                {displayContent.titleMain}
              </motion.span>
            </h1>

            {/* 右側副標題區域 - 垂直居中偏移 */}
            <div className="hidden lg:block w-full max-w-[600px] pr-16">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="transform translate-y-4"
              >
                <p className="text-lg xl:text-xl text-white/90 leading-relaxed backdrop-blur-sm bg-amber-600/30 p-6 rounded-xl border border-amber-500/20 shadow-xl">
                  {displayContent.subtitle}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 手機版副標題 - 底部居中 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="lg:hidden absolute bottom-20 left-4 right-4"
        >
          <p className="text-base md:text-lg text-white/90 text-center leading-relaxed backdrop-blur-sm bg-amber-600/40 p-4 rounded-2xl border border-amber-500/20 shadow-lg mx-auto max-w-md">
            {displayContent.subtitle}
          </p>
        </motion.div>
      </div>

      {/* 錯誤提示（僅在開發環境顯示） */}
      {error && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          主視覺載入失敗: {error}
        </div>
      )}
    </section>
  );
}
