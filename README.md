# CMYZU 學校官方網站

一個使用 Next.js 14 構建的現代化學校官方網站，支援多語系、SEO 優化、響應式設計和先進的內容管理功能。

## 🚀 技術棧

### 前端 (Next.js)
- **框架**: Next.js 14 + TypeScript + App Router
- **樣式**: Tailwind CSS + PostCSS + Autoprefixer + 自託管字體 (Noto Sans/Serif)
- **多語系**: next-intl v4 + i18n 路由
- **狀態管理**: React Context + SWR 數據獲取
- **HTTP 客戶端**: Axios
- **開發工具**: ESLint + Prettier + Husky + commitlint

### 後端 (Node.js)
- **框架**: Express + TypeScript
- **資料庫**: PostgreSQL + Prisma ORM
- **認證**: JWT + bcrypt
- **安全**: Helmet + CORS + Rate Limiting
- **開發工具**: Nodemon + ts-node

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

### 前端指令
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

### 後端指令
```bash
# 切換到後端目錄
cd backend

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建置專案
pnpm build

# 生產環境啟動
pnpm start

# 資料庫相關
pnpm db:generate  # 生成 Prisma client
pnpm db:push      # 推送 schema 變更
pnpm db:migrate   # 執行資料庫遷移
pnpm db:studio    # 開啟 Prisma Studio
```

## 📁 專案結構

```
├── src/                   # 前端 Next.js
│   ├── app/
│   │   ├── [locale]/     # 多語系路由
│   │   └── globals.css   # 全域樣式
│   ├── components/       # React 組件
│   │   └── layout/      # Layout 組件
│   ├── contexts/        # React Context 狀態管理
│   ├── lib/
│   │   └── api.ts       # API 客戶端配置
│   ├── types/           # TypeScript 型別定義
│   └── utils/           # 通用工具
├── backend/             # 獨立後端專案
│   ├── src/
│   │   ├── routes/      # API 路由
│   │   ├── middleware/  # 中介軟體
│   │   └── server.ts    # Express 伺服器
│   ├── prisma/         # 資料庫 schema
│   └── package.json    # 後端依賴管理
├── messages/           # 多語系訊息檔
└── public/            # 靜態資源
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

### 2025-08-03 - StatsSection 數字計數動畫完全重構（最新）

**核心邏輯重新設計：**
- **靜態顯示模式**：頁面載入時顯示靜態的最終值（50+、10,000+、500+、95%）
- **單次觸發動畫**：只有滑動到該區塊時才觸發一次計數動畫
- **動畫完成後保持**：動畫結束後保持最終值，不再重複觸發

**技術實作：**
- 使用 `hasTriggered` 狀態確保動畫永遠只執行一次
- 使用 `isAnimating` 狀態防止動畫重疊
- 使用 `displayValue` 管理實際顯示的數字
- Observer 加入 `hasTriggered` 檢查，避免重複監聽

**動畫流程：**
1. **初始狀態**：顯示最終值（如 "50+ 年辦學歷史"）
2. **滑到區塊**：觸發動畫，數字從 0 計數到 50
3. **動畫完成**：保持 50+，Observer 停止監聽
4. **之後滑動**：不再觸發任何動畫，始終顯示 50+

**檔案異動：**
- 重構：`src/hooks/useCountAnimation.ts` - 完全重新設計動畫觸發邏輯

### 2025-08-03 - StatsSection 數字計數動畫功能修復與優化

**問題修復：**
- **重複觸發問題**：修復數字動畫會不斷重複觸發的 bug
- **無限循環問題**：解決 Observer 依賴導致的 useEffect 無限循環
- **類型錯誤修復**：修正 HTMLElement 與 HTMLDivElement 的 ref 類型衝突

**動畫效果改善：**
- **波浪式延遲**：每個統計項目延遲 150ms 開始動畫，創造波浪效果
- **緩動函數優化**：改用 easeOutQuart 讓動畫更加流暢自然
- **視覺增強**：添加文字陰影、icon 旋轉、顏色漸變等互動效果
- **等寬數字**：使用 tabular-nums 確保數字跳動時版面穩定

**技術實作改進：**
- 使用 `hasAnimated` 狀態確保動畫只執行一次，避免重複觸發
- 動畫觸發後立即 disconnect Observer，節省資源
- 使用 useCallback 優化函數記憶化，防止不必要的重渲染
- 調整 threshold 為 0.5 和 rootMargin，改善觸發時機

**檔案異動：**
- 修改：`src/hooks/useCountAnimation.ts` - 完全重構，修復所有 bug
- 修改：`src/components/layout/StatsSection.tsx` - 優化動畫效果與互動
- 修改：`src/app/globals.css` - 新增文字陰影與等寬數字樣式

### 2025-08-03 - DepartmentsSection 打字效果滾動觸發修復

**核心問題修復：**
- **打字效果觸發時機**：修復打字效果沒有在滾動到區塊時觸發的問題  
- **CSS 動畫邏輯**：解決動畫 delay 在初始狀態就開始計時的問題

**技術實作：**
1. **動畫觸發控制**：
   - 新增 `showTypewriter` state 獨立控制打字效果
   - 延遲 600ms 觸發，等待標題動畫完成
   - 將動畫從初始 CSS 移至 `.visible` class

2. **CSS 動畫優化**：
   - 初始狀態：`border-right: transparent`，避免閃爍
   - 觸發狀態：`animation-delay: 0.5s`，確保順序執行
   - 動畫僅在 `visible` 時執行，確保滾動觸發

### 2025-08-03 - Hero 國際化翻譯修復

**核心問題修復：**
- **國際化缺失**：修復 Hero 組件缺少國際化翻譯的問題
- **硬編碼文字**：將硬編碼的中文標題和副標題改為使用翻譯系統

**技術實作：**
1. **組件國際化**：
   - 添加 `useTranslations('HomePage')` hook 使用
   - 將「元智大學管理學院」改為 `{t('title_main')}`
   - 將副標題改為 `{t('subtitle')}`

2. **翻譯檔案更新**：
   - 中文：添加 `title_main: "元智大學管理學院"`
   - 英文：添加 `title_main: "YZU College of Management"`
   - 確保副標題翻譯正確對應

### 2025-08-03 - Hero 區塊動畫瞬移問題修復

**核心問題修復：**
- **Motion 動畫瞬移問題**：修復副標題和右側裝飾方塊在動畫結束時瞬移的問題
- **絕對定位元素動畫衝突**：解決 absolute 定位元素與 framer-motion 的 transform 屬性衝突

**技術實作：**
1. **分離動畫控制**：
   - 主標題：保持原有的 `y: 20 → 0` 動畫
   - 副標題：使用獨立的 `x: -50 → 0` 從左側滑入動畫（delay: 0.3s）
   - 右側方塊：使用獨立的 `x: 50 → 0` 從右側滑入動畫（delay: 0.5s）
2. **動畫層次設計**：
   - 避免在同一個 motion.div 內混合相對定位和絕對定位元素
   - 每個絕對定位元素都有專屬的 motion 包裝器

**檔案修改：**
- `src/components/layout/Hero.tsx:16-51` - 重構動畫結構，分離各元素的動畫控制

### 2025-08-03 - ExploreSection 打字動畫觸發時機優化

**核心問題修復：**
- **動畫觸發時機問題**：修復用戶滑動過程中動畫提前觸發，導致滑到區塊時動畫已結束的問題
- **視覺同步優化**：確保用戶能真正看到文字區域時才開始打字動畫

**技術實作：**
1. **雙重 IntersectionObserver 設計**：
   - `sectionObserver`：觀察整體區塊進入（卡片動畫觸發）
   - `textObserver`：專門觀察文字區域（打字動畫觸發）
2. **精確觸發條件**：
   - 文字區域 50% 可見時才觸發打字動畫（`threshold: 0.5`）
   - 移除 `rootMargin`，避免提前觸發
3. **狀態分離管理**：
   - `isVisible`：控制整體區塊動畫
   - `textVisible`：控制打字動畫
   - `typingComplete`：控制錨點消失
4. **錨點位置修復**：動畫完成後自動移除閃爍錨點

**檔案修改：**
- `src/components/layout/ExploreSection.tsx`：重構觀察者邏輯與動畫觸發機制

### 2025-08-03 - 3D地球LOGO整合：Header品牌識別升級

**設計理念與實作：**
- **品牌視覺升級**：將3D地球整合為CMYZU品牌LOGO的一部分，放置在文字左側
- **真實地球視角**：調整地球角度 `rotation={[0.4, -1.2, 0.05]}` 展現更真實的地球視角
- **效能最佳化**：創建專用 `EarthLogo.tsx` 組件，移除不必要的光源和特效

**技術實作：**

1. **新增EarthLogo組件** (`src/components/3d/EarthLogo.tsx`)：
   - 簡化版地球模型，專門用於LOGO顯示
   - 優化光照設置，適合小尺寸展示
   - 慢速自轉動畫 `rotation.y += 0.005`
   - 材質優化以增強小尺寸下的清晰度

2. **Header整合** (`src/components/layout/Header.tsx`)：
   - 3D地球放置在CMYZU文字左側，尺寸 48x48px
   - 專用光照配置：主光源、環境光、補光三重照明
   - 響應式支援：桌面和手機版都顯示
   - SSR兼容：客戶端條件渲染避免水化錯誤

3. **檔案清理**：
   - 移除 `ScrollEarth3D.tsx` 和 `EarthManager.tsx`
   - 從 `layout.tsx` 移除EarthManager引用
   - 清理不再需要的滾動觸發邏輯

### 2025-08-03 - 終極解決方案：純 CSS 3D 地球替代 Three.js

**✅ 完全解決 React Three Fiber SSR 錯誤：**

**問題根本解決：**

1. **Three.js SSR 根本問題**：
   ```
   TypeError: Cannot read properties of undefined (reading 'S')
   react-reconciler/cjs/react-reconciler.development.js
   ```
   - 根本原因：React Three Fiber 在服務器端無法初始化
   - 解決方案：完全避免使用 Three.js，改用純 CSS/SVG 實現

2. **新的純 CSS 3D 地球實現**：
   ```tsx
   // SimpleEarth3D.tsx - 完全避免 Three.js
   - 使用 CSS 漸層和陰影模擬地球表面
   - Framer Motion 提供流暢動畫
   - 多層視覺效果：地表、雲層、大氣層、軌道
   - 100% SSR 相容，無任何運行時錯誤
   ```

3. **智能地球管理系統**：
   ```tsx
   // earthConfig.ts - 靈活配置系統
   type: 'simple' | 'threejs' | 'none'  // 三種模式選擇
   enabled: true,                        // 開關控制
   hideOnMobile: true,                   // 行動裝置優化
   ```

4. **視覺效果特色**：
   - 🌍 **逼真地球**：多層漸層模擬真實地表
   - ☁️ **動態雲層**：獨立旋轉的雲層效果  
   - 🌟 **大氣光暈**：模擬大氣散射
   - 🛰️ **軌道衛星**：動態軌道和小衛星
   - ✨ **光影效果**：陰影和高光模擬立體感

**技術優勢：**
- ✅ **零錯誤**：完全避免 Three.js SSR 問題
- ✅ **高性能**：純 CSS 動畫，GPU 加速
- ✅ **響應式**：自動適配不同螢幕尺寸
- ✅ **可維護**：簡潔的代碼結構
- ✅ **可配置**：靈活的開關和選項

**檔案結構：**
```
src/
├── components/layout/
│   ├── SimpleEarth3D.tsx     # 新的純 CSS 3D 地球
│   ├── EarthManager.tsx      # 地球組件管理器
│   └── ScrollEarth3D.tsx     # 原 Three.js 版本（可選）
├── config/
│   └── earthConfig.ts        # 地球效果配置
└── app/globals.css           # CSS 動畫定義
```

**使用說明：**
- 預設使用穩定的純 CSS 版本
- 如需 GLB 模型，可在 `earthConfig.ts` 中設定 `type: 'threejs'`
- 支援完全關閉：`enabled: false`

---

### 2025-08-03 - 修復 SSR 錯誤並完善 3D 地球

**✅ 解決服務器端渲染 (SSR) 問題：**

**問題修復：**

1. **SSR 500 錯誤修復**：
   ```
   GET /zh 500 in 39ms
   TypeError: Cannot read properties of undefined (reading 'S')
   ```
   - 問題：Three.js 組件在服務器端無法正常運行
   - 解決：將 `ScrollEarth3D` 改為動態載入，禁用 SSR

2. **動態載入配置**：
   ```tsx
   // layout.tsx 中的修復
   const ScrollEarth3D = dynamic(() => import('@/components/layout/ScrollEarth3D'), {
     ssr: false,           // 禁用服務器端渲染
     loading: () => null,  // 載入時不顯示內容
   });
   ```

3. **React Hooks 順序修復**：
   - 修復 "React Hook useEffect is called conditionally" 錯誤
   - 確保 Hooks 在每次渲染時都按相同順序調用
   - 將條件檢查移到 useEffect 內部

4. **客戶端渲染優化**：
   - 所有 3D 相關組件都增加客戶端檢查
   - 避免 `window` 對象在 SSR 時訪問錯誤
   - 提供載入狀態和錯誤回退

**技術改進：**
- ✅ 解決 SSR 相容性問題
- ✅ 修復 React Hooks 規則違反
- ✅ 優化客戶端/服務器端渲染策略
- ✅ 確保 3D 組件只在瀏覽器中運行

**修改檔案：**
- `src/app/[locale]/layout.tsx` - 添加動態載入
- `src/components/layout/ScrollEarth3D.tsx` - 修復 Hooks 順序
- `src/components/3d/Earth3D.tsx` - 改善 SSR 相容性

---

### 2025-08-03 - GLB 3D 地球模型架構優化

**✅ 修復動態載入錯誤並優化架構：**

**問題修復：**

1. **ScrollEarth3D 動態載入錯誤**：
   - 修復 `NotFoundErrorBoundary` 錯誤
   - 移除有問題的 `ThreeJSEarth` 包裝組件
   - 直接在 `ScrollEarth3D` 中使用 Canvas 和 Earth3D

2. **架構簡化**：
   ```tsx
   // 舊架構：ScrollEarth3D → ThreeJSEarth → Earth3D
   // 新架構：ScrollEarth3D → Canvas → Earth3D (直接)
   ```

3. **錯誤處理優化**：
   - 移除複雜的 ErrorBoundary 自定義實現
   - 簡化 GLB 載入錯誤處理
   - 使用 React Suspense 內建機制

4. **性能優化**：
   - 移除不必要的中間包裝組件
   - 簡化材質優化邏輯
   - 減少組件層級和重新渲染

**修改檔案：**
- `src/components/layout/ScrollEarth3D.tsx` - 重構，直接使用 Canvas
- `src/components/3d/Earth3D.tsx` - 簡化錯誤處理
- `src/app/[locale]/layout.tsx` - 更新為使用 ScrollEarth3D
- 刪除：`src/components/3d/ThreeJSEarth.tsx` - 不再需要

**技術改進：**
- 消除動態載入錯誤
- 更直接的組件架構
- 更好的錯誤恢復機制
- 降低代碼複雜度

---

### 2025-08-03 - GLB 3D 地球模型升級

**✅ 完整 GLB 3D 地球模型整合：**

**高品質 3D 模型：**

1. **GLB 模型整合**：
   - 使用專業 3D 地球模型：`/models/Earth_1_12756.glb` (12.9 MB)
   - 完整替換紋理貼圖方案，使用真正的 3D 幾何體
   - `@react-three/drei` 的 `useGLTF` hook 載入 GLB 檔案
   - 模型預載入 (`useGLTF.preload`) 優化載入性能

2. **進階材質與光照**：
   ```tsx
   // 材質優化配置
   child.material.envMapIntensity = 0.5;  // 環境反射
   child.material.roughness = 0.7;        // 表面粗糙度
   child.material.metalness = 0.1;        // 金屬感
   ```

3. **完整錯誤處理系統**：
   - React Suspense 延遲載入
   - ErrorBoundary 錯誤邊界處理
   - 備用藍色球體，確保載入失敗時的可用性
   - 客戶端渲染檢查，避免 SSR 問題

4. **優化動畫效果**：
   - 地球自轉：0.003 rad/frame，流暢的 24 小時模擬
   - 軸傾斜效果：Math.sin 函數模擬地球 23.5° 傾斜
   - 適當縮放：scene.scale.setScalar(1.5) 
   - 陰影系統：2048x2048 高解析度陰影映射

5. **性能優化措施**：
   - 模型預載入：避免初次載入延遲
   - 材質優化：批量處理模型中的所有 mesh
   - 光照優化：4組光源 (主光源、環境光、反射光、邊緣光)
   - 大氣層效果：雙層透明球體模擬大氣散射

**技術規格：**
- 模型格式：GLB (GLTF 2.0 Binary)
- 檔案大小：12.9 MB
- 渲染引擎：Three.js + React Three Fiber
- 材質類型：PBR (Physically Based Rendering)

**修改檔案：**
- `src/components/3d/Earth3D.tsx` - 完全重寫
- `public/models/Earth_1_12756.glb` - 新增 3D 模型
- 移除：`public/textures/` - 不再需要紋理檔案

---

### 2025-08-03 - 3D 地球真實紋理升級與動畫優化

**✅ 3D 地球模型重大升級：**

**真實紋理整合：**

1. **高品質地球紋理**：
   - 下載並整合 Three.js 官方地球表面紋理 (`/textures/earth-day.jpg`)
   - 替換原有程式化 2D 平面繪製，使用真實衛星影像
   - 添加雲層紋理貼圖 (`/textures/earth-clouds.jpg`) 
   - 實現地球與雲層獨立旋轉動畫效果

2. **進階材質系統**：
   ```tsx
   // 真實地球材質配置
   new THREE.MeshPhongMaterial({
     map: earthTexture,        // 真實地表紋理
     shininess: 30,           // 海洋反光效果
     bumpScale: 0.05,         // 地形凹凸感
   });
   ```

3. **逼真光照系統**：
   - 主光源：模擬太陽光，暖白色 (#FFF8DC)，強度 3.0
   - 環境光：模擬宇宙星光，深藍色 (#1a1a2e)，強度 0.15
   - 反射光：地球大氣反射效果，藍色 (#4a90e2)
   - 邊緣光：rim lighting 效果，增強立體感

4. **動畫效果優化**：
   - 地球自轉速度：0.003 rad/frame（24小時加速模擬）
   - 雲層差異旋轉：0.002 rad/frame，增加真實感
   - 軸傾斜擺動：模擬地球 23.5° 軸傾角效果
   - 大氣層雙重光暈：內外兩層，模擬大氣散射

5. **性能優化措施**：
   - 幾何體細節提升：64x64 segments（原 32x32）
   - 陰影系統：2048x2048 shadow map resolution
   - 錯誤處理：紋理載入失敗時自動回退到程式化材質
   - 客戶端檢查：避免 SSR hydration 問題

**技術文件：**
- 修改文件：`src/components/3d/Earth3D.tsx`
- 新增紋理：`public/textures/earth-day.jpg`, `earth-clouds.jpg`
- 依賴套件：Three.js v0.179.1, @react-three/fiber v9.3.0

---

### 2025-08-03 - 3D 地球滾動動畫效果實作

**✅ 完成互動式 3D 地球組件：**

**核心功能實現：**

1. **3D 地球視覺效果**：
   - 創建 `ScrollEarth.tsx` 組件，具備完整 3D 視覺效果
   - 使用漸層背景模擬地球表面（藍色海洋 + 綠色陸地）
   - 添加高光效果、大氣層光暈、陰影和 3D 立體感
   - 包含環繞軌道線和小衛星動畫元素

2. **旋轉動畫系統**：
   ```tsx
   // 持續旋轉動畫
   animate={{ 
     rotateY: 360,                    // Y軸旋轉
     rotateZ: [0, 5, -5, 0]          // 輕微擺動效果
   }}
   transition={{ 
     rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
     rotateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" }
   }}
   ```

3. **滾動觸發機制**：
   - 監聽滾動事件，檢測 NewsSection 底部位置
   - 當滾動到「最新消息」section 底部時自動顯示地球
   - 使用 `data-section="news"` 屬性精確定位觸發點
   - 提前 50vh 觸發，提供流暢的出現效果

4. **Sticky 定位效果**：
   - 固定在右側中央位置（`fixed right-8 top-1/2`）
   - 地球出現後保持在視窗中固定位置
   - 使用 `z-40` 確保在適當層級顯示

5. **響應式與性能優化**：
   - 小於 768px 的裝置自動隱藏，避免行動裝置性能問題
   - 桌面版顯示 32x32，平板顯示 24x24 的適當尺寸
   - 使用 `pointer-events-none` 避免干擾用戶操作

**技術實作：**

```tsx
// 滾動檢測邏輯
const newsSection = document.querySelector('[data-section="news"]');
const newsSectionBottom = newsSection.getBoundingClientRect().bottom + currentScrollY;
const triggerPoint = newsSectionBottom - window.innerHeight * 0.5;
setIsVisible(currentScrollY > triggerPoint);

