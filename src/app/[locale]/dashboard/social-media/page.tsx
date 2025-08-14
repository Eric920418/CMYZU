'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  publishedAt: string;
  duration: string;
  url: string;
}

const SocialMediaPage = () => {
  // YouTube 模擬資料
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([
    {
      id: '1',
      title: 'CMYZU 2024 畢業典禮精華回顧',
      thumbnail: '/api/placeholder/320/180',
      views: 12543,
      publishedAt: '2025-08-08',
      duration: '15:32',
      url: 'https://youtube.com/watch?v=example1',
    },
    {
      id: '2',
      title: '商管學院國際論壇 - 數位轉型趨勢',
      thumbnail: '/api/placeholder/320/180',
      views: 8976,
      publishedAt: '2025-08-05',
      duration: '45:18',
      url: 'https://youtube.com/watch?v=example2',
    },
  ]);

  // 新增 YouTube 影片
  const [newYouTubeVideo, setNewYouTubeVideo] = useState({
    title: '',
    thumbnail: '',
    views: 0,
    duration: '',
    url: '',
  });

  const handleAddYouTubeVideo = () => {
    if (!newYouTubeVideo.title || !newYouTubeVideo.thumbnail) {
      alert('請填寫完整資訊');
      return;
    }

    const newVideo: YouTubeVideo = {
      id: Date.now().toString(),
      title: newYouTubeVideo.title,
      thumbnail: newYouTubeVideo.thumbnail,
      views: newYouTubeVideo.views || Math.floor(Math.random() * 50000),
      publishedAt: new Date().toISOString().split('T')[0],
      duration: newYouTubeVideo.duration || '10:00',
      url: newYouTubeVideo.url || '#',
    };

    setYoutubeVideos([newVideo, ...youtubeVideos]);
    setNewYouTubeVideo({
      title: '',
      thumbnail: '',
      views: 0,
      duration: '',
      url: '',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-pink-100 rounded-lg">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">社群媒體管理</h1>
              <p className="text-gray-600">管理 Instagram 和 YouTube 內容</p>
            </div>
          </div>

          {/* YouTube 區塊 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              YouTube 影片管理
            </h2>

            {/* 新增影片表單 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-3">
                新增 YouTube 影片
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="影片標題"
                  value={newYouTubeVideo.title}
                  onChange={(e) =>
                    setNewYouTubeVideo({
                      ...newYouTubeVideo,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="url"
                  placeholder="縮圖網址"
                  value={newYouTubeVideo.thumbnail}
                  onChange={(e) =>
                    setNewYouTubeVideo({
                      ...newYouTubeVideo,
                      thumbnail: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="觀看次數"
                    value={newYouTubeVideo.views || ''}
                    onChange={(e) =>
                      setNewYouTubeVideo({
                        ...newYouTubeVideo,
                        views: parseInt(e.target.value) || 0,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="影片長度 (10:30)"
                    value={newYouTubeVideo.duration}
                    onChange={(e) =>
                      setNewYouTubeVideo({
                        ...newYouTubeVideo,
                        duration: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="url"
                    placeholder="YouTube 連結"
                    value={newYouTubeVideo.url}
                    onChange={(e) =>
                      setNewYouTubeVideo({
                        ...newYouTubeVideo,
                        url: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  onClick={handleAddYouTubeVideo}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  新增影片
                </button>
              </div>
            </div>

            {/* YouTube 影片列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {youtubeVideos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <div className="aspect-video relative">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-25">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{formatNumber(video.views)} 次觀看</span>
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaPage;
