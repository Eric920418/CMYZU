'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// 表單數據類型
interface RankingForm {
  rank: string;
  category: string;
  subtitle: string;
  description: string;
  logoUrl: string;
  logoAlt: string;
  organization: string;
  year: number;
  isActive: boolean;
}

interface EditRankingPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function EditRankingPage({ params }: EditRankingPageProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations('EditRankingPage');
  const [formData, setFormData] = useState<RankingForm>({
    rank: '',
    category: '',
    subtitle: '',
    description: '',
    logoUrl: '',
    logoAlt: '',
    organization: '',
    year: new Date().getFullYear(),
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 檢查認證狀態
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=/dashboard/rankings/${params.id}/edit`);
    }
  }, [isAuthenticated, isLoading, router, params.id]);

  // 載入現有數據
  useEffect(() => {
    const fetchRanking = async () => {
      if (!params.id || !isAuthenticated) return;

      try {
        setLoadingData(true);
        const response = await fetch(`/api/rankings/${params.id}`);

        if (!response.ok) {
          throw new Error('取得排名數據失敗');
        }

        const ranking = await response.json();
        setFormData({
          rank: ranking.rank || '',
          category: ranking.category || '',
          subtitle: ranking.subtitle || '',
          description: ranking.description || '',
          logoUrl: ranking.logoUrl || '',
          logoAlt: ranking.logoAlt || '',
          organization: ranking.organization || '',
          year: ranking.year || new Date().getFullYear(),
          isActive: ranking.isActive,
        });
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知錯誤';
        setError(`載入排名數據時發生錯誤: ${errorMessage}`);
        console.error('載入排名數據錯誤:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchRanking();
  }, [params.id, isAuthenticated]);

  // 處理輸入變更
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證必填欄位
    if (
      !formData.rank.trim() ||
      !formData.category.trim() ||
      !formData.organization.trim()
    ) {
      setError('請填寫所有必填欄位');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/rankings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新排名失敗');
      }

      // 成功後跳轉回列表頁
      router.push('/dashboard/rankings');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(`更新排名項目時發生錯誤: ${errorMessage}`);
      console.error('更新排名錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loadingData) {
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
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('title', { default: '編輯排名' })}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('description', { default: '修改學校權威排名資訊' })}
            </p>
          </div>
        </motion.div>

        {/* 表單區域 */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 排名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  排名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  placeholder="例如：#1, Top 10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 年度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年度 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="2000"
                  max="2030"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* 排名類別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                排名類別 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="例如：學習環境、西日本私立大學"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* 副標題 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                副標題
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="例如：（日本私立大學）"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* 評鑑機構 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                評鑑機構 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                placeholder="例如：THE、QS、US News"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Logo 相關 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo 替代文字
                </label>
                <input
                  type="text"
                  name="logoAlt"
                  value={formData.logoAlt}
                  onChange={handleInputChange}
                  placeholder="例如：THE 世界大學排名"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 詳細描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細描述
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="例如：2025年泰晤士高等教育日本大學排名"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* 是否啟用 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">啟用此排名</label>
            </div>

            {/* 提交按鈕 */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? '更新中...' : '更新排名'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