// 3D 效果樣式
style={{
  perspective: '1000px',
  transformStyle: 'preserve-3d'
}}
```

**CSS 動畫支援：**

6. **自定義動畫關鍵幀**：
   - 添加 `@keyframes pulse` 呼吸光暈效果
   - 新增 `@keyframes earthRotate` 地球旋轉動畫
   - 實作 `@keyframes orbitRotate` 軌道環繞效果
   - 提供 `.earth-3d` 類別支援 3D 變換

**視覺效果細節：**

7. **多層次視覺設計**：
   - 地球表面：藍綠漸層 + 高光反射
   - 大氣層：外圍光暈 + 模糊效果
   - 軌道系統：虛線環繞 + 衛星動畫
   - 背景光暈：脈衝呼吸 + 柔和光線
   - 標籤提示：毛玻璃卡片 + 地球圖示

**整合配置：**

8. **組件整合**：
   - 在 `layout.tsx` 中引入 ScrollEarth 組件
   - 在 NewsSection 添加 `data-section="news"` 識別屬性
   - 全域 CSS 支援，所有動畫效果正常運作

**使用者體驗：**

- **漸進增強**：桌面版完整 3D 效果，行動版自動隱藏
- **流暢動畫**：8秒地球旋轉 + 6秒擺動 + 12秒軌道環繞
- **視覺焦點**：不干擾主要內容，作為精美的視覺裝飾
- **性能友善**：針對不同裝置優化，避免影響頁面流暢度

**結果**：成功實現當使用者滑到「最新消息」section 底部時顯示的 3D 旋轉地球，具備 sticky 定位效果和豐富的視覺動畫，提升網站的現代感和互動體驗

**✅ 2025-08-03 後續優化 - 視覺層次與定位調整：**

**優化項目：**

1. **居中定位改進**：
   - 地球位置從右側改為畫面正中央
   - 使用 `left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2` 實現完全置中
   - 提供更好的視覺平衡和焦點效果

2. **視覺層次優化**：
   - 調整地球 z-index 為 `z-10`，顯示在毛玻璃背景後面
   - 毛玻璃內容區塊設為 `z-20`，確保內容在地球前方
   - 創造「透過毛玻璃看到地球」的夢幻效果

3. **簡化設計**：
   - 移除地球標籤文字和說明卡片
   - 純粹展示 3D 地球旋轉動畫
   - 提供更簡潔優雅的視覺體驗

**視覺效果**：
- 地球在毛玻璃後方若隱若現，創造深度感
- 內容透過毛玻璃效果與地球產生美妙的視覺融合
- 地球作為背景裝飾，不干擾主要內容閱讀

**結果**：優化後的地球效果更加優雅，位於畫面中央的毛玻璃後方，提供夢幻的視覺層次體驗

**✅ 2025-08-03 終極升級 - Three.js 3D 地球模型實作：**

**重大技術升級：**

1. **Three.js 整合**：
   - 安裝 `@react-three/fiber` 和 `@react-three/drei` 依賴
   - 使用 React Three Fiber 實現真實 3D 地球
   - 完全替換 CSS 動畫為 WebGL 渲染

2. **程式化地球材質**：
   ```tsx
   // 自動生成地球貼圖，無需外部資源
   const earthTexture = useMemo(() => {
     const canvas = document.createElement('canvas');
     // 繪製海洋漸層和陸地形狀
     // 歐亞大陸、非洲、北美洲、南美洲
   }, []);
   ```

3. **多層次 3D 結構**：
   - **地球本體**：1.5 半徑，32x32 多邊形，Phong 材質
   - **雲層系統**：1.51 半徑，程式化雲朵貼圖，半透明
   - **大氣光暈**：1.6 半徑，天藍色發光效果

4. **真實光照系統**：
   ```tsx
   // 主光源 - 模擬太陽光
   <directionalLight position={[5, 3, 5]} intensity={2} />
   // 環境光 - 基礎照明
   <ambientLight intensity={0.2} />
   // 點光源 - 增強立體感
   <pointLight position={[-5, 0, 5]} intensity={0.5} />
   ```

5. **流暢自轉動畫**：
   - 地球本體：每幀 +0.002 radians 旋轉
   - 雲層：每幀 +0.001 radians（稍慢於地球）
   - 使用 `useFrame` hook 實現 60fps 動畫

**性能優化：**

6. **幾何體最佳化**：
   - 地球主體：32x32 多邊形（平衡品質與性能）
   - 雲層：32x32 多邊形
   - 大氣層：16x16 多邊形（低多邊形光暈）

7. **材質優化**：
   - 使用 Canvas 2D API 程式化生成貼圖
   - 避免外部圖片載入，提升載入速度
   - 記憶化材質創建，防止重複計算

8. **響應式設計**：
   - 容器尺寸：300x300px（適中大小）
   - 相機視角：FOV 50°，距離 6 單位
   - 行動裝置自動隱藏（<768px）

**視覺效果增強：**

- **真實立體感**：WebGL 3D 渲染，支援陰影和高光
- **大氣層效果**：半透明天藍色光暈，模擬地球大氣
- **雲層動態**：獨立旋轉速度，增加真實感
- **材質豐富度**：Phong 光照模型，具備光澤和反射

**技術架構：**

```tsx
// 組件結構
<Canvas> 
  <Suspense fallback={WireframeEarth}>
    <Earth3D />  // 主要地球組件
  </Suspense>
  <OrbitControls enabled={false} />  // 禁用用戶控制
