'use client';

import { useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
  unreadCount?: number;
}

/**
 * 浮動聊天按鈕組件 - 固定在右下角
 */
export default function ChatButton({
  onClick,
  isOpen,
  unreadCount = 0,
}: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* 未讀訊息提示 */}
      {unreadCount > 0 && !isOpen && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-lg z-10">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}

      {/* 主按鈕 */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-14 h-14 rounded-full shadow-lg 
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? 'bg-red-500 hover:bg-red-600 hover:scale-105'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
          }
          text-white flex items-center justify-center
          border-2 border-white
          cursor-pointer
          transform hover:shadow-xl
          active:scale-95
        `}
        style={{ zIndex: 9999 }}
      >
        <div
          className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        >
          {isOpen ? (
            // 關閉按鈕（X）
            <div className="w-6 h-6 flex items-center justify-center relative">
              <div className="w-4 h-0.5 bg-white transform rotate-45 absolute" />
              <div className="w-4 h-0.5 bg-white transform -rotate-45 absolute" />
            </div>
          ) : (
            // 聊天圖標
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          )}
        </div>
      </button>

      {/* Hover 提示文字 */}
      {isHovered && !isOpen && (
        <div className="absolute -top-14 right-0 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-[10000] opacity-90 animate-in fade-in duration-200 min-w-max">
          有問題嗎？點擊開始對話
          {/* 箭頭 */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
}
