module.exports = {
  'src/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  'backend/src/**/*.{js,ts}': [
    'cd backend && pnpm typecheck'
  ]
};