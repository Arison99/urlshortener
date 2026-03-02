import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["app.samwifi.site", "api.samwifi.site"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "^/[A-Za-z0-9]{6,}$": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      }
    }
  }
});
