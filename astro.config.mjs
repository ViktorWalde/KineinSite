import process from "node:process";
import { defineConfig } from "astro/config";

const pagesBuild = process.env.KINEIN_PAGES_BUILD === "1";

export default defineConfig({
  output: "static",
  markdown: { syntaxHighlight: false },
  ...(pagesBuild
    ? { site: "https://viktorwalde.github.io", base: "/KineinSite" }
    : {}),
});
