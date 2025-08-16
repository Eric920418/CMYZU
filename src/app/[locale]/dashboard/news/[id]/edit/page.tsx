'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/dashboard/ImageUpload';
import { dashboardAPI } from '@/lib/dashboard-api';

// 安全的日期格式化函數
const formatDate = (dateInput: string | Date): string => {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return isNaN(date.getTime())
      ? new Date().toISOString().split('T')[0]
      : date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    titleEn: '',
    excerptEn: '',
    contentEn: '',
    image: '',
    isPublished: false,
    date: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 載入現有新聞資料
  useEffect(() => {
    const loadNewsData = async () => {
      try {
        setIsLoadingData(true);
        const response = await dashboardAPI.news.get(newsId);

        if (response.success && response.data) {
          const news = response.data;
          const imageValue = news.imageUrl || news.image || '';

          setFormData({
            title: news.title,
            excerpt: news.excerpt || '',
            content: news.content,
            titleEn: news.titleEn || '',
            excerptEn: news.excerptEn || '',
            contentEn: news.contentEn || '',
            image: imageValue,
            isPublished: news.published || false,
            date: formatDate(news.publishedAt || news.createdAt),
          });
          // ImageUpload 組件會自動同步預覽
        } else {
          throw new Error(response.error || '載入新聞失敗');
        }
      } catch (error) {
        console.error('載入新聞失敗:', error);
        alert(
          `載入新聞失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
        );
        router.push('/dashboard/news');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (newsId) {
      loadNewsData();
    }
  }, [newsId, router]);

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
    console.log('UPLOAD SUCCESS - New URL:', imageUrl);
    console.log('EDIT PAGE - handleImageUpload called with:', imageUrl);

    setFormData((prev) => {
      const newData = { ...prev, image: imageUrl };
      console.log('FORM STATE UPDATED - New image:', newData.image);
      console.log('EDIT PAGE - Form data updated, staying on page');
      return newData;
    });

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }

    console.log('EDIT PAGE - handleImageUpload completed, should stay on page');
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

    if (!formData.date) {
      newErrors.date = '請選擇發布日期';
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
      const updateData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        titleEn: formData.titleEn || undefined,
        excerptEn: formData.excerptEn || undefined,
        contentEn: formData.contentEn || undefined,
        imageUrl: formData.image, // 注意：API 期望 imageUrl，但表單使用 image
        published: formData.isPublished,
        publishedAt: new Date(formData.date), // 修正：使用 publishedAt 而不是 date
      };

      console.log('SUBMIT - Final imageUrl being sent:', updateData.imageUrl);
      const response = await dashboardAPI.news.update(newsId, updateData);

      if (response.success && response.data) {
        console.log(
          'UPDATE RESPONSE - imageUrl in DB:',
          response.data.imageUrl
        );
        alert('新聞更新成功！');
        router.push('/dashboard/news');
      } else {
        throw new Error(response.error || '更新新聞失敗');
      }
    } catch (error) {
      console.error('Failed to update news:', error);
      alert(
        `新聞更新失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 載入中狀態
  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入新聞資料中...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">編輯新聞</h1>
              <p className="text-sm text-gray-600">修改新聞文章內容</p>
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

              {/* 發布日期 */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  發布日期 *
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
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
            <div className="text-sm text-gray-500">新聞ID: {newsId}</div>

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
                    更新中...
                  </div>
                ) : (
                  '更新新聞'
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
}
