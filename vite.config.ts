import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.VITE_BASE ?? (repo ? `/${repo}/` : "/");

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Dance Training",
        short_name: "Dance",
        description:
          "Interactive Kakoune learning tool that adapts to your VS Code Dance keybindings.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: ".",
        scope: ".",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2,json,txt}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@data": fileURLToPath(new URL("./data", import.meta.url)),
      // The vendored Dance bundle does `import * as vscode from "vscode"`; we
      // resolve that to our in-browser polyfill instead of node_modules.
      vscode: fileURLToPath(new URL("./src/vscode/index.ts", import.meta.url)),
    },
  },
  build: {
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("monaco-editor")) return "monaco";
          if (
            id.includes("node_modules/react") ||
            id.includes("react-dom") ||
            id.includes("@radix-ui")
          )
            return "react-vendor";
          // Force the vscode polyfill, the dance bundle, and the host bridge
          // into a single chunk so the polyfill state (extensions registry,
          // command map, etc.) is a single in-memory singleton — otherwise
          // Vite duplicates the polyfill module per consumer and Dance ends
          // up reading from an empty extensions.all.
          if (
            id.includes("/src/vscode/") ||
            id.includes("/src/dance/") ||
            id.includes("vendor/dance.js") ||
            id.includes("vendor/dance.package.json")
          )
            return "dance";
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["tests/setup.ts"],
    exclude: ["node_modules", "dist", "tests/e2e/**"],
  },
});
