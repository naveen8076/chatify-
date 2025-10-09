import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // replace `global` with `globalThis` during build
    global: "globalThis",
  },
  optimizeDeps: {
    // include packages that sometimes ship modern/untranspiled code
    include: ["simple-peer", "randombytes", "socket.io-client", "react-hot-toast"],
  },
  ssr: {
    // prevent these packages from being treated as external during SSR builds
    noExternal: ["socket.io-client", "react-hot-toast", "simple-peer"],
  },
  build: {
    // produce code that is broadly compatible on Render
    target: "es2019",
  },
});
