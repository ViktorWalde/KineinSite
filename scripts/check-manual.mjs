// Confere que src/content/manual/manual.md é a cópia fiel registrada no
// frontmatter: o sha256 do corpo tem de bater. Uma edição à mão no manual
// criaria uma segunda documentação, divergente da IDE; a correção vai no
// repositório da IDE e volta por scripts/sincronizar-manual.mjs.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const file = path.join(
  import.meta.dirname,
  "..",
  "src",
  "content",
  "manual",
  "manual.md",
);
const text = readFileSync(file, "utf8");
const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
if (!match) {
  process.stderr.write(`ERRO manual sem frontmatter: ${file}\n`);
  process.exit(1);
}

const expected = /^sha256: "([0-9a-f]{64})"$/m.exec(match[1])?.[1];
const body = text.slice(match[0].length);
const actual = createHash("sha256").update(body, "utf8").digest("hex");
if (expected !== actual) {
  process.stderr.write(
    "ERRO o corpo do manual não é a cópia registrada (sha256 diferente). " +
      "Não edite o manual no site: corrija na IDE e rode " +
      "scripts/sincronizar-manual.mjs.\n",
  );
  process.exit(1);
}
process.stdout.write(`Manual: cópia fiel (sha256 ${actual.slice(0, 12)}…).\n`);
