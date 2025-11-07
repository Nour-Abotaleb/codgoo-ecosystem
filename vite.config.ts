import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@features": path.resolve(__dirname, "src/features"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@services": path.resolve(__dirname, "src/services"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@store": path.resolve(__dirname, "src/store")
    }
  }
});

