'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: string;
}

interface ChatConversation {
  id: string;
  sessionId?: string;
  userId?: string;
  title?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

/**
 * 學生問題管理頁面
 * 收集和展示學生透過 AI 客服聊天提出的問題
 */
export default function StudentQuestionsPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversation | null>(null);
  const [filterRole, setFilterRole] = useState<'ALL' | 'USER' | 'ASSISTANT'>(
    'USER'
  );
  const [searchTerm, setSearchTerm] = useState('');

  // 載入聊天對話資料
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/chat-conversations');
      if (!response.ok) throw new Error('載入對話失敗');
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  // 篩選訊息
  const getFilteredMessages = (messages: ChatMessage[]) => {
    if (filterRole === 'ALL') return messages;
    return messages.filter((msg) => msg.role === filterRole);
  };

  // 搜尋對話
  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true;
    return conv.messages.some((msg) =>
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 格式化時間
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 統計資料
  const stats = {
    totalConversations: conversations.length,
    totalMessages: conversations.reduce(
      (sum, conv) => sum + conv.messages.length,
      0
    ),
    userQuestions: conversations.reduce(
      (sum, conv) =>
        sum + conv.messages.filter((msg) => msg.role === 'USER').length,
      0
    ),
    activeConversations: conversations.filter((conv) => conv.isActive).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium">載入錯誤</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={loadConversations}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          重新載入
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 頁面標題 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">學生問題管理</h1>
          <p className="text-gray-600 mt-2">
            收集並管理學生透過 AI 客服聊天提出的問題和對話記錄
          </p>
        </motion.div>

        {/* 統計卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">總對話數</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalConversations}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">總訊息數</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.totalMessages}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">學生問題</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {stats.userQuestions}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">活躍對話</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.activeConversations}
            </p>
          </div>
        </motion.div>

        {/* 搜尋和篩選工具 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                搜尋對話內容
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋問題關鍵字..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                篩選訊息類型
              </label>
              <select
                id="filter"
                value={filterRole}
                onChange={(e) =>
                  setFilterRole(e.target.value as 'ALL' | 'USER' | 'ASSISTANT')
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">全部訊息</option>
                <option value="USER">學生問題</option>
                <option value="ASSISTANT">AI 回覆</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* 對話列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* 對話列表 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">對話列表</h3>
              <p className="text-sm text-gray-600">
                共 {filteredConversations.length} 個對話
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm
                    ? '沒有找到符合搜尋條件的對話'
                    : '目前沒有任何對話記錄'}
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {conversation.title ||
                            `對話 ${conversation.id.slice(0, 8)}`}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {conversation.messages.length} 條訊息
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(conversation.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {conversation.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            活躍
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            已結束
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 對話詳情 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">對話內容</h3>
              {selectedConversation && (
                <p className="text-sm text-gray-600">
                  {selectedConversation.title ||
                    `對話 ${selectedConversation.id.slice(0, 8)}`}
                </p>
              )}
            </div>
            <div className="p-4">
              {!selectedConversation ? (
                <div className="text-center text-gray-500 py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p>選擇一個對話以查看詳細內容</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredMessages(selectedConversation.messages).map(
                    (message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'USER'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.role === 'USER'
                                ? 'text-blue-200'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
