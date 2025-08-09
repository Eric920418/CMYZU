// 後台管理系統 API 客戶端
import {
  News,
  LiveUpdate,
  FeaturedResource,
  Ranking,
  Alumni,
  YoutubeVideo,
  InstagramPost,
  HeroContent,
  AnnualReport,
  Stat,
  StatsDescription,
  NewsletterSubscriber,
  ApiResponse,
  PaginationParams,
  BulkAction,
} from '@/types/dashboard';

// 基礎 API 客戶端類
class DashboardAPI {
  private baseURL = '/api/dashboard';

  // 通用請求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // 獲取認證 token
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null;

      // 建立標頭物件
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // 如果有 token 則添加認證標頭
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        // 如果是 401 未授權錯誤，清除本地認證資料並導向登入頁面
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/zh/login';
          }
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // 通用 CRUD 方法
  private createCRUDMethods<T extends { id: string }>(endpoint: string) {
    return {
      // 獲取列表
      list: async (params?: PaginationParams): Promise<ApiResponse<T[]>> => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
              searchParams.append(key, String(value));
            }
          });
        }
        const query = searchParams.toString();
        return this.request<T[]>(`${endpoint}${query ? `?${query}` : ''}`);
      },

      // 獲取單個項目
      get: async (id: string): Promise<ApiResponse<T>> => {
        return this.request<T>(`${endpoint}/${id}`);
      },

      // 創建
      create: async (
        data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
      ): Promise<ApiResponse<T>> => {
        return this.request<T>(endpoint, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },

      // 更新
      update: async (id: string, data: Partial<T>): Promise<ApiResponse<T>> => {
        return this.request<T>(`${endpoint}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },

      // 刪除
      delete: async (id: string): Promise<ApiResponse<void>> => {
        return this.request<void>(`${endpoint}/${id}`, {
          method: 'DELETE',
        });
      },

      // 批量操作
      bulk: async (action: BulkAction): Promise<ApiResponse<void>> => {
        return this.request<void>(`${endpoint}/bulk`, {
          method: 'POST',
          body: JSON.stringify(action),
        });
      },

      // 重新排序
      reorder: async (
        items: { id: string; order: number }[]
      ): Promise<ApiResponse<void>> => {
        return this.request<void>(`${endpoint}/reorder`, {
          method: 'POST',
          body: JSON.stringify({ items }),
        });
      },

      // PATCH 操作（狀態切換）
      patch: async (id: string, data: Partial<T>): Promise<ApiResponse<T>> => {
        return this.request<T>(`${endpoint}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      },

      // 批量操作別名
      bulkAction: async (action: BulkAction): Promise<ApiResponse<void>> => {
        return this.request<void>(`${endpoint}`, {
          method: 'DELETE',
          body: JSON.stringify(action),
        });
      },
    };
  }

  // 統計數據 API
  stats = this.createCRUDMethods<Stat>('/stats');
  statsDescriptions = this.createCRUDMethods<StatsDescription>(
    '/stats-descriptions'
  );

  // 新聞 API
  news = this.createCRUDMethods<News>('/news');

  // 即時動態 API
  liveUpdates = this.createCRUDMethods<LiveUpdate>('/live-updates');

  // 特色資源 API
  featuredResources = this.createCRUDMethods<FeaturedResource>(
    '/featured-resources'
  );

  // 排名 API
  rankings = this.createCRUDMethods<Ranking>('/rankings');

  // 校友 API
  alumni = this.createCRUDMethods<Alumni>('/alumni');

  // YouTube 影片 API
  youtubeVideos = this.createCRUDMethods<YoutubeVideo>('/youtube-videos');

  // Instagram 貼文 API
  instagramPosts = this.createCRUDMethods<InstagramPost>('/instagram-posts');

  // 主視覺內容 API
  heroContent = this.createCRUDMethods<HeroContent>('/hero');

  // 年報管理 API
  annualReports = this.createCRUDMethods<AnnualReport>('/annual-reports');

  // 電子報訂閱 API（只讀）
  newsletterSubscribers = {
    list: async (
      params?: PaginationParams
    ): Promise<ApiResponse<NewsletterSubscriber[]>> => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }
      const query = searchParams.toString();
      return this.request<NewsletterSubscriber[]>(
        `/newsletter-subscribers${query ? `?${query}` : ''}`
      );
    },

    export: async (
      format: 'csv' | 'xlsx'
    ): Promise<ApiResponse<{ url: string }>> => {
      return this.request<{ url: string }>(
        `/newsletter-subscribers/export?format=${format}`
      );
    },
  };

  // 檔案上傳 API
  upload = {
    image: async (
      file: File,
      category?: string
    ): Promise<ApiResponse<{ url: string }>> => {
      const formData = new FormData();
      formData.append('file', file);
      if (category) {
        formData.append('category', category);
      }

      return this.request<{ url: string }>('/upload/image', {
        method: 'POST',
        body: formData,
        headers: {}, // 移除 Content-Type，讓瀏覽器自動設置
      });
    },

    document: async (file: File): Promise<ApiResponse<{ url: string }>> => {
      const formData = new FormData();
      formData.append('file', file);

      return this.request<{ url: string }>('/upload/document', {
        method: 'POST',
        body: formData,
        headers: {},
      });
    },
  };

  // 儀表板統計 API
  dashboard = {
    stats: async (): Promise<
      ApiResponse<{
        totalNews: number;
        totalAlumni: number;
        totalSubscribers: number;
        monthlyViews: number;
        recentActivity: Array<{
          id: string;
          type: string;
          action: string;
          timestamp: Date;
          user?: string;
        }>;
      }>
    > => {
      return this.request('/dashboard/stats');
    },
  };

  // 系統設定 API
  settings = {
    get: async (): Promise<ApiResponse<Record<string, string>>> => {
      return this.request('/settings');
    },

    update: async (
      settings: Record<string, string>
    ): Promise<ApiResponse<void>> => {
      return this.request('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    },
  };

  // 認證 API
  auth = {
    login: async (credentials: {
      username: string;
      password: string;
    }): Promise<ApiResponse<{ token: string }>> => {
      return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },

    logout: async (): Promise<ApiResponse<void>> => {
      return this.request('/auth/logout', {
        method: 'POST',
      });
    },

    me: async (): Promise<
      ApiResponse<{ id: string; username: string; role: string }>
    > => {
      return this.request('/auth/me');
    },
  };
}

// 導出單例實例
export const dashboardAPI = new DashboardAPI();

// 錯誤處理工具
export class DashboardAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'DashboardAPIError';
  }
}

// React Query 用的 key 生成器
export const dashboardQueryKeys = {
  stats: ['stats'] as const,
  statsDescriptions: ['statsDescriptions'] as const,
  news: (params?: PaginationParams) => ['news', params] as const,
  liveUpdates: (params?: PaginationParams) => ['liveUpdates', params] as const,
  featuredResources: (params?: PaginationParams) =>
    ['featuredResources', params] as const,
  rankings: (params?: PaginationParams) => ['rankings', params] as const,
  alumni: (params?: PaginationParams) => ['alumni', params] as const,
  youtubeVideos: (params?: PaginationParams) =>
    ['youtubeVideos', params] as const,
  instagramPosts: (params?: PaginationParams) =>
    ['instagramPosts', params] as const,
  heroContent: (params?: PaginationParams) => ['heroContent', params] as const,
  annualReports: (params?: PaginationParams) =>
    ['annualReports', params] as const,
  newsletterSubscribers: (params?: PaginationParams) =>
    ['newsletterSubscribers', params] as const,
  dashboardStats: ['dashboardStats'] as const,
  settings: ['settings'] as const,
};
