'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { dashboardAPI } from '@/lib/dashboard-api';
import { Alumni } from '@/types/dashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function AlumniDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 獲取校友列表
  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.alumni.list({ search: searchQuery });
      if (response.success && response.data) {
        setAlumni(response.data);
      } else {
        setError(response.error || '獲取校友資料失敗');
      }
    } catch (error) {
      console.error('獲取校友資料錯誤:', error);
      setError('獲取校友資料失敗');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // 初始化載入
  useEffect(() => {
    if (!authLoading && user) {
      fetchAlumni();
    }
  }, [searchQuery, authLoading, user, fetchAlumni]);

  // 切換校友狀態
  const toggleStatus = async (id: string) => {
    try {
      const response = await dashboardAPI.alumni.patch(id, {});
      if (response.success) {
        fetchAlumni(); // 重新載入列表
      } else {
        setError(response.error || '切換狀態失敗');
      }
    } catch (error) {
      console.error('切換狀態錯誤:', error);
      setError('切換狀態失敗');
    }
  };

  // 批量刪除校友
  const handleBatchDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      const response = await dashboardAPI.alumni.bulkAction({
        action: 'delete',
        ids: selectedItems,
      });

      if (response.success) {
        setSelectedItems([]);
        setShowDeleteConfirm(false);
        fetchAlumni(); // 重新載入列表
      } else {
        setError(response.error || '批量刪除失敗');
      }
    } catch (error) {
      console.error('批量刪除錯誤:', error);
      setError('批量刪除失敗');
    }
  };

  // 選擇項目
  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 全選/取消全選
  const handleSelectAll = () => {
    if (selectedItems.length === alumni.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(alumni.map((item) => item.id));
    }
  };

  // 認證檢查
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">載入中...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">請先登入</h2>
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700"
          >
            前往登入頁面
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* 頁面標頭 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">傑出校友管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理校友資料和成就展示</p>
          </div>
          <Link
            href="/dashboard/alumni/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
            新增校友
          </Link>
        </div>

        {/* 搜尋和操作列 */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
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
                placeholder="搜尋校友姓名或職位..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                已選擇 {selectedItems.length} 項
              </span>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-md transition-colors"
              >
                批量刪除
              </button>
            </div>
          )}
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 校友列表 */}
        {loading ? (
          <div className="bg-white rounded-lg shadow">
            <div className="animate-pulse p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : alumni.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              尚無校友資料
            </h3>
            <p className="mt-2 text-gray-500">開始新增第一位傑出校友</p>
            <div className="mt-6">
              <Link
                href="/dashboard/alumni/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                新增校友
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.length === alumni.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  全選
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {alumni.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />

                    {item.imageUrl && item.imageUrl.trim() !== '' && (
                      <div className="flex-shrink-0 relative w-16 h-16">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="rounded-lg object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.isActive ? '已啟用' : '已停用'}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {item.position}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {item.description}
                      </p>

                      {item.achievements && item.achievements.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            主要成就: {item.achievements.slice(0, 2).join(', ')}
                            {item.achievements.length > 2 && '...'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          item.isActive
                            ? 'text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400'
                            : 'text-green-600 hover:text-green-700 border border-green-300 hover:border-green-400'
                        }`}
                      >
                        {item.isActive ? '停用' : '啟用'}
                      </button>

                      <Link
                        href={`/dashboard/alumni/${item.id}/edit`}
                        className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-300 hover:border-primary-400 rounded-md transition-colors"
                      >
                        編輯
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 批量刪除確認對話框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
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
                <h3 className="text-lg font-medium text-gray-900 mt-2">
                  確認刪除
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    確定要刪除選中的 {selectedItems.length}{' '}
                    位校友嗎？此操作無法復原。
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleBatchDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      確定刪除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
