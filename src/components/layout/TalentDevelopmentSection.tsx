'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';

// 傑出校友資料 - 九位校友分三頁展示
const alumniHighlights = [
  // 第一頁：企業領袖
  {
    id: 1,
    title: '林志明',
    position: '永豐金控董事長',
    description:
      '本校商學院85級校友，成功帶領集團轉型數位金融，創造卓越經營績效',
    image: '/4.webp',
    stats: [
      { label: '服務年資', value: '25年', icon: '👔' },
      { label: '管理資產', value: '2.8兆', icon: '💰' },
      { label: '團隊規模', value: '8000人', icon: '👥' },
    ],
    detailContent: {
      fullTitle: '林志明校友 - 永豐金控董事長的卓越領導之路',
      overview:
        '林志明校友於1985年畢業於本校商學院財務金融系，憑藉著紮實的專業知識與卓越的領導能力，成功帶領集團在數位金融時代的轉型與發展。',
      achievements: [
        '推動永豐金控數位轉型，打造領先業界的數位金融平台',
        '建立完善的ESG永續經營體系，獲得國際認證',
        '擴展海外業務版圖，成功進軍東南亞市場',
        '培養新世代金融人才，建立企業永續發展基礎',
      ],
      impact:
        '在林志明校友的帶領下，永豐金控不僅在營運績效上創新高，更在數位創新、永續經營等面向樹立標竿，為台灣金融業的發展注入新動能。',
    },
  },
  {
    id: 2,
    title: '張雅芳',
    position: '台積電營運長',
    description:
      '本校工管系88級校友，推動半導體製程創新，引領台灣科技產業邁向新里程碑',
    image: '/Image.webp',
    stats: [
      { label: '管理廠區', value: '15座', icon: '🏭' },
      { label: '年營收', value: '2.2兆', icon: '📈' },
      { label: '員工數', value: '7萬人', icon: '👨‍💼' },
    ],
    detailContent: {
      fullTitle: '張雅芳校友 - 台積電營運長的製程創新之路',
      overview:
        '張雅芳校友於1988年畢業於本校工業管理系，在半導體產業深耕多年，現為台積電營運長，負責全球製程營運管理。',
      achievements: [
        '推動3奈米製程量產，維持台積電技術領先地位',
        '建立智慧製造系統，提升生產效率30%',
        '管理全球15座晶圓廠，年產值突破2.2兆新台幣',
        '培育半導體製程專業人才，建立完整人才梯隊',
      ],
      impact:
        '張雅芳校友的營運管理創新，不僅鞏固了台積電的全球領導地位，更為台灣半導體產業的持續發展奠定堅實基礎。',
    },
  },
  {
    id: 3,
    title: '劉文達',
    position: '統一企業總裁',
    description: '本校MBA 90級校友，推動食品產業數位轉型，打造亞洲最大食品集團',
    image: '/er.webp',
    stats: [
      { label: '品牌數量', value: '200+', icon: '🏷️' },
      { label: '海外據點', value: '25國', icon: '🌏' },
      { label: '年營收', value: '6800億', icon: '💼' },
    ],
    detailContent: {
      fullTitle: '劉文達校友 - 統一企業總裁的品牌經營之路',
      overview:
        '劉文達校友於1990年取得本校MBA學位，加入統一企業後，成功推動集團國際化與數位轉型，現為統一企業總裁。',
      achievements: [
        '建立200+個品牌組合，涵蓋食品、飲料、零售等領域',
        '拓展25國海外市場，年營收達6800億新台幣',
        '推動數位零售轉型，7-ELEVEN成為亞洲最大便利商店',
        '建立永續供應鏈體系，獲得國際ESG認證',
      ],
      impact:
        '劉文達校友的品牌經營策略，不僅讓統一企業成為亞洲食品產業標竿，更為台灣企業國際化樹立成功典範。',
    },
  },
  // 第二頁：科技創新
  {
    id: 4,
    title: '陳美華',
    position: '聯發科技執行副總',
    description:
      '本校資管系92級校友，專精於AI晶片技術開發，引領全球半導體創新趨勢',
    image: '/4.webp',
    stats: [
      { label: '專利數量', value: '180項', icon: '💡' },
      { label: '研發團隊', value: '2000人', icon: '🔬' },
      { label: '市場地位', value: '全球第三', icon: '🌍' },
    ],
    detailContent: {
      fullTitle: '陳美華校友 - 聯發科技執行副總的創新科技之路',
      overview:
        '陳美華校友於1992年畢業於本校資訊管理系，專注於晶片技術研發，現為執行副總，負責AI晶片產品線的全球戰略規劃。',
      achievements: [
        '主導開發多款突破性AI晶片，獲得180項國際專利',
        '建立2000人規模的研發團隊，培養頂尖技術人才',
        '推動產品在全球市場取得領先地位，市佔率躍居第三',
        '積極推動產學合作，回饋母校培育下一代科技人才',
      ],
      impact:
        '陳美華校友的技術創新不僅推動了聯發科技的成長，更為全球AI晶片產業的發展做出重要貢獻，展現了本校校友在科技領域的卓越成就。',
    },
  },
  {
    id: 5,
    title: '李建興',
    position: 'Google台灣董事總經理',
    description: '本校資工系89級校友，推動台灣數位轉型，建立亞太AI研發中心',
    image: '/Image.webp',
    stats: [
      { label: 'AI專案', value: '50+', icon: '🤖' },
      { label: '合作企業', value: '1000+', icon: '🤝' },
      { label: '培訓人才', value: '10萬人', icon: '👨‍🎓' },
    ],
    detailContent: {
      fullTitle: '李建興校友 - Google台灣董事總經理的數位領導之路',
      overview:
        '李建興校友於1989年畢業於本校資訊工程系，後赴美深造，加入Google後負責亞太區業務發展，現為台灣董事總經理。',
      achievements: [
        '建立Google台灣AI研發中心，推動50+個AI創新專案',
        '與1000+家台灣企業合作，推動數位轉型',
        '啟動數位人才培訓計畫，培育10萬名數位專業人才',
        '推動智慧城市建設，協助政府數位治理升級',
      ],
      impact:
        '李建興校友的數位領導，不僅提升了台灣在全球科技版圖的地位，更為台灣數位經濟發展奠定重要基礎。',
    },
  },
  {
    id: 6,
    title: '黃淑娟',
    position: '鴻海精密副董事長',
    description:
      '本校電機系86級校友，推動智慧製造轉型，打造全球最大電子代工帝國',
    image: '/er.webp',
    stats: [
      { label: '工廠數量', value: '200+座', icon: '🏭' },
      { label: '員工規模', value: '130萬人', icon: '👥' },
      { label: '年產值', value: '5.9兆', icon: '📊' },
    ],
    detailContent: {
      fullTitle: '黃淑娟校友 - 鴻海精密副董事長的智造革命之路',
      overview:
        '黃淑娟校友於1986年畢業於本校電機工程系，加入鴻海後推動製造業智慧化轉型，現為副董事長，負責全球營運策略。',
      achievements: [
        '建立200+座智慧工廠，年產值達5.9兆新台幣',
        '管理130萬名員工，建立全球最大製造網絡',
        '推動工業4.0轉型，導入AI、IoT等前沿技術',
        '開展電動車事業，布局未來移動產業',
      ],
      impact:
        '黃淑娟校友的智造革命，不僅鞏固了鴻海的全球代工霸主地位，更為台灣製造業轉型升級指明方向。',
    },
  },
  // 第三頁：社會影響
  {
    id: 7,
    title: '王建國',
    position: '慈濟基金會執行長',
    description:
      '本校MBA 98級校友，運用商管專業推動社會公益事業，影響力遍及全球',
    image: '/4.webp',
    stats: [
      { label: '服務國家', value: '67國', icon: '🌏' },
      { label: '志工人數', value: '10萬人', icon: '🤝' },
      { label: '受益人群', value: '500萬人', icon: '❤️' },
    ],
    detailContent: {
      fullTitle: '王建國校友 - 慈濟基金會執行長的慈善領導之路',
      overview:
        '王建國校友於1998年取得本校MBA學位，結合商管專業與人文關懷，現任慈濟基金會執行長。',
      achievements: [
        '建立全球67國的慈善服務網絡，影響力遍及五大洲',
        '培養10萬名專業志工，建立完善的志工培訓體系',
        '累計服務500萬受益人群，涵蓋教育、醫療、災難救助等領域',
        '推動企業社會責任，促進商業與公益的結合',
      ],
      impact:
        '王建國校友運用專業的管理知識推動慈善事業現代化，不僅提升了組織效能，更展現了商管教育結合社會關懷的價值。',
    },
  },
  {
    id: 8,
    title: '林麗雲',
    position: '台灣大學校長',
    description:
      '本校教育系84級校友，推動高等教育國際化，培育無數優秀人才貢獻社會',
    image: '/Image.webp',
    stats: [
      { label: '學生人數', value: '3.2萬人', icon: '🎓' },
      { label: '國際排名', value: '全球66名', icon: '🏆' },
      { label: '研究產出', value: '年8000篇', icon: '📚' },
    ],
    detailContent: {
      fullTitle: '林麗雲校友 - 台灣大學校長的教育革新之路',
      overview:
        '林麗雲校友於1984年畢業於本校教育學系，致力於教育改革，現為台灣大學校長，推動高等教育現代化發展。',
      achievements: [
        '提升台大國際排名至全球第66名，躋身世界頂尖大學',
        '建立3.2萬學生的多元學習環境，培育跨領域人才',
        '推動年產8000篇高品質研究論文，提升學術影響力',
        '開展國際合作交流，與50+所頂尖大學建立夥伴關係',
      ],
      impact:
        '林麗雲校友的教育領導，不僅提升了台灣高等教育的國際地位，更為社會培育了無數優秀人才，影響深遠。',
    },
  },
  {
    id: 9,
    title: '陳志華',
    position: '台北市副市長',
    description:
      '本校公行系91級校友，推動智慧城市建設，打造台北成為亞洲數位治理典範',
    image: '/er.webp',
    stats: [
      { label: '數位政策', value: '100+項', icon: '📱' },
      { label: '服務人口', value: '270萬人', icon: '🏙️' },
      { label: '滿意度', value: '85%', icon: '👍' },
    ],
    detailContent: {
      fullTitle: '陳志華校友 - 台北市副市長的城市治理之路',
      overview:
        '陳志華校友於1991年畢業於本校公共行政系，長期投入公共服務，現為台北市副市長，負責數位治理與城市發展。',
      achievements: [
        '推動100+項數位政策，建立智慧城市治理體系',
        '服務270萬台北市民，市政滿意度達85%',
        '建立數位市民服務平台，提升行政效率50%',
        '推動永續城市發展，獲得國際智慧城市認證',
      ],
      impact:
        '陳志華校友的公共治理創新，不僅讓台北市成為亞洲數位治理典範，更為台灣城市發展模式樹立標竿。',
    },
  },
];

