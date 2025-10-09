import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // replace `global` with `globalThis` during build
    global: "globalThis",
  },
  // optional: help Vite pre-bundle problematic deps
  optimizeDeps: {
    include: ["simple-peer", "randombytes"],
  },
});
