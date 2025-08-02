import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import { errorHandler } from './middleware/errorHandler';

// 建立 Express 應用程式
const app: Application = express();

// 安全性中介軟體
app.use(helmet());

// CORS 設定
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 請求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 限制每個 IP 15 分鐘內最多 100 個請求
});
app.use(limiter);

// 日誌記錄
app.use(morgan('combined'));

// 解析 JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 健康檢查端點
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 4000,
    message: '後端服務運行正常'
  });
});

// 錯誤處理中介軟體
app.use(errorHandler);

export default app;