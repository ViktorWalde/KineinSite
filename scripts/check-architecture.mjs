import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const sourceExtensions = new Set([".astro", ".ts", ".js", ".mjs", ".css"]);
const importExtensions = ["", ".astro", ".ts", ".js", ".mjs", ".css"];
const exceptions = JSON.parse(
  readFileSync(path.join(root, "scripts/architecture-exceptions.json"), "utf8"),
);
const usedExceptions = new Set();
const warnings = [];
const errors = [];

function relative(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function visit(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? visit(file) : [file];
  });
}

function countCodeLines(file) {
  let inBlockComment = false;
  let count = 0;
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (inBlockComment) {
      if (line.includes("*/") || line.includes("-->")) inBlockComment = false;
      continue;
    }
    if (line.startsWith("/*") || line.startsWith("<!--")) {
      if (!line.includes("*/") && !line.includes("-->")) inBlockComment = true;
      continue;
    }
    if (line.startsWith("//") || line.startsWith("*")) continue;
    count += 1;
  }
  return count;
}

function hasException(kind, subject) {
  const key = `${kind}:${relative(subject)}`;
  const entry = exceptions[key];
  if (!entry) return false;
  usedExceptions.add(key);
  if (
    typeof entry.reason !== "string" ||
    entry.reason.trim().length < 15 ||
    typeof entry.owner !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewBy) ||
    entry.reviewBy < new Date().toISOString().slice(0, 10)
  ) {
    errors.push(`Exceção inválida ou vencida: ${key}`);
    return false;
  }
  warnings.push(`Exceção ativa: ${key} — ${entry.reason}`);
  return true;
}

const files = visit(sourceRoot).filter((file) =>
  sourceExtensions.has(path.extname(file)),
);
const lineCounts = new Map(files.map((file) => [file, countCodeLines(file)]));

for (const file of files) {
  const lines = lineCounts.get(file);
  if (lines > 400 && !hasException("file", file)) {
    errors.push(`${relative(file)}: ${lines} linhas de código; limite 400`);
  } else if (lines > 250) {
    warnings.push(
      `${relative(file)}: ${lines} linhas; revisar responsabilidades`,
    );
  }
}

const scopes = readdirSync(sourceRoot, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      !["pages", "content", "features"].includes(entry.name),
  )
  .map((entry) => path.join(sourceRoot, entry.name));
const featureRoot = path.join(sourceRoot, "features");
if (existsSync(featureRoot)) {
  scopes.push(
    ...readdirSync(featureRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(featureRoot, entry.name)),
  );
}

for (const scope of scopes) {
  const scopedFiles = files.filter((file) =>
    file.startsWith(`${scope}${path.sep}`),
  );
  const lines = scopedFiles.reduce(
    (sum, file) => sum + lineCounts.get(file),
    0,
  );
  if (
    (scopedFiles.length > 20 || lines > 1600) &&
    !hasException("scope", scope)
  ) {
    errors.push(
      `${relative(scope)}: ${scopedFiles.length} arquivos/${lines} linhas; limite 20/1600`,
    );
  } else if (scopedFiles.length > 12 || lines > 1000) {
    warnings.push(
      `${relative(scope)}: ${scopedFiles.length} arquivos/${lines} linhas; revisar coesão`,
    );
  }
}

const graph = new Map();
const codeFiles = files.filter((file) => path.extname(file) !== ".css");
for (const file of codeFiles) {
  const imports = [];
  const text = readFileSync(file, "utf8");
  const pattern =
    /\b(?:import|export)\s+(?:[^'"\n]*?\s+from\s+)?['"](\.[^'"\n]+)['"]|\bimport\s*\(\s*['"](\.[^'"\n]+)['"]\s*\)/g;
  for (const match of text.matchAll(pattern)) {
    const specifier = match[1] ?? match[2];
    const base = path.resolve(path.dirname(file), specifier);
    const target = importExtensions
      .flatMap((extension) => [
        base + extension,
        path.join(base, `index${extension}`),
      ])
      .find((candidate) => codeFiles.includes(candidate));
    if (!target) continue;
    imports.push(target);
    const from = relative(file);
    const to = relative(target);
    if (
      (from.startsWith("src/components/") ||
        from.startsWith("src/layouts/") ||
        from.startsWith("src/scripts/")) &&
      to.startsWith("src/pages/")
    ) {
      errors.push(`${from}: importação indevida de rota ${to}`);
    }
    if (
      from.startsWith("src/scripts/") &&
      /^(src\/content|src\/layouts|src\/components)\//.test(to)
    ) {
      errors.push(`${from}: script de navegador depende de ${to}`);
    }
  }
  graph.set(file, imports);
}

const visited = new Set();
const active = new Set();
function checkCycles(file, stack) {
  if (active.has(file)) {
    errors.push(
      `Ciclo de importação: ${[...stack, file].map(relative).join(" → ")}`,
    );
    return;
  }
  if (visited.has(file)) return;
  active.add(file);
  for (const target of graph.get(file) ?? [])
    checkCycles(target, [...stack, file]);
  active.delete(file);
  visited.add(file);
}
for (const file of codeFiles) checkCycles(file, []);

for (const key of Object.keys(exceptions)) {
  if (!usedExceptions.has(key)) errors.push(`Exceção sem uso: ${key}`);
}

for (const message of warnings) process.stdout.write(`AVISO ${message}\n`);
for (const message of errors) process.stderr.write(`ERRO ${message}\n`);
process.stdout.write(
  `Arquitetura: ${files.length} arquivos, ${warnings.length} avisos, ${errors.length} erros.\n`,
);
if (errors.length) process.exitCode = 1;
