'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

// 統計數據類型定義
interface StatsData {
  title: string;
  descriptionPart1: string;
  descriptionPart2: string;
  descriptionPart3: string;
  descriptionPart4: string;
  stat1: string;
  stat2: string;
  stat3: string;
  stat4: string;
}

// 統計數據展示區塊
export default function StatsSection() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  const locale = useLocale();

  // 載入統計數據
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/stats?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setStatsData(data);
        } else {
          console.error('載入統計數據失敗');
        }
      } catch (error) {
        console.error('載入統計數據錯誤:', error);
      } finally {
        // 載入完成
      }
    };

    fetchStats();
  }, [locale]);

  // 預設資料（如果API載入失敗）
  const defaultData: StatsData = {
    title: '國際化商管教育領航者',
    descriptionPart1:
      '為幫助學生銜接國際職場，我們積極建構國際化環境，國際學生比例超過10%，並持續成長。',
    descriptionPart2:
      '與歐美、亞洲及大陸地區的海外學校積極建立合作關係，擴展雙聯學位、銜接學位及交換學生等，',
    descriptionPart3:
      '目前已擁有超過100所以上的國外合作學校，知名學校包含:美國密西根大學、美國明尼蘇達大學、英國艾賽克斯大學、英國諾丁漢特倫特大學、法國雷恩商學院、德國佛茨海姆大學及澳洲昆士蘭大學等，',
    descriptionPart4: '遍佈全球近30個國家，多達千位以上學生具備國外交流經驗。',
    stat1: '北台灣唯一英語標竿學院',
    stat2: '企業最愛EMBA',
    stat3: '隨意highlight',
    stat4: '隨意highlight',
  };

  // 使用載入的資料或預設資料
  const currentData = statsData || defaultData;

  // 描述段落
  const descriptionParts = [
    currentData.descriptionPart1,
    currentData.descriptionPart2,
    currentData.descriptionPart3,
    currentData.descriptionPart4,
  ];

  // 四個標語（加上固定圖示）
  const stats = [
    {
      label: currentData.stat1,
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      label: currentData.stat2,
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: currentData.stat3,
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
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      label: currentData.stat4,
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
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      ),
    },
  ];

  // 標語項目組件
  const StatItem = ({
    stat,
    index,
  }: {
    stat: (typeof stats)[0];
    index: number;
  }) => {
    return (
      <motion.div
        className="text-center group w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: 'easeOut',
        }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full mb-3 md:mb-4 group-hover:bg-white/20 transition-colors duration-300">
          <div className="text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            {stat.icon}
          </div>
        </div>
        <div className="text-lg md:text-xl font-bold text-white transition-colors duration-300 group-hover:text-yellow-200 px-2 min-h-[3rem] flex items-center justify-center">
          {stat.label}
        </div>
      </motion.div>
    );
  };

  return (
    <section className="pb-10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-primary-700 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {currentData.title}
          </motion.h2>
          <div className="text-lg text-primary-100 max-w-4xl mx-auto leading-relaxed space-y-4">
            {descriptionParts.map((part, index) => (
              <motion.p
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.15,
                  ease: 'easeOut',
                }}
                viewport={{ once: true }}
              >
                {part}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-16">
          {stats.map((stat, index) => (
            <div
              key={`stat-${index}-${stat.label}`}
              className="flex items-center justify-center min-h-[160px] md:min-h-[180px] w-full"
            >
              <StatItem stat={stat} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
