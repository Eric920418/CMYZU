pnpm exec eslint . --ext .ts,.tsx

# CMYZU 學校官方網站

一個使用 Next.js 14 構建的現代化學校官方網站，支援多語系、SEO 優化、響應式設計和先進的內容管理功能。

## 🚀 技術棧

- **前端**: Next.js 14 + TypeScript + App Router
- **樣式**: Tailwind CSS + PostCSS + Autoprefixer + 自託管字體 (Noto Sans/Serif)
- **多語系**: next-intl v4 + i18n 路由
- **資料庫**: PostgreSQL + Prisma ORM
- **開發工具**: ESLint + Prettier + Husky + commitlint
- **部署**: Docker + Nginx (已配置)

## 📋 功能特色

### ✅ 已完成功能

- **基礎架構**: Next.js 14 專案結構與完整 DevOps 配置
- **響應式設計**: RWD Layout、Header/Footer 組件，支援手機/平板/桌面
- **多語系支援**: 完整的中文/英文切換系統 (next-intl v4)
  - 路由: `/zh` (中文) 和 `/en` (英文)
  - 自動語言偵測與重定向
  - 動態內容翻譯 (Header、Footer、頁面內容)
- **資料庫整合**: PostgreSQL + Prisma ORM，支援完整的內容管理
- **程式碼品質**: ESLint + Prettier + Husky Git hooks + commitlint 規範
- **CSS 工具鏈**: Tailwind CSS + PostCSS + Autoprefixer 完整配置
- **字體優化**: 自託管 Noto Sans/Serif 字體，支援中英文顯示
- **SEO 基礎**: 完整 meta tags、Open Graph、Twitter Card、多語系 hreflang

### 🔄 進行中功能

- **多語系 Hydration 優化**: 修正 SSR/CSR 內容同步問題

### 📝 計劃功能

- **內容管理系統**: 教師會員系統、文章/橫幅/跑馬燈 CRUD
- **進階 SEO**: Schema.org 結構化資料、GA4 分析整合
- **AI 智慧客服**: OpenAI GPT-4o 聊天機器人
- **社群整合**: Instagram Graph API 自動同步貼文
- **電子報系統**: 訂閱管理與 EDM 群發功能
- **LINE 整合**: LINE Messaging API 即時客服
- **視差動畫**: 高效能視差滾動與動畫效果

## 🛠️ 開發指令

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

# 資料庫相關
pnpm db:generate  # 生成 Prisma client
pnpm db:push      # 推送 schema 變更
pnpm db:migrate   # 執行資料庫遷移
pnpm db:studio    # 開啟 Prisma Studio


pnpm exec eslint . --ext .ts,.tsx
```

## 📁 專案結構

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── [locale]/       # 多語系路由
│   │   └── globals.css     # 全域樣式
│   ├── components/         # React 組件
│   │   └── layout/        # Layout 組件
│   ├── lib/               # 工具函式
│   ├── types/             # TypeScript 型別定義
│   └── utils/             # 通用工具
├── messages/              # 多語系訊息檔
├── prisma/               # 資料庫 schema
└── public/               # 靜態資源
```

## 🌐 多語系

網站支援中文 (zh) 和英文 (en) 兩種語言：

- **根路由**: `http://localhost:3000` → 自動重定向到 `/zh`
- **中文版**: `http://localhost:3000/zh`
- **英文版**: `http://localhost:3000/en`

### 多語系技術實作

- **next-intl v4**: 最新版本的國際化框架
- **動態路由**: `[locale]` 段落自動處理語言切換
- **中間件**: 自動語言偵測與重定向
- **SSR 支援**: 伺服器端渲染多語系內容
- **SEO 優化**: 每種語言獨立的 meta tags 和 hreflang 標籤

## 🗄️ 資料庫模型

主要資料表包括：

- **Users**: 使用者管理 (管理員/教師/學生)
- **Posts**: 文章內容管理
- **Categories**: 文章分類
- **Tags**: 標籤系統
- **Banners**: 首頁輪播橫幅
- **Marquees**: 跑馬燈公告
- **Navigation**: 動態選單
- **Translations**: 多語系翻譯

## 🔧 環境設定

複製 `.env.example` 為 `.env` 並設定相關環境變數：

```bash
cp .env.example .env
```

### 主要環境變數說明：

- **DATABASE_URL**: PostgreSQL 連線字串
- **NEXTAUTH_SECRET**: 認證密鑰 (建議使用隨機字串)
- **NEXT_PUBLIC_BASE_URL**: 網站基礎 URL (生產環境需修改)
- **OPENAI_API_KEY**: OpenAI API 金鑰 (AI 客服功能)
- **NEXT_PUBLIC_GA_MEASUREMENT_ID**: Google Analytics 追蹤 ID
- **RESEND_API_KEY**: 電子報發送服務 API
- **INSTAGRAM_ACCESS_TOKEN**: Instagram Graph API 存取權杖

### 開發環境快速啟動：

```bash
# 1. 安裝依賴
pnpm install

# 2. 生成 Prisma Client
pnpm db:generate

# 3. 啟動開發伺服器
pnpm dev
```

## 🎨 2024-07-31 新增現代化首頁設計

### 新增的元件與功能：

- **Hero 區塊** (`src/components/layout/Hero.tsx`)
  - 全屏互動式主視覺區域
  - 漸層背景與動畫裝飾元素
  - 响應式按鈕與微互動效果
  - Framer Motion 動畫效果

