import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import netlify from "./vite-plugins/netlify.ts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    netlify,
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  // test configuration moved to vitest.config.ts
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
