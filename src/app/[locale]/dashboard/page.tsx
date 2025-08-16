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

  // 教師用戶直接重定向到部落格管理頁面
  useEffect(() => {
    if (!isLoading && user?.role === 'TEACHER') {
      router.push('/zh/dashboard/my-blog');
    }
  }, [user, isLoading, router]);

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
      </div>
    </DashboardLayout>
  );
}
