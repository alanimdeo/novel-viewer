import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/novel": {
        target: "https://pages.alan.imdeo.kr/oregairu/novel",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/novel/, ""),
      },
    },
  },
  plugins: [vue()],
});
