'use client';

import { useHero } from '@/hooks/useHero';
import { useLocale } from 'next-intl';

// 動態背景組件 - 從後台載入背景圖片
export default function DynamicBackground() {
  const locale = useLocale();
  const { heroContent, loading } = useHero(locale);

  // 載入中時顯示預設背景
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-0 
                   bg-cover bg-center bg-no-repeat
                   bg-local md:bg-fixed
                   min-h-screen overflow-hidden"
        style={{
          backgroundImage: `url('/hero-building.webp')`,
        }}
      />
    );
  }

  // 使用後台設定的背景圖片，若無則使用預設
  const backgroundImage = heroContent?.backgroundImage || '/hero-building.webp';

  return (
    <div
      className="fixed inset-0 z-0 
                 bg-cover bg-center bg-no-repeat
                 bg-local md:bg-fixed
                 min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    />
  );
}
