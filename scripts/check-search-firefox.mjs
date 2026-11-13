import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";
const { fetch, AbortSignal } = globalThis;

// WebDriver nativo já disponível no ambiente; nenhuma segunda suíte instalada.
const output = "test-results/c1-2026-11-13/firefox";
await mkdir(`${output}/profiles`, { recursive: true });
const listener = createServer();
await new Promise((resolve) => listener.listen(0, "127.0.0.1", resolve));
const port = listener.address().port;
await new Promise((resolve) => listener.close(resolve));
const driver = spawn(
  "geckodriver",
  [
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--profile-root",
    path.resolve(output, "profiles"),
  ],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let log = "";
driver.stdout.on("data", (chunk) => {
  log += chunk.toString();
});
driver.stderr.on("data", (chunk) => {
  log += chunk.toString();
});
const server = await openBrowser();
let session;
async function request(method, route, body) {
  const response = await fetch(`http://127.0.0.1:${port}${route}`, {
    method,
    ...(body
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  if (result.value?.error) throw new Error(JSON.stringify(result.value));
  return result.value;
}
const wd = (method, route, body) =>
  request(method, `/session/${session}${route}`, body);
const execute = (script) => wd("POST", "/execute/sync", { script, args: [] });
async function waitFor(script) {
  for (let i = 0; i < 150; i++) {
    if (await execute(`return (${script})`)) return;
    await delay(60);
  }
  assert.fail(script);
}
async function element(selector) {
  const found = await wd("POST", "/element", {
    using: "css selector",
    value: selector,
  });
  return found["element-6066-11e4-a52e-4f735466cecf"];
}
async function click(selector) {
  await wd("POST", `/element/${await element(selector)}/click`, {});
}
async function type(value) {
  await wd("POST", `/element/${await element("#search-query")}/value`, {
    text: value,
  });
}
async function key(value) {
  await wd("POST", "/actions", {
    actions: [
      {
        type: "key",
        id: "keyboard",
        actions: [
          { type: "keyDown", value },
          { type: "keyUp", value },
        ],
      },
    ],
  });
}
try {
  for (let i = 0; i < 100; i++) {
    try {
      await request("GET", "/status");
      break;
    } catch {
      await delay(100);
    }
  }
  const created = await request("POST", "/session", {
    capabilities: {
      alwaysMatch: {
        browserName: "firefox",
        "moz:firefoxOptions": { args: ["-headless"] },
      },
    },
  });
  session = created.sessionId;
  const cases = [];
  for (const width of [768, 1366]) {
    await wd("POST", "/window/rect", { width, height: 1000 });
    await wd("POST", "/url", {
      url: new globalThis.URL("manual/", server.base).href,
    });
    await waitFor(
      "document.querySelector('.search-trigger') && !document.querySelector('.search-trigger').hidden",
    );
    await click(".search-trigger");
    await waitFor(
      "document.querySelector('.search-dialog').open && document.activeElement.id==='search-query'",
    );
    await type("CMake");
    await waitFor(
      "document.querySelector('.search-dialog').dataset.state==='results'",
    );
    const result = await execute(
      "return {width:innerWidth,first:document.querySelector('.search-result-title').textContent,count:document.querySelectorAll('.search-result').length,overflow:document.documentElement.scrollWidth>innerWidth}",
    );
    assert.ok(
      result.first.includes("C++") && result.count > 0 && !result.overflow,
    );
    await execute(
      "document.documentElement.style.fontSize='200%';document.documentElement.dataset.theme='warm'",
    );
    assert.ok(
      await execute(
        "return document.querySelector('.search-dialog').scrollWidth<=document.querySelector('.search-dialog').clientWidth && document.documentElement.scrollWidth<=innerWidth",
      ),
    );
    await execute("document.documentElement.style.fontSize=''");
    await key("\uE015");
    assert.ok(
      await execute(
        "return document.activeElement.matches('.search-result-title')",
      ),
    );
    await key("\uE00C");
    await waitFor(
      "!document.querySelector('.search-dialog').open && document.activeElement.matches('.search-trigger')",
    );
    await click(".search-trigger");
    await wd("POST", `/element/${await element("#search-query")}/clear`, {});
    await type("depuração");
    await waitFor(
      "document.querySelector('.search-dialog').dataset.state==='results'",
    );
    await click('.search-section-link[href*="/manual/#"]');
    await waitFor(
      "location.hash && document.activeElement.id===decodeURIComponent(location.hash.slice(1)) && !document.querySelector('.search-dialog').open",
    );
    cases.push(result);
  }
  await click(".search-trigger");
  await wd("POST", `/element/${await element("#search-query")}/clear`, {});
  await type("Git");
  await waitFor(
    "document.querySelector('.search-dialog').dataset.state==='results'",
  );
  await delay(450);
  const reopened = await execute(
    "const r=document.querySelector('.search-dialog').getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:innerHeight,scroll:scrollY,position:getComputedStyle(document.querySelector('.search-dialog')).position}",
  );
  assert.ok(
    reopened.top >= 0 && reopened.bottom <= reopened.height + 1,
    JSON.stringify(reopened),
  );
  await writeFile(
    `${output}/search.png`,
    Buffer.from(await wd("GET", "/screenshot"), "base64"),
  );
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(
      {
        version: created.capabilities.browserVersion,
        cases,
        reopened,
        checks: [
          "Busca real com worker e CSP atual",
          "Resultados e âncoras do manual",
          "Digitação nativa, seta, Escape e retorno de foco",
          "Texto ampliado e tema warm",
        ],
      },
      null,
      2,
    ) + "\n",
  );
  globalThis.console.log(
    `Firefox ${created.capabilities.browserVersion}: busca real, âncoras, foco, texto ampliado e tema aprovados.`,
  );
} finally {
  if (session) await wd("DELETE", "").catch(() => {});
  driver.kill();
  await writeFile(`${output}/driver.log`, log);
  await server.close();
}
