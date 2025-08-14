# CMYZU 學校官方網站

一個使用 Next.js 14 構建的現代化學校官方網站，支援多語系、SEO 優化、響應式設計和先進的內容管理功能。

## 📅 更新記錄

### 2025-08-13 修復統計數據編輯頁面儲存功能
#### 🔧 核心問題解決：
- **資料庫架構設計**：新增 `StatsContent` 資料表來儲存統計數據區塊內容
- **真實儲存功能**：將原本模擬的儲存功能改為真正的資料庫操作
- **API 路由建立**：
  - `src/app/api/dashboard/stats/route.ts`：管理端 CRUD 操作
  - `src/app/api/stats/route.ts`：前台資料讀取 API
- **前端整合更新**：
  - `src/app/[locale]/dashboard/stats/page.tsx`：編輯頁面支援真實資料載入與儲存
  - `src/components/layout/StatsSection.tsx`：首頁組件從 API 動態載入資料
- **資料庫遷移**：執行 Prisma 遷移，確保新資料表正確建立
- **API 錯誤修復**：修復 `updatedAt` 欄位缺少預設值導致的 500 錯誤
- **即時生效**：編輯後的統計數據會立即反映在首頁顯示

### 2025-08-12 世界地圖管理頁面 UX 大幅優化
#### 🌍 全方位使用者體驗改善：
- **表單結構重設計**：分區塊顯示基本資訊、交流資訊、地理位置，清晰易用
- **自動座標查詢系統**：整合 OpenStreetMap Nominatim API，支援學校名稱自動查詢座標
- **智慧國家旗幟**：自動根據查詢結果填入對應國家旗幟 emoji
- **即時表單驗證**：即時錯誤提示、欄位高亮顯示、成功訊息回饋
- **拖拽排序功能**：使用 @dnd-kit 實現直觀的學校順序管理
- **響應式設計優化**：完整的手機版佈局適配，觸控友好操作
- **新增套件**：
  - `@dnd-kit/core`、`@dnd-kit/sortable`、`@dnd-kit/utilities`：拖拽排序
- **文件位置**：
  - 主頁面：`src/app/[locale]/dashboard/worldmap/page.tsx`
  - 地理編碼服務：`src/lib/geocoding.ts`

### 2025-08-12 聊天按鈕後台隱藏功能
#### 🎯 UI/UX 優化：
- **後台聊天按鈕隱藏**：在後台頁面（dashboard）中不顯示 AI 聊天客服按鈕
- **路徑檢測邏輯**：使用 `usePathname` 檢測當前路徑，當路徑包含 `/dashboard` 時自動隱藏聊天功能
- **使用者體驗提升**：避免後台管理介面與客服聊天功能衝突
- **文件位置**：`src/components/chat/ChatSupport.tsx:21-23`

### 2025-08-11 完整社群媒體整合系統
#### 📱 真實 Instagram API 整合：
- **Facebook Graph API oEmbed**：使用官方 Facebook Graph API v19.0 進行 Instagram 貼文嵌入
- **環境變數安全配置**：支援 FACEBOOK_APP_ID 和 FACEBOOK_CLIENT_TOKEN 環境變數設定
- **雙重 API 架構**：單一貼文嵌入 (`/api/instagram-embed`) 和批量貼文獲取 (`/api/instagram-posts`)
- **前台自動展示**：`MoreHighlightsSection` 組件自動抓取真實 Instagram 貼文資料
- **後台簡化管理**：後台專注於 YouTube 影片管理，Instagram 內容自動同步
- **錯誤處理機制**：完整的錯誤處理和回退機制
- **文件位置**：
  - 後台：`src/app/[locale]/dashboard/social-media/page.tsx`
  - API：`src/app/api/instagram-embed/route.ts`, `src/app/api/instagram-posts/route.ts`
  - 前台：`src/components/layout/MoreHighlightsSection.tsx`

### 2025-08-11 README 文件清理與優化
#### 📝 文件結構優化：
- **移除重複內容**：清理同日期多個小修復的重複記錄
- **合併相關功能**：整合散落的功能描述和技術說明
- **移除過時信息**：刪除2024年開發過程記錄，保留核心功能說明
- **精簡結構**：優化章節布局，突出重要功能和最新更新
- **保留核心**：維持重要的技術棧、環境設定和部署指南

