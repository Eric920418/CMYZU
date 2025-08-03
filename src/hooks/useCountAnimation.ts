'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountAnimationOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  delay?: number;
}

// 全域 Set 追蹤已完成動畫的元素
const animatedElements = new Set<HTMLElement>();

/**
 * 數字計數動畫 Hook
 * 使用全域 Set 追蹤已動畫的元素，避免重複執行
 */
export function useCountAnimation({
  end,
  duration = 1500,
  start = 0,
  decimals = 0,
  delay = 0,
}: UseCountAnimationOptions) {
  const [displayValue, setDisplayValue] = useState(end);
  const [hasAnimated, setHasAnimated] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const startAnimation = useCallback(() => {
    const element = elementRef.current;
    if (!element || animatedElements.has(element)) {
      console.log('🚫 元素已動畫過或不存在，跳過動畫');
      return;
    }

    console.log('🎬 開始動畫，目標值:', end);

    // 立即將元素加入已動畫集合
    animatedElements.add(element);

    const startTime = Date.now();
    const totalChange = end - start;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = start + totalChange * easeOutQuart;

      setDisplayValue(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        setHasAnimated(true);
        console.log('✅ 動畫完成，目標值:', end);
      }
    };

    // 延遲執行動畫
    setTimeout(() => {
      setDisplayValue(start);
      animate();
    }, delay);
  }, [end, start, duration, decimals, delay]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 檢查元素是否已經動畫過
    if (animatedElements.has(element)) {
      console.log('🚫 元素已動畫過，不創建觀察器');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedElements.has(element)) {
          startAnimation();
          // 立即停止觀察，避免重複觸發
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startAnimation]);

  return {
    count: displayValue,
    elementRef,
    hasAnimated,
  };
}
