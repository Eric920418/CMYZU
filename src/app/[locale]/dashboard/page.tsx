'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations('DashboardPage');

  // 如果未登錄，重定向到登錄頁面
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // 載入中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 未登錄
  if (!isAuthenticated || !user) {
    return null; // 重定向中
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* 歡迎區域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white"
        >
          <h1 className="text-2xl font-bold mb-2">
            {t('welcome', { default: '歡迎回來' })}，{user.name} 👋
          </h1>
          <p className="text-primary-100">
            {t('dashboard-desc', {
              default: '管理您的網站內容，讓您的學校網站更加出色',
            })}
          </p>
        </motion.div>

        {/* 統計數據區域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardStats />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 快速操作 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <QuickActions />
          </motion.div>

          {/* 最近活動 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RecentActivity />
          </motion.div>
        </div>

        {/* 系統狀態 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('system-status', { default: '系統狀態' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-green-800">
                  {t('website-status', { default: '網站狀態' })}
                </p>
                <p className="text-sm text-green-600">
                  {t('running-normally', { default: '正常運行' })}
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-blue-800">
                  {t('database', { default: '資料庫' })}
                </p>
                <p className="text-sm text-blue-600">
                  {t('connection-normal', { default: '連線正常' })}
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-yellow-800">
                  {t('backup-status', { default: '備份狀態' })}
                </p>
                <p className="text-sm text-yellow-600">
                  {t('yesterday-backup', { default: '昨天備份' })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 管理員專屬區域 */}
        {user.role === 'ADMIN' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t('admin-tools', { default: '管理員工具' })}
                </h3>
                <p className="text-purple-100">
                  {t('admin-tools-desc', { default: '系統設定和高級功能' })}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                  {t('user-management', { default: '用戶管理' })}
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                  {t('system-settings', { default: '系統設定' })}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
