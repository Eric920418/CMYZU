'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// 探索元智管理學院區塊
export default function ExploreSection() {
  const t = useTranslations('Explore');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    // 觀察整個區塊的進入，用於觸發卡片動畫
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    // 專門觀察文字區域，確保用戶能看到文字時才開始打字動畫
    const textObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Text area is now visible, starting typing animation');
          // 重置狀態
          setTypingComplete(false);
          setTextVisible(true);
          // 打字動畫延遲0.5秒開始，持續2秒，所以2.5秒後完成
          setTimeout(() => {
            setTypingComplete(true);
          }, 2500);
        } else {
          // 離開視窗時重置狀態，準備下次進入時重新觸發
          setTextVisible(false);
          setTypingComplete(false);
        }
      },
      {
        threshold: 0.8, // 文字區域80%可見時才觸發
        rootMargin: '-50px', // 文字要完全進入視窗50px才觸發
      }
    );

    const currentSection = sectionRef.current;
    const currentText = textRef.current;

    if (currentSection) {
      sectionObserver.observe(currentSection);
    }

    if (currentText) {
      textObserver.observe(currentText);
    }

    return () => {
      if (currentSection) {
        sectionObserver.unobserve(currentSection);
      }
      if (currentText) {
        textObserver.unobserve(currentText);
      }
    };
  }, []);

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
      icon: 'school',
      link: '/about',
      gradient: 'from-blue-500 to-purple-600',
      accentColor: 'blue',
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
      icon: 'faculty',
      link: '/faculty',
      gradient: 'from-emerald-500 to-teal-600',
      accentColor: 'emerald',
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
      icon: 'international',
      link: '/international',
      gradient: 'from-orange-500 to-red-600',
      accentColor: 'orange',
    },
  ];

  // 圖標組件
  const IconComponent = ({ iconType }: { iconType: string }) => {
    const iconClass = 'w-14 h-14 text-white drop-shadow-lg';

    switch (iconType) {
      case 'school':
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
      case 'faculty':
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        );
      case 'international':
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
          transition-delay: 0.3s;
        }

        .card-entrance-delay-2.visible {
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

        /* 打字完成後移除錨點 */
        .text-typewriter.typing-complete {
          border-right: none;
          animation: typing 2s steps(40, end) forwards;
        }

        /* Hover 效果保持不變 */
        .card-hover {
          transition:
            transform 0.2s ease-out,
            box-shadow 0.2s ease-out;
        }

        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .card-hover:hover .card-title {
          color: #3b82f6;
        }

        .card-hover:hover .card-arrow {
          transform: translateX(8px);
        }

        .card-hover:hover .card-background {
          opacity: 0.15;
        }

        .card-title {
          transition: color 0.2s ease-out;
        }

        .card-arrow {
          transition: transform 0.2s ease-out;
        }

        .card-background {
          transition: opacity 0.2s ease-out;
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
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
          opacity: 0;
        }

        .particle.visible {
          opacity: 0.6;
        }

        .particle:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
        }
        .particle:nth-child(2) {
          left: 20%;
          animation-delay: 1s;
        }
        .particle:nth-child(3) {
          left: 30%;
          animation-delay: 2s;
        }
        .particle:nth-child(4) {
          left: 40%;
          animation-delay: 3s;
        }
        .particle:nth-child(5) {
          left: 50%;
          animation-delay: 4s;
        }
        .particle:nth-child(6) {
          left: 60%;
          animation-delay: 0.5s;
        }
        .particle:nth-child(7) {
          left: 70%;
          animation-delay: 1.5s;
        }
        .particle:nth-child(8) {
          left: 80%;
          animation-delay: 2.5s;
        }
        .particle:nth-child(9) {
          left: 90%;
          animation-delay: 3.5s;
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

        /* 按鈕浮誇進場 */
        .button-entrance {
          opacity: 0;
          transform: translateY(50px) scale(0.8) rotateZ(-10deg);
          transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transition-delay: 2s;
        }

        .button-entrance.visible {
          opacity: 1;
          transform: translateY(0) scale(1) rotateZ(0deg);
        }
      `}</style>

      <section ref={sectionRef} className=" pb-10 relative overflow-hidden">
        {/* 浮動粒子背景 */}
        <div className="floating-particles">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`particle ${isVisible ? 'visible' : ''}`} />
          ))}
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2
              ref={titleRef}
              className={`title-entrance text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${isVisible ? 'visible' : ''}`}
            >
              {t('title', { defaultValue: '探索元智管理學院' })}
            </h2>
            <p
              ref={textRef}
              className={`text-typewriter text-xl text-gray-700 max-w-3xl mx-auto ${textVisible ? 'visible' : ''} ${typingComplete ? 'typing-complete' : ''}`}
            >
              {t('description', {
                defaultValue:
                  '深入了解我們的學院特色、師資陣容與國際化教育環境',
              })}
            </p>
          </div>

          {/* 3個項目的浮誇進場動畫佈局 */}
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
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
                    <div className="card-hover relative backdrop-blur-md bg-white/20 rounded-3xl p-8 border border-white/30 shadow-xl overflow-hidden h-full">
                      {/* 背景漸層 */}
                      <div
                        className={`card-background absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 rounded-3xl`}
                      />

                      {/* 圖標區域 - 超浮誇旋轉飛入 */}
                      <div className="mb-8 relative z-10">
                        <div
                          className={`icon-entrance w-24 h-24 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl relative overflow-hidden ${isVisible ? 'visible' : ''}`}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full opacity-70" />
                          <div className="relative z-10">
                            <IconComponent iconType={item.icon} />
                          </div>
                        </div>
                      </div>

                      {/* 標題 */}
                      <h3 className="text-3xl font-bold text-gray-900 mb-6 relative z-10 card-title">
                        {item.title}
                      </h3>

                      {/* 描述 */}
                      <p className="text-gray-700 leading-relaxed mb-8 relative z-10">
                        {item.description}
                      </p>

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
        </div>
      </section>
    </>
  );
}
