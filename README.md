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
