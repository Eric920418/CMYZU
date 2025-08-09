# CMYZU 學校官方網站

一個使用 Next.js 14 構建的現代化學校官方網站，支援多語系、SEO 優化、響應式設計和先進的內容管理功能。

## 📅 更新記錄

### 2025-08-09 修復 ESLint 錯誤和代碼品質問題 
#### 🐛 程式碼品質修復：
- **移除未使用變數和函數參數**：
  - 修復 `dashboard/page.tsx` 中未使用的 `handleLogout` 和 `logout` 變數
  - 修復 `DashboardLayout.tsx` 中未使用的 `user` 變數  
  - 修復 `LiveUpdatesSection.tsx` 中未使用的 `useTranslations` import
  - 修復 API 路由中未使用的 `request` 參數和 `NextRequest` import
  - 修復各存儲層中未使用的類型定義和變數

- **React Hook 依賴項優化**：
  - 使用 `useCallback` 包裝 `fetchAlumni`, `fetchLiveUpdates`, `fetchNews` 函數
  - 修復 Hook 依賴項警告，確保依賴陣列正確性
  - 優化 React 性能，避免不必要的重新渲染

- **圖片組件性能提升**：
  - 替換 `img` 標籤為 Next.js `Image` 組件
  - 修復校友管理頁面和圖片上傳組件中的圖片顯示
  - 加入 `sizes` 屬性優化圖片載入性能
  - 使用 `fill` 屬性配合相對定位容器

- **ESLint 規範修復**：
  - 修復所有 `@typescript-eslint/no-unused-vars` 錯誤
  - 添加 `eslint-disable` 註解處理必要的未使用變數 
  - 確保程式碼符合團隊規範和最佳實踐

#### ✅ 修復成果：
- ✅ 成功修復 13 個 ESLint 錯誤，程式碼品質大幅提升
- ✅ 通過 pre-commit hook 檢查，確保 commit 品質
- ✅ React Hook 性能優化，減少不必要的重新渲染
- ✅ 圖片載入性能提升，更好的 LCP 和頻寬使用
- ✅ 程式碼維護性增強，移除冗餘代碼

### 2025-08-09 重構：分離即時動態為獨立 Section
#### 🔄 組件重構：
- **創建新的 LiveUpdatesSection 組件**：
  - 從 NewsSection 中完全分離即時動態功能
  - 獨立的組件檔案：`/src/components/layout/LiveUpdatesSection.tsx`
  - 包含完整的加載狀態、錯誤處理和空狀態顯示
  - 支援自動輪播和指示器導航
- **重構 NewsSection 組件**：
  - 移除所有即時動態相關邏輯和狀態
  - 清理不必要的 hooks 和 imports
  - 簡化組件結構，專注於新聞內容展示
- **更新主頁面結構**：
  - 在主頁面中將 LiveUpdatesSection 放置在 NewsSection 下方
  - 保持頁面佈局的邏輯性和使用者體驗

#### ✅ 重構優勢：
- ✅ 組件職責更加明確，符合單一責任原則
- ✅ 代碼可維護性大幅提升
- ✅ 更好的 SEO 結構化設計
- ✅ 獨立組件便於後續功能擴展
- ✅ 減少組件複雜度，提升性能

### 2025-08-09 優化 NewsSection 輪播性能和按鈕體驗
#### 🚀 性能優化：
- **左右按鈕固定位置**：
  - 將輪播按鈕改為 `fixed` 定位，確保按鈕位置固定不會隨容器移動
  - 按鈕位置：左側 `left-4`，右側 `right-4`，垂直居中
  - 增加 `z-20` 確保按鈕始終在最上層
  - 添加按鈕hover縮放效果 `hover:scale-110` 提升互動體驗
- **簡化輪播動畫**：
  - 移除複雜的 `AnimatePresence` 和多層動畫嵌套
  - 簡化為單層動畫：僅保留整體容器的淡入淡出效果
  - 動畫時間縮短至 0.2 秒，減少卡頓感
  - 移除個別項目的延遲動畫，統一切換體驗
- **優化輪播邏輯**：
  - 使用 `useMemo` 記憶化 `visibleItems` 計算，避免重複渲染
  - 簡化 `getVisibleItems` 函式為高效的 `slice` 操作
  - 減少不必要的循環和條件判斷
  - 動畫過渡時間統一為 200ms，提升響應速度

#### ✅ 優化結果：
- ✅ 輪播按鈕現在完全固定，不會隨容器內容變化而移動
- ✅ 動畫流暢度大幅提升，消除卡頓問題
- ✅ CPU 使用率降低，記憶體消耗減少
- ✅ 使用者操作體驗更加順暢
- ✅ 減少 DOM 重複渲染次數
- ✅ 分離新聞輪播容器和即時動態區塊寬度控制，即時動態寬度不再受新聞數量影響
- ✅ 移除即時動態區塊的多餘左右按鈕，保持界面簡潔

### 2025-08-09 修復新聞頁面輪播指示器和動畫性能問題
#### 🐛 問題修復：
- **修復輪播指示器數量邏輯錯誤**：
  - 解決指示器數量與實際顯示內容不匹配的問題（4個指示器但只顯示3張卡片）
  - 修改指示器計算邏輯：從總新聞數量改為根據可視內容頁數計算
  - 使用 `Math.ceil(newsItems.length / visibleItems)` 計算正確的指示器數量
- **修復輪播分頁顯示邏輯錯誤**：
  - 解決第二頁重複顯示新聞的問題（4篇新聞錯誤顯示成6篇）
  - 修正 `getVisibleItems` 函式，從循環邏輯改為正確的分頁邏輯
  - 修正輪播控制函式 `nextSlide/prevSlide`，改為按頁跳轉而非按項目跳轉
  - 確保第二頁只顯示剩餘的新聞項目（4篇新聞：第一頁3篇，第二頁1篇）
- **優化輪播動畫性能**：
  - 減少動畫位移距離：從300px縮減至50px，降低視覺衝擊
  - 縮短動畫持續時間：從0.6秒減少到0.3秒，提升流暢度
  - 減少動畫延遲：從0.1秒縮減至0.05秒，加快響應速度
  - 調整自動輪播間隔：從4秒增加到5秒，提供更充裕的閱讀時間

- **修復輪播新聞卡片寬度問題**：
  - 解決輪播最後一頁只有單篇新聞時卡片過窄的視覺問題
  - 修改卡片寬度邏輯：根據**當前頁面實際顯示項目數**動態調整寬度
  - 單篇新聞：使用 `w-full max-w-6xl mx-auto` (全寬度居中，最大1152px)
  - 輪播頁單篇：使用 `w-full max-w-2xl mx-auto` (全寬度居中，最大672px)  
  - 調整圖片高度：從 `h-64 md:h-80` 改為 `h-48 md:h-64 lg:h-72`
  - 確保所有輪播頁面的卡片都有合適且一致的視覺呈現

#### ✅ 修復結果：
- ✅ 輪播指示器數量現在正確對應實際可視頁數（2個指示器）
- ✅ 分頁顯示正確：第一頁顯示3篇，第二頁顯示1篇，總計4篇新聞
- ✅ 單篇新聞時卡片寬度適中，視覺效果更佳
- ✅ 動畫切換更加流暢，減少卡頓現象
- ✅ 使用者體驗顯著提升，輪播操作更直觀
- ✅ 性能優化，降低 CPU 使用率

### 2025-08-09 修復新聞發佈功能和資料類型不一致問題
#### 🐛 問題修復：
- **修復 updatedAt.getTime() 錯誤**：
  - 修正 `/src/app/[locale]/dashboard/news/page.tsx` 第316行的日期格式問題
  - 將 `item.updatedAt.getTime()` 改為 `new Date(item.updatedAt).getTime()` 處理序列化後的日期字串
  - 解決 "TypeError: item.updatedAt.getTime is not a function" 錯誤
- **修復新聞發佈/下架切換功能**：
  - 修正前端與後端 API 資料欄位不一致問題（`isPublished` vs `published`）
  - 統一使用 `published` 欄位名稱，與 Prisma 模型保持一致
  - 修正 `togglePublishStatus` 函式使用正確的 PATCH API 端點
  - 更新 TypeScript 類型定義 `/src/types/dashboard.ts` 中的 News 介面
- **改善發佈狀態顯示**：
  - 統一所有發佈狀態相關的 UI 組件使用 `published` 屬性
  - 修正狀態標籤和操作按鈕的條件判斷
  - 確保發佈/取消發佈功能正常運作

#### ✅ 修復結果：
- ✅ 解決新聞列表頁面載入時的運行錯誤
- ✅ 新聞發佈/下架切換按鈕功能正常運作  
- ✅ 狀態顯示（已發布/草稿）正確更新
- ✅ 前後端資料結構保持一致
- ✅ TypeScript 類型檢查通過，無類型錯誤

### 2025-08-09 修復 NewsSection 圖片更新功能問題
#### 🐛 問題修復：
- **修復新聞圖片 URL 無效錯誤**：
  - 移除了 NewsSection.tsx 中使用時間戳作為圖片 key 的邏輯，避免產生無效的 data URL
  - 添加圖片錯誤處理機制，當圖片載入失敗時自動切換到預設佔位圖
  - 建立 placeholder-news.svg 作為新聞圖片預設顯示
  - 修復 GET data:image/png;base64...=?t=xxx net::ERR_INVALID_URL 錯誤
