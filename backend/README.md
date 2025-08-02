# CMYZU 後端 API 文檔

## 🚀 快速開始

### 環境設定

1. 複製環境變數檔案：
```bash
cp .env.example .env
```

2. 修改 `.env` 中的資料庫連線和 JWT 密鑰

3. 安裝依賴：
```bash
pnpm install
```

4. 生成 Prisma Client：
```bash
pnpm db:generate
```

5. 啟動開發伺服器：
```bash
pnpm dev
```

伺服器將在 `http://localhost:5000` 啟動

## 📝 API 端點

### 認證相關 `/api/auth`

#### POST `/api/auth/register`
註冊新用戶

**請求體：**
```json
{
  "name": "張三",
  "email": "zhang@example.com",
  "password": "password123",
  "role": "STUDENT" // 可選：ADMIN, TEACHER, STUDENT
}
```

**響應：**
```json
{
  "success": true,
  "message": "註冊成功",
  "data": {
    "user": {
      "id": "user_id",
      "name": "張三",
      "email": "zhang@example.com",
      "role": "STUDENT",
      "active": true,
      "createdAt": "2025-07-31T..."
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
用戶登入

**請求體：**
```json
{
  "email": "zhang@example.com",
  "password": "password123"
}
```

**響應：**
```json
{
  "success": true,
  "message": "登入成功",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/me`
獲取當前用戶資訊

**標頭：**
```
Authorization: Bearer <jwt_token>
```

**響應：**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### POST `/api/auth/logout`
用戶登出

**標頭：**
```
Authorization: Bearer <jwt_token>
```

### 用戶管理 `/api/users`

#### GET `/api/users`
獲取用戶列表（僅管理員）

**查詢參數：**
- `page`: 頁碼（預設 1）
- `limit`: 每頁數量（預設 10）
- `role`: 角色篩選（ADMIN/TEACHER/STUDENT）
- `search`: 搜尋關鍵字（姓名或電子郵件）

**標頭：**
```
Authorization: Bearer <admin_jwt_token>
```

#### GET `/api/users/:id`
獲取特定用戶資訊

**權限：** 用戶只能查看自己，管理員可查看所有

#### PUT `/api/users/:id`
更新用戶資訊

**請求體：**
```json
{
  "name": "新姓名",
  "image": "https://example.com/avatar.jpg",
  "role": "TEACHER", // 僅管理員可修改
  "active": false    // 僅管理員可修改
}
```

#### DELETE `/api/users/:id`
停用用戶（僅管理員）

### 文章管理 `/api/posts`

#### GET `/api/posts`
獲取文章列表（公開）

**查詢參數：**
- `page`: 頁碼
- `limit`: 每頁數量
- `category`: 分類篩選
- `tag`: 標籤篩選
- `search`: 搜尋關鍵字
- `featured`: 精選文章（true/false）
- `published`: 發布狀態（預設 true）
- `author`: 作者 ID

#### GET `/api/posts/:id`
獲取特定文章

#### POST `/api/posts`
建立文章（需要教師權限）

**請求體：**
```json
{
  "title": "文章標題",
  "content": "文章內容",
  "excerpt": "文章摘要",
  "slug": "article-slug",
  "featured": false,
  "published": true,
  "categoryId": "category_id",
  "tagIds": ["tag1_id", "tag2_id"]
}
```

#### PUT `/api/posts/:id`
更新文章

**權限：** 作者或管理員

#### DELETE `/api/posts/:id`
刪除文章

**權限：** 作者或管理員

## 🔒 認證機制

### JWT Token 格式

所有需要認證的端點都需要在請求標頭中包含：

```
Authorization: Bearer <jwt_token>
```

### 權限角色

- **ADMIN**: 管理員，擁有所有權限
- **TEACHER**: 教師，可以管理文章和內容
- **STUDENT**: 學生，基本讀取權限

## 📊 錯誤響應格式

```json
{
  "success": false,
  "error": "錯誤訊息",
  "details": {
    "field": "具體錯誤欄位",
    "message": "詳細錯誤說明"
  }
}
```

### 常見錯誤代碼

- `400`: 請求資料驗證失敗
- `401`: 未認證或認證失敗
- `403`: 權限不足
- `404`: 資源不存在
- `500`: 伺服器內部錯誤

## 🗄️ 資料庫模型

### 用戶 (User)
- `id`: 唯一識別碼
- `name`: 姓名
- `email`: 電子郵件（唯一）
- `password`: 加密密碼
- `role`: 角色（ADMIN/TEACHER/STUDENT）
- `active`: 是否啟用
- `image`: 頭像 URL
- `createdAt`: 建立時間
- `updatedAt`: 更新時間

### 文章 (Post)
- `id`: 唯一識別碼
- `title`: 標題
- `content`: 內容
- `excerpt`: 摘要
- `slug`: 網址代碼（唯一）
- `featured`: 是否精選
- `published`: 是否發布
- `publishedAt`: 發布時間
- `authorId`: 作者 ID
- `categoryId`: 分類 ID
- `createdAt`: 建立時間
- `updatedAt`: 更新時間

## 🚀 部署

### 開發環境
```bash
pnpm dev
```

### 生產環境
```bash
pnpm build
pnpm start
```

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 5000
CMD ["pnpm", "start"]
```