</Canvas>
```

**結果**：成功升級為真正的 3D 地球模型，使用 Three.js 渲染引擎提供電影級視覺效果，在保持優異性能的同時大幅提升視覺衝擊力和現代感

**✅ 2025-08-03 SSR 兼容性修復：**

**關鍵問題解決：**

1. **SSR 錯誤修復**：
   - 修復 `Cannot read properties of undefined (reading 'S')` 錯誤
   - Three.js 在伺服器端渲染時無法存取 DOM API
   - 使用 Next.js `dynamic` 導入禁用 SSR

2. **動態載入策略**：
   ```tsx
   // 禁用 SSR 的 Canvas 組件
   const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
     ssr: false,
     loading: () => <LoadingSpinner />
   });
   ```

3. **客戶端檢查機制**：
   ```tsx
   const [isClient, setIsClient] = useState(false);
   
   useEffect(() => {
     setIsClient(true);  // 確保只在客戶端執行
   }, []);
   ```

4. **漸進式載入**：
   - 伺服器端：不渲染任何 3D 內容
   - 客戶端 hydration：顯示載入動畫
   - 材質載入完成：顯示完整 3D 地球
   - 載入失敗：顯示線框備用地球

5. **錯誤處理優化**：
   ```tsx
   // 材質載入檢查
   if (!isClient || !earthMaterial || !cloudMaterial) {
     return <WireframeEarthFallback />;
   }
   ```

**修復效果：**

- ✅ 消除所有 SSR 相關錯誤
- ✅ 頁面正常載入，無 500 錯誤
- ✅ 3D 地球在客戶端正常渲染
- ✅ 提供載入狀態和錯誤回退
- ✅ 保持原有的滾動觸發功能

**技術優勢：**

- **兼容性**：完美支援 Next.js SSR/SSG
- **使用者體驗**：平滑的載入過程，無閃爍
- **容錯性**：多層次錯誤處理和回退機制
- **性能**：按需載入，不影響初始頁面載入速度

**結果**：成功解決 Three.js SSR 兼容性問題，3D 地球組件現在可以在 Next.js 環境中穩定運行

**✅ 2025-08-03 React 錯誤邊界修復：**

**進一步問題解決：**

1. **React 18 兼容性修復**：
   - 修復 `NotFoundErrorBoundary` 中的組件樹錯誤
   - 簡化動態載入邏輯，避免複雜的嵌套結構
   - 移除 Framer Motion AnimatePresence 避免衝突

2. **組件架構重構**：
   ```tsx
   // 簡化的載入策略
   const ThreeJSEarth = dynamic(() => import('@/components/3d/ThreeJSEarth'), {
     ssr: false,
     loading: () => <LoadingSpinner />
   });
   ```

3. **錯誤邊界優化**：
   - 創建獨立的 ThreeJSEarth 包裝組件
   - 將 Canvas 和 Suspense 邏輯封裝在單一組件中
   - 減少跨組件的依賴關係

4. **動畫簡化**：
   ```tsx
   // 使用純 CSS 過渡替代 Framer Motion
   style={{
     opacity: isVisible ? 1 : 0,
     transition: 'opacity 1s ease-in-out'
   }}
   ```

5. **性能優化**：
   - 限制 Canvas 的 DPR (Device Pixel Ratio)
   - 簡化載入狀態處理
   - 移除不必要的錯誤邊界嵌套

**修復效果：**

- ✅ 消除 React 18 錯誤邊界問題
- ✅ 減少組件複雜度和嵌套層級
- ✅ 提升載入穩定性和性能
- ✅ 保持 3D 地球的視覺效果
- ✅ 簡化的動畫過渡效果

**技術優勢：**

- **穩定性**：減少錯誤邊界觸發機會
- **簡潔性**：更直接的組件結構
- **兼容性**：與 React 18 + Next.js 14 完美兼容
- **維護性**：更易於除錯和維護

**結果**：成功修復所有 React 錯誤邊界問題，3D 地球組件現在以更穩定的方式運行，提供流暢的用戶體驗

**✅ 2025-08-03 回歸 CSS 地球並大幅增強視覺效果：**

**問題最終解決：**

考慮到 Three.js 與 Next.js 14 + React 18 的兼容性問題持續存在，決定回歸使用 CSS 實現的地球，但進行了大幅視覺增強。

**CSS 地球視覺大升級：**

1. **地球表面複雜化**：
   ```css
   // 多層漸層效果，模擬真實地球
   background: 
     radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9) 0%, transparent 25%),  // 高光
     radial-gradient(circle at 65% 75%, rgba(0,0,0,0.4) 0%, transparent 30%),        // 陰影
     conic-gradient(from 0deg, #1e40af 0deg, #22c55e 60deg, #eab308 80deg...),       // 大陸色彩
     linear-gradient(135deg, #0f172a 0%, #1e40af 25%, #22c55e 50%...)                // 基礎漸層
   ```

2. **大陸板塊效果**：
   - 4個獨立的大陸形狀
   - 使用 radial-gradient 模擬陸地分布
   - 40% 透明度營造真實感

3. **多層大氣層光暈**：
   - 雙層大氣層效果（近層 + 遠層）
   - 不同模糊程度（3px + 6px）
   - 藍綠雙色光暈系統

4. **增強軌道系統**：
   - 主軌道：虛線邊框，15秒旋轉週期
   - 次軌道：點線邊框，20秒反向旋轉
   - 不同傾斜角度（60° + 45°）

5. **雙衛星系統**：
   - 黃色衛星：12秒軌道週期
   - 青色衛星：18秒軌道週期
   - 增強發光效果和陰影

6. **星塵背景效果**：
   - 8個隨機分布的星點
   - 獨立的閃爍動畫
   - 2-5秒隨機週期

7. **尺寸與動畫優化**：
   - 地球尺寸增大至 40x40（桌面）
   - 地球旋轉週期放慢至 12秒
   - 擺動效果減緩至 8秒週期

**視覺效果提升：**

- **真實感**：複雜的多層漸層模擬真實地球表面
- **立體感**：增強的高光和陰影效果
- **動態感**：多個軌道和衛星的複雜運動
- **科技感**：星塵效果和多色光暈系統
- **沉浸感**：更大的尺寸和豐富的視覺層次

**技術優勢：**

- **穩定性**：純 CSS + Framer Motion，無 SSR 問題
- **兼容性**：完美支援所有現代瀏覽器
- **性能**：GPU 加速的 CSS 動畫，流暢 60fps
- **維護性**：簡潔的組件結構，易於調整

**結果**：雖然暫時放棄了 Three.js，但通過 CSS 技術實現了更穩定、更豐富的視覺效果，提供不輸 3D 模型的視覺衝擊力

**✅ 2025-08-03 最終簡化 - 回歸簡潔設計：**

**用戶反饋處理：**

根據用戶反饋，移除了所有過度裝飾的效果，回歸最簡潔優雅的設計。

**大幅簡化內容：**

1. **移除所有多餘效果**：
   - ❌ 8個閃爍星塵背景
   - ❌ 兩個不同顏色的環繞衛星
   - ❌ 多層大氣層光暈效果  
   - ❌ 雙軌道線（虛線 + 點線）
   - ❌ 複雜的大陸板塊效果
   - ❌ 多層漸層和光暈

2. **保留核心功能**：
   - ✅ 簡潔的地球本體
   - ✅ 基本的旋轉動畫（8秒週期）
   - ✅ 輕微的高光效果
   - ✅ 簡單的陰影立體感

3. **最終效果**：
   ```css
   // 極簡地球設計
   background: 
     radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 20%), // 高光
     linear-gradient(135deg, #1e40af 0%, #22c55e 50%, #1e40af 100%)              // 藍綠漸層
   ```

**設計理念：**

- **極簡主義**：只保留最必要的視覺元素
- **優雅動畫**：純粹的旋轉動畫，無多餘裝飾
- **視覺焦點**：地球作為背景裝飾，不干擾主要內容
- **性能優化**：減少動畫計算，提升流暢度

**最終效果：**
- 🌍 簡潔的藍綠色地球
- 🔄 8秒平滑旋轉動畫  
- ✨ 輕微高光立體感
- 📱 行動裝置自動隱藏

**結果**：成功回歸簡潔設計，提供優雅的背景動畫效果，完美符合用戶期望的極簡美學

### 2025-08-03 - 「探索元智管理學院」section 新增

**✅ 完成首頁新增「探索元智管理學院」區塊：**

**功能新增：**

1. **新增 ExploreSection 組件**：
   - 建立 `/src/components/layout/ExploreSection.tsx`
   - 採用與現有設計一致的毛玻璃背景效果
   - 使用 3x2 Grid 佈局展示 6 個學院特色項目
   - 整合 Framer Motion 動畫效果

2. **6大學院特色項目**：
   - **學院簡介**：管理學院整體介紹與教育理念
   - **系所介紹**：企管、資管、財金等系所課程資訊
   - **師資陣容**：國內外頂尖師資介紹
   - **研究中心**：專業研究中心與產學合作
   - **國際交流**：海外交換與雙學位機會
   - **產學合作**：企業夥伴與就業媒合

3. **自定義 SVG 圖標系統**：
   - 為每個特色項目設計專屬圖標
   - 使用統一的 `w-12 h-12` 尺寸和品牌主色
   - 包含學校、部門、教師、研究、國際、產業等圖標

4. **互動效果設計**：
   - 卡片懸停時向上浮起 (`hover:-translate-y-2`)
   - 圖標容器顏色變化效果
   - 「了解更多」箭頭移動動畫
   - 300ms 流暢過渡效果

**技術實作：**

```tsx
// 毛玻璃卡片設計
<div className="backdrop-blur-sm bg-white/50 rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">

// 3x2 Grid 響應式佈局
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

// 階層動畫效果
transition={{ duration: 0.6, delay: index * 0.1 }}
```

**多語系支援：**

5. **中文翻譯完善** (`messages/zh.json`)：
   - 新增 `Explore` 翻譯區塊
   - 涵蓋標題、描述、6個項目內容
   - 包含「了解更多」和「聯絡我們」按鈕文字

6. **英文翻譯對應** (`messages/en.json`)：
   - "Explore CMYZU Business School" 標題
   - 完整的英文版項目描述
   - 符合國際化標準的教育術語

**頁面整合：**

7. **首頁佈局更新**：
   - 在 NewsSection 下方插入 ExploreSection
   - 保持與其他 section 一致的間距和背景
   - 維持整體頁面的視覺流暢性

**設計特色：**

- **視覺一致性**：與現有毛玻璃設計完美融合
- **響應式設計**：桌面 3 欄、平板 2 欄、手機 1 欄
- **動畫豐富性**：入場動畫、懸停效果、按鈕互動
- **內容豐富性**：6 個維度全面展示學院特色
- **國際化支援**：完整的中英文雙語內容

**結果**：成功新增「探索元智管理學院」區塊，提供豐富的學院資訊展示，增強首頁內容豐富度與用戶體驗

### 2025-08-03 - Header 展開背景色移除優化

**✅ 移除 Header 展開時的多餘背景效果：**

**問題解決：**
- Header 在展開時有多層灰色背景，包括主背景、漸變覆蓋層、動態光暈
- 用戶反映不想要這些背景效果，希望保持透明設計

**修復項目：**

1. **主背景透明化**：
   - 移除 `background: isNavMenuOpen ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'`
   - 統一設為 `background: 'transparent'`

2. **背景漸變覆蓋層移除**：
   - 移除 `linear-gradient(to bottom, rgba(151, 151, 149, 0.15) 0%, transparent 50%, rgba(151, 151, 149, 0.20) 100%)`
   - 改為 `background: 'transparent'`

3. **動態光暈效果移除**：
   - 移除 `radial-gradient(circle, rgba(151, 151, 149, 0.25) 0%, rgba(151, 151, 149, 0.15) 30%, rgba(151, 151, 149, 0.05) 60%, transparent 100%)`
   - 改為 `background: 'transparent'`

**效果改善：**
- ✅ Header 展開時完全透明，不會產生灰色背景
- ✅ 保持原有的毛玻璃模糊效果 (`backdrop-blur`)
- ✅ 維持所有動畫和互動功能
- ✅ 提供更乾淨的視覺體驗

**結果**：成功移除 Header 展開時的所有背景色效果，實現用戶期望的透明設計

### 2025-08-03 - 最新消息區塊台大風格重新設計

**✅ 完成最新消息區塊的台大官網風格重新設計：**

**設計變更：**

1. **採用台大官網風格佈局**：
   - 從卡片式佈局改為清單式佈局
   - 左側圓形日期標記（年份 + 月/日）
   - 右側內容區域，保持簡潔
   - 使用水平分隔線分開每個項目

2. **圓形日期標記設計**：
   - 80x80px 深灰色圓形背景
   - 顯示年份（小字）和月/日（大字）
   - 白色文字，優良的對比度
   - 響應式設計，在各裝置正常顯示

3. **內容區域優化**：
   - 移除冗長的摘要文字，保持簡潔
   - 標題使用大字體，支援 hover 效果
   - 分類標籤使用品牌色彩系統
   - 右側添加箭頭指示器

4. **互動效果增強**：
   - hover 時整列背景淡入
   - 標題顏色變化至品牌主色
   - 箭頭向右移動動畫
   - 300ms 流暢過渡效果

**技術實作：**

```tsx
// 左側圓形日期標記
<div className="w-20 h-20 rounded-full bg-gray-700 text-white flex flex-col items-center justify-center font-medium">
  <div className="text-xs leading-none">{year}</div>
  <div className="text-lg font-bold leading-none">{month}/{day}</div>
</div>

// 列表項目 hover 效果
<div className="flex items-start py-8 border-b border-gray-300 hover:bg-white/20 transition-all duration-300">
```

**視覺效果提升：**

- **簡潔佈局**：去除視覺裝飾，專注於內容本身
- **清晰層次**：左側日期 + 右側內容的明確分工
- **品牌一致性**：與現有毛玻璃背景系統完美融合
- **響應式設計**：在桌面和手機都有良好體驗

**使用者體驗優化：**

- **快速瀏覽**：清單式佈局便於快速掃視
- **視覺焦點**：圓形日期標記快速識別時間
- **互動反饋**：豐富的 hover 效果提升點擊慾望
- **內容優先**：去除干擾元素，突出新聞標題

**結果**：成功將最新消息區塊改造為台大官網風格的簡潔列表設計，提升使用者閱讀體驗與視覺美感

**✅ 2025-08-03 後續優化 - 6項目2欄Grid佈局：**

**佈局改進：**

1. **增加內容項目**：
   - 擴展從3個新聞項目到6個項目
   - 使用台大官網真實新聞標題作為範例內容
   - 涵蓋活動、學術、榮譽等不同分類

2. **2欄Grid響應式佈局**：
   - 桌面版：`grid md:grid-cols-2` 左右各3個項目
   - 手機版：單欄顯示，保持良好的閱讀體驗
   - 最大寬度設為 `max-w-6xl`，提供更寬的顯示空間

3. **項目尺寸優化**：
   - 圓形日期標記縮小為 `w-16 h-16`（原 `w-20 h-20`）
   - 標題字體調整為 `text-lg`（原 `text-xl md:text-2xl`）
   - 標籤尺寸縮小為 `text-xs`，節省空間

4. **間距微調**：
   - 項目內間距調整為 `py-6`（原 `py-8`）
   - 左右邊距設為 `-mx-4 px-4`（原 `-mx-6 px-6`）
   - 圓形標記右邊距調整為 `mr-6`（原 `mr-8`）

**技術實作：**

```tsx
// 2欄Grid響應式佈局
<div className="grid md:grid-cols-2 gap-8">
  {news.map((item, index) => (
    // 縮小後的圓形日期標記
    <div className="w-16 h-16 rounded-full bg-gray-700 text-white">
      <div className="text-xs">{year}</div>
      <div className="text-sm font-bold">{month}/{day}</div>
    </div>
  ))}
</div>
```

**使用者體驗提升：**

- **更多內容**：一次展示6個最新消息，提供更豐富的資訊
- **平衡佈局**：2欄設計在桌面版提供良好的視覺平衡
- **響應式優化**：手機版自動調整為單欄，保持可讀性
- **視覺密度**：適當的項目尺寸確保內容不過於擁擠

### 2025-08-02 - ESLint pre-commit hook 配置修復

**✅ 完成 lint-staged 配置問題修復：**

**問題診斷：**
- Pre-commit hook 執行 `pnpm lint-staged` 時出現錯誤
- 錯誤訊息顯示尋找不存在的 `lib/*` 路徑
- 根本原因：lint-staged 缺少專用配置，導致讀取 node_modules 中套件的配置

**解決方案：**

1. **建立專用 lint-staged 配置**：
   - 新增 `.lintstagedrc.js` 配置文件
   - 明確指定前端和後端的檢查規則
   - 避免 lint-staged 讀取 node_modules 中的配置

2. **優化 .gitignore 設定**：
   - 將 `/node_modules` 改為 `node_modules/` 以忽略所有層級的 node_modules
   - 新增 `backend/dist/` 忽略後端編譯輸出

3. **修復前端程式碼問題**：
   - 移除 Hero.tsx 中未使用的 `Link` import
   - 確保所有 ESLint 規則通過

**技術配置：**

```javascript
// .lintstagedrc.js
module.exports = {
  'src/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  'backend/src/**/*.{js,ts}': [
    'cd backend && pnpm typecheck'
  ]
};
```

**修復效果：**
- ✅ Pre-commit hook 正常執行，不再有 `lib/*` 路徑錯誤
- ✅ 前端 ESLint 和 Prettier 自動修復正常工作
- ✅ 後端 TypeScript 檢查正常執行
- ✅ Git 提交流程順暢，代碼品質檢查有效

**結果**：成功修復 pre-commit hook 問題，確保代碼提交前的品質檢查正常運作

## 📋 更新記錄

### 2025-08-02 - 首頁區塊分界線優化設計

**✅ 完成各區塊明顯分界線設計：**

**問題識別：**
- 原先 StatsSection、FeaturesSection、NewsSection 都使用相同的 `bg-gray-500/80` 背景
- 各區塊視覺上融合，缺乏明顯的層次區分
- 使用者反映需要更清楚的視覺分界

**解決方案：**

1. **多層次分界線設計**：
   - Hero 後方：簡潔漸層分界線 `bg-gradient-to-r from-transparent via-gray-300 to-transparent`
   - Stats 後方：幾何漸層分界，含垂直漸層 `bg-gradient-to-b from-gray-500/80 to-white`
   - Features 後方：對角線 SVG 波浪分界，創造流動感視覺效果
   - 底部：收尾漸層分界線

2. **背景層次優化**：
   - **StatsSection**：保持原有毛玻璃效果 `bg-gray-500/80`
   - **FeaturesSection**：改為純白背景 `bg-white`，與 Stats 形成對比
   - **NewsSection**：使用淺灰漸層 `bg-gradient-to-br from-gray-50 to-gray-100`
   - 三個區塊現在有明顯的視覺層次：深色 → 白色 → 淺灰

3. **SVG 藝術分界線**：
   ```jsx
   <svg className="absolute bottom-0 w-full h-8" viewBox="0 0 1200 120">
     <path d="M0,0V46.29c47.79,22.2..." className="fill-gray-500/20"></path>
     <path d="M0,0V15.81C13,36.92..." className="fill-gray-500/30"></path>  
     <path d="M0,0V5.63C149.93,59..." className="fill-white"></path>
   </svg>
   ```

**視覺效果提升：**

- **明確分界**：每個區塊都有獨特的分界設計，視覺層次清晰
- **現代感設計**：使用 SVG 波浪、漸層分界提升現代感
- **層次豐富**：深色毛玻璃 → 白色純淨 → 淺灰漸層的背景層次
- **流動感**：波浪型 SVG 分界線創造自然流動的視覺體驗

**技術實作：**

```jsx
// 頁面結構優化
<Hero />
<div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
<StatsSection />
<div className="relative h-20 overflow-hidden">...</div>
<FeaturesSection />  
<div className="relative h-16 overflow-hidden"><svg>...</svg></div>
<NewsSection />
```

**結果**：成功解決區塊分界不明顯問題，創造清晰的視覺層次與現代化設計感

### 2025-08-02 - 全頁面建築背景固定修正

**✅ 修正建築背景固定範圍，實現全頁面背景效果：**

**問題診斷：**
- 建築背景只在 Hero 組件中設置，導致其他 section 看不到背景
- 毛玻璃效果無法透過看到建築圖片
- 滾動時只有白色毛玻璃區塊向上移動

**解決方案：**

1. **移動背景到 body 元素**：
   - 在 `layout.tsx` 的 body 元素設置建築背景
   - 使用 `background-attachment: fixed` 讓背景固定在整個頁面
   - 移除 Hero 組件中的背景設置，避免重複

2. **技術實作**：
   ```tsx
   <body 
     className="bg-cover bg-center bg-no-repeat bg-fixed"
     style={{
       backgroundImage: `url('/hero-building.webp')`,
       backgroundAttachment: 'fixed',
     }}
   >
   ```

3. **Hero 組件簡化**：
   - 移除重複的背景圖片設置
   - 保留玻璃幕牆視覺效果
   - 維持原有的文字內容和動畫

**效果改善：**

- **全頁面背景**：建築圖片現在覆蓋整個頁面，不只 Hero 區塊
- **毛玻璃效果**：所有 section 的毛玻璃背景都能透過看見建築圖片
- **滾動體驗**：向下滾動時，毛玻璃內容向上移動覆蓋固定的建築背景
- **視覺一致性**：整個頁面保持統一的建築背景主題

**結果**：成功實現全頁面建築背景固定，毛玻璃內容向上滾動覆蓋的效果

### 2025-08-02 - 毛玻璃半透明 Section 背景效果

**✅ 完成所有 Section 毛玻璃半透明背景設計：**

**重大變更：**

1. **StatsSection 毛玻璃化**：
   - 背景改為 `backdrop-blur-md bg-white/20`
   - 新增半透明白色邊框 `border-white/10`
   - 保持原有文字顏色與圖標設計
   - 透過背景可看見建築圖片

2. **FeaturesSection 毛玻璃化**：
   - Section 背景：`backdrop-blur-md bg-white/30`
   - 卡片背景：`backdrop-blur-sm bg-white/40`
   - 邊框調整為半透明：`border-white/30`
   - 保持卡片懸停動畫效果

3. **NewsSection 毛玻璃化**：
   - Section 背景：`backdrop-blur-md bg-white/25`
   - 新聞卡片：`backdrop-blur-sm bg-white/50`
   - 邊框使用：`border-white/40`
   - 維持原有互動與陰影效果

**視覺效果優化：**

- **層次透明度**：三個 section 使用不同透明度創造層次感
- **毛玻璃模糊**：`backdrop-blur` 創造現代毛玻璃質感
- **建築背景可見**：透過半透明背景可看見固定的建築圖片
- **邊框一致性**：統一使用半透明白色邊框設計

**技術實作：**

```css
/* Section 毛玻璃背景 */
backdrop-blur-md bg-white/20   /* StatsSection */
backdrop-blur-md bg-white/30   /* FeaturesSection */
backdrop-blur-md bg-white/25   /* NewsSection */

/* 卡片毛玻璃背景 */
backdrop-blur-sm bg-white/40   /* Feature 卡片 */
backdrop-blur-sm bg-white/50   /* News 卡片 */
```

**使用者體驗提升：**

- **視覺連貫性**：所有 section 與固定建築背景融為一體
- **現代感設計**：毛玻璃效果提升整體現代感
- **內容可讀性**：適當的半透明度確保文字清晰可讀
- **層次豐富性**：不同透明度創造豐富的視覺層次

**結果**：成功實現全頁面毛玻璃半透明效果，與固定建築背景完美融合

### 2025-08-02 - Hero 區塊背景固定效果實作

**✅ 完成建築背景圖片完全固定效果：**

**重大變更：**

1. **背景固定實作**：
   - 使用 CSS `background-attachment: fixed` 屬性
   - 背景圖片完全固定在瀏覽器視窗位置
   - 移除 JavaScript 滾動監聽，簡化實作
   - 背景圖片永遠釘在原位，不會移動

2. **滾動覆蓋效果**：
   - 下方的 section 內容向上滾動
   - 內容會覆蓋在固定的背景圖片上方
   - 創造內容「浮出」背景的視覺效果
   - 保持建築攝影的專業美感

3. **技術簡化**：
   - 移除不必要的 React hooks 和狀態管理
   - 使用原生 CSS 屬性實現固定背景
   - 更好的效能和兼容性（桌面版）
   - 程式碼更簡潔易維護

**技術實作：**

```css
/* 背景固定設定 */
.bg-fixed {
  background-attachment: fixed;
}

/* 樣式設定 */
style={{
  backgroundImage: `url('/hero-building.webp')`,
  backgroundAttachment: 'fixed',
}}
```

**使用者體驗提升：**

- **完全固定背景**：建築圖片永遠保持在相同位置
- **內容覆蓋效果**：下方 section 向上滾動覆蓋背景
- **視覺穩定性**：背景作為穩定的視覺錨點
- **簡潔實作**：使用原生 CSS 特性，更穩定可靠

**結果**：成功實現建築背景完全固定，下方內容向上滾動覆蓋的效果

### 2025-08-02 - 頁面佈局優化：移除 navbar 高度限制

**✅ 完成頁面無縫向上滾動設計：**

**重大變更：**

1. **移除 main 元素間距限制**：
   - 修改 `src/app/[locale]/layout.tsx` 中 main 元素樣式
   - 移除 `pt-16` 上方間距，改為純 `min-h-screen`
   - 頁面內容現在可以完全延伸到瀏覽器頂部

2. **保持 Header sticky 定位**：
   - 維持原有的 `sticky! top-0 z-50` 設定
   - 透明玻璃效果導航欄依然固定在頂部
   - 滾動時導航欄正常顯示與隱藏

3. **Hero 組件適配**：
   - Hero 區塊的 `-mt-16` 設定確保全屏顯示
   - 背景圖片可以完全覆蓋到瀏覽器頂部
   - 內容層次正確，文字仍然可讀

**技術改進：**

- **完全無縫設計**：頁面內容不再受導航欄高度限制
- **視覺連續性**：整個頁面可以向上無縫滾動
- **保持功能性**：導航欄功能完全正常
- **響應式支援**：各種裝置尺寸都能正確顯示

**使用者體驗提升：**

- **沉浸式體驗**：頁面內容可以完全填滿螢幕
- **現代化設計**：符合當代網頁設計趨勢
- **滾動自然**：無縫滾動體驗，沒有間距干擾
- **視覺一致**：背景圖片與導航欄完美融合

**結果**：成功實現頁面內容無視 navbar 高度的無縫向上滾動效果

### 2025-08-02 - Glass-card 透明導航欄固定定位優化

**✅ 完成導航欄玻璃效果與固定定位整合：**

**重大變更：**

1. **Glass-card 樣式套用**：
   - 修復 Header 組件中 glass-card 類別格式問題（移除多餘空格）
   - 套用完整的玻璃質感效果：半透明背景、毛玻璃模糊、細緻邊框與陰影
   - 保持導航欄現代感與視覺層次

2. **固定定位優化**：
   - 導航欄改用 `fixed top-0 left-0 right-0` 完全固定定位
   - 移除 `sticky` 定位，避免滾動時的不穩定行為
   - 確保導航欄始終停留在頁面最頂端

3. **頁面布局調整**：
   - main 元素新增 `pt-16` 上方間距，避免內容被導航欄遮蓋
   - Hero 組件調整為 `h-screen -mt-16`，確保全屏顯示且與導航欄完美融合
   - 整個頁面現在可以無視 navbar 高度自由向上滾動

4. **視覺效果優化**：
   - Glass-card 效果包含：半透明背景、backdrop-blur 模糊、細緻光影邊框
   - 保持原有的白色半透明邊框 (`border-white/20`)
   - 維持高 z-index (z-50) 確保導航欄在最上層

**技術改進：**

- **定位系統**：從 sticky 改為 fixed，提供更穩定的固定效果
- **布局計算**：精確的間距設定，確保內容不被遮蓋
- **玻璃效果**：完整的 glass-card 樣式，提升現代感
- **滾動體驗**：頁面可以完全忽略 navbar 高度進行滾動

**使用者體驗提升：**

- **固定導航**：導航欄永遠可見，提升導航便利性
- **視覺融合**：透明玻璃效果與背景完美融合
- **滾動自由**：頁面內容可以自由滾動，不受導航欄限制
- **專業外觀**：現代 glass morphism 設計語言

**結果**：成功實現透明固定導航欄，既保持專業美感又提供優秀的使用體驗

### 2025-08-02 - 透明導航欄與建築背景圖片整合

**✅ 完成首頁主視覺背景圖片整合：**

**重大變更：**

1. **透明導航欄設計**：
   - 修改 Header 組件為透明背景 (`bg-white/90`)
   - 新增毛玻璃效果 (`backdrop-blur-md`)
   - 調整邊框為半透明 (`border-white/20`)
   - 提升導航欄與背景圖片的視覺融合度

2. **建築攝影背景整合**：
   - 建築圖片移動至正確路徑 `public/hero-building.webp`
   - 修正 Next.js 靜態檔案路徑 (`url('/hero-building.webp')`)
   - 實施全屏背景圖片 (`bg-cover bg-center`)
   - 新增深色漸層覆蓋層，提升文字可讀性
   - 保留現代玻璃幕牆視覺效果

3. **文字樣式優化**：
   - 主標題改用白色文字配合深色背景
   - 副標題使用半透明白色 (`text-white/90`)
   - 內容區塊背景調整為半透明黑色 (`bg-black/20`)
   - 滾動指示器改用白色主題

4. **視覺層次優化**：
   - 深色漸層背景確保文字可讀性
   - 保持建築攝影專業美感
   - 透明導航欄與背景完美融合
   - 響應式設計維持各裝置最佳顯示

**技術改進：**

- **背景圖片**：使用現有 `_cover.webp` 建築圖片作為主視覺背景
- **透明效果**：Header 採用毛玻璃透明效果，提升現代感
- **文字對比**：深色覆蓋層確保白色文字在建築背景上清晰可讀
- **視覺一致性**：保持原有動畫效果與互動設計

**使用者體驗提升：**

- **專業形象**：建築攝影背景提升品牌專業度與教育機構威信
- **視覺衝擊**：全屏建築背景創造強烈第一印象
- **導航體驗**：透明導航欄不干擾主視覺，保持內容焦點
- **多裝置適配**：確保建築背景在各種螢幕尺寸都能完美顯示

**結果**：成功整合建築攝影背景與透明導航欄，創造現代專業的學校官網首頁體驗

### 2025-08-02 - 現代建築風格首頁重大設計變更

**✅ 完成現代建築攝影風格首頁重新設計：**

**重大變更：**

1. **Hero 組件全面重新設計**：
   - 採用現代建築攝影美學，參考藍天白雲和圓形建築風格
   - 新增藍天漸層背景與建築幾何元素
   - 加入現代玻璃幕牆視覺效果和建築線條元素
   - 增強按鈕設計，採用玻璃質感與企業級風格
   - 改進滾動指示器，使用現代化設計語言

2. **首頁布局完全重構**：
   - 移除所有測試用的色彩系統展示內容
   - 建立專業的學校官網首頁結構
   - 保留 StatsSection、FeaturesSection、NewsSection 核心組件
   - 優化頁面層次與內容組織

3. **SEO 與結構化數據優化**：
   - 新增完整的頁面 meta 標籤與 OpenGraph 設定
   - 整合 Schema.org 結構化數據（EducationalOrganization）
   - 針對教育機構優化 SEO 關鍵字與描述
   - 提升 AI 搜尋引擎（ChatGPT、Gemini、Perplexity）可見性

4. **現代視覺設計語言**：
   - 採用企業級專業視覺風格
   - 使用 backdrop-blur 和現代漸層效果
   - 強化品牌識別與視覺一致性
   - 響應式設計確保各裝置完美顯示

**技術改進：**

- **視覺效果**：圓形建築元素、玻璃幕牆紋理、陽光光暈動畫
- **互動體驗**：現代化按鈕懸停效果、優化動畫過渡
- **SEO 優化**：完整結構化標記，符合 AI 搜尋要求
- **程式碼品質**：TypeScript 類型安全、ESLint 規範遵循

**使用者體驗提升：**

- **專業形象**：現代建築攝影美學提升品牌專業度
- **視覺層次**：清晰的資訊架構與導航體驗
- **載入效能**：移除不必要的測試內容，提升頁面效能
- **多裝置支援**：確保桌面、平板、手機完美適配

**結果**：成功打造現代建築風格的專業學校官網首頁，符合使用者視覺期待與 SEO 最佳實務

### 2025-08-01 - Tailwind CSS 4.x 成功配置修復

**✅ 成功修復 Tailwind CSS 4.x 配置問題：**

**最終解決方案：**

1. **正確安裝 Tailwind CSS 4.x**：
   ```bash
   pnpm add -D tailwindcss@latest @tailwindcss/postcss@latest
   ```

2. **PostCSS 配置** (`postcss.config.js`)：
   ```javascript
   module.exports = {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   };
   ```

3. **CSS 導入配置** (`src/app/globals.css`)：
   ```css
   @import "tailwindcss";
   
   /* 自定義品牌色系 - Tailwind CSS 4.x 語法 */
   @theme {
     --color-brand-text: #442A24;
     --color-brand-background: #979795;
     --color-brand-secondary: #818C89;
     --color-brand-accent: #C57642;
     --color-brand-white: #FFFFFF;
     --color-brand-cream: #F1EBE5;
     --color-brand-light: #DDDDD7;
     --color-brand-mint: #EAF0EE;
   }
   ```

4. **移除舊配置文件**：
   - ❌ 不需要 `tailwind.config.js`（Tailwind CSS 4.x 使用 CSS 配置）

**關鍵差異：**
- **Tailwind CSS 4.x** 不再使用 `tailwind.config.js`
- 所有配置透過 CSS 的 `@theme` 指令完成
- 使用 `@tailwindcss/postcss` 插件而非 `tailwindcss`
- CSS 導入使用 `@import "tailwindcss"` 而非 `@tailwind` 指令

**✅ 完整品牌色彩系統建立：**

**色彩階層規劃：**

1. **主色系統 (Primary) - 橙棕色**：
   - `primary-400`: `#C57642` - 品牌主色，用於主要按鈕、強調元素
   - `primary-50` 到 `primary-950` - 完整漸層，10 個色階
   - 覆蓋 Tailwind 預設 `bg-primary-*` 和 `text-primary-*` 類別

2. **輔色系統 (Secondary) - 藍灰色**：
   - `secondary-500`: `#818C89` - 品牌輔色，用於次要按鈕、輔助元素
   - `secondary-50` 到 `secondary-950` - 完整漸層，10 個色階
   - 覆蓋 Tailwind 預設 `bg-secondary-*` 和 `text-secondary-*` 類別

3. **中性色系統 (Gray) - 覆蓋 Tailwind 預設**：
   - `gray-100`: `#F1EBE5` - 米白色背景
   - `gray-200`: `#EAF0EE` - 淺綠色背景  
   - `gray-300`: `#DDDDD7` - 淺灰色背景
   - `gray-500`: `#979795` - 中性背景
   - `gray-900`: `#442A24` - 深色文字（品牌深色）
   - 完全覆蓋 Tailwind 原始灰階系統

4. **語義化顏色**：
   - 保留標準 `green-*` (成功)、`red-*` (危險)、`amber-*` (警告)、`blue-*` (資訊)
   - 與品牌色系協調搭配

**使用方式：**

```css
/* 現在可以直接使用，無需前綴 */
bg-primary-400    /* 品牌主色背景 */
text-primary-400  /* 品牌主色文字 */
bg-secondary-500  /* 品牌輔色背景 */
bg-gray-100       /* 米白色背景 (覆蓋原始 gray-100) */
text-gray-900     /* 品牌深色文字 (覆蓋原始 gray-900) */
```

**測試結果：**
- ✅ 主色系統正常：`bg-primary-400`, `hover:bg-primary-500`
- ✅ 輔色系統正常：`bg-secondary-500`, `text-secondary-600`
- ✅ 中性色系統覆蓋成功：`bg-gray-100` 顯示米白色
- ✅ 響應式類別正常：`md:grid-cols-5`, `lg:grid-cols-10`
- ✅ 語義化顏色保持：`bg-green-500`, `bg-red-500`

### 2025-08-01 - Tailwind CSS 4.x 完整配置修復

**✅ 修復 Tailwind CSS 4.x 完整配置問題：**

**問題診斷：**
1. **PostCSS 配置錯誤**：`postcss.config.js` 使用了錯誤的陣列語法
2. **缺失配置文件**：專案缺少 `tailwind.config.js` 配置文件
3. **CSS 導入語法錯誤**：Tailwind CSS 4.x 使用新的 `@import` 語法

**解決方案：**

1. **修正 PostCSS 配置**：
   ```javascript
   // postcss.config.js - 使用物件語法
   module.exports = {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   };
   ```

2. **創建 Tailwind 配置文件**：
   ```javascript
   // tailwind.config.js - 完整品牌色系配置
   module.exports = {
     content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
     theme: {
       extend: {
         colors: {
           brand: { /* 完整品牌色系 */ }
         }
       }
     }
   };
   ```

3. **更新 CSS 導入語法**：
   ```css
   /* globals.css - Tailwind CSS 4.x 新語法 */
   @import "tailwindcss";
   ```

**技術改進：**
- **版本相容性**：完全符合 Tailwind CSS 4.x 規範
- **品牌色系**：保留所有自定義品牌色彩變數
- **配置簡化**：優化 content 路徑匹配規則
- **樣式正常**：修復頁面跑版問題，所有 Tailwind 類別正常作用

**結果**：成功修復樣式載入問題，專案現在可以正常顯示 Tailwind CSS 樣式

### 2025-08-01 - Tailwind CSS PostCSS 配置修復

**✅ 修復 Tailwind CSS PostCSS 插件錯誤：**

- **問題**：Tailwind CSS 4.x 版本的 PostCSS 插件配置方式與舊版不同
- **解決方案**：更新 `postcss.config.js` 使用陣列方式引入插件
- **配置變更**：
  ```javascript
  // 修改前（物件語法）
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  }
  
  // 修改後（陣列語法）
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ]
  ```
- **結果**：成功修復 `Error: It looks like you're trying to use tailwindcss directly as a PostCSS plugin` 錯誤

### 2025-08-01 - Tailwind CSS 升級與品牌色系設定

**✅ Tailwind CSS 升級完成：**

- **版本升級**：從 `3.4.1` 升級至 `4.1.11` (最新版本)
- **配置方式變更**：採用 CSS Variables 方式在 `globals.css` 中設定自定義顏色
- **向後相容性**：保持 `tailwind.config.ts` 原有配置完整性

**✅ 自定義品牌色系設定：**

在 `src/app/globals.css` 中使用 CSS Variables 定義品牌色系：

```css
:root {
  --brand-text: #442A24;        /* 主要文字顏色 - 深棕色 */
  --brand-background: #979795;  /* 主要底色 - 中性灰 */
  --brand-secondary: #818C89;   /* 次要配色 - 藍灰色 */
  --brand-accent: #C57642;      /* 強調色 - 橙棕色 */
  --brand-white: #FFFFFF;       /* 純白色 */
  --brand-cream: #F1EBE5;       /* 米白色 - 背景用 */
  --brand-light: #DDDDD7;       /* 淺灰色 - 次要背景 */
  --brand-mint: #EAF0EE;        /* 淺綠色 - 輔助色 */
}
```

**可用的工具類別：**

```css
/* 文字顏色 */
.text-brand-text, .text-brand-secondary, .text-brand-accent

/* 背景顏色 */
.bg-brand-background, .bg-brand-secondary, .bg-brand-accent
.bg-brand-white, .bg-brand-cream, .bg-brand-light, .bg-brand-mint

/* 邊框顏色 */
.border-brand-text, .border-brand-background, .border-brand-secondary
.border-brand-accent, .border-brand-light
```

**技術優勢：**
- **CSS Variables**：支援動態主題切換和 JavaScript 操作
- **性能優化**：Tailwind CSS 4.x 更高效的 CSS 生成
- **維護性**：集中管理品牌色系，易於統一調整
- **靈活性**：可在運行時動態修改顏色值

### 2025-08-01 - 完整登錄系統實作

**✅ 登錄系統功能完成：**

- **後端 API 優化**：
  - 移除開放註冊功能，系統僅限管理員和教師使用
  - 限制登錄權限：只允許 ADMIN 和 TEACHER 角色登錄
  - 新增變更密碼 API：`PUT /api/auth/change-password`
  - 完整的密碼驗證與安全檢查

- **前端認證系統**：
  - 登錄頁面：`/zh/login` 和 `/en/login`
  - 系統儀表板：`/zh/dashboard` 和 `/en/dashboard`
  - 變更密碼頁面：`/zh/dashboard/change-password`
  - 完整的認證狀態管理與自動重定向

- **預設帳號建立**：
  - 管理員：`admin@cmyzu.edu.tw` / `123456`
  - 教師帳號：`teacher1@cmyzu.edu.tw` / `123456`
  - 提供建立腳本：`pnpm db:seed`

- **用戶體驗優化**：
  - 密碼顯示/隱藏切換功能
  - 密碼強度指示器
  - 完整的表單驗證與錯誤顯示
  - 中英文多語系支援
  - 響應式設計適配所有裝置

- **安全機制**：
  - JWT Token 認證
  - 密碼 bcrypt 加密
  - 自動登出機制
  - 權限檢查與路由保護

**使用方式：**

```bash
# 啟動後端（如未啟動）
cd backend && pnpm dev

# 啟動前端
pnpm dev

# 訪問登錄頁面
http://localhost:3001/zh/login
```

**Header 導航列優化：**
- 已登錄用戶顯示用戶頭像和姓名，不再顯示登入按鈕
- 用戶下拉菜單包含：用戶資訊、儀表板、變更密碼、登出功能
- 支援桌面版和手機版響應式設計
- 點擊外部自動關閉用戶菜單

**語言切換問題修復：**
- 修復切換語言時自動登出的問題
- 優化 AuthContext 初始化邏輯，靜默驗證 token
- 改進 API 攔截器，避免過度激進的自動登出
- 保持用戶登錄狀態在語言切換過程中的持續性

### 2025-08-01 - 前後端整合測試與資料庫設置

**✅ 測試完成項目：**

- **前端服務正常**：Next.js 開發服務運行在 http://localhost:3000
- **專案架構確認**：前後端分離架構設置正確
- **TypeScript 錯誤修復**：
  - 修復 ZodError 處理：`error.errors` → `error.issues`
  - 修復 Express 類型標註：加入 `Application` 和 `Router` 類型
- **PostgreSQL 資料庫設置**：
  - 創建新的 `cmyzu` 資料庫（不影響現有資料庫）
  - 配置正確的資料庫連線：`postgresql://eric@localhost:5432/cmyzu`
  - 執行 Prisma 資料庫遷移，創建所有必要表格
- **API 整合測試成功**：
  - 後端健康檢查：`http://localhost:4000/api/health` ✅
  - 用戶註冊 API：`POST /api/auth/register` ✅
  - 前端 Axios 客戶端配置正確

**🚀 一鍵啟動功能：**

創建了完整的一鍵啟動解決方案：

```bash
# 方法 1: 使用腳本
./start.sh

# 方法 2: 使用 pnpm 指令
pnpm start:all        # 啟動前後端
pnpm dev:frontend     # 只啟動前端
pnpm dev:backend      # 只啟動後端
```

**啟動腳本功能：**
- 自動檢查 PostgreSQL 服務狀態
- 自動創建 cmyzu 資料庫（如果不存在）
- 自動安裝依賴和執行資料庫遷移
- 同時啟動前後端服務
- 提供服務狀態檢查和錯誤處理
- 支援 Ctrl+C 優雅停止所有服務


### 2025-08-01 - 後端自動化檢查設定

**新增功能：**

- ✅ **後端 ESLint 配置**：為 backend 專案新增 ESLint v9 配置檔案
- ✅ **自動化 TypeScript 檢查**：修改 lint-staged 配置，後端檔案變更時自動執行編譯檢查
- ✅ **後端開發指令擴充**：新增 `pnpm lint`、`pnpm lint:fix`、`pnpm typecheck` 指令
- ✅ **前後端整合檢查**：Git commit 時同時檢查前端（ESLint + Prettier）和後端（TypeScript 編譯）

**提交流程優化：**

```bash
git add .
git commit -m "message"  # 自動檢查前後端代碼品質
git push
```

**檢查範圍：**
- 前端：`src/**/*.{js,jsx,ts,tsx}` → ESLint + Prettier
- 後端：`backend/src/**/*.ts` → TypeScript 編譯檢查
- 如有錯誤會阻止 commit，確保代碼品質

### 2025-07-31 - README.md 資訊更新

**更新項目：**

- ✅ **修正過期資訊**：移除前端專案中已不存在的 Prisma 資料庫指令
- ✅ **技術棧重新整理**：分為前端和後端兩個獨立章節，明確標示各自使用的技術
- ✅ **開發指令分類**：將前端和後端的開發指令分開說明，避免混淆
- ✅ **專案結構更新**：詳細描述前後端分離後的目錄結構
- ✅ **清理重複內容**：移除重複的 eslint 指令和無效的資料庫指令

**技術現況：**

- 前端：純 Next.js + TypeScript，移除 Prisma 依賴
- 後端：獨立 Express 專案，包含完整的 Prisma 資料庫管理
- 架構：前後端完全分離，可獨立部署和開發

### 2025-07-31 - 架構重構：前後端分離

**重大變更：**

- ✅ **建立獨立後端專案** (`/backend/`)
  - Node.js + Express + TypeScript 架構
  - JWT 認證系統與權限管理 (ADMIN/TEACHER/STUDENT)
  - 完整的 RESTful API 設計
  - Prisma ORM 資料庫管理
  - 錯誤處理與請求限制
  
- ✅ **重構前端為純 Next.js**
  - 移除 NextAuth.js，改用自定義認證
  - 新增 Axios HTTP 客戶端與 SWR 數據獲取
  - AuthContext 全域認證狀態管理
  - 前端完整錯誤顯示機制

- ✅ **API 端點設計**
  - `/api/auth` - 註冊、登入、用戶資料
  - `/api/users` - 用戶管理（管理員功能）
  - `/api/posts` - 文章 CRUD 操作
  - 完整的權限控制與資料驗證

**技術優勢：**

- **獨立部署**：前後端可分別部署與擴展
- **API 重用**：後端 API 可供網站、APP、第三方使用
- **更好的 SEO**：前端專注於 SSG/SSR 優化
- **權限管理**：完整的角色權限系統
- **錯誤處理**：前端顯示所有錯誤（符合要求）

**專案結構變更：**

```
├── backend/                 # 獨立後端專案
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── middleware/     # 中介軟體
│   │   └── server.ts       # 伺服器入口
│   ├── prisma/            # 資料庫模式
│   └── package.json       # 後端依賴
├── src/                   # 前端 Next.js
│   ├── contexts/          # React Context
│   ├── lib/api.ts         # API 客戶端
│   └── components/        # React 組件
```

### 2025-07-31 - 中英文切換功能修復

**修復項目：**

- ✅ 修復 Header 組件中語言切換按鈕無功能問題
- ✅ 添加 `useLocale`、`useRouter`、`usePathname` hooks 支援語言切換
- ✅ 實作 `handleLanguageSwitch` 函數，支援路由跳轉
- ✅ 優化桌面版語言切換按鈕，顯示當前語言狀態 (中文顯示 "EN"，英文顯示 "中文")
- ✅ 新增手機版語言切換功能，整合至導航選單
- ✅ 點擊切換語言後自動關閉手機選單，提升用戶體驗

**技術改進：**

- 語言切換邏輯：點擊按鈕自動在 `/zh` 和 `/en` 間切換
- 路徑保持：切換語言時保持當前頁面路徑
- 響應式設計：桌面版與手機版都支援語言切換
- 用戶體驗：清楚顯示切換後的目標語言

### 2025-08-03 - Header 導航欄完整重構與動畫系統

**✅ Header 收合展開功能重新實現：**

**核心功能實現：**

1. **恢復收合按鈕功能**：
   - 重新添加漢堡選單圖標和 X 關閉圖標
   - 實現圖標間的平滑切換動畫
   - 添加懸停和點擊效果

2. **Header 高度漸進式展開**：
   - 使用 `max-height` 實現從 `4rem` 到 `100vh` 的平滑展開
   - 800ms 的 `ease-in-out` 過渡動畫
   - 保持原本導航欄固定在頂部，下方區域逐漸延伸

3. **豐富的過渡動畫系統**：
   - **容器展開**：Header 高度變化 (800ms)
   - **內容淡入**：展開內容區域透明度和位移 (800ms，延遲150ms)
   - **導航項目階層動畫**：每個項目延遲 300ms + index × 150ms 依序出現
   - **圖標動畫**：縮放、旋轉、位移的複合效果
   - **文字動畫**：水平位移和透明度變化

4. **視覺效果增強**：
   - 導航卡片：毛玻璃背景、陰影效果、懸停縮放
   - 圖標容器：懸停旋轉和縮放效果
   - SVG 箭頭：懸停位移和縮放
   - 整體：漸進式出現，創造深度感

**背景色和染色效果探索：**

5. **多種染色動畫嘗試**：
   - 嘗試從左上角往右下角的漸變染色效果
   - 使用指定顏色 `#979795` 的多層動畫系統
   - 最終決定移除染色效果，保持乾淨的毛玻璃設計

**技術問題修復：**

6. **Sticky 定位修復**：
   - 修復 Header 在頁面滾動時消失的問題
   - 優化背景透明度設定（展開時從 0.9 調整為 0.2）
   - 確保毛玻璃效果正常工作

7. **布局優化**：
   - Header 內容水平置中
   - 響應式容器設計
   - z-index 層級管理

**最終效果：**

- ✅ 平滑的 Header 高度展開動畫（800ms）
- ✅ 豐富的導航項目漸入效果（階層式動畫）
- ✅ 完整的視覺反饋（懸停、點擊、過渡）
- ✅ 正常的 sticky 定位行為
- ✅ 優化的毛玻璃背景效果
- ✅ 水平置中的響應式布局

**結果**：Header 導航欄具備完整的展開/收合功能，包含豐富的動畫效果和優雅的視覺設計，提供卓越的用戶體驗。

### 2025-08-03 - 智能滾動狀態檢測與 Hover 控制系統

**✅ 完成滾動時禁用 hover 效果的智能控制系統：**

**問題解決：**
- 當用戶滾動頁面時，hover 動畫與滾動會產生衝突，造成視覺卡頓
- 提供更人性化的解決方案：滾動期間暫時禁用 hover 效果

**技術實現：**

1. **創建滾動狀態檢測 Hook**：
   ```typescript
   // src/hooks/useScrollState.ts
   export function useScrollState() {
     const [isScrolling, setIsScrolling] = useState(false);
     
     useEffect(() => {
       const scrollHandler = () => {
         setIsScrolling(true);
         // 滾動停止 150ms 後恢復 hover 效果
         setTimeout(() => setIsScrolling(false), 150);
       };
       
       window.addEventListener('scroll', scrollHandler);
       return () => window.removeEventListener('scroll', scrollHandler);
     }, []);
     
     return isScrolling;
   }
   ```

2. **全站組件集成滾動檢測**：
   - **ExploreSection**：Motion 動畫和 CSS hover 雙重控制
   - **NewsSection**：列表項目和按鈕 hover 效果控制
   - **StatsSection**：統計數據 hover 動畫控制
   - **FeaturesSection**：特色卡片 hover 效果控制

3. **智能 CSS 控制**：
   ```css
   /* 滾動時禁用所有 hover 效果 */
   .scroll-disabled:hover .group-hover\:opacity-15 {
     opacity: 0 !important;
   }
   
   .scroll-disabled .hover\:shadow-lg:hover {
     box-shadow: inherit !important;
   }
   ```

4. **Motion 動畫條件控制**：
   ```tsx
   <motion.div
     whileHover={!isScrolling ? { 
       y: -8, scale: 1.02 
     } : {}}
     className={`group ${isScrolling ? 'scroll-disabled' : ''}`}
   >
   ```

**技術特點：**

- **即時響應**：滾動開始立即禁用 hover，停止後 150ms 恢復
- **全面覆蓋**：涵蓋 Framer Motion 動畫和 CSS Hover 效果
- **性能優化**：使用被動事件監聽，不影響滾動性能
- **用戶友善**：保持正常滾動體驗，僅在必要時禁用 hover

**使用者體驗提升：**

- **流暢滾動**：消除滾動時的 hover 動畫衝突
- **自然互動**：滾動停止後立即恢復正常 hover 效果
- **視覺穩定**：避免滾動期間的視覺干擾和卡頓
- **智能檢測**：自動判斷滾動狀態，無需用戶干預

**結果**：成功實現智能滾動檢測系統，在保持豐富互動效果的同時提供流暢的滾動體驗

### 2025-08-03 - ExploreSection 動畫效果優化

**✅ 完成探索學院區塊動畫效果優化：**

**優化重點：**

1. **簡化過度複雜的動畫效果**：
   - 移除過於浮誇的 3D 旋轉效果（rotateY、rotateX）
   - 保留核心的懸停動畫：向上移動和輕微縮放
   - 減少視覺干擾，提升用戶體驗

2. **動畫性能優化**：
   ```tsx
   // 簡化後的動畫效果
   whileHover={{ 
     y: -8,        // 向上移動 8px
     scale: 1.02,  // 輕微縮放
   }}
   transition={{ 
     duration: 0.15,  // 加速動畫響應
     ease: "easeOut"
   }}
   ```

3. **粒子效果簡化**：
   - 粒子數量從 8 個減少至 3 個
   - 優化動畫時長和透明度
   - 減少 CPU 和 GPU 負擔

4. **光暈效果優化**：
   - 移除複雜的呼吸動畫效果
   - 使用靜態光暈提升視覺品質
   - 保持專業外觀同時提升性能

**技術改進：**

- **動畫流暢性**：簡化複雜的變換，提升動畫流暢度
- **載入性能**：減少不必要的動畫計算，提升頁面性能
- **視覺清晰度**：移除過度動畫，突出內容本身
- **用戶體驗**：保持互動性同時避免視覺疲勞

**結果**：成功優化動畫效果，在保持現代感設計的同時提供更穩定流暢的用戶體驗

### 2025-08-02 - Header 導航欄 Mega Menu 移除簡化

**✅ 移除複雜的全螢幕 Mega Menu 功能：**

**重大變更：**

1. **清理狀態管理**：
   - 移除 `isNavMenuOpen` 狀態和 `navMenuButtonRef`
   - 簡化 `useEffect` 外部點擊偵測邏輯
   - 移除導航選單按鈕相關的狀態管理

2. **移除 UI 元件**：
   - 刪除桌面版的導航選單按鈕（漢堡選單圖標）
   - 移除整個 Mega Menu DOM 結構
   - 清理相關的 SVG 圖標和動畫效果

3. **簡化功能**：
   - 移除 `getNavigationDescription` 功能函數
   - 清理不必要的導航項目描述邏輯
   - 保持現有的基本導航功能

**保留功能**：

- ✅ 基本的桌面版水平導航選單
- ✅ 手機版彈出式導航選單
- ✅ 語言切換功能
- ✅ 用戶登入/登出功能
- ✅ 響應式設計

**結果**：Header 導航欄回歸簡潔設計，專注於基本導航功能，移除複雜的全螢幕選單體驗

### 2025-08-03 - 最新消息區塊堆積木動態效果實現

**✅ 完成最新消息區塊堆積木動態效果：**

**核心功能實現：**

1. **堆積木動畫原理**：
   - 每3秒執行一次動畫循環
   - 底部新聞項目消失（向下移出）
   - 頂部新增新的新聞項目（從上方進入）
   - 類似積木堆疊的視覺效果

2. **動畫技術細節**：
   ```tsx
   // 每3秒執行堆積木動畫
   const interval = setInterval(() => {
     setDisplayNews((prev) => {
       const newNews = [...prev];
       newNews.pop();    // 移除底部項目
       const nextItem = news[currentIndex % news.length];
       newNews.unshift({ ...nextItem, id: Date.now() + Math.random() });  // 頂部新增
       return newNews;
     });
   }, 3000);
   ```

3. **Framer Motion 動畫效果**：
   - **進入動畫**：新項目從上方（y: -100）淡入並縮放
   - **退出動畫**：底部項目向下（y: 100）淡出並縮放
   - **彈性過渡**：使用 spring 動畫類型，創造自然彈性效果
   - **AnimatePresence**：管理項目的進入和退出動畫

4. **Hover 暫停功能**：
   - 滑鼠懸停於新聞區域時自動暫停動畫
   - 離開時恢復動畫循環
   - 提供更好的閱讀體驗

**技術實作：**

```tsx
// 動畫配置
initial={{ 
  opacity: 0, 
  y: index === 0 ? -100 : 100,  // 頂部進入，底部退出
  scale: 0.8
}}
animate={{ 
  opacity: 1, 
  y: 0,
  scale: 1
}}
exit={{ 
  opacity: 0, 
  y: index === displayNews.length - 1 ? 100 : -100,
  scale: 0.8
}}
transition={{ 
  duration: 0.8,
  type: "spring",
  stiffness: 100,
  damping: 20
}}
```

**使用者體驗優化：**

- **視覺吸引力**：動態效果吸引用戶注意最新消息
- **閱讀友善**：hover 時暫停，不干擾閱讀
- **流暢動畫**：彈性過渡效果自然順滑
- **無限循環**：自動循環展示所有新聞項目

**結果**：成功實現堆積木動態效果，底部抽離頂部新增，hover時暫停，提供引人注目的動態新聞展示體驗

**✅ 2025-08-03 後續優化 - 滾動觸發動畫與6項目顯示：**

**功能改進：**

1. **增加顯示數量**：
   - 從原本顯示4個新聞項目增加到6個
   - 調整Grid佈局為 `md:grid-cols-2 lg:grid-cols-3`
   - 平板顯示2欄，桌面顯示3欄，提供更豐富的內容展示

2. **滾動觸發動畫系統**：
   ```tsx
   // 添加視窗檢測狀態
   const [isInView, setIsInView] = useState(false);
   
   // 動畫條件改進
   useEffect(() => {
     if (isPaused || !isInView) return;  // 只有在視窗內且非hover時才執行
     // ... 動畫邏輯
   }, [isPaused, isInView, currentIndex, news]);
   ```

3. **Framer Motion 視窗檢測**：
   ```tsx
   <motion.div
     onViewportEnter={() => setIsInView(true)}
     onViewportLeave={() => setIsInView(false)}
   >
   ```

**技術優化：**

- **性能提升**：動畫只在用戶看到section時執行，減少不必要的計算
- **用戶體驗**：避免在用戶未注意時浪費動畫效果
- **電池友善**：減少背景動畫對行動裝置電池的消耗
- **視覺協調**：動畫開始時機更符合用戶期望

**布局改進**：

- **更多內容**：一次展示6個最新消息，資訊量翻倍
- **響應式優化**：
  - 手機：1欄顯示
  - 平板：2欄顯示  
  - 桌面：3欄顯示
- **視覺平衡**：3欄佈局在大螢幕上提供更好的視覺平衡

**結果**：優化後的新聞區塊展示更多內容，動畫觸發更精確，提供更好的性能和用戶體驗

### 2025-08-03 - 系所學程翻譯修復

**✅ 修復 Departments 翻譯缺失問題：**

**問題診斷：**
- IntlError: `Departments` 在中文語系中找不到對應翻譯
- DepartmentsSection.tsx 使用了 `useTranslations('Departments')` 但翻譯檔案中缺少此區塊
- 導致頁面無法正常載入

**解決方案：**

1. **新增中文翻譯** (`messages/zh.json`)：
   - 新增完整的 `Departments` 翻譯區塊
   - 包含標題、描述、4個系所的標題和描述
   - 新增 `learn_more` 和 `view_all` 按鈕翻譯

2. **新增英文翻譯** (`messages/en.json`)：
   - 對應的英文版 `Departments` 翻譯內容
   - 補齊缺失的 news_4, news_5, news_6 新聞翻譯

**翻譯內容：**
- **企業管理學系**：Business Administration
- **資訊管理學系**：Information Management  
- **財務金融學系**：Finance
- **國際商務學程**：International Business

**修復結果：**
- ✅ 中文頁面正常載入系所學程區塊
- ✅ 英文頁面正常載入系所學程區塊
- ✅ 所有翻譯鍵值完整對應
- ✅ 多語系系統完整性恢復

**結果**：成功修復翻譯缺失問題，系所學程區塊在中英文環境下正常運作

### 2025-08-03 - 系所學程區塊新增

**✅ 完成首頁「系所學程」section 新增：**

**功能新增：**

1. **新增 DepartmentsSection 組件**：
   - 建立 `/src/components/layout/DepartmentsSection.tsx`
   - 採用與現有設計一致的毛玻璃背景效果
   - 使用 2x2 Grid 佈局展示 4 個系所學程項目
   - 整合浮誇動畫效果與視覺元素

2. **4大系所學程項目**：
   - **企業管理學系**：策略管理、行銷管理、人力資源專業培訓
   - **資訊管理學系**：AI應用、大數據分析、系統開發技能
   - **財務金融學系**：投資分析、風險管理、金融科技應用
   - **國際商務學程**：國際貿易、跨文化管理、全球商務視野

3. **特色標籤系統**：
   - 每個系所顯示 3 個核心特色標籤
   - 使用漸層背景與白色文字的藥丸型設計
   - 懸停時有縮放動畫效果
   - 提供快速的系所特色識別

4. **自定義 SVG 圖標系統**：
   - 為每個系所設計專屬圖標
   - 企管：建築物圖標、資管：電腦螢幕圖標
   - 財金：錢幣圖標、國商：地球圖標
   - 使用統一的 `w-12 h-12` 尺寸和品牌主色

5. **豐富動畫效果設計**：
   - 標題浮誇進場動畫（rotateX + scale + translateY）
   - 卡片超浮誇進場動畫（rotateY + scale + blur）
   - 圖標旋轉飛入動畫（720度旋轉 + 縮放）
   - 浮動粒子背景與打字機文字效果

**技術實作：**

```tsx
// 毛玻璃卡片設計
<div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 border border-white/30 shadow-xl">

// 2x2 Grid 響應式佈局
<div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">

// 特色標籤設計
<span className="feature-tag px-3 py-1 text-sm font-medium bg-gradient-to-r ${department.gradient} text-white rounded-full shadow-md">
```

**頁面整合：**

6. **首頁佈局更新**：
   - 在 ExploreSection 下方插入 DepartmentsSection
   - 保持與其他 section 一致的間距和背景
   - 維持整體頁面的視覺流暢性

7. **互動效果增強**：
   - 卡片懸停時向上浮起並放大（hover:-translate-y-12 + scale-1.03）
   - 特色標籤懸停縮放效果
   - 箭頭移動動畫與背景透明度變化
   - 流暢的 300ms 過渡效果

**設計特色：**

- **視覺一致性**：與現有毛玻璃設計完美融合
- **響應式設計**：桌面 2 欄、手機 1 欄佈局
- **動畫豐富性**：超浮誇進場動畫、懸停效果、粒子背景
- **內容豐富性**：4 個維度全面展示系所學程特色
- **國際化支援**：完整的中英文雙語內容

**結果**：成功新增「系所學程」區塊，提供豐富的學程資訊展示，增強首頁內容多樣性與教育專業性

### 2025-08-03 - 中文翻譯錯誤修復

**✅ 修復最新消息區塊中文翻譯缺失問題：**

**問題診斷：**
- IntlError: `News.news_6_title` 和 `News.news_6_excerpt` 在中文語系中找不到對應翻譯
- NewsSection.tsx 中使用了 6 個新聞項目，但中文翻譯檔案只有前 3 個項目的翻譯
- 錯誤發生在第 6 個新聞項目的標題和摘要翻譯

**解決方案：**

1. **補齊缺失的翻譯鍵值**：
   - 在 `messages/zh.json` 中新增 `news_4_title`, `news_4_excerpt`
   - 新增 `news_5_title`, `news_5_excerpt`
   - 新增 `news_6_title`, `news_6_excerpt`

2. **翻譯內容對應**：
   - news_4: "臺大特色課程系列報導－國際學院「走出教室 走入實地災防與永續」"
   - news_5: "光影築夢 臺大「戲夢空間」首場燈光秀圓滿落幕"
   - news_6: "臺北市政府青年局X臺大D-School《跨越國界：國際交流與實習經驗分享》"

**修復結果：**
- ✅ 中文頁面不再出現 IntlError 錯誤訊息
- ✅ 所有 6 個新聞項目在中文頁面正常顯示
- ✅ 翻譯內容與 NewsSection.tsx 中的 defaultValue 保持一致
- ✅ 多語系系統完整性得到保障

**結果**：成功修復中文翻譯缺失問題，確保最新消息區塊在中文環境下正常運作

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

### 2025-08-03 - 系所學程滾動優化

**修復項目：**

- ✅ 新增 `useScrollState` hook 用於檢測滾動狀態
- ✅ 修改 `DepartmentsSection` 元件引入滾動狀態檢測
- ✅ 在滾動期間禁用 hover 效果，避免不必要的動畫觸發
- ✅ 優化使用者體驗，滾動時卡片不會意外觸發 hover 動畫

**技術改進：**

- 使用防抖機制檢測滾動結束（150ms 延遲）
- CSS 選擇器優化：`:not(.scrolling):hover` 條件式 hover 效果
- 動態 className 控制，根據滾動狀態切換樣式
- 提升觸控裝置和滾動操作的使用體驗

### 2025-08-03 - 統計數據動畫優化

**修復項目：**

- ✅ 修復 `useCountAnimation` hook 中動畫重複觸發問題
- ✅ 解決年辦學歷史顯示為0的閃爍問題
- ✅ 優化動畫觸發機制，確保每個統計項目只執行一次動畫

**技術改進：**

- 移除 `useCallback` 依賴造成的重複執行問題
- 使用 `useRef` 保存動畫函數，避免不必要的重新渲染
- 添加延遲機制防止數字閃爍，改善使用者體驗
- 移除 `useEffect` 不必要的依賴項，確保只在組件掛載時執行一次

### 2025-08-03 - 緊急錯誤修復

**修復項目：**

- ✅ 修復 `useCountAnimation` hook 中 `isAnimating` 變數未定義錯誤
- ✅ 修復 `Invalid locale received: undefined` 國際化錯誤
- ✅ 強化 i18n 配置的錯誤處理機制

**技術改進：**

- 移除未使用的 `isAnimating` 狀態返回值
- 添加 locale 驗證的容錯機制，預設使用 `zh` locale
- 添加 messages 載入失敗的 fallback 機制
- 確保應用程式在異常情況下仍能正常運作

### 2025-08-03 - 動畫重複執行最終修復

**修復項目：**

- ✅ 徹底修復統計數據動畫每次滾動都重複執行的問題
- ✅ 確保動畫只在首次進入視窗時執行一次，不會因為滾動而重複觸發
- ✅ 優化動畫觸發機制的可靠性

**技術改進：**

- 使用 `useRef` 追蹤觸發狀態，避免 React 狀態更新延遲問題
- 同時維護 ref 和 state，確保立即檢查和外部狀態同步
- 在 IntersectionObserver 回調中使用 ref 進行即時檢查
- 提升動畫系統的穩定性和用戶體驗

### 2025-08-03 - 修正滾動動畫重複執行問題 (第二次修復)

**修復項目：**

- ✅ 修正 `useCountAnimation` hook 中動畫 ID 不穩定導致的重複執行問題
- ✅ 改善全域狀態追蹤機制，確保動畫只執行一次
- ✅ 優化 StatsSection 組件的 key 屬性使用

**技術改進：**

- 修正動畫 ID 生成邏輯，避免 `Math.random()` 造成的不一致性
- 在 useEffect 開始時就檢查動畫狀態，避免不必要的觀察器創建
- 動畫完成後立即停止觀察器，防止後續觸發
- 使用穩定的 key 值 `stat-${stat.value}-${stat.suffix}` 取代 index

### 2025-08-03 - 根本性修復動畫重複執行問題 (最終版)

**真正的問題根因：**

- ✅ **主要原因**：StatsSection 組件使用了 `useScrollState` hook
- ✅ `useScrollState` 每次滾動都會觸發狀態更新，導致組件重新渲染
- ✅ 組件重新渲染會重新創建 `useCountAnimation` hook 實例
- ✅ 新的 hook 實例無法記住之前的動畫狀態，導致重複執行

**最終修復方案：**

- ✅ 移除 StatsSection 中不必要的 `useScrollState` 使用
- ✅ 重寫 `useCountAnimation` 使用全域 Set 追蹤已動畫的 DOM 元素
- ✅ 使用 `useCallback` 優化動畫函數，避免不必要的重新創建
- ✅ 動畫觸發後立即停止 IntersectionObserver，防止重複觸發

**技術改進：**

- 使用全域 `Set<HTMLElement>` 追蹤已動畫的實際 DOM 元素
- 移除導致組件重新渲染的不必要狀態監聽
- 簡化動畫邏輯，提升性能和可靠性
- 徹底解決滾動動畫重複執行問題

### 2025-08-03 - 修正統計數據動畫影響間距問題

**修復項目：**

- ✅ 移除動畫中的 `scale` 變化，避免影響元素尺寸
- ✅ 調整 hover 效果，只對圖標進行縮放，不影響整體佈局
- ✅ 使用固定容器高度 `min-h-[180px]` 確保間距穩定
- ✅ 優化響應式間距設定 `gap-8 md:gap-14`

**技術改進：**

- 將 `initial={{ scale: 0.8 }}` 改為只使用 opacity 和 y 位移動畫
- hover 時只縮放圖標 `group-hover:scale-110`，不縮放整個卡片
- 使用 flexbox 居中對齊，確保內容垂直置中
- 統一卡片高度，防止不同內容長度影響佈局

### 2025-08-03 - 修正動畫結束後佈局瞬移問題

**修復項目：**

- ✅ 移除動態 `text-shadow-lg` 樣式，避免動畫結束時突然變化
- ✅ 數字格式化使用 `Math.round()` 確保整數顯示一致性
- ✅ 數字容器使用固定最小寬度 `min-w-[120px] md:min-w-[140px]`
- ✅ 確保動畫過程中和結束後佈局完全穩定

**技術改進：**

- 移除會在動畫結束後突然出現的動態樣式
- 使用 `tabular-nums` 字體變體確保數字等寬顯示
- 數字容器固定寬度和居中對齊，防止位數變化影響佈局
- 統一數字格式化邏輯，避免小數點導致的佈局跳動

### 2025-08-03 - 徹底解決間距瞬移問題 (最終方案)

**根本解決方案：**

- ✅ 完全移除 motion.div 的位移動畫 (`y: 30` 到 `y: 0`)
- ✅ 移除基於 `hasAnimated` 狀態的動態樣式變化
- ✅ 數字容器使用固定寬度 `w-[140px] md:w-[160px]` 而非最小寬度
- ✅ 簡化為純 div 元素，移除所有可能影響佈局的動畫

**技術改進：**

- 使用固定寬度而非最小寬度，確保容器始終占用相同空間
- 移除所有垂直位移和縮放動畫，只保留透明度變化
- 數字計數動畫與佈局完全解耦，不影響視覺排版
- 確保動畫過程中和結束後佈局完全靜態穩定
