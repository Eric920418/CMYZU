import axios from 'axios';

// API 基礎 URL - 統一使用 Next.js API Routes
const API_BASE_URL = '/api';

// 建立 axios 實例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：自動添加認證 token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器：處理錯誤和登出
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 如果是 401 錯誤，只是記錄，不自動清除 token
    // 讓 AuthContext 來處理認證狀態的管理
    if (error.response?.status === 401) {
      console.warn('API 認證失敗:', error.config?.url);
    }

    // 顯示錯誤訊息（前端顯示所有錯誤）
    const errorMessage =
      error.response?.data?.error || error.message || '發生未知錯誤';

    // 如果是開發環境，在控制台顯示詳細錯誤
    if (process.env.NODE_ENV === 'development') {
      console.error('API 錯誤:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
        details: error.response?.data?.details,
      });
    }

    return Promise.reject({
      ...error,
      message: errorMessage,
      details: error.response?.data?.details,
    });
  }
);

// API 方法
export const authAPI = {
  // 登入
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),

  // 獲取當前用戶
  getCurrentUser: () => apiClient.get('/auth/me'),

  // 變更密碼
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/auth/change-password', data),

  // 登出
  logout: () => apiClient.post('/auth/logout'),
};

export const usersAPI = {
  // 獲取用戶列表
  getUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) => apiClient.get('/users', { params }),

  // 獲取特定用戶
  getUser: (id: string) => apiClient.get(`/users/${id}`),

  // 更新用戶
  updateUser: (
    id: string,
    data: {
      name?: string;
      image?: string;
      role?: 'ADMIN' | 'TEACHER' | 'STUDENT';
      active?: boolean;
    }
  ) => apiClient.put(`/users/${id}`, data),

  // 刪除用戶
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
};

export const postsAPI = {
  // 獲取文章列表
  getPosts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    featured?: boolean;
    published?: boolean;
    author?: string;
  }) => apiClient.get('/posts', { params }),

  // 獲取特定文章
  getPost: (id: string) => apiClient.get(`/posts/${id}`),

  // 建立文章
  createPost: (data: {
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    featured?: boolean;
    published?: boolean;
    categoryId?: string;
    tagIds?: string[];
  }) => apiClient.post('/posts', data),

  // 更新文章
  updatePost: (
    id: string,
    data: Partial<{
      title: string;
      content: string;
      excerpt: string;
      slug: string;
      featured: boolean;
      published: boolean;
      categoryId: string;
      tagIds: string[];
    }>
  ) => apiClient.put(`/posts/${id}`, data),

  // 刪除文章
  deletePost: (id: string) => apiClient.delete(`/posts/${id}`),
};

// 健康檢查
export const healthCheck = () => apiClient.get('/health');

// JWT 驗證函數 - 供後端 API 路由使用
export async function verifyJWT(request: Request) {
  try {
    // 動態導入 jwt，避免在客戶端執行
    const jwt = await import('jsonwebtoken');

    // 檢查是否可以使用 Prisma
    let prisma;
    try {
      const prismaModule = await import('@/lib/prisma');
      prisma = prismaModule.prisma;
    } catch {
      // 如果 Prisma 不可用，則使用文件存儲
      prisma = null;
    }

    // 從 Authorization header 獲取 token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return {
        success: false,
        error: '未提供認證令牌',
        status: 401,
      };
    }

    // 驗證 JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string; email: string };

    let user;

    if (prisma) {
      // 使用 Prisma 查找用戶
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      // 使用文件存儲查找用戶
      const userStorageModule = await import('@/lib/user-storage');
      const { findUserById, getSafeUserData } = userStorageModule;
      const userFromFile = await findUserById(decoded.userId);
      user = userFromFile ? getSafeUserData(userFromFile) : null;
    }

    if (!user || !user.active) {
      return {
        success: false,
        error: '無效的認證令牌',
        status: 401,
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('JWT 驗證錯誤:', error);

    return {
      success: false,
      error: '令牌驗證失敗',
      status: 403,
    };
  }
}
