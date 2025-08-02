import app from './app';
import { PrismaClient } from '@prisma/client';

// 環境變數
const PORT = process.env.PORT || 5000;

// Prisma 客戶端
export const prisma = new PrismaClient();

// 優雅關閉處理
const gracefulShutdown = async () => {
  console.log('正在關閉伺服器...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 後端伺服器運行在 http://localhost:${PORT}`);
  console.log(`📚 API 文件: http://localhost:${PORT}/api/health`);
});