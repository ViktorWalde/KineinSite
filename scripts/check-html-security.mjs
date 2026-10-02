import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

// Confere no HTML gerado o que a política de conteúdo (astro.config.mjs,
// security.csp) promete, para que uma mudança de configuração ou um HTML cru
// num Markdown não a desfaça em silêncio. O navegador já bloquearia parte
// disso; aqui o erro aparece no build, com o arquivo, antes de publicar.
const root = path.resolve("dist");
const errors = [];

function visit(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? visit(file) : [file];
  });
}

if (!existsSync(root)) {
  process.stderr.write("ERRO dist/ não existe; execute npm run build.\n");
  process.exit(1);
}

const pages = visit(root).filter((file) => file.endsWith(".html"));

for (const page of pages) {
  const name = path.relative(root, page);
  const markup = readFileSync(page, "utf8");
  const head = markup.slice(0, markup.search(/<body[\s>]/i));

  const policy = head.match(
    /<meta http-equiv="content-security-policy" content="([^"]+)"/i,
  );
  if (!policy) {
    errors.push(`${name}: sem <meta> de content-security-policy no <head>`);
  } else {
    const directives = policy[1];
    for (const required of ["script-src", "object-src 'none'", "base-uri"]) {
      if (!directives.includes(required)) {
        errors.push(`${name}: a política não tem ${required}`);
      }
    }
    if (/'unsafe-(inline|eval)'/.test(directives)) {
      errors.push(
        `${name}: a política aceita 'unsafe-inline' ou 'unsafe-eval'`,
      );
    }
  }

  for (const [tag] of markup.matchAll(/<[a-z][a-z0-9-]*\b[^>]*>/gi)) {
    const element = tag.match(/^<([a-z0-9-]+)/i)[1].toLowerCase();
    if (/\son[a-z]+\s*=/i.test(tag)) {
      errors.push(`${name}: atributo de evento inline em ${tag.slice(0, 80)}`);
    }
    if (["iframe", "object", "embed"].includes(element)) {
      errors.push(`${name}: elemento <${element}> não é permitido`);
    }
    if (element === "script") {
      const source = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
      if (source && /^(?:[a-z]+:)?\/\//i.test(source)) {
        errors.push(`${name}: script de outra origem ${source}`);
      }
    }
    if (/\starget=["']_blank["']/i.test(tag)) {
      const rel = tag.match(/\srel=["']([^"']*)["']/i)?.[1] ?? "";
      if (!rel.split(/\s+/).includes("noopener")) {
        errors.push(`${name}: target="_blank" sem rel="noopener"`);
      }
    }
  }
}

for (const error of errors) process.stderr.write(`ERRO ${error}\n`);
process.stdout.write(
  `Segurança do HTML: ${pages.length} páginas, ${errors.length} erros.\n`,
);
if (errors.length) process.exitCode = 1;
