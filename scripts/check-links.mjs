import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { URL } from "node:url";

const root = path.resolve("dist");
const origin = "https://kinein.local";
const base = process.env.KINEIN_PAGES_BUILD === "1" ? "/KineinSite" : "";
const errors = [];

function visit(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? visit(file) : [file];
  });
}

function destination(url) {
  const pathname = decodeURIComponent(url.pathname);
  if (base && pathname !== base && !pathname.startsWith(`${base}/`)) {
    throw new Error("Link local fora da base do GitHub Pages");
  }
  const relative = pathname.slice(base.length).replace(/^\/+/, "");
  let file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    throw new Error("Caminho fora de dist/");
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  return file;
}

if (!existsSync(root)) {
  process.stderr.write("ERRO dist/ não existe; execute npm run build.\n");
  process.exit(1);
}

const pages = visit(root).filter((file) => file.endsWith(".html"));
if (pages.length === 0) errors.push("Nenhuma página HTML gerada.");

for (const page of pages) {
  const markup = readFileSync(page, "utf8");
  const source = new URL(
    `${base}/${path.relative(root, page).split(path.sep).join("/")}`,
    origin,
  );
  for (const match of markup.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const raw = match[1];
    let url;
    try {
      url = new URL(raw, source);
    } catch {
      errors.push(`${path.relative(root, page)}: URL inválida ${raw}`);
      continue;
    }
    if (["mailto:", "tel:"].includes(url.protocol)) continue;
    if (!["http:", "https:"].includes(url.protocol)) {
      errors.push(`${path.relative(root, page)}: protocolo inesperado ${raw}`);
      continue;
    }
    if (url.origin !== origin) continue;
    let target;
    try {
      target = destination(url);
    } catch {
      errors.push(`${path.relative(root, page)}: caminho inválido ${raw}`);
      continue;
    }
    if (!existsSync(target)) {
      errors.push(`${path.relative(root, page)}: destino ausente ${raw}`);
      continue;
    }
    if (url.hash && target.endsWith(".html")) {
      const id = decodeURIComponent(url.hash.slice(1));
      const html = readFileSync(target, "utf8");
      const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(
        (entry) => entry[1],
      );
      if (!ids.includes(id)) {
        errors.push(`${path.relative(root, page)}: âncora ausente ${raw}`);
      }
    }
  }
}

for (const error of errors) process.stderr.write(`ERRO ${error}\n`);
process.stdout.write(
  `Links locais: ${pages.length} páginas, ${errors.length} erros.\n`,
);
if (errors.length) process.exitCode = 1;
