'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import {
  UserIcon,
  ComputerDesktopIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useChat } from '@/hooks/useChat';
import { useState } from 'react';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 聊天視窗組件 - 有sticky效果跟隨滑動
 */
export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    loadChatHistory,
    clearError,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自動滾動到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 視窗打開時聚焦輸入框
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // 載入歷史對話
  useEffect(() => {
    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen, loadChatHistory]);

  // 發送訊息處理
  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    setInputValue('');
    await sendMessage(message);
  };

  // 處理鍵盤事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 格式化時間
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 初始歡迎訊息
  const welcomeMessage = messages.length === 0 && (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ComputerDesktopIcon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        元智大學 AI 客服
      </h3>
      <p className="text-gray-600 text-sm">
        您好！我是元智大學的AI助手，
        <br />
        有什麼關於學校的問題需要幫助嗎？
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 (僅在手機版) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* 聊天視窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200
              bottom-24 right-6 w-96 h-[32rem]
              md:bottom-24 md:right-6 md:w-96 md:h-[32rem]
              max-md:bottom-0 max-md:right-0 max-md:w-full max-md:h-[90vh] max-md:rounded-none max-md:rounded-t-lg
              flex flex-col overflow-hidden
            `}
          >
            {/* 標題列 */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <ComputerDesktopIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">元智大學 AI 客服</h3>
                  <p className="text-xs text-blue-100">線上為您服務</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              >
                <div className="w-4 h-0.5 bg-white transform rotate-45 absolute" />
                <div className="w-4 h-0.5 bg-white transform -rotate-45 absolute" />
              </button>
            </div>

            {/* 錯誤提示 */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 mx-4 my-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircleIcon className="w-4 h-4 text-red-400 mr-2" />
                    <div className="text-sm text-red-700">{error.message}</div>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-400 hover:text-red-600 ml-2"
                  >
                    <div className="w-4 h-0.5 bg-current transform rotate-45 absolute" />
                    <div className="w-4 h-0.5 bg-current transform -rotate-45 absolute" />
                  </button>
                </div>
                <div className="text-xs text-red-600 mt-1">
                  錯誤類型: {error.type}
                </div>
              </div>
            )}

            {/* 訊息區域 */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
              {welcomeMessage}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex space-x-2 max-w-[80%] ${message.role === 'USER' ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    {/* 頭像 */}
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                      ${
                        message.role === 'USER'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}
                    >
                      {message.role === 'USER' ? (
                        <UserIcon className="w-4 h-4" />
                      ) : (
                        <ComputerDesktopIcon className="w-4 h-4" />
                      )}
                    </div>

                    {/* 訊息泡泡 */}
                    <div
                      className={`
                      px-3 py-2 rounded-lg text-sm
                      ${
                        message.role === 'USER'
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }
                    `}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div
                        className={`
                        text-xs mt-1 
                        ${message.role === 'USER' ? 'text-blue-100' : 'text-gray-500'}
                      `}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 載入指示器 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <ComputerDesktopIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 輸入區域 */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="輸入您的問題..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                AI 可能會產生錯誤資訊，建議您查證重要資訊
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
