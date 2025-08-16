// 後台管理系統的資料類型定義

// 統計數據類型
export interface Stat {
  id: string;
  label: string;
  icon: string; // SVG 字符串
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatsDescription {
  id: string;
  content: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 新聞類型 - 支援中英雙語系
export interface News {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // 完整內容
  // 英文欄位
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  date: Date;
  imageUrl: string; // 後台 API 使用 imageUrl
  image?: string; // 前台相容欄位
  published: boolean; // 與 Prisma 模型一致
  order: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// 即時動態類型（獨立資料表）- 支援中英雙語系
export interface LiveUpdate {
  id: string;
  title: string;
  content: string; // 即時動態內容
  // 英文欄位
  titleEn?: string;
  contentEn?: string;
  date: Date;
  isPublished: boolean;
  order: number;
  priority: 'low' | 'medium' | 'high'; // 重要程度
  tags?: string[]; // 標籤
  createdAt: Date;
  updatedAt: Date;
}

// 特色資源類型 (支援中英雙語系)
export interface FeaturedResource {
  id: string;
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
  image: string;
  category: string;
  categoryEn?: string;
  backgroundColor: string; // Tailwind class
  textColor: string; // Tailwind class
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// 排名類型 - 支援中英雙語系
export interface Ranking {
  id: string;
  rank: string; // #1, #2 等
  category: string;
  subtitle?: string;
  description?: string;
  organization: string;
  // 英文欄位
  categoryEn?: string;
  subtitleEn?: string;
  descriptionEn?: string;
  organizationEn?: string;
  logoUrl?: string;
  logoAlt?: string;
  year: number;
  isActive: boolean;
  order: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 校友統計數據
export interface AlumniStat {
  label: string;
  value: string;
  icon: string; // emoji 或 icon class
}

// 校友詳細內容
export interface AlumniDetailContent {
  fullTitle: string;
  overview: string;
  achievements: string[];
  impact: string;
}

// 傑出校友類型
export interface Alumni {
  id: string;
  name: string; // 姓名
  position: string; // 職位
  description: string;
  // 英文欄位
  nameEn?: string;
  positionEn?: string;
  descriptionEn?: string;
  achievementsEn: string[];

  imageUrl?: string;
  achievements: string[];
  isActive: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  // 前端使用的相容屬性
  title?: string;
  image?: string;
  stats?: AlumniStat[];
  detailContent?: AlumniDetailContent;
  order?: number;
}

// YouTube 影片類型
export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: Date;
  channel: string;
  videoId?: string; // YouTube video ID
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Instagram 貼文類型
export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  postDate: Date;
  isVideo: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// 主視覺內容類型
export interface HeroContent {
  id: string;
  locale: string; // 語言 ('zh' | 'en')
  titlePrefix: string; // YZU 小標
  titleMain: string; // 主標題
  subtitle: string; // 副標題
  backgroundImage?: string; // 背景圖片 URL
  gradientFrom: string; // 漸層起始色 (默認: amber-600)
  gradientTo: string; // 漸層結束色 (默認: white)
  glassEffect: boolean; // 是否顯示玻璃幕牆效果
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 年報管理類型 - 支援中英雙語系
export interface AnnualReport {
  id: string;
  year: number; // 年度 (e.g., 2023)
  title: string; // 顯示標題 (e.g., "2023年報")
  titleEn?: string; // 英文版標題
  description?: string; // 描述文字
  descriptionEn?: string; // 英文版描述
  fileUrl: string; // 年報檔案 URL
  fileName: string; // 原始檔名
  fileSize?: number; // 檔案大小 (bytes)
  isActive: boolean; // 是否啟用
  publishedAt: Date; // 發布時間
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 電子報訂閱類型
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  source?: string; // 訂閱來源
}

// 管理員用戶類型
export interface DashboardUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 系統設定類型
export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: Date;
}

// API 響應類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    totalItems: number;
  };
}

// 分頁請求參數
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// 批量操作類型
export interface BulkAction {
  action: 'activate' | 'deactivate' | 'delete' | 'reorder';
  ids: string[];
  data?: Record<string, any>;
}

// 檔案上傳類型
export interface FileUpload {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// 教師部落格文章類型
export interface TeacherPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // TipTap JSON content
  published: boolean;
  featured: boolean;
  views: number;
  tags: string[];
  category?: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 教師個人頁面設定類型
export interface TeacherProfile {
  id: string;
  userId: string;
  displayName: string;
  slug: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  showContact: boolean;
  showResearch: boolean;
  showPosts: boolean;
  email?: string;
  phone?: string;
  office?: string;
  researchAreas: string[];
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
