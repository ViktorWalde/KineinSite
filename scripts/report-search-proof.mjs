import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = "test-results/c0-2026-11-13";
const pages = JSON.parse(
  await readFile(`${root}/pages/browser-report.json`, "utf8"),
);
const other = JSON.parse(
  await readFile(`${root}/root/browser-report.json`, "utf8"),
);
const corpus = JSON.parse(await readFile(`${root}/pages/corpus.json`, "utf8"));
assert.ok(
  pages.completed &&
    pages.cspCompatible &&
    other.completed &&
    other.cspCompatible,
);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const sizes = corpus.sizes;
const runtime = ["pagefind.js", "pagefind-worker.js", "wasm.pt-br.pagefind"];
const summary = {
  package: corpus.package,
  pages: corpus.pages.length,
  headings: corpus.pages.reduce((sum, page) => sum + page.headings.length, 0),
  bundleBytes: sizes.reduce((sum, file) => sum + file.bytes, 0),
  runtimeBytes: sizes
    .filter((file) => runtime.includes(file.file))
    .reduce((sum, file) => sum + file.bytes, 0),
  dataBytes: sizes
    .filter((file) =>
      /\.(json|pf_meta|pf_index|pf_fragment|pf_filter)$/.test(file.file),
    )
    .reduce((sum, file) => sum + file.bytes, 0),
  coldRequests: pages.searchRequests.filter(
    (request) => request.phase === "query-cold",
  ).length,
  coldTransfer: pages.searchRequests
    .filter((request) => request.phase === "query-cold")
    .reduce((sum, request) => sum + (request.transfer ?? 0), 0),
};
await writeFile(
  `${root}/summary.json`,
  JSON.stringify(summary, null, 2) + "\n",
);
const rows = pages.queries
  .map(
    (query) =>
      `<tr><th scope="row">${escape(query.query)}</th><td>${query.total}</td><td>${
        query.results
          .slice(0, 3)
          .map(
            (result) =>
              `<p><a href="http://127.0.0.1:4321${escape(result.url)}">${escape(result.meta.title)}</a><br><small>${escape(result.meta.type)} · ${escape(result.meta.version ?? "sem versão única")}</small></p>`,
          )
          .join("") || "Sem resultados"
      }</td></tr>`,
  )
  .join("");
const content = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; base-uri 'none'; form-action 'none'"><title>C0 — Prova técnica de busca</title><link rel="stylesheet" href="report.css"></head><body><main><p>C0 · artefato local de engenharia</p><h1>Pagefind ${escape(summary.package)}: prova concluída</h1><p>Busca apta a C1 usando o worker do próprio site. A CSP do produto foi preservada. Não há controle de busca ou indexador adotado no build público.</p><dl><dt>Corpus real</dt><dd>${summary.pages} páginas · ${summary.headings} headings com IDs · 404 excluída</dd><dt>Bases verificadas</dt><dd>/KineinSite/ e /</dd><dt>Índice de dados</dt><dd>${summary.dataBytes.toLocaleString("pt-BR")} bytes</dd><dt>Runtime necessário</dt><dd>${summary.runtimeBytes.toLocaleString("pt-BR")} bytes (controlador, worker e WASM pt-BR)</dd><dt>Bundle completo do candidato</dt><dd>${summary.bundleBytes.toLocaleString("pt-BR")} bytes; inclui UIs opcionais não carregadas</dd><dt>Primeira consulta CMake</dt><dd>${summary.coldRequests} requisições observadas; ${summary.coldTransfer.toLocaleString("pt-BR")} bytes reportados pelo CDP, com cabeçalhos. Medição local com instrumentação.</dd></dl><h2>Compatibilidade e limites</h2><ul><li>Worker do próprio domínio: consulta executada sem violação de CSP.</li><li>Sem worker: WebAssembly bloqueado pela política. C1 deve informar indisponibilidade nesse caso.</li><li>Consulta já carregada funciona com rede bloqueada; carregamento frio offline e asset ausente retornam erro.</li><li>Metadados identificam idioma, tipo, versão e origem do manual. Não há tradução inglesa.</li></ul><h2>Consultas reais</h2><p>Os links abrem a prévia atual. Esta página mostra resultados medidos; não é a interface final de busca.</p><table><thead><tr><th scope="col">Consulta</th><th scope="col">Páginas</th><th scope="col">Primeiros resultados</th></tr></thead><tbody>${rows}</tbody></table><p>Resultados completos, URLs de seções, rede e erros esperados estão nos arquivos JSON da evidência. A aprovação visual de C1 continua futura.</p></main></body></html>`;
await mkdir(`${root}/review`, { recursive: true });
await writeFile(`${root}/review/index.html`, content);
await writeFile(
  `${root}/review/report.css`,
  "body{margin:0;background:#f4f1e9;color:#20262b;font:1rem/1.6 system-ui,sans-serif}main{max-width:64rem;margin:auto;padding:2rem 1rem}h1{line-height:1.15}a{color:#194d78}dt,th{font-weight:700}dd{margin:0 0 1rem}table{width:100%;border-collapse:collapse}td,th{padding:.75rem;border:1px solid #aaa;text-align:left;vertical-align:top;overflow-wrap:anywhere}small{color:#434e57}a:focus-visible{outline:3px solid #194d78;outline-offset:3px}@media(max-width:35rem){main{padding:1rem}table{font-size:.875rem}}\n",
);
globalThis.console.log(JSON.stringify(summary));
