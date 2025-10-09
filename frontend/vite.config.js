// vite.config.js — paste & save (merge with your current config)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["simple-peer", "randombytes", "socket.io-client", "react-hot-toast"],
  },
  ssr: {
    noExternal: ["socket.io-client", "react-hot-toast", "simple-peer"],
  },
  build: {
    target: "es2019",
    sourcemap: true,   // ← enable source maps (temporary)
    minify: false,     // ← disable minification (temporary)
  },
});
