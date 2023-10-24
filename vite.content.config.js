import { defineConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"
// import { CRX_CONTENT_OUTDIR } from "./globalConfig"
import dotenv from "dotenv"
dotenv.config()
console.error("打包content--- ", process.env.TEMP_CONTENT_DIR)

export default defineConfig({
  build: {
    outDir: process.env.TEMP_CONTENT_DIR,
    // https://cn.vitejs.dev/config/build-options.html#build-lib
    lib: {
      name: "contentLib",
      entry: path.resolve(__dirname, "src/content/index.jsx"),
      // content script不支持ES6，因此不用使用es模式，需要改为cjs模式
      // formats: ["es", "cjs"],
      fileName: () => {
        return "content.js"
      }
    },
    rollupOptions: {
      input: "src/content/index.jsx",
      output: {
        assetFileNames: (assetInfo) => {
          // 附属文件命名，content script会生成配套的css
          return "content.css"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  define: {
    "process.env.NODE_ENV": null
  },
  plugins: [react()]
})
