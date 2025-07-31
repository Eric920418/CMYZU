// CMYZU 學校官方網站首頁 - 現代化設計
import Hero from '@/components/layout/Hero';
import StatsSection from '@/components/layout/StatsSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import NewsSection from '@/components/layout/NewsSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 主視覺區域 - Hero Section */}
      <Hero />

      {/* 統計數據展示 */}
      <StatsSection />

      {/* 學校特色介紹 */}
      <FeaturesSection />

      {/* 最新消息 */}
      <NewsSection />
    </main>
  );
}
