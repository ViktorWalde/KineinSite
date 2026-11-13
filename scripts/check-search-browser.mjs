import assert from "node:assert/strict";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const output = `test-results/c1-2026-11-13/${process.env.KINEIN_TEST_BASE === "/" ? "root" : "pages"}`;
await mkdir(output, { recursive: true });
const requests = [];
const workers = new Set();
const workerJobs = [];
let sendWorker;
let failWasm = false;
const browser = await openBrowser({
  onEvent(message) {
    const { method, params, sessionId } = message;
    if (
      method === "Target.attachedToTarget" &&
      params.targetInfo.type === "worker"
    ) {
      workers.add(params.sessionId);
      workerJobs.push(
        (async () => {
          await sendWorker("Network.enable", {}, params.sessionId);
          if (failWasm)
            await sendWorker(
              "Network.setBlockedURLs",
              { urls: ["*pagefind/wasm.*"] },
              params.sessionId,
            );
          await sendWorker(
            "Runtime.runIfWaitingForDebugger",
            {},
            params.sessionId,
          );
        })(),
      );
    }
    if (method === "Target.detachedFromTarget")
      workers.delete(params.sessionId);
    if (method === "Network.requestWillBeSent")
      requests.push({ url: params.request.url, worker: Boolean(sessionId) });
  },
});
sendWorker = browser.send;
const { send, evaluate, navigate } = browser;
const report = { matrix: [], queries: [], checks: [] };
async function waitFor(expression) {
  for (let i = 0; i < 200; i++) {
    if (await evaluate(expression)) return;
    await delay(40);
  }
  assert.fail(
    `${expression}; ${await evaluate("document.querySelector('.search-dialog')?.dataset.state")}`,
  );
}
async function viewport(width, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
async function key(value, modifiers = 0) {
  const codes = {
    Enter: 13,
    Escape: 27,
    Tab: 9,
    ArrowDown: 40,
    ArrowUp: 38,
    k: 75,
  };
  for (const type of ["keyDown", "keyUp"])
    await send("Input.dispatchKeyEvent", {
      type,
      key: value,
      code: value === "k" ? "KeyK" : value,
      windowsVirtualKeyCode: codes[value],
      modifiers,
      ...(type === "keyDown" && value === "Enter" ? { text: "\r" } : {}),
    });
}
async function query(value, expected = "results") {
  await evaluate(
    `(()=>{const query=document.querySelector('#search-query');query.value=${JSON.stringify(value)};query.dispatchEvent(new Event('input',{bubbles:true}));})()`,
  );
  await waitFor(
    expected === "settled"
      ? "['results','empty'].includes(document.querySelector('.search-dialog').dataset.state)"
      : `document.querySelector('.search-dialog').dataset.state===${JSON.stringify(expected)}`,
  );
}
async function open() {
  await evaluate("document.querySelector('.search-trigger').click()");
  await waitFor(
    "document.querySelector('.search-dialog').open && document.activeElement.id==='search-query'",
  );
}
try {
  await send("Network.enable");
  await send("Target.setAutoAttach", {
    autoAttach: true,
    waitForDebuggerOnStart: true,
    flatten: true,
  });
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await viewport(1366);
  await navigate("documentacao/");
  assert.equal(requests.filter((r) => r.url.includes("/pagefind/")).length, 0);
  await evaluate("document.querySelector('.appearance').open=true");
  await open();
  assert.ok(
    await evaluate(
      "!document.querySelector('.appearance').open && document.querySelector('.search-dialog').dataset.state==='initial'",
    ),
  );
  assert.equal(
    requests.filter((r) => r.url.includes("/pagefind/")).length,
    0,
    "Abrir não baixa o índice antes de uma consulta.",
  );
  for (const term of [
    "CMake",
    "Git",
    "Python",
    "atalhos",
    "depuracao",
    "C++",
  ]) {
    await query(term);
    const result = await evaluate(
      "({status:document.querySelector('.search-status').textContent,items:[...document.querySelectorAll('.search-result-title')].map(a=>({text:a.textContent,href:a.href})),sections:[...document.querySelectorAll('.search-section-link')].map(a=>a.href)})",
    );
    assert.ok(result.items.length > 0 && result.items.length <= 6);
    report.queries.push({ term, ...result });
  }
  await query("zzzzkineinsemcorrespondencia", "empty");
  assert.equal(
    await evaluate("document.querySelectorAll('.search-result').length"),
    0,
  );
  await query("<img src=x onerror=alert(1)>", "settled");
  assert.equal(
    await evaluate(
      "document.querySelectorAll('.search-results img,.search-results script').length",
    ),
    0,
  );
  await query("", "initial");
  await key("Escape");
  await waitFor(
    "!document.querySelector('.search-dialog').open && document.activeElement.matches('.search-trigger')",
  );
  await evaluate("document.querySelector('.brand').focus()");
  await key("k", 2);
  await waitFor("document.querySelector('.search-dialog').open");
  await query("Git");
  await key("ArrowDown");
  assert.ok(
    await evaluate("document.activeElement.matches('.search-result-title')"),
  );
  for (let i = 0; i < 60; i++) {
    await key("Tab", i < 30 ? 0 : 8);
    assert.ok(
      await evaluate(
        "document.querySelector('.search-dialog').contains(document.activeElement)",
      ),
    );
  }
  await key("Escape");
  // Atalho real não toma campos editáveis ou outra caixa modal.
  await evaluate(
    "const input=document.querySelector('.docs-main');input.setAttribute('contenteditable','true');input.focus()",
  );
  await key("k", 2);
  assert.equal(
    await evaluate("document.querySelector('.search-dialog').open"),
    false,
  );
  await evaluate(
    "const other=document.createElement('dialog');other.id='test-other-dialog';other.textContent='Outra caixa modal';document.body.append(other);other.showModal()",
  );
  await key("k", 2);
  assert.equal(
    await evaluate("document.querySelector('.search-dialog').open"),
    false,
  );
  await evaluate("document.querySelector('#test-other-dialog').remove()");
  await evaluate(
    "document.querySelector('.docs-main').removeAttribute('contenteditable');document.querySelector('.brand').focus();const e=new KeyboardEvent('keydown',{key:'k',ctrlKey:true,isComposing:true,bubbles:true,cancelable:true});document.activeElement.dispatchEvent(e)",
  );
  assert.equal(
    await evaluate("document.querySelector('.search-dialog').open"),
    false,
  );
  await open();
  await query("CMake");
  // Os dados são reais; só a entrega de uma resposta do worker é atrasada.
  const worker = [...workers].at(-1);
  assert.ok(worker);
  await send(
    "Runtime.evaluate",
    {
      expression:
        "globalThis.delayedRequested=false;globalThis.delayedSent=0;globalThis.delayNextSearch=true;const originalPost=globalThis.postMessage.bind(globalThis);globalThis.postMessage=(value,...args)=>{if(globalThis.delayNextSearch&&Array.isArray(value.result?.results)){globalThis.delayNextSearch=false;globalThis.delayedRequested=true;globalThis.releaseDelayedSearch=()=>{originalPost(value,...args);globalThis.delayedSent++}}else originalPost(value,...args)}",
    },
    worker,
  );
  await query("CMake", "loading");
  let oldRequested = false;
  for (let i = 0; i < 150; i++) {
    const event = await send(
      "Runtime.evaluate",
      { expression: "globalThis.delayedRequested", returnByValue: true },
      worker,
    );
    if (event.result.value) {
      oldRequested = true;
      break;
    }
    await delay(30);
  }
  assert.ok(
    oldRequested,
    "A primeira consulta precisa chegar ao worker antes da seguinte.",
  );
  await query("Python");
  const delivery = await send(
    "Runtime.evaluate",
    {
      expression: "globalThis.releaseDelayedSearch();globalThis.delayedSent",
      returnByValue: true,
    },
    worker,
  );
  assert.equal(
    delivery.result.value,
    1,
    "O worker precisa entregar CMake depois do resultado Python para provar a proteção.",
  );
  await evaluate(
    "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
  );
  assert.ok(
    await evaluate(
      "document.querySelector('#search-query').value==='Python' && document.querySelector('.search-result-title').textContent.includes('Python')",
    ),
  );
  report.checks.push(
    "Resposta antiga não substitui Python, com entrega CMake atrasada no worker real.",
  );

  const directory = path.resolve(process.env.KINEIN_TEST_DIST ?? "dist");
  const htmlFiles = (await readdir(directory, { recursive: true })).filter(
    (file) => file.endsWith(".html"),
  );
  const ids = new Map();
  for (const file of htmlFiles) {
    const html = await readFile(path.join(directory, file), "utf8");
    ids.set(
      "/" + file.replace(/index\.html$/, ""),
      new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])),
    );
  }
  // Conferir todas as páginas retornadas pelo índice gerado pelo build.
  const indexed = await evaluate(
    `(async()=>{const module=await import(${JSON.stringify(new globalThis.URL("pagefind/pagefind.js", browser.base).href)});const found=await module.search(null);return Promise.all(found.results.map(async item=>{const data=await item.data();return {url:data.url,meta:data.meta}}));})()`,
  );
  assert.equal(indexed.length, 24);
  for (const item of indexed) {
    const url = new globalThis.URL(item.url, browser.base);
    const base = new globalThis.URL(browser.base).pathname;
    assert.ok(url.pathname.startsWith(base));
    assert.ok(
      ids.has("/" + url.pathname.slice(base.length)) &&
        !url.pathname.endsWith("404.html"),
    );
    assert.equal(item.meta.language, "pt-BR");
    assert.ok(item.meta.type && item.meta.title);
  }
  const manualIndex = indexed.find((item) => item.url.endsWith("/manual/"));
  assert.equal(manualIndex.meta.version, "0.3.5");
  assert.ok(manualIndex.meta.source.endsWith("/v0.3.5/DocsPublic/manual.md"));
  assert.match(manualIndex.meta.revision, /^[0-9a-f]{40}$/);
  const previewIndex = indexed.find((item) =>
    item.url.endsWith("/documentacao/previa-0-4/"),
  );
  assert.equal(previewIndex.meta.version, "0.4");
  assert.equal(previewIndex.meta.status, "Em desenvolvimento");
  for (const result of report.queries)
    for (const href of [
      ...result.items.map((item) => item.href),
      ...result.sections,
    ]) {
      const url = new globalThis.URL(href, browser.base);
      const base = new globalThis.URL(browser.base).pathname;
      assert.equal(url.origin, new globalThis.URL(browser.base).origin);
      const page = ids.get("/" + url.pathname.slice(base.length));
      assert.ok(page);
      if (url.hash) assert.ok(page.has(decodeURIComponent(url.hash.slice(1))));
    }
  report.indexed = indexed;
  await query("CMake");
  for (const width of [320, 375, 768, 1024, 1366, 1920])
    for (const theme of ["dark", "light", "warm"])
      for (const text of ["", "200%"]) {
        await viewport(width);
        await evaluate(
          `document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.style.fontSize=${JSON.stringify(text)};document.querySelector('.search-dialog').scrollTop=0`,
        );
        await evaluate(
          "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
        );
        const state = await evaluate(
          "(()=>{const d=document.querySelector('.search-dialog');const r=d.getBoundingClientRect();return{overflow:document.documentElement.scrollWidth>innerWidth,dialogOverflow:d.scrollWidth>d.clientWidth,left:r.left,right:r.right,top:r.top,bottom:r.bottom,triggerHeight:document.querySelector('.search-trigger').getBoundingClientRect().height}})()",
        );
        assert.ok(
          !state.overflow &&
            !state.dialogOverflow &&
            state.left >= 0 &&
            state.right <= width + 1 &&
            state.top >= 0 &&
            state.bottom <= 901 &&
            state.triggerHeight >= 44,
          JSON.stringify({ width, theme, text, state }),
        );
        report.matrix.push({ width, theme, text: text || "100%", ...state });
        if (!text && theme === "dark")
          await writeFile(
            `${output}/search-${width}.png`,
            await browser.screenshot(),
          );
      }
  await viewport(375, 420);
  await evaluate("document.querySelector('#search-query').focus()");
  const low = await evaluate(
    "(()=>{const input=document.querySelector('#search-query').getBoundingClientRect();const header=document.querySelector('.search-heading').getBoundingClientRect();const dialog=document.querySelector('.search-dialog').getBoundingClientRect();return {inputTop:input.top,inputBottom:input.bottom,headerBottom:header.bottom,bottom:dialog.bottom}})()",
  );
  assert.ok(
    low.inputTop >= low.headerBottom - 1 && low.inputBottom <= low.bottom + 1,
    JSON.stringify(low),
  );
  report.lowViewport = low;
  await writeFile(
    `${output}/accessibility.json`,
    JSON.stringify(await send("Accessibility.getFullAXTree"), null, 2),
  );
  await evaluate("document.documentElement.style.fontSize=''");
  await key("Escape");
  await viewport(375);
  await navigate("manual/");
  await open();
  await query("depuração");
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('.search-result-meta')].some(p=>p.textContent.includes('0.4')&&p.textContent.includes('Em desenvolvimento'))",
    ),
  );
  await evaluate(
    "[...document.querySelectorAll('.search-section-link')].find(a=>a.pathname.endsWith('/manual/')).click()",
  );
  await waitFor(
    "!document.querySelector('.search-dialog').open && location.hash && document.activeElement.id===decodeURIComponent(location.hash.slice(1))",
  );
  report.checks.push(
    "Seleção de seção local fecha e foca o heading; prévia identificada.",
  );
  assert.deepEqual(browser.errors, []);

  // Falhas deliberadas são registradas separadamente da navegação normal.
  await navigate("documentacao/");
  await send("Network.setBlockedURLs", { urls: ["*pagefind/pagefind.js*"] });
  await open();
  await query("Git", "error");
  await send("Network.setBlockedURLs", { urls: [] });
  await evaluate("document.querySelector('.search-retry').click()");
  await waitFor(
    "document.querySelector('.search-dialog').dataset.state==='results'",
  );
  report.checks.push("Falha do módulo com retry funcional.");
  await navigate("documentacao/");
  failWasm = true;
  await open();
  await query("Git", "error");
  failWasm = false;
  await evaluate("document.querySelector('.search-retry').click()");
  await waitFor(
    "document.querySelector('.search-dialog').dataset.state==='results'",
  );
  const noWorker = await send("Page.addScriptToEvaluateOnNewDocument", {
    source:
      "Object.defineProperty(window,'Worker',{value:undefined,configurable:true})",
  });
  await navigate("documentacao/");
  await open();
  await query("Git", "error");
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('.search-footer a')].length===2",
    ),
  );
  await send("Page.removeScriptToEvaluateOnNewDocument", {
    identifier: noWorker.identifier,
  });
  report.expectedErrors = [...browser.errors];
  await key("Escape");
  for (const width of [375, 1366]) {
    await viewport(width);
    await send("Emulation.setScriptExecutionDisabled", { value: true });
    await send("Page.navigate", {
      url: new globalThis.URL("documentacao/", browser.base).href,
    });
    await waitFor(
      "document.readyState==='complete' && !document.documentElement.dataset.enhanced",
    );
    assert.ok(
      await evaluate(
        "document.querySelector('.search-trigger').hidden && getComputedStyle(document.querySelector('.search-trigger')).display==='none' && !document.querySelector('.search-dialog').open && document.querySelectorAll('.hud-group a').length>0",
      ),
    );
    await send("Emulation.setScriptExecutionDisabled", { value: false });
  }
  await Promise.all(workerJobs);
  report.requests = requests.filter((r) => r.url.includes("/pagefind/"));
  assert.ok(report.requests.some((r) => r.worker));
  assert.ok(
    report.requests.every(
      (r) =>
        new globalThis.URL(r.url).origin ===
        new globalThis.URL(browser.base).origin,
    ),
  );
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  globalThis.console.log(
    `Busca: índice real (${indexed.length} páginas), ${report.matrix.length} cenários, teclado/foco, URLs, concorrência, falhas/retry e ausência de JS aprovados.`,
  );
} finally {
  await browser.close();
}
