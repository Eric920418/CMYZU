'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// 更多的精采收錄區塊 - Instagram 和 YouTube 社群媒體輪播展示
export default function MoreHighlightsSection() {
  const t = useTranslations('MoreHighlights');
  const locale = useLocale(); // 獲取當前語言
  const [youtubeOffset, setYoutubeOffset] = useState(0);
  const [instagramOffset, setInstagramOffset] = useState(0);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 載入 YouTube 影片資料
  const fetchYouTubeVideos = async () => {
    try {
      const response = await fetch('/api/youtube');
      if (!response.ok) {
        throw new Error('載入 YouTube 影片失敗');
      }
      const videos = await response.json();
      setYoutubeVideos(videos);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      // 如果 API 失敗，使用備用模擬資料
      setYoutubeVideos([
        {
          id: 'fallback-1',
          title: '2024畢業典禮精華回顧',
          thumbnail: '/4.webp',
          duration: '5:32',
          views: 12500,
          createdAt: new Date().toISOString(),
          url: '#',
        },
        {
          id: 'fallback-2',
          title: '學生創新創業競賽成果發表',
          thumbnail: '/Image.webp',
          duration: '8:15',
          views: 8900,
          createdAt: new Date().toISOString(),
          url: '#',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYouTubeVideos();
  }, []);

  // Instagram 貼文數據（模擬數據）
  const instagramPosts = [
    {
      id: 1,
      image: '/4.webp',
      caption: '校園秋日美景 🍂 學生們在銀杏大道上的溫馨時光',
      likes: 1250,
      comments: 89,
      postDate: '2天前',
      isVideo: false,
    },
    {
      id: 2,
      image: '/Image.webp',
      caption: '社團博覽會圓滿落幕！感謝所有同學的熱情參與 🎉',
      likes: 892,
      comments: 45,
      postDate: '4天前',
      isVideo: true,
    },
    {
      id: 3,
      image: '/er.webp',
      caption: '期中考週，圖書館裡認真讀書的同學們 📚✨',
      likes: 1580,
      comments: 123,
      postDate: '1周前',
      isVideo: false,
    },
    {
      id: 4,
      image: '/hero-building.webp',
      caption: '校園運動會精彩瞬間！展現青春活力 🏃‍♂️🏃‍♀️',
      likes: 2340,
      comments: 187,
      postDate: '1周前',
      isVideo: true,
    },
    {
      id: 5,
      image: '/4.webp',
      caption: '恭喜畢業生們！願你們前程似錦 🎓💫',
      likes: 3250,
      comments: 298,
      postDate: '2周前',
      isVideo: false,
    },
    {
      id: 6,
      image: '/Image.webp',
      caption: '國際學生文化交流活動，多元文化在此相遇 🌍',
      likes: 1650,
      comments: 156,
      postDate: '3周前',
      isVideo: false,
    },
    {
      id: 7,
      image: '/er.webp',
      caption: '校園咖啡廳的溫馨午後時光 ☕️📖 最適合讀書的角落',
      likes: 980,
      comments: 67,
      postDate: '1個月前',
      isVideo: false,
    },
    {
      id: 8,
      image: '/hero-building.webp',
      caption: '學生藝術作品展覽開幕！創意無限 🎨✨',
      likes: 1420,
      comments: 94,
      postDate: '1個月前',
      isVideo: true,
    },
    {
      id: 9,
      image: '/4.webp',
      caption: '夜晚的校園別有一番風情 🌙✨ 燈光下的建築好美',
      likes: 2150,
      comments: 201,
      postDate: '2個月前',
      isVideo: false,
    },
    {
      id: 10,
      image: '/Image.webp',
      caption: '學生志工服務活動，愛心傳遞溫暖 ❤️🤝',
      likes: 1780,
      comments: 145,
      postDate: '2個月前',
      isVideo: true,
    },
    {
      id: 11,
      image: '/er.webp',
      caption: '科學博覽會展出學生創新研究成果 🔬🧪',
      likes: 1340,
      comments: 112,
      postDate: '3個月前',
      isVideo: false,
    },
    {
      id: 12,
      image: '/hero-building.webp',
      caption: '春天的校園櫻花盛開 🌸 浪漫粉色點綴整個校園',
      likes: 2890,
      comments: 267,
      postDate: '3個月前',
      isVideo: false,
    },
  ];

  // 自動輪播效果 - 使用 transform 實現流暢動畫
  useEffect(() => {
    // 只有當 YouTube 影片載入完成且不是載入狀態時才啟動輪播
    if (loading || youtubeVideos.length === 0) return;

    let isScrolling = false;

    // 檢測用戶滾動，暫停輪播避免卡頓
    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    let scrollTimer: NodeJS.Timeout;
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 避免 SSR 問題，延遲初始化
    const initCarousel = () => {
      if (typeof window === 'undefined') return;

      // 響應式卡片寬度計算
      const isMobile = window.innerWidth < 640;
      const cardWidth = (isMobile ? 288 : 320) + (isMobile ? 16 : 24); // YouTube 卡片寬度 + gap
      const instagramCardWidth = (isMobile ? 256 : 288) + (isMobile ? 16 : 24); // Instagram 卡片寬度 + gap

      // 計算單組的寬度
      const singleSetWidth = cardWidth * youtubeVideos.length;
      const singleInstagramSetWidth =
        instagramCardWidth * instagramPosts.length;

      // 設置初始位置：YouTube從第2組開始，Instagram從第4組開始
      setYoutubeOffset(-singleSetWidth);
      setInstagramOffset(-singleInstagramSetWidth * 3);

      // YouTube 輪播：右至左，真正的無縫循環
      const youtubeInterval = setInterval(() => {
        if (isScrolling) return; // 滾動時暫停輪播

        setYoutubeOffset((prev) => {
          const newOffset = prev - 1;
          // 當移動到第4組末尾時(-4*singleSetWidth)，重置到第2組開始(-singleSetWidth)
          if (newOffset <= -singleSetWidth * 4) {
            return -singleSetWidth;
          }
          return newOffset;
        });
      }, 16);

      // Instagram 輪播：左至右，真正的無縫循環
      const instagramInterval = setInterval(() => {
        if (isScrolling) return; // 滾動時暫停輪播

        setInstagramOffset((prev) => {
          const newOffset = prev + 1;
          // 當移動到第2組開始時(-singleInstagramSetWidth)，重置到第4組開始(-3*singleInstagramSetWidth)
          if (newOffset >= -singleInstagramSetWidth) {
            return -singleInstagramSetWidth * 3;
          }
          return newOffset;
        });
      }, 16);

      return () => {
        clearInterval(youtubeInterval);
        clearInterval(instagramInterval);
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimer);
      };
    };

    // 延遲初始化避免 SSR 問題
    const timer = setTimeout(initCarousel, 100);
    return () => clearTimeout(timer);
  }, [youtubeVideos.length, instagramPosts.length, loading]);

  // 格式化觀看次數
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  // 格式化上傳時間
  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (locale === 'en') {
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30)
        return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
      if (diffDays < 365)
        return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
      return `${Math.ceil(diffDays / 365)} year${Math.ceil(diffDays / 365) > 1 ? 's' : ''} ago`;
    } else {
      if (diffDays === 1) return '1天前';
      if (diffDays < 7) return `${diffDays}天前`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)}個月前`;
      return `${Math.ceil(diffDays / 365)}年前`;
    }
  };

  // YouTube 影片卡片組件
  const YouTubeCard = ({ video }: { video: any }) => {
    // 多語系標題：英文版為空或當前語言是中文時顯示中文，否則顯示英文
    const displayTitle =
      locale === 'en' && video.titleEn ? video.titleEn : video.title;

    return (
      <div
        className="group relative flex-shrink-0 w-72 sm:w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer"
        onClick={() =>
          video.url && video.url !== '#' && window.open(video.url, '_blank')
        }
      >
        {/* 縮圖區域 */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="320px"
          />

          {/* YouTube 播放按鈕 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors duration-300">
              <svg
                className="w-6 h-6 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* 影片時長 */}
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 bg-black/80 text-white text-xs rounded backdrop-blur-sm font-medium">
              {video.duration}
            </span>
          </div>
        </div>

        {/* 影片資訊 */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-yellow-200 transition-colors duration-300">
            {displayTitle}
          </h3>
          <div className="flex items-center text-primary-200 text-xs space-x-2">
            <span>
              {formatViews(video.views)} {locale === 'en' ? 'views' : '次觀看'}
            </span>
            <span>•</span>
            <span>{formatUploadDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Instagram 貼文卡片組件
  const InstagramCard = ({ post }: { post: (typeof instagramPosts)[0] }) => (
    <div className="group relative flex-shrink-0 w-64 sm:w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer">
      {/* 圖片區域 */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <Image
          src={post.image}
          alt={post.caption}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="288px"
        />

        {/* 影片標示 */}
        {post.isVideo && (
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Instagram 漸層覆蓋 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* 貼文資訊 */}
      <div className="p-4">
        <p className="text-white text-sm mb-3 line-clamp-2 group-hover:text-yellow-200 transition-colors duration-300">
          {post.caption}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-primary-200 text-xs space-x-4">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{post.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.comments}</span>
            </div>
          </div>
          <span className="text-primary-300 text-xs">{post.postDate}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative max-w-screen ">
      <div className="w-full ">
        {/* 標題區域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('title', { defaultValue: '更多的精采收錄' })}
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-primary-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('description', {
              defaultValue:
                '追蹤我們的官方社群媒體，即時掌握校園最新動態與精彩時刻。',
            })}
          </motion.p>
        </motion.div>

        <div className="space-y-6 w-full overflow-hidden">
          {/* YouTube 影片區塊 - 右至左輪播 */}
          {/* 標籤區域 - 在輪播容器外部 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex items-center mb-3 justify-start ms-0 md:ms-4 w-full">
              <div className="flex items-center space-x-3 rounded-xl px-4 py-3 border border-white/20">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                  {t('official_channel')}
                </h3>
                <span className="px-3 py-1 bg-red-600/30 text-red-100 text-sm rounded-full border border-red-600/50 font-semibold">
                  YouTube
                </span>
              </div>
            </div>
            {/* 輪播容器 - 獨立的 overflow 控制 */}
            <div
              className="relative overflow-hidden w-full"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              }}
            >
              <div
                className="flex space-x-4 sm:space-x-6 transition-transform duration-0"
                style={{
                  transform: `translateX(${youtubeOffset}px)`,
                  minWidth: 'max-content',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* 複製影片數據以創造無限輪播效果 - 使用更多重複確保無縫 */}
                {!loading &&
                  youtubeVideos.length > 0 &&
                  [
                    ...youtubeVideos,
                    ...youtubeVideos,
                    ...youtubeVideos,
                    ...youtubeVideos,
                    ...youtubeVideos,
                  ].map((video, index) => (
                    <YouTubeCard
                      key={`youtube-${video.id}-${index}`}
                      video={video}
                    />
                  ))}

                {/* 載入狀態顯示 */}
                {loading && (
                  <div className="flex items-center justify-center w-full py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="ml-2 text-white text-sm">
                      {locale === 'en'
                        ? 'Loading YouTube videos...'
                        : '載入 YouTube 影片中...'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Instagram 貼文區塊 - 左至右輪播 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* 標籤區域 - 在輪播容器外部 */}
            <div className="flex items-center mb-3 justify-start ms-0 md:ms-4 max-w-full">
              <div className="flex items-center space-x-3 rounded-xl px-4 py-3 border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                  @yzucm
                </h3>
                <a
                  href="https://www.instagram.com/yzucm/"
                  target="_blank"
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-pink-100 text-sm rounded-full border border-pink-500/50 font-semibold"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* 輪播容器 - 獨立的 overflow 控制 */}
            <div
              className="relative overflow-hidden w-full"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              }}
            >
              <div
                className="flex space-x-4 sm:space-x-6 transition-transform duration-0"
                style={{
                  transform: `translateX(${instagramOffset}px)`,
                  minWidth: 'max-content',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* 複製貼文數據以創造無限輪播效果 - 使用更多重複確保無縫 */}
                {[
                  ...instagramPosts,
                  ...instagramPosts,
                  ...instagramPosts,
                  ...instagramPosts,
                  ...instagramPosts,
                ].map((post, index) => (
                  <InstagramCard
                    key={`instagram-${post.id}-${index}`}
                    post={post}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 社群媒體連結按鈕 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16 mb-2 px-4"
        >
          <button className="group inline-flex items-center px-4 sm:px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 hover:border-red-600/70 rounded-full text-white font-medium transition-all duration-300 backdrop-blur-md hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>
              {locale === 'en' ? 'Subscribe to YouTube' : '訂閱 YouTube 頻道'}
            </span>
          </button>

          <button className="group inline-flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-pink-500/50 hover:border-pink-500/70 rounded-full text-white font-medium transition-all duration-300 backdrop-blur-md hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>
              {locale === 'en' ? 'Follow Instagram' : '追蹤 Instagram'}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