### 2025-08-11 新增 StatsSection 後台編輯功能
#### 🚀 核心功能：
- **後台編輯介面**：可編輯統計數據區塊的標題、描述內容、統計標語
- **實時預覽**：編輯時即時顯示修改效果
- **表單驗證**：確保內容完整性，支援重設功能
- **文件位置**：`src/app/[locale]/dashboard/stats/page.tsx`
- **後台路徑**：`/dashboard/stats`
- **注意事項**：目前為展示版本，實際儲存需要後端API支持

### 2025-08-11 修復管理員權限顯示錯誤
#### 🐛 權限控制修復：
- **DashboardLayout 權限邏輯修正**：修正管理員錯誤顯示教師專用選項的問題
- **角色權限控制**：明確區分教師角色(TEACHER)和管理員角色(ADMIN)的選單權限
- **文件位置**：`src/components/dashboard/DashboardLayout.tsx:299-306`

### 2025-08-10 實作教師部落格管理系統
#### 🚀 新功能：
- **教師個人資料管理**：支援顯示名稱、個人簡介、頭像、封面圖、社群連結
- **部落格文章 CRUD**：使用 TipTap 富文本編輯器，支援草稿/發布狀態
- **前台展示頁面**：每位教師有獨立的 SEO 友善 URL (`/teacher/[teacher-slug]`)
- **API 架構**：完整的前後台分離架構，支援權限控制
- **資料庫擴展**：新增 `TeacherPost` 和 `TeacherProfile` 模型

### 2025-08-10 實現AI聊天客服功能
#### 🤖 AI客服系統：
- **智慧對話**：整合 OpenAI GPT-4o-mini，定制元智大學客服 prompt
- **資料持久化**：所有聊天記錄存入資料庫，支援匿名對話
- **響應式設計**：支援桌面版和手機版不同佈局
- **用戶體驗**：浮動聊天按鈕、打字指示器、完整錯誤處理
- **技術架構**：新增 `ChatConversation` 和 `ChatMessage` 模型

### 2025-08-10 系統架構完善
#### 🔧 重要修復：
- **認證系統優化**：修復架構不一致和多語系問題
- **校友管理同步**：修復前後台資料同步問題  
- **全球合作地圖**：新增後台管理系統，支援地點標記和編輯
- **排名管理系統**：完成後台操作區塊，支援大學排名資料管理

### 2025-08-09 前端體驗優化
#### ✨ 界面改進：
- **LiveUpdatesSection**：修復無限請求循環問題
- **NewsSection**：解決 TitleSection 組件閃爍問題
- **TypeScript 優化**：大量類型錯誤修復和型別一致性改進
- **ESLint 整合**：程式碼品質問題修復，建立開發規範

## 🚀 技術棧

### 全棧架構
- **框架**：Next.js 14 + TypeScript + App Router
- **前端**：React 18 + Tailwind CSS + Framer Motion
- **後端**：Next.js API Routes + PostgreSQL + Prisma ORM
- **資料庫**：PostgreSQL 16 + Prisma Client
- **認證**：JWT + bcrypt + 角色權限系統 (ADMIN/TEACHER/STUDENT)
- **多語系**：next-intl v4 + i18n 路由
- **開發工具**：ESLint + Prettier + Husky + commitlint

## 📋 核心功能

### ✅ 已完成功能
- **完整後台管理**：用戶管理、內容管理、權限控制
- **教師部落格系統**：個人資料管理、文章發布、前台展示
- **AI 智慧客服**：OpenAI 整合、對話持久化、多語系支援
- **多語系支援**：中英文完整切換、SEO 優化、自動偵測
- **響應式設計**：RWD Layout、手機/平板/桌面完整支援
- **內容管理**：新聞系統、即時動態、特色資源、排名管理
- **資料持久化**：PostgreSQL 完整整合、Prisma ORM

### 🔄 進行中功能
- **進階 SEO**：Schema.org 結構化資料、GA4 分析整合
- **統計系統後端**：StatsSection 編輯功能資料庫整合

## 🛠️ 開發指令

### 基礎開發
```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建置專案
pnpm build

# 程式碼檢查
pnpm lint

# 型別檢查
pnpm typecheck
```

