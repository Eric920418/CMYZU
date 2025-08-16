'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { dashboardAPI } from '@/lib/dashboard-api';
import { AnnualReport } from '@/types/dashboard';

// 年報管理主頁面
export default function AnnualReportsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [reports, setReports] = useState<AnnualReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<AnnualReport | null>(null);

  // 身份驗證檢查
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/zh/login');
      return;
    }

    setIsAuthenticated(true);
    setIsAuthLoading(false);
    loadReports();
  }, [router]);

  // 載入年報列表
  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dashboardAPI.annualReports.list();

      if (response.success && response.data) {
        setReports(response.data);
      } else {
        throw new Error(response.error || '載入年報失敗');
      }
    } catch (err) {
      console.error('Load reports error:', err);
      setError(err instanceof Error ? err.message : '載入年報失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 篩選年報
  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.year.toString().includes(searchTerm) ||
      (report.description &&
        report.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 切換選擇
  const toggleSelect = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id)
        ? prev.filter((reportId) => reportId !== id)
        : [...prev, id]
    );
  };

  // 全選/取消全選
  const toggleSelectAll = () => {
    setSelectedReports(
      selectedReports.length === filteredReports.length
        ? []
        : filteredReports.map((r) => r.id)
    );
  };

  // 切換年報狀態
  const toggleReportStatus = async (id: string) => {
    try {
      const response = await dashboardAPI.annualReports.patch(id, {});
      if (response.success) {
        await loadReports();
      } else {
        throw new Error(response.error || '切換狀態失敗');
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      setError(err instanceof Error ? err.message : '切換狀態失敗');
    }
  };

  // 刪除年報
  const deleteReport = async (id: string) => {
    if (!confirm('確定要刪除這個年報嗎？')) return;

    try {
      const response = await dashboardAPI.annualReports.delete(id);
      if (response.success) {
        await loadReports();
        setSelectedReports((prev) =>
          prev.filter((reportId) => reportId !== id)
        );
      } else {
        throw new Error(response.error || '刪除失敗');
      }
    } catch (err) {
      console.error('Delete report error:', err);
      setError(err instanceof Error ? err.message : '刪除年報失敗');
    }
  };

  // 批量刪除
  const bulkDelete = async () => {
    if (selectedReports.length === 0) return;
    if (!confirm(`確定要刪除 ${selectedReports.length} 個年報嗎？`)) return;

    try {
      for (const id of selectedReports) {
        await dashboardAPI.annualReports.delete(id);
      }
      await loadReports();
      setSelectedReports([]);
    } catch (err) {
      console.error('Bulk delete error:', err);
      setError(err instanceof Error ? err.message : '批量刪除失敗');
    }
  };

  // 格式化檔案大小
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '未知';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // 編輯年報
  const handleEdit = (report: AnnualReport) => {
    setEditingReport(report);
    setShowEditModal(true);
  };

  if (isAuthLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          {/* 頁面標題和操作 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">年報管理</h1>
              <p className="text-gray-600 mt-1">管理和發布學院年度報告</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              新增年報
            </button>
          </div>

          {/* 錯誤提示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </motion.div>
          )}

          {/* 搜尋和批量操作 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="搜尋年報..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {selectedReports.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-gray-600">
                  已選擇 {selectedReports.length} 個年報
                </span>
                <button
                  onClick={bulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  批量刪除
                </button>
              </motion.div>
            )}
          </div>

          {/* 年報列表 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">載入中...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                還沒有年報
              </h3>
              <p className="text-gray-600">開始創建你的第一個年報吧</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedReports.length === filteredReports.length
                          }
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        年報資訊
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        檔案資訊
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        狀態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        發布日期
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedReports.includes(report.id)}
                            onChange={() => toggleSelect(report.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {report.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {report.year} 年度
                            </div>
                            {report.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {report.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {report.fileName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(report.fileSize)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleReportStatus(report.id)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              report.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {report.isActive ? '已發布' : '未發布'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(report.publishedAt).toLocaleDateString(
                            'zh-TW'
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            預覽
                          </a>
                          <button
                            onClick={() => handleEdit(report)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            刪除
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 統計資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">總年報數</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {reports.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已發布</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {reports.filter((r) => r.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-gray-600"
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
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">待發布</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {reports.filter((r) => !r.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* 創建年報模態框 */}
      <CreateReportModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadReports}
      />

      {/* 編輯年報模態框 */}
      {editingReport && (
        <EditReportModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingReport(null);
          }}
          onSuccess={loadReports}
          report={editingReport}
        />
      )}
    </>
  );
}

