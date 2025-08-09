import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 開始種子數據初始化...');

  // 清除現有數據
  console.log('🧹 清理現有數據...');
  await prisma.annualReport.deleteMany({});
  await prisma.liveUpdate.deleteMany({});
  await prisma.news.deleteMany({});
  await prisma.featuredResource.deleteMany({});
  await prisma.heroContent.deleteMany({});
  await prisma.user.deleteMany({});

  // 創建用戶
  console.log('👥 創建用戶...');

  const adminUser = await prisma.user.create({
    data: {
      name: '系統管理員',
      email: 'admin@cmyzu.edu.tw',
      password: await bcrypt.hash('123456', 12),
      role: 'ADMIN',
      active: true,
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      name: '張老師',
      email: 'teacher1@cmyzu.edu.tw',
      password: await bcrypt.hash('123456', 12),
      role: 'TEACHER',
      active: true,
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: '王老師',
      email: 'teacher2@cmyzu.edu.tw',
      password: await bcrypt.hash('123456', 12),
      role: 'TEACHER',
      active: true,
    },
  });

  console.log(`✅ 創建了 3 個用戶`);

  // 創建新聞
  console.log('📰 創建新聞...');

  const newsData = [
    {
      title: '【重要公告】2025年春季學期開學通知',
      content: '親愛的同學們，2025年春季學期將於2月17日正式開學...',
      excerpt: '2025年春季學期開學相關事宜通知',
      imageUrl: '/api/images/news1.webp',
      published: true,
      featured: true,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
    {
      title: '商管學院獲得AACSB國際商學院認證',
      content: '本校商管學院正式獲得AACSB（國際商學院聯合會）認證...',
      excerpt: '商管學院通過AACSB認證，提升國際競爭力',
      imageUrl: '/api/images/news2.webp',
      published: true,
      featured: true,
      authorId: teacher1.id,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      title: '2025年國際交換生計劃開始申請',
      content: '本校與多所國際知名大學合作的交換生計劃現已開放申請...',
      excerpt: '國際交換生計劃申請開放中',
      imageUrl: '/api/images/news3.webp',
      published: true,
      featured: false,
      authorId: teacher2.id,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const news of newsData) {
    await prisma.news.create({ data: news });
  }

  console.log(`✅ 創建了 ${newsData.length} 則新聞`);

  // 創建即時動態
  console.log('⚡ 創建即時動態...');

  const liveUpdatesData = [
    {
      title: '圖書館延長開放時間',
      content: '為配合期末考試，圖書館將延長開放至晚上10點',
      priority: 'HIGH' as const,
      published: true,
      tags: ['圖書館', '考試'],
      authorId: adminUser.id,
    },
    {
      title: '校園網路維護通知',
      content: '今晚9點-10點將進行網路設備維護，屆時網路可能會短暫中斷',
      priority: 'MEDIUM' as const,
      published: true,
      tags: ['網路', '維護'],
      authorId: teacher1.id,
    },
    {
      title: '明日天氣提醒',
      content: '明日可能有午後雷陣雨，請同學攜帶雨具',
      priority: 'LOW' as const,
      published: true,
      tags: ['天氣', '提醒'],
      authorId: teacher2.id,
    },
  ];

  for (const liveUpdate of liveUpdatesData) {
    await prisma.liveUpdate.create({ data: liveUpdate });
  }

  console.log(`✅ 創建了 ${liveUpdatesData.length} 則即時動態`);

  // 創建特色資源
  console.log('🎯 創建特色資源...');

  const featuredResourcesData = [
    {
      title: '新戶申辦優惠',
      description: '新用戶專享優惠方案，多重好禮等您來領取',
      imageUrl: '/featured/card1.webp',
      linkUrl: '#',
      category: '優惠活動',
      bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
      order: 1,
      enabled: true,
    },
    {
      title: '購物回饋計劃',
      description: '消費回饋高達5%，讓每次購物都更划算',
      imageUrl: '/featured/card2.webp',
      linkUrl: '#',
      category: '回饋方案',
      bgColor: 'bg-gradient-to-br from-green-500 to-teal-600',
      order: 2,
      enabled: true,
    },
    {
      title: '星空任務挑戰',
      description: '完成任務獲得專屬獎勵，開啟您的星空之旅',
      imageUrl: '/featured/card3.webp',
      linkUrl: '#',
      category: '任務活動',
      bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600',
      order: 3,
      enabled: true,
    },
    {
      title: '貴賓專屬服務',
      description: '專屬客服、優先處理，享受頂級貴賓待遇',
      imageUrl: '/featured/card4.webp',
      linkUrl: '#',
      category: '貴賓服務',
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-600',
      order: 4,
      enabled: true,
    },
    {
      title: '理財規劃顧問',
      description: '專業理財顧問為您量身打造投資組合',
      imageUrl: '/featured/card5.webp',
      linkUrl: '#',
      category: '理財服務',
      bgColor: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      order: 5,
      enabled: true,
    },
    {
      title: '數位工具體驗',
      description: '最新數位金融工具，讓理財更加便利智慧',
      imageUrl: '/featured/card6.webp',
      linkUrl: '#',
      category: '數位服務',
      bgColor: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      order: 6,
      enabled: true,
    },
  ];

  for (const resource of featuredResourcesData) {
    await prisma.featuredResource.create({ data: resource });
  }

  console.log(`✅ 創建了 ${featuredResourcesData.length} 個特色資源`);

  // 創建主視覺內容
  console.log('🎨 創建主視覺內容...');

  const heroContentsData = [
    {
      locale: 'zh',
      titlePrefix: 'YZU',
      titleMain: '元智大學管理學院',
      subtitle:
        '致力於培養具有國際視野、創新思維與社會責任感的優秀人才，為學生提供最優質的教育環境與學習資源',
      gradientFrom: 'amber-600',
      gradientTo: 'white',
      glassEffect: true,
      isActive: true,
    },
    {
      locale: 'en',
      titlePrefix: 'YZU',
      titleMain: 'College of Management',
      subtitle:
        'Committed to cultivating outstanding talents with global vision, innovative thinking, and social responsibility, providing students with the highest quality educational environment and learning resources',
      gradientFrom: 'amber-600',
      gradientTo: 'white',
      glassEffect: true,
      isActive: true,
    },
  ];

  for (const heroContent of heroContentsData) {
    await prisma.heroContent.create({ data: heroContent });
  }

  console.log(`✅ 創建了 ${heroContentsData.length} 個主視覺內容`);

  // 創建年報資料
  console.log('📄 創建年報資料...');

  const annualReportsData = [
    {
      year: 2023,
      title: '2023 年度報告',
      description: '展現學院 2023 年度重要發展成果與未來規劃',
      fileUrl: '/files/annual-report-2023.pdf',
      fileName: 'CMYZU-Annual-Report-2023.pdf',
      fileSize: 5242880, // 5MB
      isActive: true,
      authorId: adminUser.id,
    },
    {
      year: 2022,
      title: '2022 年度報告',
      description: '回顧學院 2022 年度辦學成效與重要里程碑',
      fileUrl: '/files/annual-report-2022.pdf',
      fileName: 'CMYZU-Annual-Report-2022.pdf',
      fileSize: 4718592, // 4.5MB
      isActive: true,
      authorId: adminUser.id,
    },
  ];

  for (const report of annualReportsData) {
    await prisma.annualReport.create({ data: report });
  }

  console.log(`✅ 創建了 ${annualReportsData.length} 份年報`);

  console.log('🎉 種子數據初始化完成！');
  console.log(`
📊 數據摘要：
• 用戶: 3 個 (1 管理員, 2 教師)
• 新聞: ${newsData.length} 則
• 即時動態: ${liveUpdatesData.length} 則
• 特色資源: ${featuredResourcesData.length} 個
• 主視覺內容: ${heroContentsData.length} 個
• 年報: ${annualReportsData.length} 份

🔑 預設帳號：
• admin@cmyzu.edu.tw (管理員) - 密碼: 123456
• teacher1@cmyzu.edu.tw (張老師) - 密碼: 123456
• teacher2@cmyzu.edu.tw (王老師) - 密碼: 123456
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ 種子數據初始化失敗:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