- **改善前台 API 圖片處理邏輯**：
  - 優化 /api/news/route.ts 中的 imageUrl 欄位處理
  - 確保空字串或純空白的 imageUrl 轉為 null，讓前端使用 fallback 圖片
  - 提升圖片顯示的穩定性和用戶體驗

#### ✅ 修復結果：
- ✅ 解決新聞區塊圖片載入錯誤 net::ERR_INVALID_URL  
- ✅ 修復圖片更新後仍顯示舊圖片的緩存問題
- ✅ 新聞圖片更新功能正常運作，支援上傳和即時顯示更新
- ✅ 前台新聞輪播圖片顯示穩定，無載入失敗問題
- ✅ 後台管理頁面圖片顯示優化，避免無效 data URL
- ✅ ImageUpload 組件優化，正確處理 data URL 和時間戳
- ✅ 提升整體用戶體驗，避免破圖顯示

### 2025-08-09 修復前端錯誤和缺少翻譯
#### 🐛 問題修復：
- **修復新聞編輯頁面 setImagePreview 未定義錯誤**：
  - 修復 `/src/app/[locale]/dashboard/news/[id]/edit/page.tsx` 第54和84行的錯誤
  - 添加缺少的 `imagePreview` 狀態定義
  - 解決 "載入新聞失敗: setImagePreview is not defined" 錯誤
- **修復翻譯訊息缺失錯誤**：
  - 在 `messages/zh.json` 中添加缺失的翻譯鍵
  - 修復 `DashboardPage.admin-tools-desc` 和 `DashboardPage.system-settings`
  - 解決控制台中的 MISSING_MESSAGE 錯誤
- **修復 Image 元件缺少 src 屬性錯誤**：
  - 修復校友管理頁面中的圖片顯示條件檢查
  - 改善 `item.imageUrl && item.imageUrl.trim() !== ''` 條件判斷
  - 避免空字符串導致的 Image 元件 src 屬性缺失
- **修復圖片上傳功能問題**：
  - 修復 ImageUpload 組件的預覽狀態同步問題
  - 添加 useEffect 確保 currentImage 變更時更新預覽
  - 移除新聞創建/編輯頁面中多餘的 setImagePreview 調用
  - 簡化圖片預覽邏輯，由 ImageUpload 組件完全控制
  - 修復上傳 API 檔案格式檢查，支援副檔名作為 MIME 類型後備檢查
  - 確保上傳成功後 preview 狀態正確保持圖片顯示
- **修復前台新聞圖片顯示問題**：
  - 修復前台 API (`/api/news/route.ts`) 的欄位映射問題
  - 將資料庫的 `imageUrl` 欄位映射到前台組件期望的 `image` 欄位
  - 確保前台新聞輪播正確顯示新聞圖片，而非空白灰色區塊
  - 使用發布時間作為前台顯示的日期
  - 清理調試代碼，移除所有 console.log 和調試信息
- **修復後台新聞管理頁面圖片顯示錯誤**：
  - 修復新聞管理頁面 (`/dashboard/news/page.tsx`) 中的 Image 組件 src 屬性錯誤
  - 正確使用 `item.imageUrl` 而非 `item.image` 作為圖片來源
  - 添加圖片載入的條件檢查，當沒有圖片時顯示預設圖標
  - 更新 News 類型定義，明確標示 `imageUrl` 為主要欄位，`image` 為前台相容欄位
- **重構圖片存儲系統 - 從 public 目錄遷移到獨立存儲**：
  - 在 `.env` 中新增 `UPLOADS_DIR` 環境變數配置專用圖片存儲目錄
  - 創建 `/storage/uploads/` 目錄作為圖片專用存儲位置，避免 Next.js public 目錄重啟才能讀取的問題
  - 修改上傳 API (`/api/upload/route.ts`) 使用新的存儲目錄路徑
  - 創建圖片服務 API (`/api/images/[filename]/route.ts`) 提供圖片訪問服務
  - 更新種子數據中的圖片路徑使用新的 API 格式 (`/api/images/filename.webp`)
  - 重新運行種子數據更新數據庫中的圖片路徑
  - 解決圖片緩存問題：修改緩存策略、新增 ETag 支援、為 Image 組件新增 key 屬性強制重新渲染
  - 更新 Next.js 配置 (`next.config.mjs`) 允許 API 路由圖片訪問
  - 解決之前的 `GET http://localhost:3000/_next/image?url=...&w=256&q=75 400 (Bad Request)` 錯誤

#### ✅ 修復結果：
- ✅ 新聞編輯頁面不再出現 setImagePreview 錯誤，可正常使用圖片預覽功能
- ✅ 後台管理頁面翻譯完整，無缺失訊息錯誤
- ✅ 校友管理頁面圖片正確顯示，無 React 警告
- ✅ 圖片上傳功能完全正常運作，預覽即時更新且持續顯示
- ✅ ImageUpload 組件狀態管理改善，支援動態 currentImage 更新
- ✅ 上傳 API 支援多種檔案格式檢查方式，更加穩定可靠
- ✅ 新聞管理頁面 500 錯誤已修復，three.js 模組衝突問題解決
- ✅ 前台新聞輪播正確顯示圖片，不再出現空白灰色區塊
- ✅ 欄位映射問題已修復，前台 API 正確返回組件期望的資料格式
- ✅ 後台新聞管理頁面圖片正確顯示，不再出現 Image src 屬性錯誤
- ✅ 圖片欄位統一化：後台使用 imageUrl，前台透過 API 映射取得 image
- ✅ 圖片存儲系統重構完成，使用獨立的 `/storage/uploads/` 目錄
- ✅ 圖片上傳無需重啟服務器，支援即時訪問和更新
- ✅ 新的圖片服務 API 支援安全檢查、快取最佳化和多格式支援
- ✅ Next.js Image 組件 400 錯誤已修復，所有圖片正確透過 API 路由載入
- ✅ 環境變數配置靈活，可輕鬆更換存儲位置
- ✅ 前端控制台乾淨，無 React 錯誤和警告，調試代碼已清理

### 2025-08-09 修復編譯錯誤並安裝缺少的套件
#### 🐛 問題修復：
- **修復模組找不到錯誤**：
  - 安裝 `react-hot-toast` 套件，解決 `Module not found: Can't resolve 'react-hot-toast'` 錯誤
  - 安裝 `@heroicons/react` 套件，解決 `Module not found: Can't resolve '@heroicons/react/24/outline'` 錯誤
  - 修復大量 ESLint 錯誤：移除未使用的變數、import、函數參數
  - 修復 `prefer-const` 錯誤：將 `let` 改為 `const` for 未重新賦值的變數

#### ✅ 修復結果：
- ✅ 專案成功編譯，不再出現模組找不到錯誤
- ✅ 大幅減少 ESLint 錯誤數量，提升程式碼品質
- ✅ 移除未使用的 imports 和變數，清理程式碼
- ✅ 所有套件相依性問題解決，開發環境穩定運行

### 2025-08-09 修復 React hooks 使用規則違反錯誤
#### 🐛 問題修復：
- **修復 Invalid hook call 錯誤** (`/src/components/ClientLayoutWrapper.tsx`):
  - 解決 `TypeError: Cannot read properties of null (reading 'useContext')` 錯誤
  - 修復 `Warning: Invalid hook call. Hooks can only be called inside of the body of a function component` 警告
  - 問題根源：SSR/CSR 不匹配，服務端沒有 Next.js router context
  - 添加 `isClient` 狀態檢查，確保 hooks 只在客戶端環境執行
  - 服務端渲染時使用默認布局，客戶端 hydration 後才進行路由檢查
  - 使用 `window.location.pathname` 作為初始路徑，避免 SSR 錯誤

#### ✅ 修復結果：
- ✅ 消除所有 React hooks 使用規則違反錯誤
- ✅ 解決 webpack 模組載入錯誤
- ✅ 修復頁面無法正常渲染的問題
- ✅ 確保 SSR/CSR 一致性，避免 hydration 錯誤
- ✅ 保持原有的管理頁面和一般頁面佈局邏輯

## 📅 更新記錄

### 2025-08-08 實作年報管理系統
#### 🚀 新增功能：
- **年報資料模型** (`/prisma/schema.prisma`):
  - 新增 AnnualReport 模型，包含年度、標題、描述、檔案URL、檔案大小等欄位
  - 支援發布狀態管理和作者關聯
  - 年度唯一性約束，確保每年只有一份年報
  - 自動記錄創建和更新時間戳記

- **年報存儲管理系統** (`/src/lib/annual-reports-storage-prisma.ts`):
  - 完整 CRUD 操作：創建、讀取、更新、刪除年報資料
  - 支援批量操作和狀態切換功能
  - 整合 Prisma ORM 進行資料庫操作
  - 包含預設種子資料功能

- **後台管理 API** (`/src/app/api/dashboard/annual-reports/`):
  - GET、POST、PUT、DELETE、PATCH 完整 RESTful API
  - JWT 認證和 ADMIN/TEACHER 角色權限控制
  - 支援單項操作和批量操作
  - 完整錯誤處理和 API 響應格式標準化

- **前台公開 API** (`/src/app/api/annual-reports/`):
  - 提供前台動態載入已發布年報列表
  - 只返回啟用狀態的年報
  - 支援前後台資料即時同步

