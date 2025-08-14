'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import {
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CalendarIcon,
  EyeIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { TeacherProfile } from '@/types/dashboard';

interface TeacherData extends TeacherProfile {
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: string;
    views: number;
    tags: string[];
    category?: string;
  }[];
}

export default function TeacherDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchTeacher();
    }
  }, [slug]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teachers/${slug}`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTeacher(result.data);
        } else {
          setError(result.error || '載入教師資料失敗');
        }
      } else if (response.status === 404) {
        notFound();
      } else {
        throw new Error('載入教師資料失敗');
      }
    } catch (err: any) {
      console.error('載入教師資料失敗:', err);
      setError(err.message || '載入教師資料失敗');
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !teacher) {
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
    <div className="min-h-screen bg-gray-50">
      {/* 封面區域 */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700">
        {teacher.coverImage && (
          <Image
            src={teacher.coverImage}
            alt=""
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        {/* 導航 */}
        <nav className="relative pt-8 px-4 sm:px-6 lg:px-8">
          <Link
            href="/zh/teachers"
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            ← 返回師資列表
          </Link>
        </nav>
      </div>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 教師資訊卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 頭像 */}
              <div className="p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4">
                  {teacher.avatar ? (
                    <Image
                      src={teacher.avatar}
                      alt={teacher.displayName}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-lg">
                      <UserIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {teacher.displayName}
                </h1>
                {teacher.bio && (
                  <p className="text-gray-600 mb-4">{teacher.bio}</p>
                )}
              </div>

              {/* 聯絡資訊 */}
              {teacher.showContact && (
                <div className="px-6 pb-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 mt-4 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    聯絡資訊
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {teacher.email && (
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                          href={`mailto:${teacher.email}`}
                          className="hover:text-blue-600 transition-colors duration-200"
                        >
                          {teacher.email}
                        </a>
                      </div>
                    )}
                    {teacher.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                    {teacher.office && (
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{teacher.office}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 研究領域 */}
              {teacher.showResearch && teacher.researchAreas.length > 0 && (
                <div className="px-6 pb-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 mt-4 flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    研究領域
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.researchAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 社群連結 */}
              {teacher.socialLinks &&
                Object.values(teacher.socialLinks).some((link) => link) && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 mt-4 flex items-center">
                      <GlobeAltIcon className="h-4 w-4 mr-1" />
                      社群連結
                    </h3>
                    <div className="flex space-x-3">
                      {teacher.socialLinks.website && (
                        <a
                          href={teacher.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        >
                          <GlobeAltIcon className="h-5 w-5" />
                        </a>
                      )}
                      {teacher.socialLinks.linkedin && (
                        <a
                          href={teacher.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        >
                          <span className="text-sm font-semibold">in</span>
                        </a>
                      )}
                      {teacher.socialLinks.twitter && (
                        <a
                          href={teacher.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        >
                          <span className="text-sm font-semibold">𝕏</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </motion.div>

          {/* 部落格文章 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {teacher.showPosts &&
            teacher.recentPosts &&
            teacher.recentPosts.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    最新文章
                  </h2>

                  <div className="space-y-6">
                    {teacher.recentPosts.map((post) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              href={`/zh/teachers/${teacher.slug}/posts/${post.slug}`}
                              className="block group"
                            >
                              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                                {post.title}
                              </h3>
                            </Link>

                            {post.excerpt && (
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {formatDate(post.createdAt)}
                              </div>
                              <div className="flex items-center">
                                <EyeIcon className="h-4 w-4 mr-1" />
                                {post.views} 次瀏覽
                              </div>
                              {post.category && (
                                <div className="flex items-center">
                                  <TagIcon className="h-4 w-4 mr-1" />
                                  {post.category}
                                </div>
                              )}
                            </div>

                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                                    +{post.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      href={`/zh/teachers/${teacher.slug}/posts`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      查看所有文章
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  尚未有文章
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {teacher.displayName} 老師還沒有發布任何文章
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
