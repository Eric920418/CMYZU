# CMYZU 學校官方網站

一個使用 Next.js 14 構建的現代化學校官方網站，支援多語系、SEO 優化、響應式設計和先進的內容管理功能。

## 📅 最新更新

### 🌐 2025-08-16 修復 Footer 組件國際化問題
修復頁尾組件中的硬編碼文字國際化問題：
- **國際化修復**：將頁尾描述文字改為使用翻譯函數 `t('description')`
- **翻譯新增**：在 messages/zh.json 和 messages/en.json 中新增 Footer.description 翻譯
- **多語系支援**：確保中英文用戶都能看到正確語言的頁尾描述
- **代碼標準化**：消除組件中最後的硬編碼中文文字

### 📊 2025-08-16 年度報告系統英文版支援
完成年度報告管理系統的完整英文版支援：
- **雙語編輯介面**：後台管理新增英文版標題和描述輸入欄位
- **資料庫擴展**：新增 titleEn、descriptionEn 欄位到 AnnualReport 模型
- **API 完整支援**：創建和更新 API 支援英文欄位的讀寫操作
- **前台多語系顯示**：前台年度報告根據語言設定智慧切換標題顯示
- **TypeScript 型別更新**：完整的介面定義支援新英文欄位
- **安全遷移**：使用 prisma db push 安全同步資料庫變更

### 🌐 2025-08-16 修復 MoreHighlightsSection 國際化問題
修復社群媒體區塊中的硬編碼文字：
- **國際化支援**：修復 "CMYZU 官方頻道" 硬編碼問題，支援多語系顯示
- **翻譯完善**：在 en.json 和 zh.json 中新增 official_channel 翻譯
- **代碼標準化**：消除組件中的硬編碼中文文字，提升代碼品質

### 🐛 2025-08-16 修復人才發展區塊標題顯示問題
修復桌面版標題需要重整頁面才顯示的問題：
- **簡化可見性邏輯**：移除複雜的 IntersectionObserver，標題在組件載入時直接顯示
- **強制內聯樣式**：添加內聯樣式確保動畫效果，避免CSS類名可能的問題  
- **根本問題解決**：標題應該立即顯示，不需要複雜的觀察器邏輯
- **用戶體驗改善**：消除標題需要重整頁面才顯示的問題

### 🌐 2025-08-16 前台 YouTube 影片多語系顯示修復
修復前台 MoreHighlightsSection 組件的多語系支援：
- **前台 API 更新**：YouTube API 新增 titleEn、descriptionEn 欄位輸出
- **多語系邏輯**：根據當前語言 (en/zh) 智慧切換標題和文字顯示
- **時間格式化**：上傳時間支援中英文格式 (1天前 / 1 day ago)
- **介面文字**：觀看次數、按鈕文字支援多語系
- **全局整合**：與現有語言切換工具完美整合

### 🎬 2025-08-16 YouTube 影片管理英文版支援
完成社群媒體管理頁面的 YouTube 影片英文版欄位：
- **雙語編輯介面**：新增英文版標題和英文版描述輸入框
- **資料庫擴展**：新增 titleEn、descriptionEn 欄位到 YouTubeVideo 模型
- **API 完整支援**：後台 API 支援英文欄位的讀寫操作
- **TypeScript 型別更新**：完整的介面定義支援新欄位
- **安全遷移**：使用 prisma db push 安全同步資料庫變更

### 👨‍🎓 2025-08-15 傑出校友系統英文版支援
完成傑出校友管理系統的完整英文版支援：
- **雙語編輯介面**：創建和編輯頁面支援中英文同時輸入
- **資料庫擴展**：新增 nameEn、positionEn、descriptionEn、achievementsEn 欄位
- **API 完整支援**：後台 API 支援英文欄位的讀寫操作
- **搜尋優化**：搜尋功能涵蓋中英文內容
- **TypeScript 型別更新**：完整的型別定義支援

### 🌐 2025-08-15 完整國際化系統實現
完成了全站完整的中英雙語系統，包含：
- **前台組件國際化**：所有組件支援中英文切換
- **後台管理雙語化**：編輯界面支援中英文內容同時管理
- **智慧內容切換**：英文版本為空時優雅回退到中文內容
- **API 層面完整支援**：資料庫和 API 全面支援雙語欄位

### 🎯 2025-08-15 AI 客服系統優化
新增學生問題管理後台功能：
- **對話管理**：完整的聊天記錄管理和搜尋功能
- **統計看板**：對話數據統計和分析
- **智慧篩選**：支援訊息類型篩選和關鍵字搜尋

### 🔧 2025-08-14 系統架構完善
- **排名系統英文支援**：完整的雙語排名管理和前台顯示
- **新聞系統升級**：支援中英文內容同時編輯和智慧顯示
- **即時動態重構**：完整的雙語系統和API整合
- **特色資源優化**：內容重寫和彈窗功能修復


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