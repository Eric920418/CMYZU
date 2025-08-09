// CMYZU 學校官方網站首頁 - 現代建築風格設計
import Hero from '@/components/layout/Hero';
import DynamicBackground from '@/components/layout/DynamicBackground';
import StatsSection from '@/components/layout/StatsSection';
import MoreHighlightsSection from '@/components/layout/MoreHighlightsSection';
import NewsletterSection from '@/components/layout/NewsletterSection';
import TalentDevelopmentSection from '@/components/layout/TalentDevelopmentSection';
import NewsSection from '@/components/layout/NewsSection';
import LiveUpdatesSection from '@/components/layout/LiveUpdatesSection';
import FeaturedResourcesSection from '@/components/layout/FeaturedResourcesSection';
import RankingSection from '@/components/layout/RankingSection';
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
    <main className="min-h-screen relative">
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

      {/* 動態背景圖片 - 從後台管理載入 */}
      <DynamicBackground />

      {/* 主視覺區域 - 現代建築風格 Hero Section */}
      <div className="relative z-10">
        <Hero />
      </div>

      {/* 內容區域 - 加上響應式容器 */}
      <div className="relative z-20 py-20 backdrop-blur-md bg-gray-500/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center ">
          {/* 統計數據展示 */}
          <StatsSection />
          {/* 最新消息輪播 */}
          <NewsSection />
        </div>
        <div className="w-[80%] mx-auto px-1 sm:px-2 lg:px-4 mt-0 md:mt-[-5%]">
          {/* 即時動態 */}
          <LiveUpdatesSection />
        </div>

        {/* 特色資源 */}
        <FeaturedResourcesSection />

        {/* 排名 */}
        <RankingSection />

        {/* 培養最國際化的商管專業人才 - 需要全寬度顯示 */}
        <TalentDevelopmentSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-20">
          {/* 更多的精采收錄 */}
          <MoreHighlightsSection />
          {/* 電子報專區 */}
          <NewsletterSection />
        </div>
      </div>
    </main>
  );
}
