import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**"],
  },
  {
    files: ["**/*.{js,mjs}"],
    extends: [js.configs.recommended],
  },
  {
    files: ["src/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true },
    },
  },
  ...astro.configs.recommended,
  {
    files: ["src/**/*.astro"],
    rules: {
      "astro/no-set-html-directive": "error",
    },
  },
]);
