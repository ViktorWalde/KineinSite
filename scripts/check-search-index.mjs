import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const directory = path.resolve(process.env.KINEIN_TEST_DIST ?? "dist");
const files = (await readdir(directory, { recursive: true })).filter((file) =>
  file.endsWith(".html"),
);
const pages = [];
for (const file of files) {
  const html = await readFile(path.join(directory, file), "utf8");
  const main = /<main\b[^>]*>/.exec(html)?.[0] ?? "";
  const noindex = html.includes('name="robots" content="noindex"');
  assert.equal(main.includes("data-pagefind-body"), !noindex, file);
  assert.ok(
    !html.includes("data-c0-"),
    "Atributos da fixture não devem substituir metadados do produto.",
  );
  if (noindex) continue;
  assert.ok(
    main.includes('data-search-language="pt-BR"') &&
      main.includes('data-search-type="'),
    file,
  );
  pages.push(file);
}
const entry = JSON.parse(
  await readFile(path.join(directory, "pagefind/pagefind-entry.json"), "utf8"),
);
assert.equal(entry.version, "1.6.0");
assert.deepEqual(Object.keys(entry.languages), ["pt-br"]);
assert.equal(entry.languages["pt-br"].page_count, pages.length);
assert.ok(!pages.includes("404.html"));
for (const file of await readdir(path.join(directory, "pagefind")))
  assert.ok(
    !/^pagefind-(?:ui|component-ui|modular-ui|highlight)\./.test(file),
    file,
  );
const manual = await readFile(
  path.join(directory, "manual/index.html"),
  "utf8",
);
assert.ok(
  manual.includes(
    'data-search-source="https://github.com/ViktorWalde/KineinVectis/blob/v0.3.5/DocsPublic/manual.md"',
  ),
);
assert.ok(/data-search-revision="[0-9a-f]{40}"/.test(manual));
const preview = await readFile(
  path.join(directory, "documentacao/previa-0-4/index.html"),
  "utf8",
);
assert.ok(
  preview.includes('data-search-version="0.4"') &&
    preview.includes('data-search-status="Em desenvolvimento"'),
);
globalThis.console.log(
  `Índice de busca: ${pages.length} páginas públicas, versão, idioma, origem, prévia e exclusões conferidos.`,
);
