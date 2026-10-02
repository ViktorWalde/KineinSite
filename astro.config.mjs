import process from "node:process";
import { defineConfig } from "astro/config";

const pagesBuild = process.env.KINEIN_PAGES_BUILD === "1";

export default defineConfig({
  output: "static",
  markdown: { syntaxHighlight: false },
  // O GitHub Pages não permite cabeçalhos HTTP próprios, então a política de
  // conteúdo vai num <meta> em cada página. O Astro calcula o hash de cada
  // script e estilo que ele emite (inclusive o script de tema do <head>);
  // qualquer outro script inline, injetado ou vindo de HTML cru num
  // Markdown, é recusado pelo navegador. frame-ancestors, report-uri e
  // sandbox não valem em <meta> e ficam de fora (docs/ARCHITECTURE.md,
  // "Segurança").
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        "upgrade-insecure-requests",
      ],
    },
  },
  ...(pagesBuild
    ? { site: "https://viktorwalde.github.io", base: "/KineinSite" }
    : {}),
});
