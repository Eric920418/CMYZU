'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface Teacher {
  id: string;
  name: string;
  email: string;
  image?: string;
  teacherProfile: {
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
    showContact: boolean;
    showResearch: boolean;
    showPosts: boolean;
    email?: string;
    phone?: string;
    office?: string;
    researchAreas: string[];
    createdAt: string;
    updatedAt: string;
  };
  _count: {
    teacherPosts: number;
  };
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teachers');

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTeachers(result.data);
        } else {
          setError(result.error || '載入教師列表失敗');
        }
      } else {
        throw new Error('載入教師列表失敗');
      }
    } catch (err: any) {
      console.error('載入教師列表失敗:', err);
      setError(err.message || '載入教師列表失敗');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.teacherProfile.displayName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.teacherProfile.bio
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.teacherProfile.researchAreas.some((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">錯誤: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            師資介紹
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            認識我們優秀的教師團隊，了解他們的專業領域和研究成果
          </motion.p>
        </div>

        {/* 搜尋欄 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="搜尋教師或研究領域..."
            />
          </div>
        </motion.div>

        {/* 教師卡片網格 */}
        {filteredTeachers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              沒有找到教師
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? '嘗試使用不同的搜尋關鍵字' : '目前沒有教師資料'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* 封面圖片或預設背景 */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  {teacher.teacherProfile.coverImage && (
                    <Image
                      src={teacher.teacherProfile.coverImage}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* 教師資訊 */}
                <div className="p-6 -mt-8 relative">
                  {/* 頭像 */}
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-white rounded-full p-1 shadow-lg mx-auto">
                      {teacher.teacherProfile.avatar || teacher.image ? (
                        <Image
                          src={teacher.teacherProfile.avatar || teacher.image!}
                          alt={teacher.teacherProfile.displayName}
                          width={60}
                          height={60}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 基本資料 */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {teacher.teacherProfile.displayName}
                    </h3>
                    {teacher.teacherProfile.bio && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {teacher.teacherProfile.bio}
                      </p>
                    )}
                  </div>

                  {/* 研究領域 */}
                  {teacher.teacherProfile.showResearch &&
                    teacher.teacherProfile.researchAreas.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            研究領域
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {teacher.teacherProfile.researchAreas
                            .slice(0, 3)
                            .map((area) => (
                              <span
                                key={area}
                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                              >
                                {area}
                              </span>
                            ))}
                          {teacher.teacherProfile.researchAreas.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{teacher.teacherProfile.researchAreas.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* 聯絡資訊 */}
                  {teacher.teacherProfile.showContact && (
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {teacher.teacherProfile.email && (
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          <span className="truncate">
                            {teacher.teacherProfile.email}
                          </span>
                        </div>
                      )}
                      {teacher.teacherProfile.office && (
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                          <span>{teacher.teacherProfile.office}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 文章統計 */}
                  {teacher.teacherProfile.showPosts &&
                    teacher._count.teacherPosts > 0 && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        <span>{teacher._count.teacherPosts} 篇文章</span>
                      </div>
                    )}

                  {/* 社群連結 */}
                  {teacher.teacherProfile.socialLinks && (
                    <div className="flex justify-center space-x-3 mb-4">
                      {teacher.teacherProfile.socialLinks.website && (
                        <a
                          href={teacher.teacherProfile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <GlobeAltIcon className="h-5 w-5" />
                        </a>
                      )}
                      {teacher.teacherProfile.socialLinks.linkedin && (
                        <a
                          href={teacher.teacherProfile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <span className="text-sm font-semibold">in</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* 查看詳情按鈕 */}
                  <Link
                    href={`/zh/teachers/${teacher.teacherProfile.slug}`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    查看詳情
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
