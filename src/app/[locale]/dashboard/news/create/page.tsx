'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/dashboard/ImageUpload';
import { dashboardAPI } from '@/lib/dashboard-api';

export default function CreateNewsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    titleEn: '',
    excerptEn: '',
    contentEn: '',
    image: '',
    isPublished: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 處理輸入變更
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除相關錯誤
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // 處理圖片上傳完成
  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
    // 清除圖片相關錯誤
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  // 驗證表單
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '請輸入新聞標題';
    } else if (formData.title.length > 100) {
      newErrors.title = '標題不能超過 100 個字元';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = '請輸入新聞摘要';
    } else if (formData.excerpt.length > 200) {
      newErrors.excerpt = '摘要不能超過 200 個字元';
    }

    if (!formData.content.trim()) {
      newErrors.content = '請輸入中文新聞內容';
    }

    // 英文欄位驗證（可選）
    if (formData.titleEn && formData.titleEn.length > 100) {
      newErrors.titleEn = '英文標題不能超過 100 個字元';
    }

    if (formData.excerptEn && formData.excerptEn.length > 200) {
      newErrors.excerptEn = '英文摘要不能超過 200 個字元';
    }

    if (!formData.image) {
      newErrors.image = '請上傳新聞圖片';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 使用真實的 API 創建新聞
      const newsData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        titleEn: formData.titleEn || undefined,
        excerptEn: formData.excerptEn || undefined,
        contentEn: formData.contentEn || undefined,
        imageUrl: formData.image, // 注意：API 期望 imageUrl，但表單使用 image
        published: formData.isPublished,
        publishedAt: new Date(), // 修正：使用 publishedAt 而不是 date
        order: 0,
        views: 0,
      };
      const response = await dashboardAPI.news.create(newsData);

      if (response.success && response.data) {
        alert('新聞創建成功！');
        router.push('/dashboard/news');
      } else {
        throw new Error(response.error || '創建新聞失敗');
      }
    } catch (error) {
      console.error('Failed to create news:', error);
      alert(
        `新聞創建失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 儲存草稿
  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      setErrors({ title: '至少需要輸入標題才能儲存草稿' });
      return;
    }

    setIsLoading(true);

    try {
      // 使用真實的 API 創建草稿（isPublished = false）
      const response = await dashboardAPI.news.create({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        titleEn: formData.titleEn || undefined,
        excerptEn: formData.excerptEn || undefined,
        contentEn: formData.contentEn || undefined,
        imageUrl: formData.image || '',
        publishedAt: new Date(), // 修正：使用 publishedAt 而不是 date
        order: 0,
        views: 0,
        published: false, // 強制設為草稿
      });

      if (response.success && response.data) {
        alert('草稿已儲存！');
        router.push('/dashboard/news');
      } else {
        throw new Error(response.error || '草稿儲存失敗');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert(
        `草稿儲存失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* 頁面標題 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">新增新聞</h1>
              <p className="text-sm text-gray-600">創建新的新聞文章</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 中文資訊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              中文資訊 *
            </h2>

            <div className="space-y-4">
              {/* 中文標題 */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  中文標題 *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="輸入中文新聞標題..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/100 字元
                </p>
              </div>

              {/* 中文摘要 */}
              <div>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  中文摘要 *
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="輸入中文新聞摘要..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.excerpt ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.excerpt.length}/200 字元
                </p>
              </div>
            </div>
          </motion.div>

          {/* 英文資訊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              English Content (Optional)
            </h2>

            <div className="space-y-4">
              {/* 英文標題 */}
              <div>
                <label
                  htmlFor="titleEn"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  English Title
                </label>
                <input
                  type="text"
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => handleInputChange('titleEn', e.target.value)}
                  placeholder="Enter English news title..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.titleEn ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.titleEn && (
                  <p className="mt-1 text-sm text-red-600">{errors.titleEn}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.titleEn.length}/100 characters
                </p>
              </div>

              {/* 英文摘要 */}
              <div>
                <label
                  htmlFor="excerptEn"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  English Excerpt
                </label>
                <textarea
                  id="excerptEn"
                  rows={3}
                  value={formData.excerptEn}
                  onChange={(e) =>
                    handleInputChange('excerptEn', e.target.value)
                  }
                  placeholder="Enter English news excerpt..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.excerptEn ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.excerptEn && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.excerptEn}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.excerptEn.length}/200 characters
                </p>
              </div>
            </div>
          </motion.div>

          {/* 新聞圖片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              新聞圖片
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  上傳圖片 *
                </label>
                <ImageUpload
                  onUpload={handleImageUpload}
                  currentImage={formData.image}
                  className="w-full"
                />
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* 中文新聞內容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              中文新聞內容 *
            </h2>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                中文詳細內容 *
              </label>
              <textarea
                id="content"
                rows={10}
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="輸入詳細的中文新聞內容..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">支援 Markdown 語法</p>
            </div>
          </motion.div>

          {/* 英文新聞內容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              English News Content (Optional)
            </h2>

            <div>
              <label
                htmlFor="contentEn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                English Content
              </label>
              <textarea
                id="contentEn"
                rows={10}
                value={formData.contentEn}
                onChange={(e) => handleInputChange('contentEn', e.target.value)}
                placeholder="Enter detailed English news content..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.contentEn ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.contentEn && (
                <p className="mt-1 text-sm text-red-600">{errors.contentEn}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Supports Markdown syntax
              </p>
            </div>
          </motion.div>

          {/* 發布設定 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              發布設定
            </h2>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    handleInputChange('isPublished', e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">立即發布</span>
              </label>
              <p className="ml-4 text-xs text-gray-500">取消勾選將儲存為草稿</p>
            </div>
          </motion.div>

          {/* 操作按鈕 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between pt-6 border-t border-gray-200"
          >
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '儲存中...' : '儲存草稿'}
            </button>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {formData.isPublished ? '發布中...' : '創建中...'}
                  </div>
                ) : formData.isPublished ? (
                  '發布新聞'
                ) : (
                  '創建新聞'
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
}
