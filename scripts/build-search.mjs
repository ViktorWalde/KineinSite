import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { TextDecoder } from "node:util";
import * as pagefind from "pagefind";

const directory = path.resolve(process.env.KINEIN_TEST_DIST ?? "dist");
try {
  const { index, errors } = await pagefind.createIndex({
    includeCharacters: "+#",
    writePlayground: false,
    excludeSelectors: [
      "nav",
      "aside",
      "dialog",
      "button",
      "summary",
      "[hidden]",
      "svg",
      "[role=status]",
      "[data-task-list]",
      "[data-contributors-list]",
    ],
  });
  assert.deepEqual(errors, []);
  const result = await index.addDirectory({ path: directory });
  assert.deepEqual(result.errors, []);
  assert.ok(result.page_count > 0, "Nenhuma página disponível para a busca.");
  const bundle = await index.getFiles();
  assert.deepEqual(bundle.errors, []);
  const entry = bundle.files.find(
    (file) => file.path === "pagefind-entry.json",
  );
  assert.ok(entry);
  const info = JSON.parse(new TextDecoder().decode(entry.content));
  const indexed = Object.values(info.languages).reduce(
    (total, language) => total + language.page_count,
    0,
  );
  let bytes = 0,
    count = 0;
  for (const file of bundle.files) {
    // A interface e os destaques usam componentes do site, não as UIs do pacote.
    if (/^pagefind-(?:component-ui|modular-ui|ui|highlight)\./.test(file.path))
      continue;
    const target = path.join(directory, "pagefind", file.path);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.content);
    bytes += file.content.byteLength;
    count++;
  }
  globalThis.console.log(
    `Busca: ${indexed} páginas indexadas de ${result.page_count} HTMLs, ${count} arquivos/${bytes} bytes; UIs opcionais omitidas.`,
  );
} finally {
  await pagefind.close();
}
