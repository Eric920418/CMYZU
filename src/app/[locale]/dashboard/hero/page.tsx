'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { dashboardAPI } from '@/lib/dashboard-api';
import { useAuth } from '@/contexts/AuthContext';
import { HeroContent } from '@/types/dashboard';
import ImageUpload from '@/components/dashboard/ImageUpload';

// 主視覺後台管理頁面
export default function HeroManagementPage() {
  const { loading: authLoading } = useAuth();
  const [heroContents, setHeroContents] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 表單狀態
  const [formData, setFormData] = useState({
    locale: 'zh',
    titlePrefix: 'YZU',
    titleMain: '',
    subtitle: '',
    backgroundImage: '',
    gradientFrom: 'amber-600',
    gradientTo: 'white',
    glassEffect: true,
  });

  // 載入主視覺內容
  const loadHeroContents = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.heroContent.list();

      if (response.success && response.data) {
        setHeroContents(response.data);
      } else {
        toast.error(response.error || '載入主視覺內容失敗');
      }
    } catch (error) {
      console.error('載入主視覺失敗:', error);
      toast.error('載入主視覺內容失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadHeroContents();
    }
  }, [authLoading]);

  // 開啟編輯模態框
  const handleEdit = (hero: HeroContent) => {
    setEditingHero(hero);
    setFormData({
      locale: hero.locale,
      titlePrefix: hero.titlePrefix,
      titleMain: hero.titleMain,
      subtitle: hero.subtitle,
      backgroundImage: hero.backgroundImage || '',
      gradientFrom: hero.gradientFrom,
      gradientTo: hero.gradientTo,
      glassEffect: hero.glassEffect,
    });
    setIsEditModalOpen(true);
  };

  // 關閉編輯模態框
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingHero(null);
    setFormData({
      locale: 'zh',
      titlePrefix: 'YZU',
      titleMain: '',
      subtitle: '',
      backgroundImage: '',
      gradientFrom: 'amber-600',
      gradientTo: 'white',
      glassEffect: true,
    });
  };

  // 保存主視覺內容
  const handleSave = async () => {
    try {
      if (!editingHero) return;

      const response = await dashboardAPI.heroContent.update(
        editingHero.id,
        formData
      );

      if (response.success) {
        toast.success('主視覺內容更新成功');
        await loadHeroContents();
        handleCloseModal();
      } else {
        toast.error(response.error || '更新失敗');
      }
    } catch (error) {
      console.error('保存失敗:', error);
      toast.error('保存主視覺內容失敗');
    }
  };

  // 切換狀態
  const handleToggleStatus = async (hero: HeroContent) => {
    try {
      const response = await dashboardAPI.heroContent.toggleStatus(hero.id);

      if (response.success) {
        toast.success(`主視覺已${!hero.isActive ? '啟用' : '停用'}`);
        await loadHeroContents();
      } else {
        toast.error(response.error || '狀態切換失敗');
      }
    } catch (error) {
      console.error('狀態切換失敗:', error);
      toast.error('狀態切換失敗');
    }
  };

  // 預設漸層顏色選項
  const gradientOptions = [
    { from: 'amber-600', to: 'white', name: '琥珀漸層' },
    { from: 'blue-600', to: 'purple-600', name: '藍紫漸層' },
    { from: 'green-600', to: 'teal-600', name: '綠青漸層' },
    { from: 'red-600', to: 'pink-600', name: '紅粉漸層' },
    { from: 'indigo-600', to: 'blue-600', name: '靛藍漸層' },
    { from: 'purple-600', to: 'pink-600', name: '紫粉漸層' },
  ];

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <SparklesIcon className="h-8 w-8 text-amber-500" />
              主視覺管理
            </h1>
            <p className="mt-2 text-gray-600">
              管理網站首頁主視覺區塊的內容與設計
            </p>
          </div>
        </div>

        {/* 主視覺卡片列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {heroContents.map((hero) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* 卡片標頭 */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="h-6 w-6 text-gray-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {hero.locale === 'zh' ? '中文版本' : '英文版本'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {hero.locale.toUpperCase()} - {hero.titlePrefix}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(hero)}
                      className={`p-2 rounded-lg transition-colors ${
                        hero.isActive
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={hero.isActive ? '點擊停用' : '點擊啟用'}
                    >
                      {hero.isActive ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(hero)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      title="編輯主視覺"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 預覽區域 */}
              <div
                className="h-64 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgb(245 158 11), white)`,
                }}
              >
                {/* 玻璃幕牆效果 */}
                {hero.glassEffect && (
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent">
                    <div className="h-full w-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:40px_100%] animate-pulse" />
                  </div>
                )}

                {/* 背景圖片 */}
                {hero.backgroundImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url(${hero.backgroundImage})` }}
                  />
                )}

                {/* 內容預覽 */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-center">
                  <span className="text-white drop-shadow-lg text-sm font-light tracking-widest mb-2">
                    {hero.titlePrefix}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-white mb-4 leading-tight">
                    {hero.titleMain}
                  </h2>
                  <p className="text-sm text-white/90 leading-relaxed backdrop-blur-sm bg-amber-600/20 p-3 rounded-lg border border-amber-500/20">
                    {hero.subtitle.length > 80
                      ? `${hero.subtitle.substring(0, 80)}...`
                      : hero.subtitle}
                  </p>
                </div>
              </div>

              {/* 卡片資訊 */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    更新時間: {new Date(hero.updatedAt).toLocaleString('zh-TW')}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hero.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {hero.isActive ? '啟用中' : '已停用'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 編輯模態框 */}
        {isEditModalOpen && editingHero && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    編輯主視覺內容 -{' '}
                    {editingHero.locale === 'zh' ? '中文版' : '英文版'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* 基本資訊 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      前綴標識
                    </label>
                    <input
                      type="text"
                      value={formData.titlePrefix}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          titlePrefix: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例: YZU"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      語言版本
                    </label>
                    <select
                      value={formData.locale}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          locale: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled
                    >
                      <option value="zh">中文 (ZH)</option>
                      <option value="en">英文 (EN)</option>
                    </select>
                  </div>
                </div>

                {/* 主標題 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主標題
                  </label>
                  <input
                    type="text"
                    value={formData.titleMain}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        titleMain: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="輸入主標題"
                    required
                  />
                </div>

                {/* 副標題 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    副標題
                  </label>
                  <textarea
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subtitle: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="輸入副標題或描述"
                    required
                  />
                </div>

                {/* 背景圖片上傳 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    背景圖片
                  </label>
                  <ImageUpload
                    currentImage={formData.backgroundImage}
                    onImageChange={(imageUrl) =>
                      setFormData((prev) => ({
                        ...prev,
                        backgroundImage: imageUrl,
                      }))
                    }
                    placeholder="上傳主視覺背景圖片"
                  />
                </div>

                {/* 漸層顏色選擇 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文字漸層效果
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gradientOptions.map((option) => (
                      <button
                        key={`${option.from}-${option.to}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            gradientFrom: option.from,
                            gradientTo: option.to,
                          }))
                        }
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.gradientFrom === option.from &&
                          formData.gradientTo === option.to
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="h-8 rounded mb-2"
                          style={{
                            background: `linear-gradient(135deg, rgb(245 158 11), rgb(255 255 255))`,
                          }}
                        />
                        <span className="text-sm font-medium">
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 效果選項 */}
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.glassEffect}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          glassEffect: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      啟用玻璃幕牆效果
                    </span>
                  </label>
                </div>
              </div>

              {/* 模態框按鈕 */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    保存變更
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
