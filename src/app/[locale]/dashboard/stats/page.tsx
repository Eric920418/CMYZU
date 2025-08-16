'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTranslations } from 'next-intl';

// 統計數據類型定義（支援多語系）
interface StatsData {
  // 中文內容
  titleZh: string;
  descriptionPart1Zh: string;
  descriptionPart2Zh: string;
  descriptionPart3Zh: string;
  descriptionPart4Zh: string;
  stat1Zh: string;
  stat2Zh: string;
  stat3Zh: string;
  stat4Zh: string;
  // 英文內容
  titleEn: string;
  descriptionPart1En: string;
  descriptionPart2En: string;
  descriptionPart3En: string;
  descriptionPart4En: string;
  stat1En: string;
  stat2En: string;
  stat3En: string;
  stat4En: string;
}

// StatsSection 編輯頁面（支援多語系）
export default function StatsEditPage() {
  const t = useTranslations('StatsEditPage');

  // 狀態管理 - 中文內容
  const [titleZh, setTitleZh] = useState('');
  const [descriptionPartsZh, setDescriptionPartsZh] = useState([
    '',
    '',
    '',
    '',
  ]);
  const [statsZh, setStatsZh] = useState(['', '', '', '']);

  // 狀態管理 - 英文內容
  const [titleEn, setTitleEn] = useState('');
  const [descriptionPartsEn, setDescriptionPartsEn] = useState([
    '',
    '',
    '',
    '',
  ]);
  const [statsEn, setStatsEn] = useState(['', '', '', '']);

  // 其他狀態
  const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState('');

  // 載入統計數據
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsFetching(true);
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('載入統計數據失敗');
        }

        const data: StatsData = await response.json();

        // 更新中文狀態
        setTitleZh(data.titleZh);
        setDescriptionPartsZh([
          data.descriptionPart1Zh,
          data.descriptionPart2Zh,
          data.descriptionPart3Zh,
          data.descriptionPart4Zh,
        ]);
        setStatsZh([data.stat1Zh, data.stat2Zh, data.stat3Zh, data.stat4Zh]);

        // 更新英文狀態
        setTitleEn(data.titleEn);
        setDescriptionPartsEn([
          data.descriptionPart1En,
          data.descriptionPart2En,
          data.descriptionPart3En,
          data.descriptionPart4En,
        ]);
        setStatsEn([data.stat1En, data.stat2En, data.stat3En, data.stat4En]);
      } catch (error) {
        console.error('載入統計數據失敗:', error);
        setMessage('載入統計數據失敗，請重新整理頁面。');
      } finally {
        setIsFetching(false);
      }
    };

    fetchStats();
  }, []);

  // 更新中文描述段落
  const updateDescriptionPartZh = (index: number, value: string) => {
    const newParts = [...descriptionPartsZh];
    newParts[index] = value;
    setDescriptionPartsZh(newParts);
  };

  // 更新英文描述段落
  const updateDescriptionPartEn = (index: number, value: string) => {
    const newParts = [...descriptionPartsEn];
    newParts[index] = value;
    setDescriptionPartsEn(newParts);
  };

  // 更新中文統計標語
  const updateStatZh = (index: number, value: string) => {
    const newStats = [...statsZh];
    newStats[index] = value;
    setStatsZh(newStats);
  };

  // 更新英文統計標語
  const updateStatEn = (index: number, value: string) => {
    const newStats = [...statsEn];
    newStats[index] = value;
    setStatsEn(newStats);
  };

  // 儲存變更
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const requestData = {
        // 中文內容
        titleZh,
        descriptionPart1Zh: descriptionPartsZh[0],
        descriptionPart2Zh: descriptionPartsZh[1],
        descriptionPart3Zh: descriptionPartsZh[2],
        descriptionPart4Zh: descriptionPartsZh[3],
        stat1Zh: statsZh[0],
        stat2Zh: statsZh[1],
        stat3Zh: statsZh[2],
        stat4Zh: statsZh[3],
        // 英文內容
        titleEn,
        descriptionPart1En: descriptionPartsEn[0],
        descriptionPart2En: descriptionPartsEn[1],
        descriptionPart3En: descriptionPartsEn[2],
        descriptionPart4En: descriptionPartsEn[3],
        stat1En: statsEn[0],
        stat2En: statsEn[1],
        stat3En: statsEn[2],
        stat4En: statsEn[3],
      };

      const response = await fetch('/api/dashboard/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('儲存失敗');
      }

      await response.json();
      setMessage('儲存成功！統計數據已更新。');

      // 清除訊息
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('儲存統計數據失敗:', error);
      setMessage('儲存失敗，請重試。');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 載入中顯示
  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">載入統計數據中...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            編輯統計數據區塊（多語系）
          </h1>

          {/* 訊息顯示 */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {message}
            </div>
          )}

          {/* 語言切換標籤 */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('zh')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'zh'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              中文內容
            </button>
            <button
              onClick={() => setActiveTab('en')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'en'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              English Content
            </button>
          </div>

          <div className="space-y-6">
            {/* 中文內容編輯 */}
            {activeTab === 'zh' && (
              <>
                {/* 中文標題編輯 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文標題
                  </label>
                  <input
                    type="text"
                    value={titleZh}
                    onChange={(e) => setTitleZh(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="請輸入中文標題"
                  />
                </div>

                {/* 中文描述段落編輯 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文描述內容（共4段）
                  </label>
                  <div className="space-y-3">
                    {descriptionPartsZh.map((part, index) => (
                      <div key={index}>
                        <label className="block text-xs text-gray-500 mb-1">
                          第 {index + 1} 段
                        </label>
                        <textarea
                          value={part}
                          onChange={(e) =>
                            updateDescriptionPartZh(index, e.target.value)
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                          placeholder={`請輸入第 ${index + 1} 段中文內容`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 中文統計標語編輯 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文統計標語（共4個）
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {statsZh.map((stat, index) => (
                      <div key={index}>
                        <label className="block text-xs text-gray-500 mb-1">
                          標語 {index + 1}
                        </label>
                        <input
                          type="text"
                          value={stat}
                          onChange={(e) => updateStatZh(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder={`請輸入標語 ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 中文預覽區域 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文預覽效果
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-xl font-bold text-primary-700 mb-4 text-center">
                      {titleZh}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-2 mb-4">
                      {descriptionPartsZh.map((part, index) => (
                        <p key={index} className="text-center">
                          {part}
                        </p>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {statsZh.map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <div className="w-6 h-6 bg-primary-500 rounded-full"></div>
                          </div>
                          <div className="text-xs font-medium text-gray-700">
                            {stat}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 英文內容編輯 */}
            {activeTab === 'en' && (
              <>
                {/* 英文標題編輯 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Title
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter English title"
                  />
                </div>

                {/* 英文描述段落編輯 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Description Content (4 paragraphs)
                  </label>
                  <div className="space-y-3">
                    {descriptionPartsEn.map((part, index) => (
                      <div key={index}>
                        <label className="block text-xs text-gray-500 mb-1">
                          Paragraph {index + 1}
                        </label>
                        <textarea
                          value={part}
                          onChange={(e) =>
                            updateDescriptionPartEn(index, e.target.value)
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                          placeholder={`Enter paragraph ${index + 1} content in English`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 英文統計標語編輯 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Statistics Labels (4 items)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {statsEn.map((stat, index) => (
                      <div key={index}>
                        <label className="block text-xs text-gray-500 mb-1">
                          Label {index + 1}
                        </label>
                        <input
                          type="text"
                          value={stat}
                          onChange={(e) => updateStatEn(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder={`Enter label ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 英文預覽區域 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Preview
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-xl font-bold text-primary-700 mb-4 text-center">
                      {titleEn}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-2 mb-4">
                      {descriptionPartsEn.map((part, index) => (
                        <p key={index} className="text-center">
                          {part}
                        </p>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {statsEn.map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <div className="w-6 h-6 bg-primary-500 rounded-full"></div>
                          </div>
                          <div className="text-xs font-medium text-gray-700">
                            {stat}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 操作按鈕 */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // 重設為預設值
                  if (activeTab === 'zh') {
                    setTitleZh('國際化商管教育領航者');
                    setDescriptionPartsZh([
                      '為幫助學生銜接國際職場，我們積極建構國際化環境，國際學生比例超過10%，並持續成長。',
                      '與歐美、亞洲及大陸地區的海外學校積極建立合作關係，擴展雙聯學位、銜接學位及交換學生等，',
                      '目前已擁有超過100所以上的國外合作學校，知名學校包含:美國密西根大學、美國明尼蘇達大學、英國艾賽克斯大學、英國諾丁漢特倫特大學、法國雷恩商學院、德國佛茨海姆大學及澳洲昆士蘭大學等，',
                      '遍佈全球近30個國家，多達千位以上學生具備國外交流經驗。',
                    ]);
                    setStatsZh([
                      '北台灣唯一英語標竿學院',
                      '企業最愛EMBA',
                      '隨意highlight',
                      '隨意highlight',
                    ]);
                  } else {
                    setTitleEn('Global Business Education Leader');
                    setDescriptionPartsEn([
                      'To help students connect with the international workplace, we actively build an international environment with over 10% international students and growing.',
                      'We actively establish partnerships with overseas schools in Europe, America, Asia, and mainland China, expanding dual degrees, bridging degrees, and exchange student programs.',
                      'Currently we have partnerships with over 100 international schools, including prestigious institutions like University of Michigan, University of Minnesota, University of Essex, Nottingham Trent University, ESC Rennes Business School, Pforzheim University, and University of Queensland.',
                      'Spanning nearly 30 countries worldwide, with over a thousand students having international exchange experience.',
                    ]);
                    setStatsEn([
                      'Only English Benchmark College in Northern Taiwan',
                      'Most Popular EMBA by Enterprises',
                      'Featured Highlight',
                      'Featured Highlight',
                    ]);
                  }
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                重設{activeTab === 'en' ? ' / Reset' : ''}
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? '儲存中... / Saving...'
                  : '儲存變更 / Save Changes'}
              </button>
            </div>
          </div>

          {/* 說明文字 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>提示：</strong>{' '}
              統計數據已連接資料庫並支援中英雙語系，儲存後將立即生效。
              變更會即時反映在首頁的統計數據區塊中，並根據用戶選擇的語言自動顯示對應內容。
            </p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
