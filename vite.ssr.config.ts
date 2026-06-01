import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  build: {
    ssr: "src/entry-server.tsx",
    outDir: "dist-ssr",
    emptyOutDir: true,
    rollupOptions: {
      output: { format: "esm", entryFileNames: "entry-server.mjs" },
    },
    target: "node18",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  plugins: [react()],
  ssr: { noExternal: true },
  define: {
    __BUILD_ID__: JSON.stringify(String(Date.now())),
  },
});
