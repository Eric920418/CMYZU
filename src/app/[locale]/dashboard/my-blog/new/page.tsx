'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SimpleTipTapEditor from '@/components/editor/SimpleTipTapEditor';
import {
  DocumentTextIcon,
  TagIcon,
  GlobeAltIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function NewPostPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    featured: false,
    tags: [] as string[],
    category: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  // 檢查認證狀態
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/zh/login');
      return;
    }

    if (!isLoading && user?.role !== 'TEACHER' && user?.role !== 'ADMIN') {
      router.push('/zh/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('標題為必填欄位');
      return;
    }

    if (!formData.content.trim()) {
      setError('內容為必填欄位');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dashboard/teacher-posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // 成功後跳轉回部落格管理頁面
        router.push('/zh/dashboard/my-blog');
      } else {
        setError(result.error || '創建文章失敗');
      }
    } catch (err: unknown) {
      console.error('創建文章失敗:', err);
      setError(err instanceof Error ? err.message : '創建文章失敗');
    } finally {
      setSaving(false);
    }
  };

  // 處理輸入變更
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 自動生成 slug
    if (field === 'title' && value) {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  // 新增標籤
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  // 移除標籤
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // 處理標籤輸入的 Enter 鍵
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">載入中...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">新增文章</h1>
          <p className="text-gray-600">創建新的部落格文章</p>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本資料 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              文章資料
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL 路徑
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  自動根據標題生成，也可手動修改
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  摘要
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="文章簡短描述，會顯示在文章列表中"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分類
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange('category', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：教學、研究、心得分享"
                />
              </div>
            </div>
          </div>

          {/* 標籤 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <TagIcon className="h-5 w-5 mr-2" />
              標籤
            </h2>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="輸入標籤後按 Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  新增
                </button>
              </div>
            </div>
          </div>

          {/* 文章內容 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              內容 <span className="text-red-500">*</span>
            </h2>

            <SimpleTipTapEditor
              content={formData.content}
              onChange={(content) => handleInputChange('content', content)}
            />
          </div>

          {/* 發布設定 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">發布設定</h2>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    handleInputChange('published', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <GlobeAltIcon className="h-5 w-5 ml-2 mr-1 text-green-600" />
                <span className="text-sm text-gray-700">
                  立即發布（取消勾選則儲存為草稿）
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    handleInputChange('featured', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <StarIcon className="h-5 w-5 ml-2 mr-1 text-yellow-500" />
                <span className="text-sm text-gray-700">設為精選文章</span>
              </label>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/zh/dashboard/my-blog')}
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              取消
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-md text-white font-medium ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {saving
                ? '儲存中...'
                : formData.published
                  ? '發布文章'
                  : '儲存草稿'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
