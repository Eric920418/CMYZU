'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  LinkIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { TeacherProfile } from '@/types/dashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function MyProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    slug: '',
    bio: '',
    avatar: '',
    coverImage: '',
    email: '',
    phone: '',
    office: '',
    researchAreas: [] as string[],
    socialLinks: {
      website: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      youtube: '',
    },
    showContact: true,
    showResearch: true,
    showPosts: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // 載入個人資料
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dashboard/teacher-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const profileData = result.data;
          setProfile(profileData);

          // 填充表單數據
          setFormData({
            displayName: profileData.displayName || user?.name || '',
            slug: profileData.slug || '',
            bio: profileData.bio || '',
            avatar: profileData.avatar || '',
            coverImage: profileData.coverImage || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            office: profileData.office || '',
            researchAreas: profileData.researchAreas || [],
            socialLinks: {
              website: profileData.socialLinks?.website || '',
              linkedin: profileData.socialLinks?.linkedin || '',
              twitter: profileData.socialLinks?.twitter || '',
              facebook: profileData.socialLinks?.facebook || '',
              instagram: profileData.socialLinks?.instagram || '',
              youtube: profileData.socialLinks?.youtube || '',
            },
            showContact: profileData.showContact ?? true,
            showResearch: profileData.showResearch ?? true,
            showPosts: profileData.showPosts ?? true,
          });
        } else {
          // 沒有個人資料，使用默認值
          setFormData((prev) => ({
            ...prev,
            displayName: user?.name || '',
            slug:
              user?.name
                ?.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '') || '',
          }));
        }
      } else {
        throw new Error('載入個人資料失敗');
      }
    } catch (err: unknown) {
      console.error('載入個人資料失敗:', err);
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 保存個人資料
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      setError('顯示名稱為必填欄位');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dashboard/teacher-profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('個人資料已成功更新');
        setProfile(result.data);
      } else {
        setError(result.error || '更新失敗');
      }
    } catch (err: unknown) {
      console.error('更新個人資料失敗:', err);
      setError(err.message || '更新失敗');
    } finally {
      setSaving(false);
    }
  };

  // 輸入框變更處理
  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('socialLinks.')) {
      const socialField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // 研究領域管理
  const addResearchArea = () => {
    const newArea = prompt('請輸入研究領域：');
    if (newArea && newArea.trim()) {
      setFormData((prev) => ({
        ...prev,
        researchAreas: [...prev.researchAreas, newArea.trim()],
      }));
    }
  };

  const removeResearchArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      researchAreas: prev.researchAreas.filter((_, i) => i !== index),
    }));
  };

  if (isLoading || loading) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            個人頁面設定
          </h1>
          <p className="text-gray-600">設定您的個人資料和部落格頁面顯示內容</p>
          {profile && (
            <p className="text-sm text-blue-600 mt-2">
              您的個人頁面網址: <code>/teacher/{profile.slug}</code>
            </p>
          )}
        </div>

        {/* 錯誤和成功訊息 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本資料 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              基本資料
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  顯示名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange('displayName', e.target.value)
                  }
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
                  placeholder="自動生成"
                />
                <p className="text-xs text-gray-500 mt-1">
                  留空將自動根據顯示名稱生成
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                個人簡介
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請介紹您的專業背景、研究興趣等..."
              />
            </div>
          </div>

          {/* 聯絡資訊 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              聯絡資訊
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電子郵件
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電話
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  辦公室
                </label>
                <input
                  type="text"
                  value={formData.office}
                  onChange={(e) => handleInputChange('office', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 研究領域 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              研究領域
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {formData.researchAreas.map((area, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => removeResearchArea(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={addResearchArea}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              + 新增研究領域
            </button>
          </div>

          {/* 社群連結 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <LinkIcon className="h-5 w-5 mr-2" />
              社群連結
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData.socialLinks).map(([platform, url]) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {platform === 'website' ? '個人網站' : platform}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleInputChange(
                        `socialLinks.${platform}`,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`https://`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 顯示設定 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              頁面顯示設定
            </h2>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showContact}
                  onChange={(e) =>
                    handleInputChange('showContact', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">顯示聯絡資訊</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showResearch}
                  onChange={(e) =>
                    handleInputChange('showResearch', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">顯示研究領域</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showPosts}
                  onChange={(e) =>
                    handleInputChange('showPosts', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  顯示部落格文章
                </span>
              </label>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-md text-white font-medium ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {saving ? '儲存中...' : '儲存設定'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
