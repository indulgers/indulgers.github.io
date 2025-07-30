import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // 替换为你的仓库名
  build: {
    outDir: "dist",
    target: "esnext", // 支持更现代的特性
    // 或者指定支持 top-level await 的浏览器版本
    // target: ["chrome89", "firefox89", "safari15", "edge89"]
  },
});
