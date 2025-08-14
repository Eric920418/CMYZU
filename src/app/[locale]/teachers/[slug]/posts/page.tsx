'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  DocumentTextIcon,
  CalendarIcon,
  EyeIcon,
  TagIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface TeacherData {
  id: string;
  displayName: string;
  slug: string;
  bio?: string;
  avatar?: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published: boolean;
  featured: boolean;
  views: number;
  tags: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
}

interface PostsData {
  teacher: TeacherData;
  posts: Post[];
}

export default function TeacherPostsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<PostsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPosts();
    }
  }, [slug]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teachers/${slug}/posts`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || '載入文章列表失敗');
        }
      } else if (response.status === 404) {
        notFound();
      } else {
        throw new Error('載入文章列表失敗');
      }
    } catch (err: any) {
      console.error('載入文章列表失敗:', err);
      setError(err.message || '載入文章列表失敗');
    } finally {
      setLoading(false);
    }
  };

  // 篩選文章
  const filteredPosts = data
    ? data.posts.filter((post) => {
        const matchesSearch =
          searchTerm === '' ||
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === '' || post.category === selectedCategory;

        const matchesTag =
          selectedTag === '' || post.tags.includes(selectedTag);

        return matchesSearch && matchesCategory && matchesTag;
      })
    : [];

  // 取得所有分類
  const categories = data
    ? Array.from(
        new Set(data.posts.map((post) => post.category).filter(Boolean))
      )
    : [];

  // 取得所有標籤
  const allTags = data
    ? Array.from(new Set(data.posts.flatMap((post) => post.tags)))
    : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">載入中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">
              錯誤: {error || '教師資料不存在'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 導航 */}
        <nav className="mb-8">
          <Link
            href={`/zh/teachers/${data.teacher.slug}`}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            ← 返回 {data.teacher.displayName} 個人頁面
          </Link>
        </nav>

        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {data.teacher.displayName} 的文章
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            共 {data.posts.length} 篇文章
          </motion.p>
        </div>

        {/* 篩選區域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜尋 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搜尋
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="搜尋文章..."
                />
              </div>
            </div>

            {/* 分類篩選 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分類
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有分類</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 標籤篩選 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                標籤
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有標籤</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* 清除篩選 */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedTag('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                清除篩選
              </button>
            </div>
          </div>
        </motion.div>

        {/* 文章列表 */}
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              沒有找到文章
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory || selectedTag
                ? '嘗試調整篩選條件'
                : '這位教師還沒有發布任何文章'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.featured && (
                        <span className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                          精選
                        </span>
                      )}
                      {post.category && (
                        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/zh/teachers/${data.teacher.slug}/posts/${post.slug}`}
                      className="block group"
                    >
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3">
                        {post.title}
                      </h2>
                    </Link>

                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {post.views} 次瀏覽
                      </div>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
