import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { visualizer } from "rollup-plugin-visualizer"; //build 视图分析依赖文件

import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    AutoImport({
      dts: "src/typings/auto-imports.d.ts", // 生成在src路径下名为auto-import.d.ts的声明文件
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: "src/typings/components.d.ts", // 生成在src路径下名为auto-import.d.ts的声明文件
      dirs: ["src/components"], // 配置需要默认导入的自定义组件文件夹，该文件夹下的所有组件都会自动 import
    }),
    visualizer({
      emitFile: true,
      filename: "visualizer.html", //分析图生成的文件名
      open: true, //如果存在本地服务端口，将在打包后自动展示
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 9527,
    // open: true,
    proxy: {
      "/api": {
        target: "https://lengyibai.gitee.io/wzry",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    minify: "terser",
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
