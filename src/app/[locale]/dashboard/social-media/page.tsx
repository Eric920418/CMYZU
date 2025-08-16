'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface YouTubeVideo {
  id: string;
  title: string;
  titleEn?: string; // 英文版標題
  videoId?: string;
  thumbnail: string;
  views: number;
  duration: string;
  url: string;
  description?: string;
  descriptionEn?: string; // 英文版描述
  published: boolean;
  order: number;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

const SocialMediaPage = () => {
  // YouTube 影片資料與載入狀態
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 新增 YouTube 影片表單資料
  const [newYouTubeVideo, setNewYouTubeVideo] = useState({
    title: '',
    titleEn: '', // 英文版標題
    videoId: '',
    thumbnail: '',
    views: 0,
    duration: '',
    url: '',
    description: '',
    descriptionEn: '', // 英文版描述
    published: true,
    order: 0,
  });

  // 載入 YouTube 影片資料
  const fetchYouTubeVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/youtube');
      if (!response.ok) {
        throw new Error('載入影片失敗');
      }
      const videos = await response.json();
      setYoutubeVideos(videos);
      setError('');
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError('載入 YouTube 影片失敗');
    } finally {
      setLoading(false);
    }
  };

  // 載入當前用戶資訊
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/current-user');
      if (!response.ok) {
        throw new Error('載入用戶資訊失敗');
      }
      const user = await response.json();
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching current user:', err);
      // 如果取得用戶失敗，使用預設管理員 ID
      setCurrentUser({ id: 'cme475m500000lwvbwwlb3gqa' });
    }
  };

  // 頁面載入時取得資料
  useEffect(() => {
    fetchCurrentUser();
    fetchYouTubeVideos();
  }, []);

  // 新增 YouTube 影片
  const handleAddYouTubeVideo = async () => {
    if (
      !newYouTubeVideo.title ||
      !newYouTubeVideo.thumbnail ||
      !newYouTubeVideo.url
    ) {
      alert('請填寫標題、縮圖和 YouTube 連結');
      return;
    }

    if (!currentUser?.id) {
      alert('無法取得用戶資訊，請重新載入頁面');
      return;
    }

    try {
      const response = await fetch('/api/dashboard/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newYouTubeVideo,
          authorId: currentUser.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '新增影片失敗');
      }

      // 成功新增後重新載入列表
      await fetchYouTubeVideos();

      // 重置表單
      setNewYouTubeVideo({
        title: '',
        titleEn: '',
        videoId: '',
        thumbnail: '',
        views: 0,
        duration: '',
        url: '',
        description: '',
        descriptionEn: '',
        published: true,
        order: 0,
      });

      alert('影片新增成功！');
    } catch (err) {
      console.error('Error adding YouTube video:', err);
      alert(err instanceof Error ? err.message : '新增影片失敗');
    }
  };

  // 刪除 YouTube 影片
  const handleDeleteVideo = async (id: string) => {
    if (!confirm('確定要刪除這個影片嗎？')) {
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/youtube/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '刪除影片失敗');
      }

      // 成功刪除後重新載入列表
      await fetchYouTubeVideos();
      alert('影片刪除成功！');
    } catch (err) {
      console.error('Error deleting YouTube video:', err);
      alert(err instanceof Error ? err.message : '刪除影片失敗');
    }
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
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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

            {/* 錯誤訊息顯示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* 新增影片表單 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-3">
                新增 YouTube 影片
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="影片標題 *"
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
                  type="text"
                  placeholder="英文版標題"
                  value={newYouTubeVideo.titleEn}
                  onChange={(e) =>
                    setNewYouTubeVideo({
                      ...newYouTubeVideo,
                      titleEn: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="url"
                  placeholder="縮圖網址 *"
                  value={newYouTubeVideo.thumbnail}
                  onChange={(e) =>
                    setNewYouTubeVideo({
                      ...newYouTubeVideo,
                      thumbnail: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="url"
                  placeholder="YouTube 連結 *"
                  value={newYouTubeVideo.url}
                  onChange={(e) =>
                    setNewYouTubeVideo({
                      ...newYouTubeVideo,
                      url: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <textarea
                  placeholder="影片描述"
                  value={newYouTubeVideo.description}
                  onChange={(e) =>
                    setNewYouTubeVideo({
                      ...newYouTubeVideo,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <textarea
                  placeholder="英文版描述"
                  value={newYouTubeVideo.descriptionEn}
                  onChange={(e) =>
                    setNewYouTubeVideo({
                      ...newYouTubeVideo,
                      descriptionEn: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="grid grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="YouTube ID"
                    value={newYouTubeVideo.videoId}
                    onChange={(e) =>
                      setNewYouTubeVideo({
                        ...newYouTubeVideo,
                        videoId: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
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
                    type="number"
                    placeholder="排序權重"
                    value={newYouTubeVideo.order || ''}
                    onChange={(e) =>
                      setNewYouTubeVideo({
                        ...newYouTubeVideo,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newYouTubeVideo.published}
                      onChange={(e) =>
                        setNewYouTubeVideo({
                          ...newYouTubeVideo,
                          published: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    發布到前台
                  </label>
                </div>
                <button
                  onClick={handleAddYouTubeVideo}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  新增影片
                </button>
              </div>
            </div>

            {/* 載入狀態 */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-2 text-gray-600">載入中...</span>
              </div>
            ) : (
              <>
                {/* YouTube 影片列表 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {youtubeVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                        {!video.published && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            未發布
                          </div>
                        )}
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-25 cursor-pointer"
                          onClick={() => window.open(video.url, '_blank')}
                        >
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
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                          <span>{formatNumber(video.views)} 次觀看</span>
                          <span>{formatDate(video.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">
                            作者: {video.author.name}
                          </span>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 無資料狀態 */}
                {youtubeVideos.length === 0 && (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500">
                      尚無 YouTube 影片，請新增第一個影片
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaPage;
