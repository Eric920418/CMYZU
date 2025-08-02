'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

// 用戶類型定義
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  active: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// 認證狀態類型
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Context 類型
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: (skipErrorOnFail?: boolean) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  showError: (message: string, details?: any) => void;
  showSuccess: (message: string) => void;
}

// 建立 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 組件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // 顯示錯誤（前端顯示所有錯誤）
  const showError = (message: string, details?: any) => {
    console.error('認證錯誤:', message, details);

    // 在這裡可以添加 toast 通知或其他錯誤顯示邏輯
    // 暫時使用 alert，之後可以替換為更好的 UI
    if (typeof window !== 'undefined') {
      alert(`錯誤: ${message}`);
    }
  };

  // 顯示成功訊息
  const showSuccess = (message: string) => {
    console.log('操作成功:', message);

    // 暫時使用 alert，之後可以替換為更好的 UI
    if (typeof window !== 'undefined') {
      alert(`成功: ${message}`);
    }
  };

  // 設定認證狀態
  const setAuthData = (user: User | null, token: string | null) => {
    setAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: !!(user && token),
    });

    // 儲存到 localStorage
    if (typeof window !== 'undefined') {
      if (user && token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  };

  // 登入
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data.data;
      setAuthData(user, token);
    } catch (error: any) {
      showError(error.message || '登入失敗', error.details);
      throw error;
    }
  };

  // 變更密碼
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword,
      });
      showSuccess(response.data.message || '密碼變更成功');
    } catch (error: any) {
      showError(error.message || '密碼變更失敗', error.details);
      throw error;
    }
  };

  // 登出
  const logout = () => {
    try {
      // 呼叫後端登出 API（不等待響應）
      authAPI.logout().catch(() => {
        // 即使後端失敗也繼續登出
      });
    } catch (error) {
      // 忽略登出 API 錯誤
    } finally {
      setAuthData(null, null);
    }
  };

  // 刷新用戶資料
  const refreshUser = async (skipErrorOnFail = false) => {
    try {
      const response = await authAPI.getCurrentUser();
      const { user } = response.data.data;
      setAuthData(user, authState.token);
    } catch (error: any) {
      // 如果是跳過錯誤模式（例如語言切換時），不清除認證狀態
      if (skipErrorOnFail) {
        console.warn('無法刷新用戶資料，但保持登錄狀態:', error.message);
        return;
      }

      // 如果無法獲取用戶資料，清除認證狀態
      setAuthData(null, null);
      showError(error.message || '無法獲取用戶資料', error.details);
    }
  };

  // 初始化認證狀態
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === 'undefined') {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setAuthData(user, token);

          // 靜默驗證 token 是否仍然有效，失敗時不登出
          await refreshUser(true);
        } catch (error) {
          // 如果資料無效，清除儲存
          setAuthData(null, null);
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshUser,
    changePassword,
    showError,
    showSuccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook 來使用 Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必須在 AuthProvider 內部使用');
  }
  return context;
};
