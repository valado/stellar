// @ts-expect-error
import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// @ts-expect-error: `process` is a Node.js global.
const dev = process.env.NODE_ENV !== "production";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: dev
      ? {
          key: fs.readFileSync("ca/key.pem"),
          cert: fs.readFileSync("ca/cert.pem"),
        }
      : undefined,
  },
});
