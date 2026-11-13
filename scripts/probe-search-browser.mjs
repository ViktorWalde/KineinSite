import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const output = path.resolve(
  process.env.KINEIN_C0_OUTPUT ?? "test-results/c0-2026-11-13/pages",
);
process.env.KINEIN_TEST_DIST = path.join(output, "site");
const corpus = JSON.parse(
  await readFile(path.join(output, "corpus.json"), "utf8"),
);
const requests = new Map();
const workers = [];
const activeWorkers = new Set();
const workerJobs = [];
let workerFailure = false;
let workerSend;
let phase = "initial";
const browser = await openBrowser({
  onEvent(message) {
    const { method, params, sessionId } = message;
    if (
      method === "Target.attachedToTarget" &&
      params.targetInfo.type === "worker"
    ) {
      workers.push({ id: params.sessionId, url: params.targetInfo.url });
      activeWorkers.add(params.sessionId);
      workerJobs.push(
        (async () => {
          await workerSend("Network.enable", {}, params.sessionId);
          if (workerFailure)
            await workerSend(
              "Network.setBlockedURLs",
              { urls: ["*pagefind/wasm.*"] },
              params.sessionId,
            );
          await workerSend(
            "Runtime.runIfWaitingForDebugger",
            {},
            params.sessionId,
          );
        })(),
      );
    }
    if (method === "Target.detachedFromTarget")
      activeWorkers.delete(params.sessionId);
    if (method === "Network.requestWillBeSent")
      requests.set(`${sessionId ?? "page"}:${params.requestId}`, {
        url: params.request.url,
        worker: Boolean(sessionId),
        phase,
      });
    if (method === "Network.loadingFinished") {
      const item = requests.get(`${sessionId ?? "page"}:${params.requestId}`);
      if (item) item.transfer = params.encodedDataLength;
    }
  },
});
workerSend = browser.send;
const { send, evaluate } = browser;
const report = {
  csp: [],
  queries: [],
  package: corpus.package,
  completed: false,
};
async function waitFor(expression) {
  for (let i = 0; i < 150; i++) {
    if (await evaluate(expression)) return;
    await delay(40);
  }
  assert.fail(expression);
}
async function entry(route) {
  const url = new globalThis.URL(route, browser.base).href;
  await send("Page.navigate", { url });
  await waitFor(
    `location.href===${JSON.stringify(url)} && document.readyState==='complete' && globalThis.c0Ready`,
  );
}
async function query(text, options = { noWorker: false }, filters = {}) {
  return evaluate(
    `Promise.race([runC0(${JSON.stringify(text)},${JSON.stringify(options)},${JSON.stringify(filters)}),new Promise(resolve=>setTimeout(()=>resolve({error:'probe-timeout'}),12000))])`,
  );
}
function checkUrls(result) {
  for (const item of result.results ?? []) {
    assert.equal(item.meta.language, "pt-BR");
    assert.ok(item.meta.title && item.meta.type && item.excerpt);
    for (const href of [
      item.url,
      ...(item.sub_results ?? []).map((sub) => sub.url),
    ]) {
      const url = new globalThis.URL(href, browser.base);
      assert.equal(url.origin, new globalThis.URL(browser.base).origin);
      const base = new globalThis.URL(browser.base).pathname;
      assert.ok(url.pathname.startsWith(base), href);
      const route = "/" + url.pathname.slice(base.length);
      const page = corpus.pages.find((page) => page.route === route);
      assert.ok(page, href);
      if (url.hash)
        assert.ok(
          page.headings.some(
            (h) => h.id === decodeURIComponent(url.hash.slice(1)),
          ),
          href,
        );
    }
  }
}
try {
  await send("Network.enable");
  await send("Target.setAutoAttach", {
    autoAttach: true,
    waitForDebuggerOnStart: true,
    flatten: true,
  });
  await browser.navigate("documentacao/");
  assert.equal(
    await evaluate(
      "performance.getEntriesByType('resource').filter(e=>e.name.includes('/pagefind/')).length",
    ),
    0,
  );
  for (const noWorker of [true, false]) {
    phase = noWorker ? "csp-main" : "csp-worker";
    await entry(`c0-csp.html?worker=${noWorker ? 0 : 1}`);
    const result = await query("CMake", { noWorker });
    const violations = await evaluate("globalThis.c0Violations");
    report.csp.push({ noWorker, result, violations });
  }
  assert.ok(report.csp[0].result.error.includes("WebAssembly"));
  assert.ok(report.csp[0].violations.some((v) => v.blocked === "wasm-eval"));
  assert.ok(report.csp[1].result.total > 0);
  assert.deepEqual(report.csp[1].violations, []);
  checkUrls(report.csp[1].result);
  await entry("c0-csp.html?queries=1");
  assert.equal(
    await evaluate(
      "performance.getEntriesByType('resource').filter(e=>e.name.includes('/pagefind/')).length",
    ),
    0,
  );
  for (const term of [
    "CMake",
    "Git",
    "Python",
    "atalhos",
    "depuracao",
    "C++",
    "zzzzkineinsemcorrespondencia",
  ]) {
    phase = term === "CMake" ? "query-cold" : `query-warm-${term}`;
    const result = await query(term);
    assert.ok(!result.error, JSON.stringify(result));
    assert.equal(result.total === 0, term === "zzzzkineinsemcorrespondencia");
    checkUrls(result);
    report.queries.push(result);
  }
  const manual = await query(
    "depuração",
    { noWorker: false },
    { filters: { type: "manual" } },
  );
  assert.equal(manual.total, 1);
  assert.equal(manual.results[0].meta.version, "0.3.5");
  assert.ok(
    manual.results[0].meta.source.includes("/v0.3.5/DocsPublic/manual.md"),
  );
  checkUrls(manual);
  report.manual = manual;
  report.languageFilter = await query(
    "Python",
    { noWorker: false },
    { filters: { language: "pt-BR" } },
  );
  assert.ok(report.languageFilter.total > 0);
  report.missingLanguage = await query(
    "Python",
    { noWorker: false },
    { filters: { language: "en-US" } },
  );
  assert.equal(report.missingLanguage.total, 0);
  report.resources = await evaluate(
    "performance.getEntriesByType('resource').filter(e=>e.name.includes('/pagefind/')).map(e=>({url:e.name,bytes:e.encodedBodySize,transfer:e.transferSize,ms:e.duration}))",
  );
  await Promise.all(workerJobs);
  report.workerRequests = [...requests.values()].filter((item) => item.worker);
  report.searchRequests = [...requests.values()].filter((item) =>
    item.url.includes("/pagefind/"),
  );
  assert.ok(report.workerRequests.some((item) => item.url.includes("/wasm.")));
  assert.ok(
    report.workerRequests.every(
      (item) =>
        new globalThis.URL(item.url).origin ===
        new globalThis.URL(browser.base).origin,
    ),
  );
  assert.ok(
    report.resources.every(
      (r) =>
        new globalThis.URL(r.url).origin ===
        new globalThis.URL(browser.base).origin,
    ),
  );
  await send("Network.enable");
  const offline = {
    offline: true,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
  };
  await send("Network.emulateNetworkConditions", offline);
  for (const session of activeWorkers)
    await send("Network.setBlockedURLs", { urls: ["*"] }, session);
  const requestCount = requests.size;
  report.offlineWarm = await query("CMake");
  assert.ok(report.offlineWarm.total > 0);
  assert.equal(requests.size, requestCount);
  await send("Network.emulateNetworkConditions", {
    ...offline,
    offline: false,
  });
  for (const session of activeWorkers)
    await send("Network.setBlockedURLs", { urls: [] }, session);
  await entry("c0-csp.html?cold=1");
  await send("Network.emulateNetworkConditions", offline);
  report.offlineCold = await query("CMake");
  assert.ok(report.offlineCold.error);
  await send("Network.emulateNetworkConditions", {
    ...offline,
    offline: false,
  });
  await entry("c0-csp.html?english=1");
  await evaluate("document.documentElement.lang='en-US'");
  report.englishRequest = await query("Python");
  assert.ok(report.englishRequest.total > 0);
  checkUrls(report.englishRequest);
  await entry("c0-csp.html?failed=1");
  workerFailure = true;
  report.assetFailure = await query("CMake");
  assert.ok(report.assetFailure.error);
  workerFailure = false;
  await Promise.all(workerJobs);
  report.workers = workers;
  report.console = browser.errors;
  report.cspCompatible = !report.csp.find((item) => !item.noWorker).result
    .error;
  report.completed = true;
  globalThis.console.log(
    `C0: consultas e URLs reais verificadas; CSP compatível: ${report.cspCompatible}. Erros esperados de CSP/offline/asset registrados.`,
  );
} finally {
  await writeFile(
    path.join(output, "browser-report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  await browser.close();
}
