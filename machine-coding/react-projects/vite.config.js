// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Allows using `describe`, `it`, `expect` globally
    environment: "jsdom", // Ensures a browser-like environment
    setupFiles: "./src/setupTests.js", // Runs setup before tests
  },
});
