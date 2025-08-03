'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useCountAnimation } from '@/hooks/useCountAnimation';

// 統計數據展示區塊
export default function StatsSection() {
  const t = useTranslations('Stats');

  const stats = [
    {
      value: 50,
      suffix: '+',
      label: t('years', { defaultValue: '年辦學歷史' }),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      value: 10000,
      suffix: '+',
      label: t('students', { defaultValue: '在學學生' }),
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
    },
    {
      value: 500,
      suffix: '+',
      label: t('faculty', { defaultValue: '優秀教師' }),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      value: 95,
      suffix: '%',
      label: t('employment', { defaultValue: '就業率' }),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
    },
  ];

  // 統計項目組件，使用數字計數動畫
  const StatItem = ({
    stat,
    index,
  }: {
    stat: (typeof stats)[0];
    index: number;
  }) => {
    const { count, elementRef } = useCountAnimation({
      end: stat.value,
      duration: 1200,
      decimals: 0,
      delay: index * 150, // 每個項目延遲 150ms，創造波浪效果
    });

    // 格式化數字顯示（添加千分位逗號）
    const formatNumber = (num: number) => {
      return Math.round(num).toLocaleString();
    };

    return (
      <div ref={elementRef} className="text-center group">
        <div className="inline-flex items-center justify-center  bg-white/10 rounded-full mb-4 group-hover:bg-white/20 transition-colors duration-300">
          <div className="text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            {stat.icon}
          </div>
        </div>
        <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-yellow-200">
          <div className="w-[140px] md:w-full mx-auto">
            <span className="tabular-nums">{formatNumber(count)}</span>
            <span className="text-primary-200">{stat.suffix}</span>
          </div>
        </div>
        <div className="text-primary-100 font-medium transition-colors duration-300 group-hover:text-white">
          {stat.label}
        </div>
      </div>
    );
  };

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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 ">
            {t('title', { defaultValue: '最國際化的商管學院' })}
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            {t('description', {
              defaultValue:
                '數十年來，我們致力於提供優質教育，培養無數優秀人才',
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <div
              key={`stat-${stat.value}-${stat.suffix}`}
              className="flex items-center justify-center min-h-[180px] min-w-[250px]"
            >
              <StatItem stat={stat} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
