import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

const isLibBuild =
  process.env.BUILD_MODE === "lib" ||
  process.env.npm_lifecycle_event === "build" ||
  process.env.npm_lifecycle_event === "build:fast";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      include: ["src"],
      exclude: ["src/demo/**/*", "src/**/*.test.tsx", "src/**/*.test.ts"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    open: false,
    host: true,
  },
  build: isLibBuild
    ? {
        target: "esnext",
        minify: "esbuild",
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "MuiMediaPlayer",
          formats: ["es"],
          fileName: () => "mui-media-player.es.js",
        },
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
            /^@mui\/material\//,
            /^@mui\/icons-material\//,
          ],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "@mui/material": "MaterialUI",
              "@emotion/react": "EmotionReact",
              "@emotion/styled": "EmotionStyled",
            },
          },
        },
      }
    : {
        outDir: "dist-demo",
      },
});