- **後台管理頁面** (`/src/app/[locale]/dashboard/annual-reports/`):
  - **主列表頁面**: 展示所有年報資料的響應式表格佈局
  - **新增模態框**: 完整表單包含年度、標題、描述、檔案URL等欄位
  - **編輯模態框**: 修改現有年報資料，支援狀態切換
  - 搜尋功能：支援標題、年度、描述的即時搜尋
  - 批量操作：多選刪除、狀態批量切換
  - 統計儀表板：總數、已發布、待發布統計

- **前台動態載入** (`/src/components/layout/NewsletterSection.tsx`):
  - 整合 useAnnualReports hook 從 API 動態載入年報列表
  - 支援多個年報按鈕，不同漸層色彩設計
  - 載入狀態和錯誤處理機制
  - 無資料時顯示友善提示
  - 直接檔案下載功能

#### 📁 檔案結構：
- `src/lib/annual-reports-storage-prisma.ts` - 年報資料存儲邏輯
- `src/app/api/dashboard/annual-reports/` - 年報管理 API 端點
- `src/app/api/annual-reports/` - 前台年報內容 API
- `src/app/[locale]/dashboard/annual-reports/` - 年報管理後台頁面
- `src/hooks/useAnnualReports.ts` - 年報內容載入 Hook
- `src/types/dashboard.ts` - 年報資料型別定義

#### ✅ 功能特色：
- ✅ 完整的年報內容 CRUD 管理
- ✅ 檔案URL管理和下載功能
- ✅ 年度唯一性驗證和檔案大小追蹤
- ✅ 響應式設計支援手機、平板、桌面版
- ✅ 即時搜尋和批量操作功能
- ✅ 狀態管理（啟用/停用）和統計儀表板
- ✅ 前後台資料即時同步
- ✅ 完整錯誤處理和使用者回饋
- ✅ 整合到 Dashboard 導航系統
- ✅ 支援多個年報動態展示，自動漸層色彩

### 2025-08-08 實作主視覺後台管理系統
#### 🚀 新增功能：
- **主視覺資料模型** (`/prisma/schema.prisma`):
  - 新增 HeroContent 模型到 Prisma Schema，包含標題前綴、主標題、副標題、背景圖片等欄位
  - 支援多語系內容管理 (中/英文)
  - 可自訂文字漸層效果和玻璃幕牆視覺效果
  - 自動記錄創建和更新時間戳記

- **主視覺資料存儲系統** (`/src/lib/hero-storage-prisma.ts`):
  - 完整 CRUD 操作：創建、讀取、更新、刪除主視覺內容
  - 支援語言篩選和狀態切換功能
  - 整合 Prisma ORM 進行資料庫操作
  - 自動初始化中英文預設內容

- **後台 API 路由** (`/src/app/api/dashboard/hero/`):
  - GET、POST、PUT、DELETE、PATCH 完整 RESTful API
  - 支援語言和啟用狀態的查詢篩選
  - 完整錯誤處理和 API 響應格式標準化

- **前台公開 API** (`/src/app/api/hero/`):
  - 提供前台 Hero 組件動態載入主視覺內容
  - 根據語言參數返回對應的主視覺設定

- **後台管理頁面** (`/src/app/[locale]/dashboard/hero/`):
  - **主列表頁面**: 展示中英文主視覺內容的響應式卡片佈局
  - **編輯模態框**: 完整表單包含標題、副標題、背景圖片上傳、漸層色彩選擇
  - 即時預覽功能：顯示主視覺實際效果
  - 狀態管理：啟用/停用主視覺展示
  - 多語系內容獨立管理

- **前台動態載入** (`/src/components/layout/Hero.tsx`):
  - 整合 useHero hook 從後台 API 動態載入主視覺內容
  - 支援背景圖片、文字漸層、玻璃效果等視覺設定
  - 載入狀態和錯誤處理機制
  - 後台無資料時自動回退到翻譯檔案內容

#### 📁 檔案結構：
- `src/lib/hero-storage-prisma.ts` - 主視覺資料存儲邏輯
- `src/app/api/dashboard/hero/` - 主視覺管理 API 端點
- `src/app/api/hero/` - 前台主視覺內容 API
- `src/app/[locale]/dashboard/hero/` - 主視覺管理後台頁面
- `src/hooks/useHero.ts` - 主視覺內容載入 Hook
- `src/types/dashboard.ts` - 更新主視覺資料型別定義

#### ✅ 功能特色：
- ✅ 完整的主視覺內容 CRUD 管理
- ✅ 多語系獨立內容管理 (中/英文)
- ✅ 背景圖片上傳功能（使用既有 ImageUpload 組件）
- ✅ 文字漸層效果自訂（6種預設配色方案）
- ✅ 玻璃幕牆視覺效果開關
- ✅ 即時預覽主視覺效果
- ✅ 響應式設計支援手機、平板、桌面版
- ✅ 前後台資料即時同步
- ✅ 完整錯誤處理和使用者回饋
- ✅ 整合到 Dashboard 導航系統

### 2025-08-08 實作傑出校友後台管理系統
#### 🚀 新增功能：
- **傑出校友資料模型** (`/prisma/schema.prisma`):
  - 新增 Alumni 模型到 Prisma Schema，包含姓名、職位、描述、圖片、成就列表等欄位
  - 支援作者關聯和啟用狀態管理
  - 自動記錄創建和更新時間戳記

- **校友資料存儲系統** (`/src/lib/alumni-storage-prisma.ts`):
  - 完整 CRUD 操作：創建、讀取、更新、刪除校友資料
  - 支援批量刪除和狀態切換功能
  - 整合 Prisma ORM 進行資料庫操作
  - 包含作者關聯查詢和權限檢查

- **後台 API 路由** (`/src/app/api/dashboard/alumni/`):
  - GET、POST、PUT、DELETE、PATCH 完整 RESTful API
  - JWT 認證和 ADMIN/TEACHER 角色權限控制
  - 支援搜尋、分頁、排序功能
  - 批量操作和狀態切換 API

- **後台管理頁面** (`/src/app/[locale]/dashboard/alumni/`):
  - **主列表頁面**: 展示所有校友資料的響應式卡片網格佈局
  - **新增頁面**: 完整表單包含姓名、職位、描述、圖片上傳、多項成就管理
  - **編輯頁面**: 修改現有校友資料，支援圖片替換和成就列表動態編輯
  - 搜尋功能：支援姓名、職位、描述的即時搜尋
  - 批量操作：多選刪除、狀態批量切換
  - 狀態管理：啟用/停用校友展示

#### 📁 檔案結構：
- `src/lib/alumni-storage-prisma.ts` - 校友資料存儲邏輯
- `src/app/api/dashboard/alumni/` - 校友管理 API 端點
- `src/app/[locale]/dashboard/alumni/` - 校友管理後台頁面
- `src/types/dashboard.ts` - 更新校友資料型別定義

#### ✅ 功能特色：
- ✅ 完整的校友資料 CRUD 管理
- ✅ 多項成就動態新增/刪除功能
- ✅ 圖片上傳整合（使用既有 ImageUpload 組件）
- ✅ 響應式設計支援手機、平板、桌面版
- ✅ 即時搜尋和批量操作功能
- ✅ 狀態管理（啟用/停用）
- ✅ 完整錯誤處理和使用者回饋
- ✅ 整合到 Dashboard 導航系統

### 2025-08-08 實作圖片上傳功能
#### 🚀 新增功能：
- **圖片上傳 API** (`/src/app/api/upload/route.ts`):
  - 支援 JPG、PNG、GIF、WebP 格式圖片上傳
  - 檔案大小限制 5MB，自動檔案格式驗證
  - 使用 UUID 生成唯一檔名，避免檔名衝突
  - 圖片存儲到 `/public/uploads/` 目錄，前端可直接訪問
  - 完整錯誤處理機制，所有錯誤顯示在前端

- **ImageUpload 組件** (`/src/components/dashboard/ImageUpload.tsx`):
  - 拖拽上傳與點擊上傳雙模式支援
  - 即時圖片預覽與上傳進度顯示
  - 支援圖片更換與移除功能
  - 完整的上傳狀態回饋 (載入中、成功、錯誤)
  - 使用 Framer Motion 提供流暢動畫效果

- **後台新聞管理整合**:
  - 新聞創建頁面整合 ImageUpload 組件
  - 新聞編輯頁面整合 ImageUpload 組件
  - 取代原有的檔案輸入方式，提升用戶體驗
  - 自動表單驗證與錯誤處理整合

#### 📁 檔案結構：
- `public/uploads/` - 圖片上傳存儲目錄
- 所有上傳的圖片可透過 `/uploads/檔名` 路徑訪問
- UUID 檔名確保檔案不會重複或衝突

#### ✅ 功能特色：
- ✅ 支援多種圖片格式 (JPG、PNG、GIF、WebP)
- ✅ 檔案大小與格式自動驗證
- ✅ 拖拽上傳與點擊上傳雙模式
- ✅ 即時預覽與上傳進度顯示
- ✅ 完整錯誤處理與用戶回饋
- ✅ 整合到後台新聞管理系統
- ✅ 響應式設計，支援各種螢幕尺寸

