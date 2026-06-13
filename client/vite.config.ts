import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 开发环境：浏览器请求 /api/* → 转发至 Express (localhost:3001)
    // 生产环境不走此代理，由 VITE_API_BASE 指定后端地址（见 src/api/client.ts）
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