- **統計數據展示** (`src/components/layout/StatsSection.tsx`)
  - 學校成就數據視覺化呈現
  - 藍色漸層背景與白色數字
  - 滑鼠懸停效果與動畫

- **學校特色介紹** (`src/components/layout/FeaturesSection.tsx`)
  - 4大核心特色展示卡片
  - 各張卡片獨特漸層背景色彩
  - 懸停互動與細緻動畫

- **最新消息區塊** (`src/components/layout/NewsSection.tsx`)
  - 模擬新聞內容展示
  - 分類標籤與時間顯示
  - 卡片式布局與懸停效果

### 樣式與設計優化：

- **Tailwind CSS 配置優化** (`tailwind.config.ts`)
  - 新增 accent 色彩系統
  - 詳細的主色與次要色配置
  - 中文註解說明

- **全域樣式優化** (`src/app/globals.css`)
  - 按鈕樣式升級：漸層背景、陰影效果、hover 動畫
  - 新增 line-clamp 工具類別
  - 卡片樣式現代化

### 多語系支援擴展：

- **中文翻譯** (`messages/zh.json`)
  - 新增 HomePage、Stats、Features、News 所有文字
  - 校園特色與成就介紹內容

- **英文翻譯** (`messages/en.json`)
  - 對應中文內容的英文版本
  - 符合國際化標準的教育術語

### 技術亮點：

- **响應式設計**: 支援手機、平板、桌電全尺寸
- **動畫效果**: 使用 Framer Motion 實現流暢動畫
- **SEO 優化**: 語意化 HTML 結構與 meta 標籤
- **效能優化**: 懶加載、圖片優化、CSS 模組化

### 使用者體驗提升：

- **視覺層次**: 明確的信息架構與版面布局
- **互動回饋**: 豐富的 hover 效果與點擊回饋
- **色彩系統**: 統一的品牌色彩與視覺識別
- **內容結構**: 清晰的信息層次與導航結構

## 📝 開發規範

- **Commit 格式**: 使用 Conventional Commits
- **程式碼風格**: 遵循 ESLint + Prettier 規則
- **Git Hooks**: 自動執行 lint 與格式化
- **TypeScript**: 嚴格型別檢查
- **組件註解**: 所有新組件均包含中文註解說明

## 🎯 已完成的重要功能

### 1. 完整的開發環境配置

- ✅ Next.js 14 + TypeScript + App Router 架構
- ✅ Tailwind CSS + PostCSS + Autoprefixer 樣式工具鏈
- ✅ ESLint + Prettier + Husky Git hooks 程式碼品質控制
- ✅ Commitlint 規範化 Git 提交訊息

### 2. 多語系國際化系統

- ✅ next-intl v4 最新版本整合
- ✅ 動態路由 `/zh` 和 `/en` 自動切換
- ✅ 中間件自動語言偵測與重定向
- ✅ Header/Footer/內容完整翻譯支援
- ✅ SEO 友善的多語系 meta tags

### 3. 資料庫與內容管理準備

- ✅ PostgreSQL + Prisma ORM 完整設定
- ✅ 使用者、文章、分類、標籤等完整資料模型
- ✅ Banner、跑馬燈、導航選單資料結構
- ✅ 多語系翻譯表設計

### 4. 響應式前端界面

- ✅ RWD Header 導航列 (支援手機選單)
- ✅ RWD Footer 頁尾 (多欄位連結布局)
- ✅ 自託管 Noto Sans/Serif 字體優化
- ✅ 品牌色彩系統與動畫效果準備

### 5. SEO 與效能優化基礎

- ✅ 完整的 meta tags、Open Graph、Twitter Card
- ✅ 多語系 hreflang 標籤
- ✅ 語義化 HTML 結構
- ✅ 圖片格式優化 (WebP/AVIF)
- ✅ 字體預載入與顯示優化

## 🚀 部署

專案可部署至任何支援 Node.js 的平台：

- **Vercel** (推薦) - 零配置部署
- **Netlify** - 靜態站點託管
- **Railway** - 全端應用部署
- **自架伺服器** - Docker + Nginx 配置

### 生產環境檢查清單：

- [ ] 設定正確的 `NEXT_PUBLIC_BASE_URL`
- [ ] 配置 PostgreSQL 資料庫連線
- [ ] 設定 CDN 加速靜態資源
- [ ] 啟用 SSL 憑證
- [ ] 配置環境變數安全管理

## 📋 更新記錄

### 2025-07-31 - ESLint 錯誤修復

**修復項目：**

- ✅ 移除 `Header.tsx` 中未使用的 `cn` 工具函數 import
- ✅ 移除 `NewsSection.tsx` 中未使用的 `Image` 組件 import
- ✅ 修復 `layout.tsx` 中的 `any` 類型，改用明確的 `Record<string, unknown>` 類型
- ✅ 修復 `i18n.ts` 中的 `any` 類型，改用聯合類型 `'zh' | 'en'`
- ✅ 修復 `utils.ts` 中 `debounce` 和 `throttle` 函數的 `any[]` 參數類型，改用 `unknown[]`

**技術改進：**

- 提高 TypeScript 類型安全性
- 消除所有 ESLint 錯誤和警告
- 維持程式碼一致性和可維護性