### 2025-08-08 修復後台管理 401 未授權錯誤
#### 🐛 問題修復：
- **修復後台管理頁面 401 Unauthorized 錯誤** (`/src/lib/dashboard-api.ts`):
  - 後台 API 正常運作，問題出在瀏覽器中的 JWT token 已過期
  - 完整測試認證流程：登入、新聞 API、即時動態 API 全部正常
  - 改善 dashboard-api.ts 錯誤處理：401 錯誤時自動清除過期認證資料
  - 自動導向登入頁面，避免用戶停留在錯誤狀態

#### ✅ 修復結果：
- ✅ 後端認證系統完全正常運作
- ✅ API 測試通過：登入、新聞管理、即時動態管理
- ✅ 401 錯誤時自動清理過期 token 並重定向到登入頁面
- ✅ 用戶只需重新登入即可正常使用後台管理功能
- ✅ 預設管理員帳號：admin@cmyzu.edu.tw / 密碼: 123456

#### 💡 用戶操作指引：
1. 清除瀏覽器 localStorage (或用無痕模式)
2. 訪問 `/zh/login` 重新登入
3. 使用測試帳號：admin@cmyzu.edu.tw / 123456

### 2025-08-08 修復 live_updates 表格不存在錯誤
#### 🐛 問題修復：
- **修復 PrismaClientKnownRequestError: The table `public.live_updates` does not exist** (`/src/lib/live-updates-storage-prisma.ts`):
  - 資料庫表格與 Prisma schema 不同步，導致 API 500 錯誤
  - 執行 `pnpm db:push` 推送 schema 到資料庫
  - 執行 `pnpm db:seed` 建立初始種子資料
  - 重新生成 Prisma Client 確保類型同步

#### ✅ 修復結果：
- ✅ 所有資料庫表格 (users, news, live_updates, featured_resources) 成功建立
- ✅ API 路由 `/api/live-updates` 和 `/api/news` 正常運作
- ✅ 種子資料包含 3 個用戶、3 則新聞、3 則即時動態、6 個特色資源
- ✅ 前台和後台數據同步，不再出現 500 錯誤

### 2025-08-08 修復新聞管理頁面 views 欄位錯誤
#### 🐛 問題修復：
- **修復 TypeError: Cannot read properties of undefined (reading 'toLocaleString')** (`/src/app/[locale]/dashboard/news/page.tsx`):
  - 修復第342行 `item.views.toLocaleString()` 的 undefined 錯誤
  - 添加安全檢查 `(item.views || 0).toLocaleString()`，為舊資料提供預設值 0
  - 修正 Prisma schema 中 News 模型缺少 `views` 欄位的問題
  - 為 News 模型添加 `views Int @default(0)` 欄位並執行資料庫遷移
  - 重置資料庫以同步 schema 更改，確保所有欄位一致

#### ✅ 修復結果：
- ✅ 新聞管理頁面不再出現 undefined 錯誤
- ✅ 瀏覽次數正確顯示為 "0 次瀏覽"
- ✅ 資料庫 schema 與類型定義完全同步
- ✅ 所有舊資料都有預設的 views 值

### 2025-08-08 修復 webpack 熱重載 404 錯誤
#### 🐛 問題修復：
- **修復 webpack 熱重載 404 錯誤**：
  - 清理 `.next` 快取資料夾和 `node_modules/.cache`
  - 終止所有舊的 Next.js 開發進程，避免進程衝突
  - 重新啟動開發服務器，恢復正常的 Hot Module Replacement (HMR)
  - 確保 webpack 熱更新檔案正確生成和載入

#### ✅ 修復結果：
- ✅ 開發服務器正常運行在 `http://localhost:3000`
- ✅ webpack 熱重載功能恢復正常
- ✅ 不再出現 `/_next/static/webpack/*.webpack.hot-update.json 404` 錯誤
- ✅ 程式碼修改後能夠即時熱重載

### 2025-08-08 修復即時動態認證問題
#### 🐛 問題修復：
- **修復 401 未授權錯誤** (`/src/lib/dashboard-api.ts`, `/src/hooks/useLiveUpdates.ts`):
  - 修復後台管理頁面載入即時動態失敗的問題 (API Error: 401 Unauthorized)
  - `dashboard-api.ts` 的 request 方法新增自動 JWT 認證標頭
  - `useLiveUpdates.ts` hook 在調用後台 API 時正確包含認證資訊
  - 確保 localStorage 中的 auth_token 正確附加到 Authorization header
  - 統一處理前台公開 API 和後台管理 API 的認證需求

#### ✅ 修復結果：
- ✅ 後台即時動態管理頁面正常載入數據
- ✅ 前台即時動態展示功能不受影響
- ✅ JWT 認證機制完整運作
- ✅ 所有 dashboard API 調用都包含正確認證標頭

### 2025-08-08 修復 DashboardLayout locale 錯誤
#### 🐛 問題修復：
- **修復前端運行時錯誤** (`/src/components/dashboard/DashboardLayout.tsx`):
  - 修復第209行 `ReferenceError: locale is not defined` 錯誤
  - 移除變更密碼連結中的未定義 locale 變數
  - 統一使用 `/dashboard/change-password` 路徑，簡化路由結構
  - 確保後台管理介面完全正常運作

#### ✅ 修復結果：
- ✅ 後台管理介面不再出現運行時錯誤
- ✅ 變更密碼功能連結正確顯示
- ✅ Dashboard Layout 完全穩定運作

### 2025-08-08 PostgreSQL 資料庫完整整合
#### 🚀 重大架構升級：檔案系統 → PostgreSQL
- **完全遷移到 PostgreSQL**：移除所有檔案存儲系統，統一使用 PostgreSQL 資料庫
- **Prisma ORM 整合**：
  - 新建完整資料庫 Schema (`prisma/schema.prisma`)
  - User, News, LiveUpdate, FeaturedResource 四大核心資料表
  - 支援角色權限系統 (ADMIN/TEACHER/STUDENT)
  - 優先級、標籤、發布狀態等進階功能
  
#### ✅ 資料庫功能：
- ✅ **用戶認證系統**：bcrypt 密碼加密、JWT Token、權限控制
- ✅ **新聞管理系統**：完整 CRUD、發布狀態、精選功能、作者關聯
- ✅ **即時動態系統**：優先級分級 (LOW/MEDIUM/HIGH/URGENT)、標籤搜尋
- ✅ **特色資源管理**：狀態管理、分類展示、排序功能
- ✅ **資料種子腳本**：預建測試資料 (admin@cmyzu.edu.tw / teacher1@cmyzu.edu.tw)
- ✅ **資料持久化**：所有操作立即同步到資料庫，無資料丟失風險

#### 📡 API 路由完整重構：
- **前台公開 API**: `/api/news`, `/api/live-updates` (只顯示已發布內容)
- **後台管理 API**: `/api/dashboard/*` (完整權限控制、CRUD 操作)
- **統一錯誤處理**: 所有錯誤完整顯示在前端，包含詳細錯誤資訊
- **JWT 認證**: 所有後台 API 需要有效 JWT Token 和適當角色權限

#### 🔧 資料庫設定：
```bash
# 資料庫連接
DATABASE_URL="postgresql://eric:0418@localhost:5432/cmyzu"

# 初始化資料庫
pnpm db:generate  # 生成 Prisma Client
pnpm db:push      # 推送資料庫 Schema
pnpm db:seed      # 執行種子資料腳本
```

### 2025-08-08 統一後端架構：完全遷移到 Next.js
#### 🚀 重大架構決策：
- **刪除獨立 Express 後端**：移除 `/backend` 資料夾，統一使用 Next.js 全棧方案
- **認證系統完全整合**：
  - 新建檔案型用戶存儲系統 (`/src/lib/user-storage.ts`)
  - 完整認證 API Routes：`/api/auth/login`、`/api/auth/logout`、`/api/auth/me`、`/api/auth/change-password`
  - 保留企業級安全：bcrypt 密碼加密、JWT Token 認證、輸入驗證
  - 預設帳號：admin@cmyzu.edu.tw / teacher1@cmyzu.edu.tw (密碼: 123456)

#### ✅ 整合成果：
- ✅ **單一架構部署**：只需要 Vercel 一鍵部署，無需額外後端服務
- ✅ **完整認證功能**：登入、登出、密碼變更、權限控制
- ✅ **統一檔案存儲**：用戶、新聞、即時動態都使用檔案系統持久化
- ✅ **後台整合**：密碼變更頁面整合到管理後台，用戶體驗完整
- ✅ **開發維護簡化**：單一專案、統一錯誤處理、共享型別系統

### 2025-08-08 修復前後台資料對接問題
#### 🔧 API 架構修復：
- **建立完整的持久化存儲** (`/src/lib/live-updates-storage-persistent.ts`):
  - 即時動態現在使用檔案系統持久化存儲（與新聞系統一致）
  - 取代原本的記憶體存儲，確保資料在重啟後保持
  - 支援完整的 CRUD 操作和批量處理

- **分離前後台 API 端點**:
  - 前台使用：`/api/news` 和 `/api/live-updates`（公開 API）
  - 後台使用：`/api/dashboard/news` 和 `/api/dashboard/live-updates`（管理 API）
  - 前台只能存取已發布的內容，後台可管理全部內容

- **修復 Hook 資料獲取**:
  - `useNews.ts` 和 `useLiveUpdates.ts` 現在根據用途自動選擇正確的 API 端點
  - `usePublishedNews` 和 `usePublishedLiveUpdates` 使用前台公開 API
  - 後台管理頁面使用後台管理 API

