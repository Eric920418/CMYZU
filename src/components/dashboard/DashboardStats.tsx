'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// 統計數據類型
interface DashboardStatsData {
  totalNews: number;
  totalAlumni: number;
  totalSubscribers: number;
  monthlyViews: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalNews: 0,
    totalAlumni: 0,
    totalSubscribers: 0,
    monthlyViews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: 實作真實的 API 調用
        // const response = await dashboardAPI.dashboard.stats();

        // 暫時使用模擬數據
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模擬加載
        setStats({
          totalNews: 15,
          totalAlumni: 9,
          totalSubscribers: 1247,
          monthlyViews: 8932,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsItems = [
    {
      title: '新聞文章',
      value: stats.totalNews,
      change: '+2',
      changeType: 'increase' as const,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
      color: 'blue',
      href: '/dashboard/news',
    },
    {
      title: '傑出校友',
      value: stats.totalAlumni,
      change: '+1',
      changeType: 'increase' as const,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      color: 'green',
      href: '/dashboard/alumni',
    },
    {
      title: '電子報訂閱',
      value: stats.totalSubscribers,
      change: '+47',
      changeType: 'increase' as const,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'purple',
      href: '/dashboard/newsletter',
    },
    {
      title: '月度瀏覽',
      value: stats.monthlyViews,
      change: '+12%',
      changeType: 'increase' as const,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      color: 'orange',
      href: '/dashboard',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-200',
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          icon: 'text-green-600',
          text: 'text-green-600',
          border: 'border-green-200',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          icon: 'text-purple-600',
          text: 'text-purple-600',
          border: 'border-purple-200',
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          icon: 'text-orange-600',
          text: 'text-orange-600',
          border: 'border-orange-200',
        };
      default:
        return {
          bg: 'bg-gray-50',
          icon: 'text-gray-600',
          text: 'text-gray-600',
          border: 'border-gray-200',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsItems.map((item, index) => {
        const colors = getColorClasses(item.color);

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            onClick={() => (window.location.href = item.href)}
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-3 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform duration-200`}
              >
                <div className={colors.icon}>{item.icon}</div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {item.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.value.toLocaleString()}
                </p>
                <div className="flex items-center justify-end mt-1">
                  <svg
                    className="w-4 h-4 text-green-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-600">
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
