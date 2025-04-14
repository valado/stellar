// @ts-expect-error
import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("ca/key.pem"),
      cert: fs.readFileSync("ca/cert.pem"),
    },
  },
});