- **即時資料同步**:
  - 後台更新後，前台會立即反映變更
  - 所有錯誤完整顯示在前端，便於除錯
  - 新增詳細的錯誤處理和日誌記錄

#### ✅ 解決的問題：
- ✅ **前台即時更新**：後台發布內容後前台立即可見
- ✅ **資料持久化**：伺服器重啟後資料不會遺失  
- ✅ **API 分離**：前後台使用不同端點，權限清楚
- ✅ **錯誤處理**：完整的錯誤資訊顯示，方便除錯
- ✅ **架構清潔**：清晰的職責分工和資料流向

### 2025-08-08 重構新聞系統：完全分離新聞與即時動態
#### 🚀 重大架構重構：
- **建立獨立的即時動態系統** (`/src/types/dashboard.ts`):
  - 新增 `LiveUpdate` 介面，完全獨立於 `News`
  - LiveUpdate 包含：title, content, priority, tags, date 等欄位
  - News 保持原有結構不變，專門處理新聞稿
  
- **分離後台管理** (`/src/app/[locale]/dashboard/`):
  - `/dashboard/news/` - 專門管理新聞稿
  - `/dashboard/live-updates/` - 全新的即時動態管理頁面
  - 兩個完全獨立的管理介面和工作流程

- **獨立的 API 端點** (`/src/lib/dashboard-api.ts`):
  - `dashboardAPI.news` - 新聞稿 API
  - `dashboardAPI.liveUpdates` - 即時動態 API  
  - 完全不同的資料庫表和 API 路由

- **專用 Hooks** (`/src/hooks/`):
  - `/hooks/useNews.ts` - 專門處理新聞稿
  - `/hooks/useLiveUpdates.ts` - 全新的即時動態 hook
  - 提供不同的篩選和排序選項

- **前端整合顯示** (`/src/components/layout/NewsSection.tsx`):
  - 上方：新聞稿輪播（傳統卡片格式）
  - 下方：即時動態時間軸（無圖片，重視時效性）
  - 兩個獨立的資料來源在前台合併展示

#### ✅ 正確的架構優勢：
- ✅ **資料庫分離**：新聞和即時動態使用不同的資料表
- ✅ **後台分離**：完全獨立的管理介面，避免混淆
- ✅ **API 分離**：不同的端點和邏輯處理
- ✅ **前台整合**：使用者在首頁看到完整的資訊流
- ✅ **擴展性強**：兩個系統可以獨立演進和優化
- ✅ **維護容易**：清晰的職責分離，降低維護複雜度

### 2025-08-08 即時動態區塊改為獨立輪播
#### 🔧 功能改進：
- **即時動態獨立輪播設計** (`/src/components/layout/NewsSection.tsx`):
  - 將即時動態從列表展示改為單一輪播卡片
  - 一次只顯示一則即時動態，可以左右切換
  - 獨立的輪播控制和自動播放機制（3秒切換）
  - 添加輪播指示器，支援直接點擊切換
  - 滑鼠懸停時暫停自動播放
  - 使用 Framer Motion 提供流暢的切換動畫效果
  - 只在有多則動態時顯示控制按鈕和指示器
  - 保持與新聞稿輪播獨立，不互相干擾

### 2025-08-08 修復 NewsSection 輪播邏輯問題
#### 🐛 問題修復：
- **修復輪播條件邏輯錯誤** (`/src/components/layout/NewsSection.tsx`):
  - 修復輪播控制按鈕顯示條件：從 `newsItems.length > 1` 改為 `newsItems.length > visibleItems`
  - 修復主要指示器顯示條件：從 `newsItems.length > 1` 改為 `newsItems.length > visibleItems`  
  - 修復自動輪播觸發條件：從 `newsItems.length <= 1` 改為 `newsItems.length <= visibleItems`
  - 修復小型指示器硬編碼問題：移除 `newsItems.slice(0, 3)` 和 `currentIndex % 3` 限制
  - 添加 `visibleItems` 到自動輪播 useEffect 依賴數組

#### 💡 核心問題分析：
- 桌面版 `visibleItems = 3`，但只有 2 篇新聞時，不應該啟用輪播功能
- 原邏輯以新聞數量判斷是否輪播，應以「新聞數量是否大於可視數量」判斷
- 當 2 篇新聞在 3 個位置時，無需輪播即可全部顯示

#### ✅ 修復結果：
- ✅ 2 篇新聞時完全不顯示輪播控制（按鈕、指示器）
- ✅ 不會出現第二頁空白或重複內容的問題
- ✅ 自動輪播只在真正需要時啟用
- ✅ 響應式下各螢幕尺寸邏輯一致（手機1個、平板2個、桌面3個）

### 2025-08-08 修復前台特色資源顯示問題
#### 🐛 問題修復：
- **修復前台不顯示後台更新內容問題** (`/src/components/layout/FeaturedResourcesSection.tsx`, `/src/hooks/useFeaturedResources.ts`, `/src/app/api/featured-resources/route.ts`):
  - 創建 `useFeaturedResources` hook，從 API 動態獲取特色資源數據
  - 新增前台公開 API 端點，只返回已啟用的特色資源
  - 移除硬編碼資源數據，改為使用共享數據源
  - 添加載入狀態、錯誤處理和空狀態顯示

- **修復出場動畫重複抖動問題** (`/src/components/layout/FeaturedResourcesSection.tsx`):
  - 簡化為純淡入動畫，移除所有 `whileInView` 滾動觸發動畫
  - 移除複雜的 scale、y 移動等可能重複觸發的動畫效果
  - 保留基本的 hover 效果和載入延遲動畫
  - 移除標題區域的動畫，直接顯示內容

#### ✅ 修復結果：
- 前台特色資源現在會即時顯示後台管理的最新內容
- 只顯示已啟用的資源，按順序正確排列
- 動畫問題完全解決，使用簡潔穩定的淡入效果
- 完善的載入和錯誤狀態處理

### 2025-08-08 修復特色資源 API 數據同步問題
#### 🐛 問題修復：
- **修復編輯後頁面不更新問題** (`/src/app/api/dashboard/featured-resources/`, `/src/data/featured-resources.ts`):
  - 創建共享數據源 `/src/data/featured-resources.ts`，統一管理特色資源數據
  - 修復主列表 API (`route.ts`) 和單項 API (`[id]/route.ts`) 使用不同數據源的問題
  - 重構 GET/POST/PUT/DELETE 方法使用統一的數據管理函數
  - 確保所有 API 操作都在同一個數據實例上進行

#### ✅ 修復結果：
- 編輯特色資源後頁面會立即更新顯示最新內容
- 新增、編輯、刪除操作完全同步，前後端數據一致
- API 返回正確的更新後數據給前端使用

### 2025-08-08 修復特色資源後台模態框顯示問題
#### 🐛 問題修復：
- **修復編輯模態框無法顯示問題** (`/src/app/[locale]/dashboard/featured-resources/page.tsx`):
  - 將模態框組件移到 `DashboardLayout` 外部，避免被容器限制
  - 提高模態框 z-index 到 `z-[9999]`，確保顯示在最上層
  - 修復背景遮罩和內容區域的 z-index 層級關係
  - 使用 React Fragment (`<>...</>`) 包裝多個根元素，修復 JSX 語法錯誤
  - 保留 `e.stopPropagation()` 防止事件冒泡干擾

#### ✅ 修復結果：
- 編輯按鈕現在能正常打開編輯模態框
- 模態框正確顯示在頁面最上層，不被其他元素遮蓋
- 新增和編輯功能完全正常運作
- JSX 語法錯誤已修復，頁面正常載入

### 2025-08-08 修復特色資源後台頁面佈局問題
#### 🐛 問題修復：
- **修復後台頁面爆版問題** (`/src/app/[locale]/dashboard/featured-resources/page.tsx`):
  - 添加 `DashboardLayout` 包裝組件，恢復左側選單和正確佈局
  - 新增身份驗證和權限檢查，確保只有已登錄用戶可以訪問
  - 改善載入狀態處理，分離身份驗證載入和資料載入狀態
  - 添加重定向邏輯，未登錄用戶自動導向登錄頁面

#### ✅ 修復結果：
- 後台特色資源管理頁面現在正常顯示左側選單和頁面結構
- 身份驗證流程完整，符合後台安全要求
- 使用者體驗改善，載入狀態更清晰

### 2025-08-08 修復 FeaturedResourcesSection 重複動畫問題
#### 🐛 問題修復：
- **移除重複的出場動畫** (`/src/components/layout/FeaturedResourcesSection.tsx`):
  - 移除標題 h2 和描述 p 元素的獨立動畫設定
  - 保留外層 motion.div 的整體動畫效果
  - 避免標題區域出現重複動畫的視覺問題

#### ✅ 修復結果：
- 特色資源區塊現在只執行一次平滑的出場動畫
- 標題和描述文字與容器同步進場，避免視覺重複

### 2025-08-08 新聞系統數據持久化 💾
#### 🚨 修復服務器重啟數據丟失問題：
**問題核心**：服務器重啟後記憶體數據重置，導致新創建的新聞無法操作
- 新聞創建後，服務器重啟會導致數據丟失
- 前端頁面顯示的新聞ID在後端已不存在
- 發佈狀態切換、編輯、刪除功能失效（404 Not Found錯誤）

