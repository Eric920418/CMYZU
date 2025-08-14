'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

// 排名數據類型
interface Ranking {
  id: string;
  rank: string;
  category: string;
  subtitle?: string;
  description?: string;
  logoUrl?: string;
  logoAlt?: string;
  organization: string;
  year: number;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function RankingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations('RankingsPage');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 檢查認證狀態
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard/rankings');
    }
  }, [isAuthenticated, isLoading, router]);

  // 載入排名數據
  const fetchRankings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rankings');

      if (!response.ok) {
        throw new Error('取得排名數據失敗');
      }

      const data = await response.json();
      setRankings(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(`載入排名數據時發生錯誤: ${errorMessage}`);
      console.error('載入排名數據錯誤:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRankings();
    }
  }, [isAuthenticated, fetchRankings]);

  // 刪除排名
  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個排名項目嗎？')) return;

    try {
      const response = await fetch(`/api/rankings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '刪除失敗');
      }

      await fetchRankings(); // 重新載入數據
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(`刪除排名項目時發生錯誤: ${errorMessage}`);
      console.error('刪除錯誤:', err);
    }
  };

  // 切換啟用狀態
  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/rankings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '切換狀態失敗');
      }

      await fetchRankings(); // 重新載入數據
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(`切換排名狀態時發生錯誤: ${errorMessage}`);
      console.error('切換狀態錯誤:', err);
    }
  };

  // 調整順序
  const updateOrder = async (id: string, direction: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/rankings/${id}/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '調整順序失敗');
      }

      await fetchRankings(); // 重新載入數據
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(`調整排名順序時發生錯誤: ${errorMessage}`);
      console.error('調整順序錯誤:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 標題區域 */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('title', { default: '排名管理' })}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('description', { default: '管理學校各項權威排名資訊' })}
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/rankings/create')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            {t('add-new', { default: '新增排名' })}
          </button>
        </motion.div>

        {/* 錯誤訊息 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* 排名列表 */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">載入中...</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>{t('no-rankings', { default: '尚未建立任何排名項目' })}</p>
              <button
                onClick={() => router.push('/dashboard/rankings/create')}
                className="mt-4 text-primary-600 hover:text-primary-700"
              >
                {t('create-first', { default: '建立第一個排名項目' })}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      排名
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      類別
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      評鑑機構
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      年度
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      狀態
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      順序
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rankings.map((ranking, index) => (
                    <tr key={ranking.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="text-2xl font-bold text-primary-600">
                          {ranking.rank}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {ranking.category}
                        </div>
                        {ranking.subtitle && (
                          <div className="text-sm text-gray-500">
                            {ranking.subtitle}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">
                          {ranking.organization}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{ranking.year}</div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() =>
                            toggleActive(ranking.id, ranking.isActive)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ranking.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {ranking.isActive ? '啟用' : '停用'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateOrder(ranking.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ArrowUpIcon className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-600 min-w-[2rem] text-center">
                            {ranking.order}
                          </span>
                          <button
                            onClick={() => updateOrder(ranking.id, 'down')}
                            disabled={index === rankings.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ArrowDownIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/rankings/${ranking.id}/edit`
                              )
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ranking.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
