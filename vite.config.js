import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'
import AutoImport from 'unplugin-auto-import/vite'
import dotenv from 'dotenv'
dotenv.config()
// TODO 报错了，先注释
// import { createStyleImportPlugin, AntdResolve } from "vite-plugin-style-import"

console.error('打包index--- ', process.env.TEMP_BACKGROUND_DIR)
export default defineConfig({
  plugins: [
    react(),
    reactRefresh(), // 热更新
    AutoImport({
      include: [/\.[tj]sx?$/],
      imports: ['react', 'react-router'],
    }),
    // Antd 的样式使用了 Less 作为开发语言，为了减小 antd 的 css，变全局引入为按需引入
    // createStyleImportPlugin({ resolve: [AntdResolve] })
  ],
  css: {
    // CSS 预处理器的配置选项
    preprocessorOptions: {
      less: {
        additionalData: `@import "${path.resolve(__dirname, 'src/assests/index.less')}";`, // 全局变量
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // 配置所有页面路径，使得所有页面都会被打包
        index: path.resolve(__dirname, 'index.html'),
        login: path.resolve(__dirname, '/pages/login.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
