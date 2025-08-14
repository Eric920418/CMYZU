'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// 統計數據類型定義
interface StatsData {
  title: string;
  descriptionPart1: string;
  descriptionPart2: string;
  descriptionPart3: string;
  descriptionPart4: string;
  stat1: string;
  stat2: string;
  stat3: string;
  stat4: string;
}

// StatsSection 編輯頁面
export default function StatsEditPage() {
  // 狀態管理
  const [title, setTitle] = useState('');
  const [descriptionParts, setDescriptionParts] = useState(['', '', '', '']);
  const [stats, setStats] = useState(['', '', '', '']);
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

        // 更新狀態
        setTitle(data.title);
        setDescriptionParts([
          data.descriptionPart1,
          data.descriptionPart2,
          data.descriptionPart3,
          data.descriptionPart4,
        ]);
        setStats([data.stat1, data.stat2, data.stat3, data.stat4]);
      } catch (error) {
        console.error('載入統計數據失敗:', error);
        setMessage('載入統計數據失敗，請重新整理頁面。');
      } finally {
        setIsFetching(false);
      }
    };

    fetchStats();
  }, []);

  // 更新描述段落
  const updateDescriptionPart = (index: number, value: string) => {
    const newParts = [...descriptionParts];
    newParts[index] = value;
    setDescriptionParts(newParts);
  };

  // 更新統計標語
  const updateStat = (index: number, value: string) => {
    const newStats = [...stats];
    newStats[index] = value;
    setStats(newStats);
  };

  // 儲存變更
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const requestData = {
        title,
        descriptionPart1: descriptionParts[0],
        descriptionPart2: descriptionParts[1],
        descriptionPart3: descriptionParts[2],
        descriptionPart4: descriptionParts[3],
        stat1: stats[0],
        stat2: stats[1],
        stat3: stats[2],
        stat4: stats[3],
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
            編輯統計數據區塊
          </h1>

          {/* 訊息顯示 */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {message}
            </div>
          )}

          <div className="space-y-6">
            {/* 標題編輯 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                區塊標題
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="請輸入標題"
              />
            </div>

            {/* 描述段落編輯 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述內容（共4段）
              </label>
              <div className="space-y-3">
                {descriptionParts.map((part, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-500 mb-1">
                      第 {index + 1} 段
                    </label>
                    <textarea
                      value={part}
                      onChange={(e) =>
                        updateDescriptionPart(index, e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      placeholder={`請輸入第 ${index + 1} 段內容`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 統計標語編輯 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                統計標語（共4個）
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-500 mb-1">
                      標語 {index + 1}
                    </label>
                    <input
                      type="text"
                      value={stat}
                      onChange={(e) => updateStat(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={`請輸入標語 ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 預覽區域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                預覽效果
              </label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-xl font-bold text-primary-700 mb-4 text-center">
                  {title}
                </h3>
                <div className="text-sm text-gray-600 space-y-2 mb-4">
                  {descriptionParts.map((part, index) => (
                    <p key={index} className="text-center">
                      {part}
                    </p>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
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

            {/* 操作按鈕 */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // 重設為預設值
                  setTitle('國際化商管教育領航者');
                  setDescriptionParts([
                    '為幫助學生銜接國際職場，我們積極建構國際化環境，國際學生比例超過10%，並持續成長。',
                    '與歐美、亞洲及大陸地區的海外學校積極建立合作關係，擴展雙聯學位、銜接學位及交換學生等，',
                    '目前已擁有超過100所以上的國外合作學校，知名學校包含:美國密西根大學、美國明尼蘇達大學、英國艾賽克斯大學、英國諾丁漢特倫特大學、法國雷恩商學院、德國佛茨海姆大學及澳洲昆士蘭大學等，',
                    '遍佈全球近30個國家，多達千位以上學生具備國外交流經驗。',
                  ]);
                  setStats([
                    '北台灣唯一英語標竿學院',
                    '企業最愛EMBA',
                    '隨意highlight',
                    '隨意highlight',
                  ]);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                重設
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '儲存中...' : '儲存變更'}
              </button>
            </div>
          </div>

          {/* 說明文字 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-white">
              <strong>提示：</strong> 統計數據已連接資料庫，儲存後將立即生效。
              變更會即時反映在首頁的統計數據區塊中。
            </p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
