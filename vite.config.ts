import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/novel": {
        target: "https://novel.alan.imdeo.kr/novel",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/novel/, ""),
      },
    },
  },
  plugins: [vue(), vuetify({ autoImport: true })],
  // base: "./",
});