#### 💾 實現數據持久化：
- **新建持久化存儲** (`/src/lib/news-storage-persistent.ts`):
  - 使用檔案系統存儲新聞數據（`/data/news.json`）
  - 自動創建數據目錄，確保檔案存在
  - JSON格式存儲，支援日期自動轉換
  - 所有CRUD操作都會即時保存到檔案

- **升級API路由**:
  - 所有新聞API路由改用 `newsStoragePersistent`
  - 服務器重啟後數據完全保持
  - 前後台數據始終一致

#### ✅ 解決結果：
- ✅ 服務器重啟後新聞數據完全保留
- ✅ 新創建的新聞可以正常編輯和發佈
- ✅ 所有CRUD操作永久有效，無404錯誤
- ✅ 前後台數據持久同步

### 2025-08-08 修復新聞管理系統整合問題 🔧
#### 🚨 重大問題修復：
**問題核心**：前後台使用完全不同的數據源，導致功能失效
- 後台管理頁面使用獨立的假數據，所有功能只是 TODO 註解
- 前台使用 API 數據，但 API 返回空數據
- 新增、編輯、刪除功能完全無效

#### 📋 系統整合修復：
- **建立共享數據存儲** (`/src/lib/news-storage.ts`):
  - 統一的 newsStorage 管理器，處理所有新聞 CRUD 操作
  - 包含預設測試新聞，確保有內容可顯示
  - 解決不同 API 路由間數據不共享的問題

- **修復後台管理頁面** (`/src/app/[locale]/dashboard/news/page.tsx`):
  - 移除所有 TODO 註解和假數據
  - 整合真實的 dashboardAPI.news.list() 調用
  - 實作真實的狀態切換、批量刪除功能
  - 新增完整錯誤處理和使用者提示

- **修復新增新聞頁面** (`/src/app/[locale]/dashboard/news/create/page.tsx`):
  - 移除 TODO 註解，使用真實的 dashboardAPI.news.create()
  - 實作草稿儲存功能
  - 改善圖片上傳邏輯（使用隨機預設圖片）

- **統一 API 數據源** (`/src/app/api/dashboard/news/`):
  - 所有 API 路由使用共享的 newsStorage
  - 確保數據在不同端點間一致性

#### 🔄 前台組件改進：
- **NewsSection 智能顯示** (`/src/components/layout/NewsSection.tsx`):
  - 無資料時顯示友善的空狀態而非隱藏
  - 保持區塊結構，提供更好的使用者體驗

#### ✅ 修復結果：
- ✅ 後台新增新聞後，前台立即顯示
- ✅ 後台切換發布狀態，前台即時反映
- ✅ 後台刪除新聞，前台同步消失
- ✅ 所有 CRUD 操作完全正常運作
- ✅ 前後台數據完全同步

### 2025-08-08 實作特色資源 CRUD 功能
#### 🚀 新增功能：
- **特色資源 API 路由** (`/src/app/api/dashboard/featured-resources/`):
  - 完整 CRUD 操作：GET（列表+單項）、POST、PUT、DELETE  
  - 支援分頁、排序、搜尋功能，可依標題、描述、分類篩選
  - 包含 6 筆預設特色資源數據（信用卡主題）
  - 完整錯誤處理機制，所有錯誤都顯示在前台
  
- **特色資源管理頁面** (`/src/app/[locale]/dashboard/featured-resources/page.tsx`):
  - 響應式卡片網格佈局，支援手機、平板、桌面版
  - 即時搜尋功能，可搜尋標題、描述、分類
  - 內建新增/編輯模態框，支援完整欄位編輯
  - 包含圖片預覽、背景色選擇器、狀態管理
  - 一鍵刪除功能，附確認對話框防誤操作
  - 完整載入狀態和錯誤處理，提升使用者體驗

#### 🔧 系統整合：
- 整合既有的 `dashboardAPI.featuredResources` 客戶端
- 符合專案統一的 API 響應格式標準
- 遵循現有的 TypeScript 類型定義
- 與後台管理系統導航無縫整合

### 2025-08-08 建立完整 API 路由系統並修復架構問題

#### 🔄 組件重構：
- **NewsSection.tsx 改為動態載入** (`/src/components/layout/NewsSection.tsx`):
  - 移除硬編碼的假數據，改為使用資料庫 API 獲取真實新聞數據
  - 整合 useNews 自定義 hook，支援分頁和已發布狀態篩選
  - 新增完整的載入狀態 UI，包含 skeleton loading 效果
  - 加入錯誤處理機制，顯示友善的錯誤訊息和重試按鍵
  - 優化輪播控制邏輯，避免在載入或無數據時出現異常

#### 🎣 新增自定義 Hook：
- **useNews hook** (`/src/hooks/useNews.ts`):
  - 統一的新聞數據獲取邏輯，支援參數化查詢
  - 內建載入狀態、錯誤處理和重新載入功能
  - 支援發布狀態篩選，確保前台只顯示已發布內容
  - TypeScript 類型安全，整合 dashboard API 系統

#### 🛠️ API 路由系統建立：
- **新聞管理 API** (`/src/app/api/dashboard/news/`):
  - 完整 CRUD 操作：GET（列表+單項）、POST、PUT、DELETE
  - 支援分頁、排序、搜尋功能
  - 模擬資料庫操作，包含 6 筆測試新聞數據
  - 完整錯誤處理和 API 響應格式標準化

#### 🐛 關鍵錯誤修復：
- **修復 API 路由 404 問題** (`/src/middleware.ts`):
  - 中間件配置排除 `/api` 路徑，避免國際化重定向
  - 修正 matcher 規則：`'/((?!_next|_vercel|api|.*\\..*).*)'`
  - 解決 API 請求被錯誤重定向到語系路徑的問題

#### 💡 使用者體驗改善：
- 載入時顯示美觀的 skeleton 動畫
- 網路錯誤時提供清晰的錯誤訊息和操作建議
- 保持輪播功能的流暢性和響應式設計
- 維持多語系支援和 SEO 優化
- 新增 favicon.ico 檔案，解決瀏覽器 404 警告

### 2025-08-06 修復頁面重整自動登出問題

#### 🐛 重大錯誤修復：
- **修復AuthContext初始化邏輯錯誤** (`/src/contexts/AuthContext.tsx`):
  - 解決每次頁面重整時自動登出的嚴重問題
  - 移除初始化時的API驗證邏輯，避免網路問題導致意外登出
  - 改為直接從localStorage載入認證狀態，提升使用者體驗
  - 保留背景驗證選項但不影響登入狀態

### 2025-08-06 登入頁面新增返回主畫面按鍵並修復翻譯錯誤

#### 🔧 改善項目：
- **登入頁面使用性提升** (`/src/app/[locale]/login/page.tsx`):
  - 新增返回主畫面按鍵，讓使用者能夠輕鬆回到網站首頁
  - 使用帶有左箭頭圖示的按鍵設計，直觀易懂
  - 採用 Next.js Link 元件確保 SEO 友善的導航
  - 支援多語系顯示，使用翻譯鍵 `back-to-home`

#### 🐛 錯誤修復：
- **修復翻譯鍵缺失錯誤** (`/messages/zh.json`, `/messages/en.json`):
  - 修復 `IntlError: MISSING_MESSAGE: Could not resolve LoginPage.back-to-home` 錯誤
  - 在中英文翻譯檔案中添加 `LoginPage.back-to-home` 翻譯鍵
  - 中文：「返回主畫面」，英文：「Back to Home」

### 2025-08-06 完成管理員後台系統開發

#### 🎯 重大功能：
- **完整後台管理系統**: 建立功能完整的內容管理後台，支援所有前台內容的增刪改查
  - 新建 `/dashboard` 路由，包含現代化的管理介面設計
  - 支援新聞管理、特色資源管理、校友管理、排名管理等核心功能
  - 整合統計數據、社群媒體內容、電子報訂閱管理
  - 實作檔案上傳、批量操作、搜尋篩選等進階功能

#### 🏗️ 技術架構：
- **資料類型系統** (`/src/types/dashboard.ts`):
  - 定義 8 種核心資料類型：News, FeaturedResource, Alumni, Ranking 等
  - 完整的 TypeScript 介面，包含分頁、API 響應、批量操作等工具類型
  - 支援國際化、檔案上傳、系統設定等擴充功能

- **API 客戶端架構** (`/src/lib/dashboard-api.ts`):
  - 統一 CRUD API 封裝，支援通用的增刪改查操作
  - 內建檔案上傳、批量操作、資料排序重排功能
  - 完整錯誤處理與 React Query 整合準備
  - 模組化設計，易於擴充新的資料類型管理

#### 🎨 使用者介面：
- **現代化 Dashboard Layout** (`/src/components/dashboard/DashboardLayout.tsx`):
  - 響應式側邊欄導航，支援桌面版和手機版
  - 8 個主要功能模組：總覽、統計數據、新聞、特色資源、排名、校友、社群媒體、主視覺設定
  - 整合用戶管理、權限控制、快速返回主站等功能
  - 使用 Framer Motion 提供流暢的介面動畫

- **主控台儀表板** (`/src/app/[locale]/dashboard/page.tsx`):
  - 即時統計數據展示：新聞數量、校友數量、訂閱人數、月度瀏覽量
  - 快速操作面板：6 個常用功能的快速入口
  - 最近活動記錄：系統操作歷史與實時更新
  - 系統狀態監控：網站、資料庫、備份狀態一目了然