// 創建年報模態框組件
function CreateReportModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    fileUrl: '',
    fileName: '',
    fileSize: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await dashboardAPI.annualReports.create({
        year: formData.year,
        title: formData.title,
        titleEn: formData.titleEn || undefined,
        description: formData.description || undefined,
        descriptionEn: formData.descriptionEn || undefined,
        fileUrl: formData.fileUrl,
        fileName: formData.fileName,
        fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
        authorId: 'system',
        publishedAt: new Date(),
        isActive: true,
      });

      if (response.success) {
        onSuccess();
        onClose();
        setFormData({
          year: new Date().getFullYear(),
          title: '',
          titleEn: '',
          description: '',
          descriptionEn: '',
          fileUrl: '',
          fileName: '',
          fileSize: '',
        });
      } else {
        throw new Error(response.error || '創建失敗');
      }
    } catch (err) {
      console.error('Create report error:', err);
      setError(err instanceof Error ? err.message : '創建年報失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">新增年報</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                年度 *
              </label>
              <input
                type="number"
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                標題 *
              </label>
              <input
                type="text"
                required
                placeholder="例如：2023 年度報告"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                英文標題
              </label>
              <input
                type="text"
                placeholder="例如：2023 Annual Report"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                rows={3}
                placeholder="簡短描述這份年報的內容..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                英文描述
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of this annual report..."
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEn: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                檔案 URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/annual-report-2023.pdf"
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                檔案名稱 *
              </label>
              <input
                type="text"
                required
                placeholder="Annual-Report-2023.pdf"
                value={formData.fileName}
                onChange={(e) =>
                  setFormData({ ...formData, fileName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                檔案大小 (bytes)
              </label>
              <input
                type="number"
                placeholder="5242880"
                value={formData.fileSize}
                onChange={(e) =>
                  setFormData({ ...formData, fileSize: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '創建中...' : '創建年報'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// 編輯年報模態框組件
function EditReportModal({
  isOpen,
  onClose,
  onSuccess,
  report,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  report: AnnualReport;
}) {
  const [formData, setFormData] = useState({
    year: report.year,
    title: report.title,
    titleEn: report.titleEn || '',
    description: report.description || '',
    descriptionEn: report.descriptionEn || '',
    fileUrl: report.fileUrl,
    fileName: report.fileName,
    fileSize: report.fileSize?.toString() || '',
    isActive: report.isActive,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await dashboardAPI.annualReports.update(report.id, {
        year: formData.year,
        title: formData.title,
        titleEn: formData.titleEn || undefined,
        description: formData.description || undefined,
        descriptionEn: formData.descriptionEn || undefined,
        fileUrl: formData.fileUrl,
        fileName: formData.fileName,
        fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
        isActive: formData.isActive,
      });

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        throw new Error(response.error || '更新失敗');
      }
    } catch (err) {
      console.error('Update report error:', err);
      setError(err instanceof Error ? err.message : '更新年報失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">編輯年報</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                年度 *
              </label>
              <input
                type="number"
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                標題 *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                英文標題
              </label>
              <input
                type="text"
                placeholder="例如：2023 Annual Report"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                英文描述
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of this annual report..."
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEn: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                檔案 URL *
              </label>
              <input
                type="url"
                required
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                檔案名稱 *
              </label>
              <input
                type="text"
                required
                value={formData.fileName}
                onChange={(e) =>
                  setFormData({ ...formData, fileName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                檔案大小 (bytes)
              </label>
              <input
                type="number"
                value={formData.fileSize}
                onChange={(e) =>
                  setFormData({ ...formData, fileSize: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">啟用年報</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '更新中...' : '更新年報'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
