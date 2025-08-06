'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

interface FullScreenNavProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: Array<{ name: string; href: string }>;
}

export default function FullScreenNav({
  isOpen,
  onClose,
  navigation,
}: FullScreenNavProps) {
  // 這些 hooks 不能寫在 return 之前的 if 裡
  const [show, setShow] = useState(isOpen);
  const [animateClass, setAnimateClass] = useState('animate-slide-down');

  // 控制開關動畫
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimateClass('animate-slide-down');
    } else if (show) {
      setAnimateClass('animate-slide-up');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 動畫結束時才真正卸載
  const handleAnimationEnd = () => {
    if (!isOpen) setShow(false);
  };

  // 鎖定背景滾動（同理不能寫在 if 裡）
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 只有這裡能判斷 show 決定要不要 return null
  if (!show) return null;

  return (
    <nav
      className={clsx(
        'fixed inset-0 z-40 bg-white/5 backdrop-blur-lg',
        animateClass
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* ...內容同前 */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out opacity-100"
        style={{ background: 'transparent' }}
      />
      <div
        className="absolute top-10 left-1/2 transform -translate-x-1/2 w-96 h-96 transition-all duration-1200 ease-out blur-3xl opacity-100 scale-100"
        style={{ background: 'transparent', transitionDelay: '200ms' }}
      />
      <div className="flex items-center justify-center w-full h-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-8">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group block p-6 rounded-xl transition-all duration-500 ease-out transform border hover:scale-105 hover:shadow-xl',
                'translate-y-0 opacity-100 scale-100 rotate-0 backdrop-blur-sm border-white/40'
              )}
              style={{
                transitionDelay: `${300 + index * 150}ms`,
                background: 'rgba(255, 255, 255, 0.75)',
                boxShadow:
                  '0 10px 25px rgba(151, 151, 149, 0.15), 0 4px 10px rgba(151, 151, 149, 0.1)',
              }}
              onClick={onClose}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-all duration-400 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md scale-100 rotate-0"
                    style={{ transitionDelay: `${450 + index * 150}ms` }}
                  >
                    <svg
                      className="w-6 h-6 text-primary-600 transition-all duration-400 ease-out group-hover:translate-x-1 group-hover:scale-110 translate-x-0 scale-100"
                      style={{ transitionDelay: `${600 + index * 150}ms` }}
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
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-all duration-400 ease-out translate-x-0 opacity-100"
                    style={{ transitionDelay: `${500 + index * 150}ms` }}
                  >
                    {item.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