#### 📋 內容管理功能：
- **新聞管理系統** (`/src/app/[locale]/dashboard/news/`):
  - 完整列表檢視：支援搜尋、排序、篩選功能
  - 批量操作：多選刪除、狀態切換、排序調整
  - 創建/編輯表單：標題、摘要、內容、圖片上傳、發布狀態
  - 即時預覽：圖片預覽、字數統計、表單驗證
  - 草稿系統：支援草稿儲存與發布工作流程

#### 🔄 資料整合層：
- **前台資料 Hooks** (`/src/hooks/useWebsiteData.ts`):
  - 統一資料獲取介面：`useNewsData`, `useFeaturedResourcesData`, `useStatsData` 等
  - 自動資料載入、錯誤處理、重新整理功能
  - 支援前後台資料同步，確保內容即時更新
  - 模擬資料與真實 API 的無縫切換準備

#### 💡 創新特色：
- **彈性資料結構**: 所有前台卡片和資料都可在後台靈活管理
- **即時同步**: 後台修改立即反映到前台顯示
- **國際化支援**: 多語系內容管理，支援中英文界面
- **響應式設計**: 完整的手機版和桌面版最佳化
- **用戶體驗**: 流暢動畫、載入狀態、錯誤處理等細節優化

#### 🔧 開發成果：
- ✅ 完成 6 大功能模組的基礎架構
- ✅ 實作完整的新聞管理 CRUD 功能
- ✅ 建立可擴展的組件庫和工具函數
- ✅ 整合認證系統與權限控制
- ✅ 支援檔案上傳與圖片管理
- ✅ 完備的 TypeScript 類型定義

#### 📝 待完成項目：
- [ ] 其他內容類型的 CRUD 頁面（校友、資源、排名等）
- [ ] 真實 API 後端整合
- [ ] 資料匯出功能（CSV、Excel）
- [ ] 進階權限管理與角色系統
- [ ] 系統設定與自定義配置

### 2025-08-06 修復 FeaturedResourcesSection 動畫問題

#### 動畫優化：
- **修復入場動畫重複觸發**: 
  - 確保 `whileInView` 動畫只觸發一次 (`once: true`)
  - 添加 `amount: 0.3` 參數，當元素 30% 進入視窗時觸發動畫
  - 保持入場動畫的穩定性，避免重複跳動
- **解決滾動時卡頓問題**: 
  - 重新加入 `useScrollState` hook 用於滾動狀態檢測
  - 滾動時禁用所有 hover 效果，避免效能問題
  - 滾動停止後恢復正常 hover 互動

#### 修復項目：
- ✅ 卡片入場動畫只觸發一次，不再重複跳動
- ✅ 滾動時禁用 hover 效果，解決卡頓問題
- ✅ 滾動停止後 hover 效果正常運作

### 2025-08-06 修復 ESLint 錯誤

#### 程式碼品質改進：
- **移除未使用的匯入**: 
  - MoreHighlightsSection.tsx: 移除未使用的 useRef
  - WorldMap.tsx: 移除未使用的 motion 匯入
- **圖片優化**: NewsSection.tsx 中的 img 標籤改為 Next.js Image 組件，提升效能和 SEO
- **參數清理**: 
  - NewsletterSection.tsx: 移除 onClick 事件中未使用的參數 'e' 
  - TalentDevelopmentSection.tsx: 移除函數中未使用的 index 和 pageIndex 參數
- **類型安全提升**: 移除 TalentDevelopmentSection.tsx 中的 any 類型使用，改為適當的 TypeScript 類型

#### 修復項目明細：
- ✅ MoreHighlightsSection.tsx: useRef 未使用錯誤
- ✅ NewsSection.tsx: img 標籤 Next.js 警告  
- ✅ NewsletterSection.tsx: 2 個未使用參數錯誤
- ✅ TalentDevelopmentSection.tsx: 6 個 any 類型和未使用變數錯誤
- ✅ WorldMap.tsx: motion 未使用錯誤

### 2025-08-06 簡化 TalentDevelopmentSection 卡片設計

#### 卡片結構簡化：
- **移除關鍵數據區塊**: 將原本的統計數據展示 (stats) 從卡片中完全移除
  - 桌面版卡片：移除 3x1 數據格子展示區域
  - 手機版卡片：移除數據指標和完整數據展示
  - 保持數據在詳情彈窗中的完整展示功能
  
#### 視覺設計改進：
- **卡片內容重心調整**: 重新聚焦於人物本身
  - 保留：校友照片、姓名、職位、介紹文字、了解更多按鈕
  - 照片區域文字增大：姓名 (text-2xl)、職位 (text-base)，提升可讀性
  - 描述文字優化：增加行數限制 (line-clamp-3)、改善字體粗細 (font-medium)
  - 內容區域間距增加：padding 從 p-4 改為 p-6
  
#### 設計理念調整：
- **極簡主義設計**: 去除視覺雜訊，突出校友個人形象
- **漸層效果減弱**: 照片覆蓋層從 from-black/70 減至 from-black/50，保持照片清晰度
- **統一視覺語言**: 桌面版與手機版設計保持一致的簡潔風格

### 2025-08-06 修改 FeaturedResourcesSection 為 3x2 網格佈局

#### 結構調整：
- **卡片佈局重構**: 將特色資源區塊從垂直排列改為 3x2 網格佈局
  - 手機版：單欄顯示 (1x6)
  - 小平板版：雙欄顯示 (2x3)
  - 桌機版：三欄顯示 (3x2)
  - 固定卡片高度 (h-80)，提升視覺一致性

#### 內容更新：
- **資源內容主題化**: 更新為銀行/信用卡主題內容
  - 新戶申辦優惠、購物回饋、星空任務等 6 個主要服務
  - 每個卡片使用不同的漸層背景色彩設計
  - 移除原有的統計數據 (stats) 結構

#### 視覺設計改進：
- **卡片樣式優化**:
  - 使用圓角設計 (rounded-3xl) 
  - 背景圖片透明度效果 (opacity-30/40)
  - Hover 效果：卡片上移、陰影加深、箭頭顯示
  - 漸層遮罩從透明到半透明黑色
- **互動體驗提升**:
  - 點擊整個卡片即可開啟詳情彈窗
  - 鼠標懸停時顯示右上角箭頭圖示
  - 彈窗內容簡化，加入圖片預覽

#### 技術實現：
- **響應式網格系統**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (3x2 佈局)
- **Framer Motion 動畫優化**: 縮短延遲時間 (index * 0.1)，提升載入體驗
- **背景色彩系統化**: 每個卡片使用 Tailwind 漸層背景類別
- **滾動優化**: 集成 `useScrollState` hook，滾動時禁用 hover 效果防止卡頓
  - 滾動期間停用 `whileHover` 動畫、陰影變化、圖片透明度變化
  - 滾動停止 150ms 後自動恢復 hover 效果

### 2025-08-06 重構頁面結構：移動世界地圖到排名區塊

#### 結構調整：
- **頁面佈局優化**: 將世界地圖區塊從特色資源 Section 移動到排名 Section 下方
  - 改善頁面視覺流暢性，將相關的國際化內容集中展示
  - 排名展示（國際化成就）+ 世界地圖（全球合作網絡）形成完整的國際化形象展示
  - 減少特色資源區塊的內容複雜度，讓每個 Section 職責更明確

#### 技術實現：
- **FeaturedResourcesSection.tsx**: 
  - 移除世界地圖相關程式碼和 import
  - 簡化元件結構，專注於特色資源展示
  - 移除 WorldMap 的動態載入配置

- **RankingSection.tsx**: 
  - 新增世界地圖動態載入配置
  - 在排名卡片下方整合世界地圖展示
  - 保持原有的 Framer Motion 動畫效果
  - 使用相同的載入中提示設計

#### 使用者體驗提升：
- **內容組織邏輯化**: 國際排名成就與全球合作網絡緊密結合
- **視覺層次優化**: 從排名數據到地理分布的漸進式資訊展示
- **頁面流暢性**: 改善內容間的連結性和閱讀體驗

### 2025-08-06 新增排名展示 Section

#### 新增功能：
- **RankingSection.tsx**: 新增學校排名展示區塊
  - 展示本校在各項國際評鑑中的優異表現
  - 包含 THE 世界大學排名、QS 世界大學排名等權威機構認證
  - 使用卡片式設計，展示 #1 排名成就
  - 支援響應式網格佈局（手機版單列、平板雙列、桌機三列）
  - 整合 Framer Motion 動畫效果，提升用戶體驗

#### 技術實現：
- **排名資料結構化**: 
  - 三大排名類別：學習環境、西日本私立大學、國際化比例
  - 支援評鑑機構 Logo 顯示與說明
  - 包含詳細的資料來源與更新時間說明
  - 採用漸層背景設計，從淺灰到淺藍的視覺層次

- **SEO 優化**: 
  - 結構化排名資訊展示，有利於搜尋引擎收錄
  - 權威評鑑機構資訊，提升網站可信度
  - 完整的說明文字，增加內容豐富度

#### 頁面整合：
- **page.tsx**: 在特色資源 Section 下方新增排名展示區塊
- 保持整體頁面流暢性與視覺一致性
- 確保與其他 Section 的間距和佈局協調

### 2025-08-06 修改統計數據區塊為固定標語

