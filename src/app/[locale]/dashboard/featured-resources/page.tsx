'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/lib/dashboard-api';
import { FeaturedResource } from '@/types/dashboard';

// 特色資源管理頁面
export default function FeaturedResourcesManagementPage() {
  const t = useTranslations('FeaturedResourcesManagement');
  const tCommon = useTranslations('Common');
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [resources, setResources] = useState<FeaturedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingResource, setEditingResource] =
    useState<FeaturedResource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 身份驗證檢查
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard/featured-resources');
    }
  }, [isAuthenticated, authLoading, router]);

  // 載入特色資源列表
  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.featuredResources.list();
      if (response.success && response.data) {
        setResources(response.data);
      } else {
        setError(response.error || tCommon('error'));
      }
    } catch (err) {
      console.error('載入特色資源錯誤:', err);
      setError(tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadResources();
    }
  }, [isAuthenticated]);

  // 刪除特色資源
  const handleDelete = async (id: string) => {
    if (!confirm(t('delete_confirm'))) return;

    try {
      const response = await dashboardAPI.featuredResources.delete(id);
      if (response.success) {
        await loadResources();
      } else {
        setError(response.error || tCommon('error'));
      }
    } catch (err) {
      console.error('刪除錯誤:', err);
      setError(tCommon('error'));
    }
  };

  // 過濾資源
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 身份驗證載入中
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // 未登錄
  if (!isAuthenticated || !user) {
    return null; // 重定向中
  }

  // 資料載入中
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          {/* 頁面標題和操作 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600">{t('description')}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
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
              <span>{t('add_new')}</span>
            </button>
          </div>

          {/* 搜尋欄 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
            </div>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

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

          {/* 資源網格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* 資源圖片 */}
                <div className="relative h-48">
                  <Image
                    src={resource.image}
                    alt={resource.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className={`absolute inset-0 opacity-80`} />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {resource.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingResource(resource);
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors duration-200"
                      title={t('edit')}
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(resource.id);
                      }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-full text-white transition-colors duration-200"
                      title={t('delete')}
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* 資源內容 */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {t('order_label')}: {resource.order}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        resource.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {resource.isActive ? t('active') : t('inactive')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 空狀態 */}
          {filteredResources.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {t('no_resources_found')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? t('adjust_search') : t('create_first')}
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>

      {/* 創建/編輯模態框 - 移到 DashboardLayout 外面 */}
      <ResourceModal
        isOpen={showCreateModal || !!editingResource}
        onClose={() => {
          setShowCreateModal(false);
          setEditingResource(null);
        }}
        resource={editingResource}
        onSuccess={() => {
          loadResources();
          setShowCreateModal(false);
          setEditingResource(null);
        }}
      />
    </>
  );
}

// 資源表單模態框組件
interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource?: FeaturedResource | null;
  onSuccess: () => void;
}

function ResourceModal({
  isOpen,
  onClose,
  resource,
  onSuccess,
}: ResourceModalProps) {
  const t = useTranslations('FeaturedResourcesManagement');
  const tCommon = useTranslations('Common');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    titleEn: '',
    descriptionEn: '',
    categoryEn: '',
    image: '',
    backgroundColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
    textColor: 'text-white',
    isActive: true,
    order: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化表單數據
  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        category: resource.category,
        titleEn: resource.titleEn || '',
        descriptionEn: resource.descriptionEn || '',
        categoryEn: resource.categoryEn || '',
        image: resource.image,
        backgroundColor: resource.backgroundColor,
        textColor: resource.textColor,
        isActive: resource.isActive,
        order: resource.order,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        titleEn: '',
        descriptionEn: '',
        categoryEn: '',
        image: '',
        backgroundColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
        textColor: 'text-white',
        isActive: true,
        order: 1,
      });
    }
    setError(null);
  }, [resource, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = resource
        ? await dashboardAPI.featuredResources.update(resource.id, formData)
        : await dashboardAPI.featuredResources.create(formData);

      if (response.success) {
        onSuccess();
      } else {
        setError(response.error || tCommon('error'));
      }
    } catch (err) {
      console.error('提交錯誤:', err);
      setError(tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-10"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {resource ? t('edit_resource') : t('add_resource')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
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
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 中文內容區塊 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                {t('chinese_content')}
              </h4>

              {/* 中文標題 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('title_field')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* 中文描述 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('description_field')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* 中文分類 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('category_field')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* 英文內容區塊 */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="text-md font-semibold text-gray-900 mb-2">
                {t('english_content')}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {t('bilingual_note')}
              </p>

              {/* 英文標題 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('english_title')}
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Optional English title"
                />
              </div>

              {/* 英文描述 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('english_description')}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionEn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Optional English description"
                />
              </div>

              {/* 英文分類 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('english_category')}
                </label>
                <input
                  type="text"
                  value={formData.categoryEn}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryEn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Optional English category"
                />
              </div>
            </div>

            {/* 圖片URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('image_url_field')}
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* 順序和狀態 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('order_field')}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('status_field')}
                </label>
                <select
                  value={formData.isActive.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === 'true',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="true">{t('active')}</option>
                  <option value="false">{t('inactive')}</option>
                </select>
              </div>
            </div>

            {/* 按鈕組 */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {loading
                  ? t('processing')
                  : resource
                    ? t('update')
                    : t('create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
