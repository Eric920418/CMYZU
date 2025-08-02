module.exports = {
  // 前端檔案
  'src/**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  // 後端檔案 - 只檢查 TypeScript 編譯
  'backend/src/**/*.ts': ['cd backend && pnpm typecheck'],
  // 其他檔案
  '*.{md,json}': ['prettier --write'],
  '*.{css,scss}': ['prettier --write'],
};
