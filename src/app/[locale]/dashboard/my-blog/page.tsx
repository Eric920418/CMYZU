'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  GlobeAltIcon,
  EyeSlashIcon,
  StarIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { TeacherPost } from '@/types/dashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

export default function MyBlogPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<TeacherPost[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // 載入文章列表
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dashboard/teacher-posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('取得文章列表失敗');
      }

      const result = await response.json();
      if (result.success) {
        setPosts(result.data);

        // 計算統計資料
        const totalPosts = result.data.length;
        const publishedPosts = result.data.filter(
          (post: TeacherPost) => post.published
        ).length;
        const draftPosts = totalPosts - publishedPosts;
        const totalViews = result.data.reduce(
          (sum: number, post: TeacherPost) => sum + post.views,
          0
        );

        setStats({
          totalPosts,
          publishedPosts,
          draftPosts,
          totalViews,
        });
      } else {
        setError(result.error || '載入失敗');
      }
    } catch (err: unknown) {
      console.error('載入文章失敗:', err);
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  // 切換文章發布狀態
  const togglePublishStatus = async (postId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/dashboard/teacher-posts/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle-publish',
        }),
      });

      if (!response.ok) {
        throw new Error('更新狀態失敗');
      }

      const result = await response.json();
      if (result.success) {
        await fetchPosts(); // 重新載入列表
      } else {
        alert(`錯誤: ${result.error}`);
      }
    } catch (err: unknown) {
      console.error('更新狀態失敗:', err);
      alert(`錯誤: ${err instanceof Error ? err.message : '操作失敗'}`);
    }
  };

  // 切換精選狀態
  const toggleFeaturedStatus = async (postId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/dashboard/teacher-posts/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle-featured',
        }),
      });

      if (!response.ok) {
        throw new Error('更新精選狀態失敗');
      }

      const result = await response.json();
      if (result.success) {
        await fetchPosts(); // 重新載入列表
      } else {
        alert(`錯誤: ${result.error}`);
      }
    } catch (err: unknown) {
      console.error('更新精選狀態失敗:', err);
      alert(`錯誤: ${err instanceof Error ? err.message : '操作失敗'}`);
    }
  };

  // 刪除文章
  const deletePost = async (postId: string) => {
    if (!confirm('確定要刪除這篇文章嗎？此操作無法復原。')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/dashboard/teacher-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('刪除文章失敗');
      }

      const result = await response.json();
      if (result.success) {
        await fetchPosts(); // 重新載入列表
      } else {
        alert(`錯誤: ${result.error}`);
      }
    } catch (err: unknown) {
      console.error('刪除文章失敗:', err);
      alert(`錯誤: ${err instanceof Error ? err.message : '操作失敗'}`);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">錯誤: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的部落格</h1>
          <p className="text-gray-600">管理您的部落格文章和個人頁面設定</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">總文章數</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalPosts}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <GlobeAltIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已發布</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.publishedPosts}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <PencilIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">草稿</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.draftPosts}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EyeIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">總瀏覽數</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalViews}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/zh/dashboard/my-blog/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新增文章
          </Link>
          <Link
            href="/zh/dashboard/my-profile"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            編輯個人頁面
          </Link>
        </div>

        {/* 文章列表 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">文章列表</h2>
          </div>

          {posts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                尚未有文章
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                開始撰寫您的第一篇部落格文章
              </p>
              <div className="mt-6">
                <Link
                  href="/zh/dashboard/my-blog/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  新增文章
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      標題
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分類/標籤
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      瀏覽數
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      更新時間
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {post.featured && (
                              <StarIconSolid className="h-5 w-5 text-yellow-400" />
                            )}
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">
                              {post.title}
                            </div>
                            {post.excerpt && (
                              <div className="text-sm text-gray-500 truncate max-w-md">
                                {post.excerpt}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {post.published ? '已發布' : '草稿'}
                          </span>
                          {post.featured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              精選
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          {post.category && (
                            <div className="flex items-center">
                              <TagIcon className="h-4 w-4 text-gray-400 mr-1" />
                              {post.category}
                            </div>
                          )}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{post.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <EyeIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {post.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(post.updatedAt.toString())}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2 justify-end">
                          <Link
                            href={`/zh/dashboard/my-blog/edit/${post.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="編輯文章"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() =>
                              togglePublishStatus(post.id, post.published)
                            }
                            className={`${
                              post.published
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={post.published ? '設為草稿' : '發布文章'}
                          >
                            {post.published ? (
                              <EyeSlashIcon className="h-4 w-4" />
                            ) : (
                              <GlobeAltIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              toggleFeaturedStatus(post.id, post.featured)
                            }
                            className={`${
                              post.featured
                                ? 'text-yellow-500 hover:text-yellow-700'
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                            title={post.featured ? '取消精選' : '設為精選'}
                          >
                            {post.featured ? (
                              <StarIconSolid className="h-4 w-4" />
                            ) : (
                              <StarIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                            title="刪除文章"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
