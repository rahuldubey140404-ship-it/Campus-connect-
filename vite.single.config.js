// Builds the whole app into ONE index.html that opens by double-click (no server needed)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: "../html-version", emptyOutDir: false },
});
