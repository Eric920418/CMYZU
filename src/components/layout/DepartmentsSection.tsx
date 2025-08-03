'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useScrollState } from '@/hooks/useScrollState';

// 系所學程區塊
export default function DepartmentsSection() {
  const t = useTranslations('Departments');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const isScrolling = useScrollState();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 延遲觸發打字效果，等標題動畫完成
          setTimeout(() => {
            setShowTypewriter(true);
          }, 600);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // 系所學程內容
  const departments = [
    {
      id: 1,
      title: t('department_1_title', {
        defaultValue: '企業管理學系',
      }),
      description: t('department_1_description', {
        defaultValue:
          '培養具備全方位管理知識與實務能力的專業管理人才，涵蓋策略管理、行銷管理、人力資源管理等領域。',
      }),
      icon: 'business',
      link: '/departments/business',
      gradient: 'from-blue-500 to-indigo-600',
      features: ['策略管理', '行銷管理', '人力資源'],
    },
    {
      id: 2,
      title: t('department_2_title', {
        defaultValue: '資訊管理學系',
      }),
      description: t('department_2_description', {
        defaultValue:
          '結合資訊科技與管理知識，培養數位時代所需的資訊管理專業人才，強調AI與大數據應用。',
      }),
      icon: 'information',
      link: '/departments/information',
      gradient: 'from-green-500 to-emerald-600',
      features: ['AI應用', '大數據分析', '系統開發'],
    },
    {
      id: 3,
      title: t('department_3_title', {
        defaultValue: '財務金融學系',
      }),
      description: t('department_3_description', {
        defaultValue:
          '專注於金融市場分析、投資理財、風險管理等專業領域，培養金融專業人才。',
      }),
      icon: 'finance',
      link: '/departments/finance',
      gradient: 'from-purple-500 to-pink-600',
      features: ['投資分析', '風險管理', '金融科技'],
    },
    {
      id: 4,
      title: t('department_4_title', {
        defaultValue: '國際商務學程',
      }),
      description: t('department_4_description', {
        defaultValue:
          '培養具備國際視野與跨文化溝通能力的國際商務人才，強調全球化商業環境的適應力。',
      }),
      icon: 'international_business',
      link: '/departments/international-business',
      gradient: 'from-orange-500 to-red-600',
      features: ['國際貿易', '跨文化管理', '全球商務'],
    },
  ];

  // 圖標組件
  const IconComponent = ({ iconType }: { iconType: string }) => {
    const iconClass = 'w-12 h-12 text-white drop-shadow-lg';

    switch (iconType) {
      case 'business':
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      case 'information':
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
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'finance':
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'international_business':
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
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
      {/* CSS 動畫樣式 */}
      <style jsx>{`
        /* 標題浮誇進場動畫 */
        .title-entrance {
          opacity: 0;
          transform: translateY(100px) scale(0.3) rotateX(45deg);
          transition: all 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .title-entrance.visible {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0deg);
        }

        /* 卡片超浮誇進場動畫 */
        .card-entrance {
          opacity: 0;
          transform: translateY(150px) rotateY(-45deg) scale(0.5);
          filter: blur(10px);
          transition: all 1.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-entrance.visible {
          opacity: 1;
          transform: translateY(0) rotateY(0deg) scale(1);
          filter: blur(0px);
        }

        .card-entrance-delay-1.visible {
          transition-delay: 0.2s;
        }

        .card-entrance-delay-2.visible {
          transition-delay: 0.4s;
        }

        .card-entrance-delay-3.visible {
          transition-delay: 0.6s;
        }

        /* 圖標旋轉飛入動畫 */
        .icon-entrance {
          transform: translateY(-200px) rotate(720deg) scale(0.2);
          transition: all 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .icon-entrance.visible {
          transform: translateY(0) rotate(0deg) scale(1);
        }

        /* 文字打字機效果 */
        .text-typewriter {
          opacity: 0;
          width: 0;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid transparent;
        }

        .text-typewriter.visible {
          opacity: 1;
          border-right: 2px solid #3b82f6;
          animation:
            typing 2s steps(40, end) forwards,
            blink 0.5s infinite;
          animation-delay: 0.5s;
        }

        /* Hover 效果 - 滾動時禁用 */
        .card-hover {
          transition:
            transform 0.3s ease-out,
            box-shadow 0.3s ease-out;
        }

        .card-hover:not(.scrolling):hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.25);
        }

        .card-hover:not(.scrolling):hover .card-title {
          color: #3b82f6;
        }

        .card-hover:not(.scrolling):hover .card-arrow {
          transform: translateX(8px);
        }

        .card-hover:not(.scrolling):hover .card-background {
          opacity: 0.15;
        }

        .card-hover:not(.scrolling):hover .feature-tag {
          transform: scale(1.05);
        }

        .card-title {
          transition: color 0.3s ease-out;
        }

        .card-arrow {
          transition: transform 0.3s ease-out;
        }

        .card-background {
          transition: opacity 0.3s ease-out;
        }

        .feature-tag {
          transition: transform 0.2s ease-out;
        }

        /* 背景粒子動畫 */
        .floating-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          opacity: 0;
        }

        .particle.visible {
          opacity: 0.5;
        }

        .particle:nth-child(1) {
          left: 5%;
          animation-delay: 0s;
        }
        .particle:nth-child(2) {
          left: 15%;
          animation-delay: 1s;
        }
        .particle:nth-child(3) {
          left: 25%;
          animation-delay: 2s;
        }
        .particle:nth-child(4) {
          left: 35%;
          animation-delay: 3s;
        }
        .particle:nth-child(5) {
          left: 45%;
          animation-delay: 4s;
        }
        .particle:nth-child(6) {
          left: 55%;
          animation-delay: 0.5s;
        }
        .particle:nth-child(7) {
          left: 65%;
          animation-delay: 1.5s;
        }
        .particle:nth-child(8) {
          left: 75%;
          animation-delay: 2.5s;
        }
        .particle:nth-child(9) {
          left: 85%;
          animation-delay: 3.5s;
        }
        .particle:nth-child(10) {
          left: 95%;
          animation-delay: 4.5s;
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink {
          0%,
          50% {
            border-color: #3b82f6;
          }
          51%,
          100% {
            border-color: transparent;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(100vh) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>

      <section ref={sectionRef} className="py-10 relative overflow-hidden">
        {/* 浮動粒子背景 */}
        <div className="floating-particles">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`particle ${isVisible ? 'visible' : ''}`} />
          ))}
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className={`title-entrance text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${isVisible ? 'visible' : ''}`}
            >
              {t('title', { defaultValue: '系所學程' })}
            </h2>
            <p
              className={`text-typewriter text-xl text-gray-700 max-w-3xl mx-auto ${showTypewriter ? 'visible' : ''}`}
            >
              {t('description', {
                defaultValue:
                  '多元化的學習領域，培養未來領袖所需的專業知識與技能',
              })}
            </p>
          </div>

          {/* 系所學程卡片佈局 */}
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {departments.map((department, index) => (
                <div
                  key={department.id}
                  className={`card-entrance ${
                    index === 1
                      ? 'card-entrance-delay-1'
                      : index === 2
                        ? 'card-entrance-delay-2'
                        : index === 3
                          ? 'card-entrance-delay-3'
                          : ''
                  } ${isVisible ? 'visible' : ''}`}
                >
                  <Link href={department.link}>
                    <div
                      className={`card-hover ${isScrolling ? 'scrolling' : ''} relative backdrop-blur-md bg-white/20 rounded-3xl p-8 border border-white/30 shadow-xl overflow-hidden h-full`}
                    >
                      {/* 背景漸層 */}
                      <div
                        className={`card-background absolute inset-0 bg-gradient-to-br ${department.gradient} opacity-0 rounded-3xl`}
                      />

                      {/* 圖標與標題區域 */}
                      <div className="flex items-center mb-6 relative z-10">
                        {/* 圖標 */}
                        <div
                          className={`icon-entrance w-20 h-20 rounded-2xl bg-gradient-to-br ${department.gradient} flex items-center justify-center shadow-lg relative overflow-hidden mr-4 ${isVisible ? 'visible' : ''}`}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-70" />
                          <div className="relative z-10">
                            <IconComponent iconType={department.icon} />
                          </div>
                        </div>

                        {/* 標題 */}
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 card-title">
                          {department.title}
                        </h3>
                      </div>

                      {/* 描述 */}
                      <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                        {department.description}
                      </p>

                      {/* 特色標籤 */}
                      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                        {department.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className={`feature-tag px-3 py-1 text-sm font-medium bg-gradient-to-r ${department.gradient} text-white rounded-full shadow-md`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* 了解更多按鈕 */}
                      <div className="flex items-center text-primary-600 font-bold text-lg relative z-10">
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

          {/* 查看所有學程按鈕 */}
          <div className="text-center mt-16">
            <Link href="/departments" className="group">
              <button className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                <span className="mr-2">
                  {t('view_all', { defaultValue: '查看所有學程' })}
                </span>
                <svg
                  className="w-5 h-5 inline-block group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
