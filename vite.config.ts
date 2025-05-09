import fs from "node:fs";
import { URL } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";

const dev = process.env.NODE_ENV !== "production";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    https: dev
      ? {
          key: fs.readFileSync("ca/key.pem"),
          cert: fs.readFileSync("ca/cert.pem"),
        }
      : undefined,
  },
  resolve: {
    alias: [
      {
        find: "$components",
        replacement: new URL("src/components", import.meta.url).pathname,
      },
      {
        find: "$demos",
        replacement: new URL("src/demos", import.meta.url).pathname,
      },
      {
        find: "$factories",
        replacement: new URL("src/factories", import.meta.url).pathname,
      },
      {
        find: "$hooks",
        replacement: new URL("src/hooks", import.meta.url).pathname,
      },
      {
        find: "$stores",
        replacement: new URL("src/stores", import.meta.url).pathname,
      },
      {
        find: "$utils",
        replacement: new URL("src/utils", import.meta.url).pathname,
      },
    ],
  },
});
