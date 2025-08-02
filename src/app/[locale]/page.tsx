// CMYZU 學校官方網站首頁 - 現代建築風格設計
import Hero from '@/components/layout/Hero';
import StatsSection from '@/components/layout/StatsSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import NewsSection from '@/components/layout/NewsSection';
import { Metadata } from 'next';

// SEO 優化的頁面元數據
export const metadata: Metadata = {
  title: 'CMYZU 學校 - 卓越教育，創新未來',
  description:
    '致力於培養具有國際視野、創新思維與社會責任感的優秀人才，為學生提供最優質的教育環境與學習資源。',
  keywords: 'CMYZU, 學校, 教育, 卓越教育, 創新未來, 國際視野, 優質教育',
  openGraph: {
    title: 'CMYZU 學校 - 卓越教育，創新未來',
    description: '致力於培養具有國際視野、創新思維與社會責任感的優秀人才',
    type: 'website',
    locale: 'zh_TW',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 結構化數據 Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'CMYZU 學校',
            description:
              '致力於培養具有國際視野、創新思維與社會責任感的優秀人才',
            url: 'https://cmyzu.edu.tw',
            logo: 'https://cmyzu.edu.tw/logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+886-2-1234-5678',
              contactType: '招生諮詢',
            },
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'TW',
              addressRegion: '台北市',
            },
          }),
        }}
      />

      {/* 主視覺區域 - 現代建築風格 Hero Section */}
      <Hero />

      <div className="py-20 backdrop-blur-md bg-gray-500/80 border-gray-500/60 flex flex-col items-center justify-center gap-20">
        {/* 統計數據展示 */}
        <StatsSection />
        {/* 學校特色介紹 */}
        <FeaturesSection />
        {/* 最新消息 */}
        <NewsSection />
      </div>
    </main>
  );
}
