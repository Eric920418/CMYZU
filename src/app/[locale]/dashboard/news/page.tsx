'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { News } from '@/types/dashboard';
import { dashboardAPI } from '@/lib/dashboard-api';

// 安全的日期格式化函數
const formatDate = (dateInput: string | Date): string => {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return isNaN(date.getTime())
      ? '無效日期'
      : date.toLocaleDateString('zh-TW');
  } catch {
    return '無效日期';
  }
};

export default function NewsManagementPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedNews, setSelectedNews] = useState<News[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 載入新聞列表
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // 使用真實的 API 調用
        const response = await dashboardAPI.news.list({
          sortBy,
          sortOrder,
          search: searchTerm,
          page: 1,
          pageSize: 100, // 獲取所有新聞
        });

        if (response.success && response.data) {
          // 轉換日期字串為Date物件，並處理舊資料相容性
          const newsWithDates = response.data.map((item) => ({
            ...item,
            date: new Date(item.date),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            // 為沒有 type 欄位的舊資料設定預設值為新聞稿
            type: (item as any).type || ('press-release' as const),
          }));
          setNews(newsWithDates);
        } else {
          throw new Error(response.error || '獲取新聞失敗');
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
        // 顯示錯誤給使用者
        alert(
          `載入新聞失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [sortBy, sortOrder, searchTerm]);

  // 過濾和排序新聞
  const filteredNews = news
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (
        (aValue instanceof Date && bValue instanceof Date) ||
        sortBy === 'date' ||
        sortBy === 'createdAt' ||
        sortBy === 'updatedAt'
      ) {
        const dateA =
          aValue instanceof Date ? aValue : new Date(aValue as string);
        const dateB =
          bValue instanceof Date ? bValue : new Date(bValue as string);
        return sortOrder === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  // 處理選擇
  const handleSelectNews = (newsId: string) => {
    setSelectedNews((prev) =>
      prev.find((item) => item.id === newsId)
        ? prev.filter((item) => item.id !== newsId)
        : [...prev, news.find((item) => item.id === newsId)!]
    );
  };

  // 選擇全部/取消全部
  const handleSelectAll = () => {
    if (selectedNews.length === filteredNews.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(filteredNews);
    }
  };

  // 批量刪除
  const handleBulkDelete = async () => {
    if (selectedNews.length === 0) return;

    try {
      // 逐個刪除新聞（因為目前沒有批量刪除API）
      for (const newsItem of selectedNews) {
        const response = await dashboardAPI.news.delete(newsItem.id);
        if (!response.success) {
          throw new Error(
            `刪除新聞 "${newsItem.title}" 失敗: ${response.error}`
          );
        }
      }

      // 更新本地狀態
      setNews((prev) =>
        prev.filter(
          (item) => !selectedNews.find((selected) => selected.id === item.id)
        )
      );
      setSelectedNews([]);
      setShowDeleteModal(false);
      alert('批量刪除成功');
    } catch (error) {
      console.error('Failed to delete news:', error);
      alert(
        `批量刪除失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
      );
    }
  };

  // 快速狀態切換
  const togglePublishStatus = async (newsId: string) => {
    try {
      const newsItem = news.find((item) => item.id === newsId);
      if (!newsItem) return;

      // 使用 PATCH API 切換發布狀態
      const response = await dashboardAPI.news.patch(newsId, {});

      if (response.success && response.data) {
        // 更新本地狀態
        setNews((prev) =>
          prev.map((item) => (item.id === newsId ? response.data! : item))
        );
        alert(`新聞已${!newsItem.published ? '發布' : '取消發布'}`);
      } else {
        throw new Error(response.error || '更新失敗');
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      alert(
        `狀態切換失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 頁面標題和動作按鈕 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新聞管理</h1>
            <p className="mt-2 text-sm text-gray-600">
              管理網站上的所有新聞文章
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/dashboard/news/create"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              新增新聞
            </Link>
          </div>
        </div>

        {/* 搜尋和篩選欄 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜尋新聞標題或內容..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">依日期排序</option>
                <option value="title">依標題排序</option>
                <option value="views">依瀏覽數排序</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={sortOrder === 'asc' ? '升序' : '降序'}
              >
                <svg
                  className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 批量操作 */}
          {selectedNews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  已選擇 {selectedNews.length} 篇新聞
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    批量刪除
                  </button>
                  <button
                    onClick={() => setSelectedNews([])}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    取消選擇
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 新聞列表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">載入中...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="text-gray-500">沒有找到相關新聞</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* 表頭 */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedNews.length === filteredNews.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      全選
                    </span>
                  </label>
                </div>
              </div>

              {/* 新聞項目 */}
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    {/* 選擇框 */}
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          !!selectedNews.find(
                            (selected) => selected.id === item.id
                          )
                        }
                        onChange={() => handleSelectNews(item.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>

                    {/* 新聞圖片 */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {item.imageUrl &&
                      item.imageUrl.trim() !== '' &&
                      !item.imageUrl.startsWith('data:') ? (
                        <Image
                          key={`${item.id}-${new Date(item.updatedAt).getTime()}`}
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover rounded-lg"
                          sizes="80px"
                          onError={(e) => {
                            console.error('圖片載入失敗:', item.imageUrl);
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* 新聞內容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.published ? '已發布' : '草稿'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>{formatDate(item.date)}</span>
                        <span>{(item.views || 0).toLocaleString()} 次瀏覽</span>
                        <span>最後更新：{formatDate(item.updatedAt)}</span>
                      </div>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => togglePublishStatus(item.id)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          item.published
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {item.published ? '取消發布' : '發布'}
                      </button>
                      <Link
                        href={`/dashboard/news/${item.id}/edit`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        編輯
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedNews([item]);
                          setShowDeleteModal(true);
                        }}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 刪除確認模態框 */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    確認刪除
                  </h3>
                  <p className="text-sm text-gray-600">
                    確定要刪除選中的 {selectedNews.length}{' '}
                    篇新聞嗎？此操作無法復原。
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  確認刪除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