### 資料庫管理
```bash
# 生成 Prisma Client
pnpm db:generate

# 推送資料庫 Schema 變更
pnpm db:push

# 執行種子資料腳本
pnpm db:seed

# 重設資料庫
pnpm db:reset
```

## 📁 專案結構

```
├── src/                   # Next.js 全棧應用
│   ├── app/
│   │   ├── [locale]/     # 多語系路由
│   │   ├── api/          # API 路由 (後端邏輯)
│   │   └── globals.css   # 全域樣式
│   ├── components/       # React 組件
│   │   ├── layout/       # Layout 組件
│   │   ├── dashboard/    # 後台組件
│   │   └── chat/         # AI 聊天組件
│   ├── contexts/        # React Context 狀態管理
│   ├── lib/
│   │   ├── prisma.ts     # Prisma 客戶端配置
│   │   └── api.ts        # API 工具函數
│   ├── types/           # TypeScript 型別定義
│   └── hooks/           # 自定義 Hooks
├── prisma/             # Prisma 資料庫配置
│   ├── schema.prisma   # 資料庫 Schema
│   └── migrations/     # 資料庫遷移檔案
├── messages/           # 多語系訊息檔
└── public/            # 靜態資源
```

## 🌐 多語系支援

網站支援中文 (zh) 和英文 (en) 兩種語言：

- **根路由**：`http://localhost:3000` → 自動重定向到 `/zh`
- **中文版**：`http://localhost:3000/zh`
- **英文版**：`http://localhost:3000/en`

### 技術實作
- **next-intl v4**：最新版本的國際化框架
- **動態路由**：`[locale]` 段落自動處理語言切換
- **中間件**：自動語言偵測與重定向
- **SEO 優化**：每種語言獨立的 meta tags 和 hreflang 標籤

## 🗄️ 資料庫模型

### 主要資料表
- **Users**：使用者管理 (ADMIN/TEACHER/STUDENT 角色權限)
- **News**：新聞文章管理 (標題、內容、摘要、圖片、發布狀態)
- **LiveUpdate**：即時動態管理 (優先級、標籤、發布狀態)
- **TeacherPost**：教師部落格文章 (TipTap 內容、草稿/發布狀態)
- **TeacherProfile**：教師個人資料 (社群連結、研究領域)
- **ChatConversation/ChatMessage**：AI 客服對話記錄

### 資料庫特色
- **關聯性設計**：完整的外鍵關係和資料完整性
- **角色權限**：三級角色系統，支援細粒度權限控制
- **優先級系統**：支援 LOW/MEDIUM/HIGH/URGENT 四級優先級
- **時間戳記**：自動管理 createdAt 和 updatedAt

## 🔧 環境設定

複製 `.env.example` 為 `.env` 並設定相關環境變數：

```bash
cp .env.example .env
```

### 主要環境變數
- **DATABASE_URL**：PostgreSQL 連線字串
- **NEXTAUTH_SECRET**：認證密鑰
- **NEXT_PUBLIC_BASE_URL**：網站基礎 URL
- **OPENAI_API_KEY**：OpenAI API 金鑰 (AI 客服功能)
- **NEXT_PUBLIC_GA_MEASUREMENT_ID**：Google Analytics 追蹤 ID

### 快速啟動
```bash
# 1. 安裝依賴
pnpm install

# 2. 生成 Prisma Client
pnpm db:generate

# 3. 啟動開發伺服器
pnpm dev
```

## 🚀 部署

專案可部署至任何支援 Node.js 的平台：
- **Vercel** (推薦) - 零配置部署
- **Railway** - 全端應用部署
- **自架伺服器** - Docker + Nginx 配置

### 生產環境檢查清單
- [ ] 設定正確的 `NEXT_PUBLIC_BASE_URL`
- [ ] 配置 PostgreSQL 資料庫連線
- [ ] 設定環境變數安全管理
- [ ] 啟用 SSL 憑證

## 📝 開發規範

- **Commit 格式**：使用 Conventional Commits
- **程式碼風格**：遵循 ESLint + Prettier 規則
- **Git Hooks**：自動執行 lint 與格式化
- **TypeScript**：嚴格型別檢查
- **組件註解**：所有新組件均包含中文註解說明

---