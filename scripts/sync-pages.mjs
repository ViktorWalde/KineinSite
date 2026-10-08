import { cp, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [source, target, commit] = process.argv.slice(2);
if (!source || !target || !/^[a-f0-9]{40}$/.test(commit ?? "")) {
  throw new Error(
    "Uso: node scripts/sync-pages.mjs <dist> <clone-temporário> <commit>",
  );
}
const destination = path.resolve(target);
// Só o clone descartável criado pelo publicador pode ser esvaziado.
if (!/^kinein-pages\.[A-Za-z0-9]{8}$/.test(path.basename(destination))) {
  throw new Error("Destino não é um clone temporário do publicador.");
}
await stat(path.join(destination, ".git"));
await stat(path.join(source, "index.html"));
for (const entry of await readdir(destination)) {
  if (entry !== ".git")
    await rm(path.join(destination, entry), { recursive: true, force: true });
}
for (const entry of await readdir(source)) {
  if (entry === ".git")
    throw new Error("O build contém um diretório .git inesperado.");
  await cp(path.join(source, entry), path.join(destination, entry), {
    recursive: true,
  });
}
await writeFile(path.join(destination, ".nojekyll"), "");
await writeFile(
  path.join(destination, "site-version.json"),
  `${JSON.stringify({ sourceCommit: commit })}\n`,
);
