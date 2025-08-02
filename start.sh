#!/bin/bash

# CMYZU 前後端一鍵啟動腳本
# 使用方法: ./start.sh

echo "🚀 啟動 CMYZU 前後端服務..."

# 檢查 PostgreSQL 是否運行
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "❌ PostgreSQL 服務未運行，請先啟動 PostgreSQL"
    exit 1
fi

echo "✅ PostgreSQL 服務正常"

# 檢查並創建資料庫（如果不存在）
if ! psql -lqt | cut -d \| -f 1 | grep -qw cmyzu; then
    echo "📊 創建 cmyzu 資料庫..."
    createdb cmyzu
    echo "✅ cmyzu 資料庫創建成功"
else
    echo "✅ cmyzu 資料庫已存在"
fi

# 啟動後端服務
echo "🔧 啟動後端服務 (port 4000)..."
cd backend
pnpm install >/dev/null 2>&1
pnpm db:generate >/dev/null 2>&1
pnpm db:push >/dev/null 2>&1
PORT=4000 pnpm dev &
BACKEND_PID=$!
cd ..

# 等待後端啟動
echo "⏳ 等待後端服務啟動..."
sleep 3

# 檢查後端是否啟動成功
if curl -s http://localhost:4000/api/health >/dev/null; then
    echo "✅ 後端服務啟動成功 (http://localhost:4000)"
else
    echo "❌ 後端服務啟動失敗"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 啟動前端服務
echo "🎨 啟動前端服務 (port 3000)..."
pnpm install >/dev/null 2>&1
pnpm dev &
FRONTEND_PID=$!

# 等待前端啟動
echo "⏳ 等待前端服務啟動..."
sleep 5

echo ""
echo "🎉 服務啟動完成！"
echo "📱 前端: http://localhost:3000"
echo "🔌 後端: http://localhost:4000"
echo "📚 API 文件: http://localhost:4000/api/health"
echo ""
echo "按 Ctrl+C 停止所有服務"

# 等待中斷信號
trap 'echo ""; echo "🛑 停止服務..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# 保持腳本運行
wait