export default function TalentDevelopmentSection() {
  const t = useTranslations('TalentDevelopment');
  const [selectedHighlight, setSelectedHighlight] = useState<
    (typeof alumniHighlights)[0] | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
  // 檢查裝置
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // 主要邏輯：垂直卷軸推動橫向輪播
  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current!;
    const scroller = scrollerRef.current!;

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const totalH = section.offsetHeight - viewH;

      // 滾動尚未進入區塊 或 已超過區塊
      if (rect.top > 0 || rect.bottom < viewH) return;

      // 捲動進度 0~1
      const progress = Math.min(Math.max(-rect.top / totalH, 0), 1);
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;

      scroller.scrollLeft = progress * maxScrollLeft;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // 初始
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  // ----------- 手機版 ----------
  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative py-20">
        <div className="text-center mb-12">
          <div
            className={`title-entrance text-2xl md:text-4xl lg:text-5xl font-bold text-primary-700 mb-4  ${isVisible ? 'visible' : ''}`}
          >
            <span className="text-primary-600 font-medium">傑出校友</span>
          </div>
          <h2
            className={`title-entrance text-base md:text-xl text-gray-700 max-w-3xl mx-auto px-4 md:px-0 ${isVisible ? 'visible' : ''}`}
          >
            {t('title', { defaultValue: '校友成就展現教育價值' })}
          </h2>
        </div>
        <div className="container">
          <div className="space-y-12">
            {alumniHighlights.map((highlight) => (
              <div key={highlight.id} className="relative">
                <HighlightCard
                  highlight={highlight}
                  openDetail={setSelectedHighlight}
                />
              </div>
            ))}
          </div>
          {/* 詳細介紹模態框... */}
          {selectedHighlight && (
            <DetailModal
              highlight={selectedHighlight}
              close={() => setSelectedHighlight(null)}
            />
          )}
        </div>
      </section>
    );
  }

  // ----------- 桌面版 ----------
  return (
    <>
      <style jsx>{`
        /* 浮誇標題進場動畫 */
        .title-entrance {
          opacity: 0;
          transform: translateY(0px) scale(0.7);
          transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .title-entrance.visible {
          opacity: 1;
          transform: translateY(-100px) scale(1);
        }

        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
      <section
        ref={sectionRef}
        className={`relative`}
        style={{ height: `${Math.ceil(alumniHighlights.length / 3) * 100}vh` }}
      >
        <div className="text-center mt-30 mb-[-100px]">
          <div
            className={`title-entrance text-2xl md:text-4xl lg:text-5xl font-bold text-primary-700 mb-4  ${isVisible ? 'visible' : ''}`}
          >
            <span className="text-primary-600 font-medium">傑出校友</span>
          </div>
          <h2
            className={`title-entrance text-base md:text-xl text-primary-100 max-w-3xl mx-auto px-4 md:px-0 ${isVisible ? 'visible' : ''}`}
          >
            {t('title', { defaultValue: '校友成就展現教育價值' })}
          </h2>
        </div>

        {/* sticky 水平卡片容器 */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-y-hidden z-10">
          <div
            ref={scrollerRef}
            className="flex h-full flex-nowrap overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth hide-scrollbar"
            style={{
              scrollSnapType: 'x mandatory',
            }}
          >
            {Array.from(
              { length: Math.ceil(alumniHighlights.length / 3) },
              (_, pageIndex) => {
                const pageAlumni = alumniHighlights.slice(
                  pageIndex * 3,
                  (pageIndex + 1) * 3
                );
                return (
                  <AlumniPageCard
                    key={pageIndex}
                    alumni={pageAlumni}
                    openDetail={setSelectedHighlight}
                  />
                );
              }
            )}
          </div>
        </div>
        {/* 詳細介紹模態框... */}
        {selectedHighlight && (
          <DetailModal
            highlight={selectedHighlight}
            close={() => setSelectedHighlight(null)}
          />
        )}
      </section>
    </>
  );
}

// 三人一頁的校友展示卡片 - 高端設計版
function AlumniPageCard({
  alumni,
  openDetail,
}: {
  alumni: (typeof alumniHighlights)[0][];
  openDetail: (h: (typeof alumniHighlights)[0]) => void;
}) {
  return (
    <div
      className="flex-shrink-0 w-screen h-screen flex items-center justify-center min-w-[100vw] flex-none"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="container mx-auto px-4">
        <div className="h-full max-h-[90vh] flex flex-col justify-center py-8">
          {/* 三位校友卡片 - 豪華設計 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {alumni.map((alumnus) => (
              <div
                key={alumnus.id}
                className="group cursor-pointer relative"
                onClick={() => openDetail(alumnus)}
              >
                {/* 背景光暈效果 */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* 主要卡片容器 */}
                <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group-hover:shadow-3xl group-hover:border-white/30 transition-all duration-500 group-hover:-translate-y-2">
                  {/* 校友照片區域 */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={alumnus.image}
                        alt={alumnus.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* 漸層覆蓋層 - 減弱漸層效果 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                      {/* 底部姓名覆蓋 */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {alumnus.title}
                        </h4>
                        <p className="text-white/90 text-base font-medium drop-shadow">
                          {alumnus.position}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 卡片內容區域 */}
                  <div className="p-6 space-y-4">
                    {/* 描述文字 */}
                    <p className="text-white/85 text-sm leading-relaxed line-clamp-3 group-hover:text-white transition-colors duration-300 font-medium">
                      {alumnus.description}
                    </p>

                    {/* 了解更多按鈕 */}
                    <div className="pt-2">
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          <span>了解更多</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </span>
                        {/* 按鈕光暈效果 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 手機版優化卡片設計
function HighlightCard({
  highlight,
  openDetail,
}: {
  highlight: (typeof alumniHighlights)[0];
  openDetail: (h: (typeof alumniHighlights)[0]) => void;
}) {
  return (
    <div
      key={highlight.id}
      className="relative group cursor-pointer"
      onClick={() => openDetail(highlight)}
    >
      {/* 背景光暈效果 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-secondary-500/30 to-primary-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      {/* 主要卡片容器 */}
      <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group-hover:shadow-3xl group-hover:border-white/30 transition-all duration-500">
        {/* 校友照片區域 */}
        <div className="relative overflow-hidden">
          <div className="aspect-[16/9] relative">
            <Image
              src={highlight.image}
              alt={highlight.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="100vw"
            />
            {/* 漸層覆蓋層 - 減弱效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

            {/* 底部姓名區域 */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                {highlight.title}
              </h4>
              <p className="text-white/90 text-base font-medium drop-shadow mb-2">
                {highlight.position}
              </p>
            </div>
          </div>
        </div>

        {/* 卡片內容區域 */}
        <div className="p-6 space-y-4">
          {/* 描述文字 */}
          <p className="text-white/85 text-sm leading-relaxed group-hover:text-white transition-colors duration-300 line-clamp-3 font-medium">
            {highlight.description}
          </p>

          {/* 了解更多按鈕 */}
          <div className="pt-2">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span className="text-base">了解更多</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
              {/* 按鈕光暈效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 詳細介紹模態框（照你原本內容拆分）
function DetailModal({
  highlight,
  close,
}: {
  highlight: (typeof alumniHighlights)[0];
  close: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={close}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 關閉按鈕 */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
          aria-label="關閉詳細介紹"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 模態框內容 */}
        <div className="p-8">
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
            <Image
              src={highlight.image}
              alt={highlight.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-block px-4 py-2 bg-primary-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                人才發展
              </span>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {highlight.detailContent.fullTitle}
            </h2>
            <div className="text-lg text-gray-600 leading-relaxed">
              {highlight.detailContent.overview}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                主要成就
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlight.detailContent.achievements.map(
                  (achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {achievement}
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                重要數據
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {highlight.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl"
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">影響與意義</h3>
              <p className="leading-relaxed">
                {highlight.detailContent.impact}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
