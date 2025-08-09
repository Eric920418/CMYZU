'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'publish';
  action: string;
  timestamp: Date;
  user?: string;
  module:
    | 'news'
    | 'alumni'
    | 'resources'
    | 'rankings'
    | 'social'
    | 'hero'
    | 'stats';
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // TODO: 實作真實的 API 調用
        // const response = await dashboardAPI.dashboard.recentActivity();

        // 暫時使用模擬數據
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'create',
            action: '新增新聞：「元智管理學院榮獲教育部教學卓越計畫殊榮」',
            timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2分鐘前
            user: 'admin',
            module: 'news',
          },
          {
            id: '2',
            type: 'update',
            action: '更新校友資料：林志明 - 永豐金控董事長',
            timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15分鐘前
            user: 'admin',
            module: 'alumni',
          },
          {
            id: '3',
            type: 'publish',
            action: '發布特色資源：新戶申辦享限定首刷好禮',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30分鐘前
            user: 'editor',
            module: 'resources',
          },
          {
            id: '4',
            type: 'update',
            action: '修改統計數據：更新國際化商管教育描述',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1小時前
            user: 'admin',
            module: 'stats',
          },
          {
            id: '5',
            type: 'create',
            action: '新增 YouTube 影片：2024畢業典禮精華回顧',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小時前
            user: 'editor',
            module: 'social',
          },
          {
            id: '6',
            type: 'update',
            action: '更新排名資料：本校世界頂尖大學排名',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4小時前
            user: 'admin',
            module: 'rankings',
          },
        ];

        setActivities(mockActivities);
      } catch (error) {
        console.error('Failed to fetch recent activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '剛才';
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    return `${days} 天前`;
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'create':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
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
          </div>
        );
      case 'update':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
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
          </div>
        );
      case 'publish':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-600"
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
          </div>
        );
      case 'delete':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-red-600"
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
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getModuleName = (module: ActivityItem['module']) => {
    switch (module) {
      case 'news':
        return '新聞';
      case 'alumni':
        return '校友';
      case 'resources':
        return '資源';
      case 'rankings':
        return '排名';
      case 'social':
        return '社群';
      case 'hero':
        return '主視覺';
      case 'stats':
        return '統計';
      default:
        return '未知';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">最近活動</h2>
          <p className="text-sm text-gray-600 mt-1">系統操作記錄</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">最近活動</h2>
        <p className="text-sm text-gray-600 mt-1">系統操作記錄</p>
      </div>

      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative pb-8">
                  {index !== activities.length - 1 && (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  )}
                  <div className="relative flex space-x-3">
                    <div>{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {activity.user}
                          </span>{' '}
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                            {getModuleName(activity.module)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-700">
                          {activity.action}
                        </p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {getTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500">暫無最近活動</p>
          </div>
        )}
      </div>
    </div>
  );
}