#### 修改內容：
- **StatsSection.tsx**: 將數字跳動展示改為四個固定標語
  - 移除 `useCountAnimation` 數字動畫功能
  - 改為顯示：北台灣唯一英語標竿學院、企業最愛EMBA、隨意highlight、隨意highlight
  - 保留圖示與動畫效果，改用 Framer Motion 進場動畫
  - 調整文字大小與排版，適應標語長度
  - 移除數字格式化與計算邏輯

### 2025-08-06 整合電子報與年報下載功能

#### 功能整合：
- **統一區塊設計**: 將年報下載功能整合到電子報區塊內，形成統一的用戶服務區
  - 電子報訂閱與年報下載並列於同一區塊
  - 使用分隔線與"或"字樣進行視覺區分
  - 採用漸層背景設計（從琥珀色到藍色），整合兩項功能的視覺效果
  - 支援 2023 及 2022 年報 PDF 下載

#### 技術實現：
- **整合式設計**: 
  - 單一區塊包含電子報訂閱 + 年報下載功能
  - 分隔線動畫效果，使用 scaleX 從 0 到 1 的漸變
  - 年報下載按鈕採用較小尺寸，與電子報訂閱按鈕形成層次對比

- **國際化支援**: 
  - 新增"或"/"or"翻譯
  - 年報相關翻譯：年報下載、下載最新年報等
  - 翻譯文件位置：`messages/zh.json` 和 `messages/en.json`

- **組件優化**:
  - 使用 Framer Motion 實現漸層進場動畫
  - 整合背景漸層色彩，統一視覺風格
  - 響應式佈局，手機版垂直排列

### 2025-08-05 修復手機版水平滾動問題
- 修復手機版出現水平滾動條的問題
- 優化 TalentDevelopmentSection 和 WorldMap 響應式設計
- 全域 CSS 防禦性編程，避免元素溢出

## 📊 歷史更新摘要 (2025年8月5日前)

### 前端功能開發 (8月1-5日)
- ✅ Tailwind CSS 4.x 升級與品牌色系設定
- ✅ 完整登錄系統實作與前後端整合
- ✅ 中英文國際化切換功能
- ✅ 響應式導航欄與動畫系統
- ✅ Hero 區塊與建築風格背景設計
- ✅ 統計數據動畫與計數效果
- ✅ 新聞輪播系統與堆積木動態效果
- ✅ 系所學程展示區塊
- ✅ 特色資源 3x2 網格佈局
- ✅ 人才培育滾動劫持輪播
- ✅ 世界地圖互動功能
- ✅ 電子報訂閱與年報下載整合

### 技術優化 (8月1-5日)
- ✅ ESLint pre-commit hook 配置
- ✅ 毛玻璃半透明背景效果
- ✅ 滾動動畫觸發機制優化
- ✅ 響應式佈局手機版適配
- ✅ 動畫重複執行問題修復
- ✅ 效能優化與卡頓修復
- ✅ 圖片 404 問題解決
- ✅ 中間件路由配置最佳化

## 🚀 技術棧

### 全棧架構 (Next.js + PostgreSQL)
- **框架**: Next.js 14 + TypeScript + App Router
- **前端**: React 18 + Tailwind CSS + Framer Motion
- **後端**: Next.js API Routes + PostgreSQL + Prisma ORM
- **資料庫**: PostgreSQL 16 + Prisma Client + 完整 Schema
- **認證**: JWT + bcrypt + 角色權限系統 (ADMIN/TEACHER/STUDENT)
- **多語系**: next-intl v4 + i18n 路由
- **狀態管理**: React Context + 自定義 Hooks
- **開發工具**: ESLint + Prettier + Husky + commitlint

## 📋 功能特色

### ✅ 已完成功能

- **基礎架構**: Next.js 14 專案結構與完整 DevOps 配置
- **響應式設計**: RWD Layout、Header/Footer 組件，支援手機/平板/桌面
- **多語系支援**: 完整的中文/英文切換系統 (next-intl v4)
  - 路由: `/zh` (中文) 和 `/en` (英文)
  - 自動語言偵測與重定向
  - 動態內容翻譯 (Header、Footer、頁面內容)
- **資料存儲**: PostgreSQL 資料庫持久化存儲，支援完整的內容管理和用戶認證
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
- **電子報系統**: ✅ 訂閱管理介面與前端表單驗證 (2025-08-04)
  - 完整的電子報訂閱表單元件
  - 響應式設計與動畫效果
  - 電子郵件格式驗證
  - 訂閱狀態回饋
  - TODO: 後端 API 整合與 EDM 群發功能
- **LINE 整合**: LINE Messaging API 即時客服
- **視差動畫**: 高效能視差滾動與動畫效果

## 🛠️ 開發指令

### 基礎開發指令
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

### 資料庫相關指令
```bash
# 生成 Prisma Client
pnpm db:generate

# 推送資料庫 Schema 變更
pnpm db:push

# 執行種子資料腳本
pnpm db:seed

# 重設資料庫並重新種子
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
│   │   └── dashboard/    # 後台組件
│   ├── contexts/        # React Context 狀態管理
│   ├── lib/
│   │   ├── prisma.ts     # Prisma 客戶端配置
│   │   ├── user-storage.ts          # 用戶管理系統
│   │   ├── news-storage-prisma.ts   # 新聞管理系統
│   │   ├── live-updates-storage-prisma.ts  # 即時動態系統
│   │   └── seed.ts       # 資料種子腳本
│   ├── types/           # TypeScript 型別定義
│   └── utils/           # 通用工具
├── prisma/             # Prisma 資料庫配置
│   ├── schema.prisma   # 資料庫 Schema
│   └── migrations/     # 資料庫遷移檔案
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

- **Users**: 使用者管理 (ADMIN/TEACHER/STUDENT 角色權限)
- **News**: 新聞文章管理 (標題、內容、摘要、圖片、發布狀態、精選狀態)
- **LiveUpdate**: 即時動態管理 (優先級、標籤、發布狀態)
- **FeaturedResource**: 特色資源管理 (分類、狀態、排序)

### 資料庫 Schema 特色：
- **關聯性設計**: News 和 LiveUpdate 關聯到 User (作者)
- **角色權限**: 三級角色系統，支援細粒度權限控制
- **優先級系統**: LiveUpdate 支援 LOW/MEDIUM/HIGH/URGENT 四級優先級
- **標籤系統**: 支援陣列型別標籤，便於分類和搜尋
- **時間戳記**: 自動管理 createdAt 和 updatedAt

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

## ✨ 2024-08-04 新增「培養最國際化的商管專業人才」區塊
### 新增功能：
- **培養最國際化的商管專業人才區塊** (`src/components/layout/TalentDevelopmentSection.tsx`)
  - 展示學校國際化人才培養特色的互動式展示區域
  - 包含全球視野培養、實務導向教學、雙語專業課程、創新創業精神四大特色
  - 校友成功故事展示，包含具體案例與統計數據
  - 支援多語系內容與結構化標記
  - 漸進式動畫載入與細緻的懸停互動效果
  - 玻璃質感卡片設計與漸層視覺效果
  - 響應式網格佈局，適配各種螢幕尺寸

### 頁面結構調整：
- 在首頁 (`src/app/[locale]/page.tsx`) 中將新區塊放置在「統計數據展示」與「更多的精采收錄」之間
- 保持了整體頁面的視覺流暢性與內容層次結構

## 🎬 2024-08-04 重新設計「更多的精采收錄」- Instagram & YouTube 雙層輪播

### 重大功能更新：

- **社群媒體雙層輪播系統** (`src/components/layout/MoreHighlightsSection.tsx`)
  - **YouTube 區塊**：右至左自動輪播，展示官方頻道影片
  - **Instagram 區塊**：左至右自動輪播，展示社群貼文動態
  - 卡片式設計，支援影片縮圖、互動數據與平台識別
  - 漸層遮罩效果，營造無限輪播視覺體驗
  - 社群媒體平台品牌色彩與圖標整合

### 檔案修改：

- 重構：`src/components/layout/MoreHighlightsSection.tsx` - 完全重新設計為社群媒體輪播
- 修改：`messages/zh.json` - 更新中文翻譯內容
- 修改：`messages/en.json` - 更新英文翻譯內容

### 技術特色：

- **雙向輪播動畫**：YouTube 右至左，Instagram 左至右的連續滾動
- **無限循環效果**：複製數據陣列實現無縫輪播體驗
- **遮罩漸層**：CSS mask-image 創造邊緣淡出效果
- **響應式卡片**：YouTube (320px) 與 Instagram (288px) 最適尺寸
- **平台視覺識別**：YouTube 紅色與 Instagram 漸層品牌色彩
- **互動回饋**：懸停縮放與顏色轉換動畫
- **社群連結按鈕**：引導用戶訂閱官方社群媒體

### 🚀 輪播效能優化：

- **增加內容豐富度**：YouTube 擴展至 10 個影片，Instagram 擴展至 12 則貼文
- **改善動畫技術**：使用 CSS `transform` 代替 `scrollLeft` 實現更流暢的輪播
- **優化渲染效能**：移除不必要的 transition 類別，提升動畫流暢度
- **精確計算邏輯**：根據卡片實際寬度動態計算輪播範圍
- **無限循環優化**：改善邊界檢測，確保無縫循環體驗

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

---

**README.md 更新日期：2025-08-08**
