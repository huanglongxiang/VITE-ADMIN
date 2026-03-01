import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'esnext',
    lib: {
      formats: ['umd'],
      entry: './src/main.ts',
      name: 'vitePdfSystem',
      fileName: 'vite-pdf-system',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        format: 'umd', // 输出格式为 UMD
        name: 'vitePdfSystem', // 全局变量名（需与主应用中注册的名称一致）
      },
    },
  },
  server: {
    port: 7101,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
