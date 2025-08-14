'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import {
  UserIcon,
  CalendarIcon,
  EyeIcon,
  TagIcon,
  ClockIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

interface TeacherData {
  id: string;
  displayName: string;
  slug: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  researchAreas: string[];
}

interface PostData {
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

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt: string;
  views: number;
  tags: string[];
  category?: string;
}

interface ArticleData {
  post: PostData;
  teacher: TeacherData;
  relatedPosts: RelatedPost[];
}

export default function ArticlePage() {
  const params = useParams();
  const { slug, postSlug } = params as { slug: string; postSlug: string };

  const [data, setData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug && postSlug) {
      fetchArticle();
    }
  }, [slug, postSlug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teachers/${slug}/posts/${postSlug}`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || '載入文章失敗');
        }
      } else if (response.status === 404) {
        notFound();
      } else {
        throw new Error('載入文章失敗');
      }
    } catch (err: any) {
      console.error('載入文章失敗:', err);
      setError(err.message || '載入文章失敗');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200; // 中文閱讀速度
    const words = content.replace(/<[^>]*>/g, '').length / 2; // 估算中文字數
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const shareArticle = () => {
    if (navigator.share && data) {
      navigator.share({
        title: data.post.title,
        text: data.post.excerpt || '',
        url: window.location.href,
      });
    } else {
      // 複製連結到剪貼板
      navigator.clipboard.writeText(window.location.href);
      alert('文章連結已複製到剪貼板');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">錯誤: {error || '文章不存在'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 導航 */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link
              href="/zh/teachers"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              師資介紹
            </Link>
            <span>/</span>
            <Link
              href={`/zh/teachers/${data.teacher.slug}`}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {data.teacher.displayName}
            </Link>
            <span>/</span>
            <Link
              href={`/zh/teachers/${data.teacher.slug}/posts`}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              文章
            </Link>
            <span>/</span>
            <span className="text-gray-900">{data.post.title}</span>
          </div>
        </nav>

        {/* 文章內容 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 文章標題區 */}
          <div className="px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                {data.post.featured && (
                  <span className="inline-flex px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    精選文章
                  </span>
                )}
                {data.post.category && (
                  <span className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {data.post.category}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {data.post.title}
              </h1>

              {data.post.excerpt && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {data.post.excerpt}
                </p>
              )}
            </motion.div>

            {/* 文章資訊 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between border-t border-b border-gray-200 py-6 mb-8"
            >
              <div className="flex items-center space-x-6">
                {/* 作者資訊 */}
                <Link
                  href={`/zh/teachers/${data.teacher.slug}`}
                  className="flex items-center space-x-3 group"
                >
                  {data.teacher.avatar ? (
                    <Image
                      src={data.teacher.avatar}
                      alt={data.teacher.displayName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {data.teacher.displayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.teacher.bio}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(data.post.createdAt)}
                </div>
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {data.post.views} 次瀏覽
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />約{' '}
                  {estimateReadingTime(data.post.content)} 分鐘閱讀
                </div>
                <button
                  onClick={shareArticle}
                  className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  title="分享文章"
                >
                  <ShareIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {/* 文章內容 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-none text-gray-900 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.post.content }}
            />

            {/* 標籤 */}
            {data.post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 pt-8 border-t border-gray-200"
              >
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    標籤：
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {data.post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 相關文章 */}
        {data.relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相關文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.relatedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <Link
                    href={`/zh/teachers/${data.teacher.slug}/posts/${post.slug}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                      {post.title}
                    </h3>
                  </Link>

                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      {post.views}
                    </div>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
}
