'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

/**
 * AI聊天客服主組件 - 整合浮動按鈕與聊天視窗
 * 在後台頁面（dashboard）中不顯示
 */
export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // 在後台頁面（dashboard）中不顯示聊天功能
  if (pathname.includes('/dashboard')) {
    return null;
  }

  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isOpen} unreadCount={0} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
