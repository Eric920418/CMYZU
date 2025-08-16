'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAnnualReports } from '@/hooks/useAnnualReports';

// 電子報專區 - 用戶電子郵件訂閱功能
export default function NewsletterSection() {
  const t = useTranslations('Newsletter');
  const locale = useLocale(); // 獲取當前語言
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  // 載入年報資料
  const {
    reports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useAnnualReports();

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 簡單的電子郵件格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('請輸入有效的電子郵件地址');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 後續整合後端 API 處理電子報訂閱
      // 目前先模擬提交成功
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubscribed(true);
      setEmail('');

      // 3秒後重置狀態
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    } catch (err) {
      setError('訂閱失敗，請稍後再試');
      console.error('Newsletter subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full">
      <div className="w-full">
        {/* 電子報與年報專區容器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* 背景裝飾容器 - 整合設計 */}
          <div className="relative bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-blue-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 overflow-hidden">
            {/* 簡化裝飾性背景元素 */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-lg"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-400/20 to-transparent rounded-full blur-lg"></div>

            {/* 內容區域 */}
            <div className="relative z-10 text-center">
              {/* 緊湊標題區 - 移除大圖標，改用內聯小圖標 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-2 mb-3"
              >
                <svg
                  className="w-5 h-5 text-amber-400"
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
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {t('title', { defaultValue: '電子報專區' })}
                </h2>
              </motion.div>

              {/* 簡化描述文字 */}
              <motion.p
                className="text-sm sm:text-base text-primary-100 mb-4 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                {t('description', {
                  defaultValue: '訂閱獲得最新消息與重要公告',
                })}
              </motion.p>

              {/* 緊湊型訂閱表單 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {!isSubscribed ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
                  >
                    <div className="relative flex-1 w-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('placeholder', {
                          defaultValue: '請輸入電子郵件',
                        })}
                        className="w-full px-3 py-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 text-sm"
                        required
                      />
                      {/* 內聯小圖標 */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-4 h-4 text-white/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-md text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>訂閱中...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          <span>
                            {t('subscribe', { defaultValue: '訂閱' })}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* 緊湊型訂閱成功狀態 */
                  <div className="flex items-center justify-center gap-2 text-green-300 max-w-md mx-auto">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">
                      {t('success', { defaultValue: '訂閱成功！' })}
                    </span>
                  </div>
                )}

                {/* 錯誤訊息 */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-2.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs max-w-md mx-auto"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>

              {/* 簡化隱私聲明 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-3 text-xs text-primary-200/80 max-w-md mx-auto"
              >
                {t('privacy', {
                  defaultValue: '尊重隱私，可隨時取消',
                })}
              </motion.div>

              {/* 分隔線 */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-6 mb-6 flex items-center"
              >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="mx-4 text-xs text-white/60">
                  {t('or', { defaultValue: '或' })}
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </motion.div>

              {/* 年報下載區域 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                {/* 年報下載標題 */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">
                    {t('annualReport.title', { defaultValue: '年報下載' })}
                  </h3>
                </div>

                {/* 年報描述 */}
                <p className="text-xs sm:text-sm text-primary-100/90 mb-4 max-w-lg mx-auto">
                  {t('annualReport.description', {
                    defaultValue: '下載最新年報，了解學院發展成果與未來規劃',
                  })}
                </p>

                {/* 年報下載按鈕 - 動態載入 */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                  {reportsLoading ? (
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/70"></div>
                      載入年報中...
                    </div>
                  ) : reportsError ? (
                    <div className="text-red-300 text-sm">載入年報失敗</div>
                  ) : reports.length === 0 ? (
                    <div className="text-white/70 text-sm">
                      暫無可下載的年報
                    </div>
                  ) : (
                    reports.map((report, index) => {
                      // 根據索引選擇不同的漸層顏色
                      const gradientClasses = [
                        'from-blue-500/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-600',
                        'from-indigo-500/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-600',
                        'from-purple-500/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-600',
                        'from-pink-500/80 to-red-600/80 hover:from-pink-500 hover:to-red-600',
                        'from-green-500/80 to-teal-600/80 hover:from-green-500 hover:to-teal-600',
                      ];

                      return (
                        <a
                          key={report.id}
                          href={report.fileUrl}
                          download={report.fileName}
                          className={`group px-3 py-2 bg-gradient-to-r ${
                            gradientClasses[index % gradientClasses.length]
                          } text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center`}
                          onClick={() => {
                            console.log(`Downloading ${report.title}`);
                          }}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>
                            {/* 多語言標題顯示邏輯：英文優先顯示英文標題，中文顯示中文標題 */}
                            {locale === 'en' && report.titleEn
                              ? report.titleEn
                              : report.title}
                          </span>
                        </a>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
