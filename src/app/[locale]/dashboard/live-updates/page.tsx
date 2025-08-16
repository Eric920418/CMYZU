'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { LiveUpdate } from '@/types/dashboard';
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

// 重要程度顏色映射
const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
  }
};

const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
  }
};

export default function LiveUpdatesManagementPage() {
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUpdates, setSelectedUpdates] = useState<LiveUpdate[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all');

  // 載入即時動態列表
  useEffect(() => {
    const fetchLiveUpdates = async () => {
      setIsLoading(true);
      try {
        const response = await dashboardAPI.liveUpdates.list({
          sortBy,
          sortOrder,
          search: searchTerm,
          page: 1,
          pageSize: 100,
        });

        if (response.success && response.data) {
          console.log('後台 API 原始數據:', response.data.slice(0, 1)); // 只顯示第一筆方便調試
          const updatesWithDates = response.data.map((item) => ({
            ...item,
            date: new Date(item.date),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            // 修復欄位名稱不一致問題：將 published 映射到 isPublished
            isPublished: item.published,
          }));
          console.log('處理後的數據:', updatesWithDates.slice(0, 1)); // 只顯示第一筆方便調試
          setLiveUpdates(updatesWithDates);
        } else {
          throw new Error(response.error || '獲取即時動態失敗');
        }
      } catch (error) {
        console.error('Failed to fetch live updates:', error);
        alert(
          `載入即時動態失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveUpdates();
  }, [sortBy, sortOrder, searchTerm]);

  // 過濾和排序即時動態
  const filteredUpdates = liveUpdates
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        filterPriority === 'all' || item.priority === filterPriority;

      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof LiveUpdate];
      const bValue = b[sortBy as keyof LiveUpdate];

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

      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityA = priorityOrder[aValue as keyof typeof priorityOrder];
        const priorityB = priorityOrder[bValue as keyof typeof priorityOrder];
        return sortOrder === 'asc'
          ? priorityA - priorityB
          : priorityB - priorityA;
      }

      return 0;
    });

  // 處理選擇
  const handleSelectUpdate = (updateId: string) => {
    setSelectedUpdates((prev) =>
      prev.find((item) => item.id === updateId)
        ? prev.filter((item) => item.id !== updateId)
        : [...prev, liveUpdates.find((item) => item.id === updateId)!]
    );
  };

  // 選擇全部/取消全部
  const handleSelectAll = () => {
    if (selectedUpdates.length === filteredUpdates.length) {
      setSelectedUpdates([]);
    } else {
      setSelectedUpdates(filteredUpdates);
    }
  };

  // 批量刪除
  const handleBulkDelete = async () => {
    if (selectedUpdates.length === 0) return;

    try {
      for (const updateItem of selectedUpdates) {
        const response = await dashboardAPI.liveUpdates.delete(updateItem.id);
        if (!response.success) {
          throw new Error(
            `刪除即時動態 "${updateItem.title}" 失敗: ${response.error}`
          );
        }
      }

      setLiveUpdates((prev) =>
        prev.filter(
          (item) => !selectedUpdates.find((selected) => selected.id === item.id)
        )
      );
      setSelectedUpdates([]);
      setShowDeleteModal(false);
      alert('批量刪除成功');
    } catch (error) {
      console.error('Failed to delete live updates:', error);
      alert(
        `批量刪除失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
      );
    }
  };

  // 快速狀態切換
  const togglePublishStatus = async (updateId: string) => {
    try {
      const updateItem = liveUpdates.find((item) => item.id === updateId);
      if (!updateItem) return;

      console.log('切換前狀態:', {
        updateId,
        currentStatus: updateItem.isPublished,
      });

      // 使用 PATCH API 進行狀態切換
      const response = await dashboardAPI.liveUpdates.patch(updateId, {});

      console.log('API 回應:', response);

      if (response.success && response.data) {
        // 更新本地狀態，將後端的 published 映射到前端的 isPublished
        setLiveUpdates((prev) =>
          prev.map((item) =>
            item.id === updateId
              ? {
                  ...item,
                  isPublished: response.data!.published,
                  // 同時更新其他可能變更的欄位
                  updatedAt: new Date(response.data!.updatedAt),
                }
              : item
          )
        );
        console.log('狀態更新完成:', { newStatus: response.data.published });
        alert(`即時動態已${response.data.published ? '發布' : '取消發布'}`);
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
            <h1 className="text-2xl font-bold text-gray-900">即時動態管理</h1>
            <p className="mt-2 text-sm text-gray-600">
              管理網站上的即時動態資訊（支援中英雙語版本）
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/dashboard/live-updates/create"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
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
              新增即時動態
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
                  placeholder="搜尋即時動態標題或內容..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {/* 重要程度篩選器 */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">所有重要程度</option>
                <option value="high">高重要</option>
                <option value="medium">中重要</option>
                <option value="low">低重要</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date">依日期排序</option>
                <option value="title">依標題排序</option>
                <option value="priority">依重要程度排序</option>
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
          {selectedUpdates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  已選擇 {selectedUpdates.length} 個即時動態
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    批量刪除
                  </button>
                  <button
                    onClick={() => setSelectedUpdates([])}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    取消選擇
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 即時動態列表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">載入中...</p>
            </div>
          ) : filteredUpdates.length === 0 ? (
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p className="text-gray-500">沒有找到相關即時動態</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* 表頭 */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedUpdates.length === filteredUpdates.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      全選
                    </span>
                  </label>
                </div>
              </div>

              {/* 即時動態項目 */}
              {filteredUpdates.map((item, index) => (
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
                          !!selectedUpdates.find(
                            (selected) => selected.id === item.id
                          )
                        }
                        onChange={() => handleSelectUpdate(item.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </label>

                    {/* 重要程度圖標 */}
                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-purple-100 rounded-lg">
                      <svg
                        className="w-8 h-8 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>

                    {/* 內容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        {/* 重要程度標籤 */}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}
                        >
                          {getPriorityText(item.priority)}重要
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.isPublished ? '已發布' : '草稿'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.content}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>{formatDate(item.date)}</span>
                        <span>最後更新：{formatDate(item.updatedAt)}</span>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>標籤：</span>
                            {item.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="text-gray-400">
                                +{item.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => togglePublishStatus(item.id)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          item.isPublished
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {item.isPublished ? '取消發布' : '發布'}
                      </button>
                      <Link
                        href={`/dashboard/live-updates/${item.id}/edit`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        編輯
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedUpdates([item]);
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
                    確定要刪除選中的 {selectedUpdates.length}{' '}
                    個即時動態嗎？此操作無法復原。
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
