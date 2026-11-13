import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { URL } from "node:url";
import { openBrowser } from "./lib/browser.mjs";
import { prepareSearchDocument } from "./lib/search-corpus.mjs";

// C0 é uma prova opt-in, fora de dist/ e do pipeline publicado.
const candidate = process.env.KINEIN_PAGEFIND_DIR;
assert.ok(
  candidate,
  "Informe KINEIN_PAGEFIND_DIR (instalação temporária do Pagefind 1.6.0).",
);
const pkg = JSON.parse(
  await readFile(path.join(candidate, "package.json"), "utf8"),
);
assert.equal(pkg.version, "1.6.0");
const pagefind = await import(
  pathToFileURL(path.join(candidate, "lib/index.js")).href
);
const source = path.resolve(process.env.KINEIN_TEST_DIST ?? "dist");
const output = path.resolve(
  process.env.KINEIN_C0_OUTPUT ?? "test-results/c0-2026-11-13/pages",
);
assert.ok(!output.startsWith(source + path.sep) && output !== source);
assert.ok(
  output.startsWith(path.resolve("test-results") + path.sep),
  "A prova só escreve em test-results/.",
);
const files = (await readdir(source, { recursive: true }))
  .filter((file) => file.endsWith(".html"))
  .sort();
assert.equal(
  files.length,
  25,
  "Conferir mudanças no corpus antes de alterar a prova.",
);
await mkdir(output, { recursive: true });
await cp(source, path.join(output, "site"), { recursive: true });
const before = {};
const pages = [];
const excluded = [];
const browser = await openBrowser();
try {
  const created = await pagefind.createIndex({
    includeCharacters: "+#",
    writePlayground: false,
  });
  assert.deepEqual(created.errors, []);
  const index = created.index;
  for (const file of files) {
    const html = await readFile(path.join(source, file), "utf8");
    before[file] = createHash("sha256").update(html).digest("hex");
    const route = "/" + file.replace(/index\.html$/, "");
    const doc = await browser.evaluate(
      `(${prepareSearchDocument.toString()})(${JSON.stringify(html)},${JSON.stringify(route)})`,
    );
    if (doc.excluded) {
      excluded.push(doc);
      continue;
    }
    const added = await index.addHTMLFile({ url: route, content: doc.content });
    assert.deepEqual(added.errors, [], route);
    assert.equal(added.file.meta.title, doc.title);
    delete doc.content;
    pages.push({ ...doc, indexed: added.file });
  }
  assert.equal(pages.length, 24);
  assert.equal(
    pages.find((p) => p.route === "/documentacao/previa-0-4/").metadata.version,
    "0.4",
  );
  assert.ok(
    pages
      .find((p) => p.route === "/documentacao/previa-0-4/")
      .metadata.status.includes("EM DESENVOLVIMENTO"),
  );
  assert.deepEqual(
    excluded.map((p) => p.route),
    ["/404.html"],
  );
  const bundle = path.join(output, "site/pagefind");
  // Apenas artefatos gerados desta prova, para não contar fragmentos antigos.
  await rm(bundle, { recursive: true, force: true });
  await rm(path.join(output, "site/c0-control.html"), { force: true });
  const written = await index.writeFiles({ outputPath: bundle });
  assert.deepEqual(written.errors, []);
  const sizes = [];
  for (const file of (await readdir(bundle, { recursive: true })).sort()) {
    const body = await readFile(path.join(bundle, file)).catch(() => null);
    if (body) sizes.push({ file, bytes: body.byteLength });
  }
  for (const [file, hash] of Object.entries(before))
    assert.equal(
      createHash("sha256")
        .update(await readFile(path.join(source, file)))
        .digest("hex"),
      hash,
    );
  const probe = await readFile(
    new URL("./lib/search-probe-client.mjs", import.meta.url),
    "utf8",
  );
  await writeFile(path.join(output, "site/c0-probe.js"), probe);
  const manual = await readFile(path.join(source, "manual/index.html"), "utf8");
  const entry = '<script type="module" src="./c0-probe.js"></script>';
  await writeFile(
    path.join(output, "site/c0-csp.html"),
    manual.replace("</body>", entry + "</body>"),
  );
  await writeFile(
    path.join(output, "corpus.json"),
    JSON.stringify(
      {
        package: pkg.version,
        source,
        pages,
        excluded,
        sizes,
        htmlHashes: before,
      },
      null,
      2,
    ) + "\n",
  );
  globalThis.console.log(
    `C0: ${pages.length} páginas, ${pages.reduce((n, p) => n + p.headings.length, 0)} headings; ${sizes.reduce((n, f) => n + f.bytes, 0)} bytes de bundle. Fonte preservada.`,
  );
} finally {
  await pagefind.close();
  await browser.close();
}
