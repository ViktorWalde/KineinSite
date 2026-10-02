// Copia o manual da IDE, sem alterar uma letra, para src/content/manual/.
//
//   node scripts/sincronizar-manual.mjs <clone-da-kinein-vectis> <tag>
//   (exemplo: node scripts/sincronizar-manual.mjs ../KineinVectis v0.3.5)
//
// O texto vem de `git show <tag>:DocsPublic/manual.md` no clone local, e o
// frontmatter registra a tag, o commit e o sha256 do corpo. O site mostra a
// versão pública do manual; o repositório da IDE continua sendo a fonte.
// scripts/check-manual.mjs confere no build que o corpo não foi editado.
// Num clone raso sem a tag: git fetch --depth=1 origin refs/tags/<tag>:refs/tags/<tag>
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const SOURCE = "DocsPublic/manual.md";
const [clone, tag] = process.argv.slice(2);
if (!clone || !/^v\d+\.\d+\.\d+$/.test(tag ?? "")) {
  process.stderr.write(
    "Uso: node scripts/sincronizar-manual.mjs <clone-da-kinein-vectis> <tag vX.Y.Z>\n",
  );
  process.exit(1);
}

function git(...args) {
  return execFileSync("git", ["-C", clone, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
}

const commit = git("rev-parse", `${tag}^{commit}`).trim();
const body = git("show", `${commit}:${SOURCE}`);
const sha256 = createHash("sha256").update(body, "utf8").digest("hex");
const today = new Date().toISOString().slice(0, 10);

const frontmatter = [
  "---",
  `version: "${tag.slice(1)}"`,
  `tag: "${tag}"`,
  `commit: "${commit}"`,
  `source: "${SOURCE}"`,
  `sha256: "${sha256}"`,
  `syncedAt: ${today}`,
  "---",
  "",
].join("\n");

const dir = path.join(import.meta.dirname, "..", "src", "content", "manual");
mkdirSync(dir, { recursive: true });
writeFileSync(path.join(dir, "manual.md"), frontmatter + body);
process.stdout.write(
  `Manual ${tag} (${commit.slice(0, 7)}) copiado; sha256 ${sha256}.\n`,
);
