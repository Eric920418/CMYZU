'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { dashboardAPI } from '@/lib/dashboard-api';

export default function EditLiveUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const liveUpdateId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as const,
    tags: [] as string[],
    isPublished: false,
  });
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 載入現有即時動態資料
  useEffect(() => {
    const loadLiveUpdate = async () => {
      setIsLoadingData(true);
      try {
        const response = await dashboardAPI.liveUpdates.get(liveUpdateId);

        if (response.success && response.data) {
          const data = response.data;
          setFormData({
            title: data.title,
            content: data.content,
            priority: data.priority,
            tags: data.tags || [],
            isPublished: data.isPublished,
          });
        } else {
          throw new Error(response.error || '載入即時動態失敗');
        }
      } catch (error) {
        console.error('Failed to load live update:', error);
        alert(
          `載入失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
        );
        router.push('/dashboard/live-updates');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (liveUpdateId) {
      loadLiveUpdate();
    }
  }, [liveUpdateId, router]);

  // 處理輸入變更
  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除相關錯誤
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // 新增標籤
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      handleInputChange('tags', [...formData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // 移除標籤
  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      'tags',
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  // 表單驗證
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '請輸入標題';
    } else if (formData.title.length > 200) {
      newErrors.title = '標題不能超過 200 個字元';
    }

    if (!formData.content.trim()) {
      newErrors.content = '請輸入內容';
    } else if (formData.content.length > 2000) {
      newErrors.content = '內容不能超過 2000 個字元';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await dashboardAPI.liveUpdates.update(liveUpdateId, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        priority: formData.priority,
        tags: formData.tags,
        isPublished: formData.isPublished,
      });

      if (response.success) {
        alert('即時動態更新成功！');
        router.push('/dashboard/live-updates');
      } else {
        throw new Error(response.error || '更新失敗');
      }
    } catch (error) {
      console.error('Failed to update live update:', error);
      alert(`更新失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 儲存草稿
  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      setErrors({ title: '請至少輸入標題才能儲存草稿' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await dashboardAPI.liveUpdates.update(liveUpdateId, {
        title: formData.title.trim(),
        content: formData.content.trim() || '(草稿)',
        priority: formData.priority,
        tags: formData.tags,
        isPublished: false,
      });

      if (response.success) {
        alert('草稿儲存成功！');
        router.push('/dashboard/live-updates');
      } else {
        throw new Error(response.error || '儲存失敗');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert(`儲存失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除即時動態
  const handleDelete = async () => {
    if (!confirm('確定要刪除這個即時動態嗎？此操作無法復原。')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await dashboardAPI.liveUpdates.delete(liveUpdateId);

      if (response.success) {
        alert('即時動態已刪除！');
        router.push('/dashboard/live-updates');
      } else {
        throw new Error(response.error || '刪除失敗');
      }
    } catch (error) {
      console.error('Failed to delete live update:', error);
      alert(`刪除失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入即時動態資料中...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">編輯即時動態</h1>
            <p className="mt-2 text-sm text-gray-600">
              修改即時動態的內容和設定
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              刪除
            </button>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              返回
            </button>
          </div>
        </div>

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* 標題 */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="輸入即時動態標題..."
                  maxLength={200}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/200 字元
                </p>
              </div>

              {/* 重要程度 */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  重要程度
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange('priority', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">低重要</option>
                  <option value="medium">中重要</option>
                  <option value="high">高重要</option>
                </select>
              </div>

              {/* 標籤 */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  標籤
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="輸入標籤後按 Enter 或點擊新增..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    新增
                  </button>
                </div>
                {/* 顯示標籤 */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <svg
                            className="w-3 h-3"
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
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 內容 */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  內容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  rows={8}
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="輸入即時動態內容..."
                  maxLength={2000}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.content.length}/2000 字元
                </p>
              </div>

              {/* 發布選項 */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      handleInputChange('isPublished', e.target.checked)
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    立即發布（取消勾選將儲存為草稿）
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '處理中...' : '儲存草稿'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? '處理中...'
                : formData.isPublished
                  ? '更新並發布'
                  : '更新'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
