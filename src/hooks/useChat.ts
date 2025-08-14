'use client';

import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: Date;
}

export interface ChatError {
  message: string;
  code?: string;
  type: 'API_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR';
}

/**
 * 聊天功能 hook - 提供完整的聊天狀態管理和錯誤處理
 */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // 清除錯誤
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 載入對話歷史
  const loadChatHistory = useCallback(async () => {
    try {
      clearError();

      const params = new URLSearchParams();
      if (conversationId) {
        params.append('conversationId', conversationId);
      } else {
        params.append('sessionId', sessionId);
      }

      const response = await fetch(`/api/chat?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.messages) {
        setMessages(
          data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (err) {
      console.error('載入對話歷史失敗:', err);
      const errorMessage =
        err instanceof Error ? err.message : '載入對話歷史失敗';
      setError({
        message: errorMessage,
        type: 'API_ERROR',
      });
    }
  }, [conversationId, sessionId, clearError]);

  // 發送訊息
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'USER',
        content: content.trim(),
        timestamp: new Date(),
      };

      // 立即顯示用戶訊息
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      clearError();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content.trim(),
            conversationId,
            sessionId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // 根據不同的錯誤狀態碼提供更詳細的錯誤訊息
          let errorMessage = errorData.error || '發送訊息失敗';

          switch (response.status) {
            case 400:
              errorMessage = errorData.error || '請求格式不正確';
              break;
            case 401:
              errorMessage = 'API 認證失敗，請聯繫管理員';
              break;
            case 429:
              errorMessage = '請求過於頻繁，請稍等一下再試';
              break;
            case 500:
              errorMessage = errorData.error || '伺服器內部錯誤';
              break;
            default:
              errorMessage = `網路錯誤 (${response.status}): ${errorData.error || '請稍後再試'}`;
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.message) {
          throw new Error('未收到AI回應');
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ASSISTANT',
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
      } catch (err) {
        console.error('發送訊息錯誤:', err);

        let errorMessage: string;

        if (err instanceof Error) {
          errorMessage = err.message;

          // 根據錯誤訊息判斷錯誤類型
          if (err.message.includes('fetch')) {
            errorMessage = '網路連線問題，請檢查您的網路連線';
          }
        } else {
          errorMessage = '發生未知錯誤，請稍後再試';
        }

        setError({
          message: errorMessage,
          type: errorType,
        });

        // 顯示錯誤訊息給用戶
        const errorResponseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ASSISTANT',
          content: `⚠️ 系統錯誤：${errorMessage}`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorResponseMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, conversationId, sessionId, clearError]
  );

  // 重置對話
  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    clearError();
  }, [clearError]);

  return {
    messages,
    isLoading,
    error,
    conversationId,
    sessionId,
    sendMessage,
    loadChatHistory,
    clearError,
    resetChat,
  };
}
