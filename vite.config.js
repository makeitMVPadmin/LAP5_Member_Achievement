import eslint from "vite-plugin-eslint2";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "",
  plugins: [react(), eslint()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
