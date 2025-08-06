'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';

// 探索元智管理學院區塊
export default function ExploreSection() {
  const t = useTranslations('Explore');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 使用 useCallback 優化 observer 回調
  const handleIntersection = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    },
    [isVisible]
  );

  useEffect(() => {
    // 延遲初始化避免重複觸發
    const timer = setTimeout(() => {
      const sectionObserver = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
        rootMargin: '50px',
      });

      const currentSection = sectionRef.current;
      if (currentSection) {
        sectionObserver.observe(currentSection);
      }

      return () => {
        clearTimeout(timer);
        if (currentSection) {
          sectionObserver.unobserve(currentSection);
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [handleIntersection]);

  // 學院介紹內容（精選3項）
  const exploreItems = [
    {
      id: 1,
      title: t('item_1_title', {
        defaultValue: '學院簡介',
      }),
      description: t('item_1_description', {
        defaultValue:
          '元智管理學院致力於培養具備國際視野與創新思維的管理人才，結合理論與實務，為學生提供全方位的管理教育。',
      }),
      icon: 'highlight',
      link: '/about',
      gradient: 'from-blue-500 to-purple-600',
      accentColor: 'blue',
      backgroundImage: '/hero-building.webp',
    },
    {
      id: 2,
      title: t('item_2_title', {
        defaultValue: '師資陣容',
      }),
      description: t('item_2_description', {
        defaultValue:
          '擁有來自國內外頂尖大學的優秀師資，專業領域涵蓋管理學各個面向，致力於學術研究與教學創新。',
      }),
      icon: 'course',
      link: '/faculty',
      gradient: 'from-emerald-500 to-teal-600',
      accentColor: 'emerald',
      backgroundImage: '/Image.webp',
    },
    {
      id: 3,
      title: t('item_3_title', {
        defaultValue: '國際交流',
      }),
      description: t('item_3_description', {
        defaultValue:
          '與全球超過100所知名大學建立合作關係，提供學生海外交換、雙學位及國際實習機會。',
      }),
      icon: 'activity',
      link: '/international',
      gradient: 'from-orange-500 to-red-600',
      accentColor: 'orange',
      backgroundImage: '/4.webp',
    },
  ];

  // 圖標組件
  const IconComponent = ({ iconType }: { iconType: string }) => {
    const iconClass = 'w-8 h-8 md:w-14 md:h-14 text-white drop-shadow-lg';

    switch (iconType) {
      case 'highlight':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        );
      case 'course':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case 'activity':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <>
      {/* 浮誇出場動畫樣式 */}
      <style jsx>{`
        /* 浮誇標題進場動畫 */
        .title-entrance {
          opacity: 0;
          transform: translateY(80px) scale(0.7);
          transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .title-entrance.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* 浮誇卡片進場動畫 */
        .card-entrance {
          opacity: 0;
          transform: translateY(100px) scale(0.8) rotateX(15deg);
          transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-entrance.visible {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0deg);
        }

        .card-entrance-delay-1.visible {
          transition-delay: 0.3s;
        }

        .card-entrance-delay-2.visible {
          transition-delay: 0.6s;
        }

        /* 浮誇圖標旋轉進場動畫 */
        .icon-entrance {
          opacity: 0;
          transform: scale(0.3) rotate(180deg);
          transition: all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .icon-entrance.visible {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        /* 優化的懸停效果 */
        .card-hover {
          will-change: transform, box-shadow;
          transition:
            transform 0.3s ease-out,
            box-shadow 0.3s ease-out;
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        }

        .card-hover:hover .card-arrow {
          transform: translateX(8px);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }

        .card-hover:hover .card-background {
          opacity: 0.25;
        }

        .card-title {
          transition: all 0.3s ease-out;
        }

        .card-arrow {
          transition: all 0.3s ease-out;
        }

        .card-background {
          transition: opacity 0.3s ease-out;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="py-8 md:pb-10 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-6 md:mb-8">
            <h2
              className={`title-entrance text-2xl md:text-4xl lg:text-5xl font-bold text-primary-700 mb-4 ${isVisible ? 'visible' : ''}`}
            >
              {t('title', { defaultValue: '探索元智管理學院' })}
            </h2>
            <p
              className={`title-entrance text-base md:text-xl text-gray-700 max-w-3xl mx-auto px-4 md:px-0 ${isVisible ? 'visible' : ''}`}
            >
              {t('description', {
                defaultValue:
                  '深入了解我們的學院特色、師資陣容與國際化教育環境',
              })}
            </p>
          </div>

          {/* 3個項目的浮誇進場動畫佈局 */}
          <div className="max-w-7xl mx-auto px-4 md:px-0">
            <div className="grid md:grid-cols-3 gap-6 md:gap-12">
              {exploreItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`card-entrance ${
                    index === 1
                      ? 'card-entrance-delay-1'
                      : index === 2
                        ? 'card-entrance-delay-2'
                        : ''
                  } ${isVisible ? 'visible' : ''}`}
                >
                  <Link href={item.link}>
                    <div className="card-hover relative backdrop-blur-md bg-white/20 rounded-3xl p-4 md:p-8 border border-white/30 shadow-xl overflow-hidden h-full">
                      {/* 背景圖片 */}
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl opacity-30"
                        style={{
                          backgroundImage: `url(${item.backgroundImage})`,
                        }}
                      />
                      {/* 深色覆蓋層，提高文字對比度 */}
                      <div className="absolute inset-0 bg-black/30 rounded-3xl" />
                      {/* 背景漸層覆蓋 */}
                      <div
                        className={`card-background absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 rounded-3xl`}
                      />

                      {/* 圖標區域 - 超浮誇旋轉飛入 */}
                      <div className="mb-6 md:mb-8 relative z-10">
                        <div
                          className={`icon-entrance w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl relative overflow-hidden ${isVisible ? 'visible' : ''}`}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full opacity-70" />
                          <div className="relative z-10">
                            <IconComponent iconType={item.icon} />
                          </div>
                        </div>
                      </div>

                      {/* 標題 */}
                      <h3 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6 relative z-10 card-title drop-shadow-lg">
                        {item.title}
                      </h3>

                      {/* 描述 */}
                      <p className="text-white/90 leading-relaxed mb-6 md:mb-8 relative z-10 min-h-[100px] md:min-h-[150px] drop-shadow-md text-sm md:text-base">
                        {item.description}
                      </p>

                      {/* 了解更多按鈕 */}
                      <div className="flex items-center text-white font-bold text-lg relative z-10 drop-shadow-lg">
                        <span className="mr-3">
                          {t('learn_more', { defaultValue: '了解更多' })}
                        </span>
                        <svg
                          className="w-6 h-6 card-arrow"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
