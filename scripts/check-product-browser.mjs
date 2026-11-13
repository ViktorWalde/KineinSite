import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser();
const { send, evaluate, navigate } = browser;
const output = "test-results/a-2026-11-12";
await mkdir(output, { recursive: true });
async function viewport(width) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
async function key(key) {
  for (const type of ["keyDown", "keyUp"])
    await send("Input.dispatchKeyEvent", {
      type,
      key,
      code: key,
      windowsVirtualKeyCode: key === "Escape" ? 27 : 13,
      nativeVirtualKeyCode: key === "Escape" ? 27 : 13,
      ...(type === "keyDown" && key === "Enter" ? { text: "\r" } : {}),
    });
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return;
    await delay(30);
  }
  assert.fail(expression);
}
try {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await navigate();
  await evaluate(
    "document.fonts.ready;document.querySelector('.hero-capture img').decode()",
  );
  const cases = [];
  for (const width of [320, 375, 768, 1024, 1366, 1920])
    for (const theme of ["dark", "light", "warm"])
      for (const text of ["", "200%"]) {
        await viewport(width);
        await evaluate(
          `document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.style.fontSize=${JSON.stringify(text)};scrollTo({top:0,behavior:'instant'})`,
        );
        const state = await evaluate(
          `(()=>{const image=document.querySelector('.hero-capture img');const r=image.getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,ratio:r.width/r.height,loaded:image.complete&&image.naturalWidth>0,priority:image.fetchPriority,loading:image.loading,copyFirst:Boolean(document.querySelector('.hero-copy').compareDocumentPosition(document.querySelector('.hero-capture'))&Node.DOCUMENT_POSITION_FOLLOWING),top:r.top,caption:document.querySelector('.hero-capture figcaption').textContent,cta:[...document.querySelectorAll('.hero-actions a')].map(a=>a.href)};})()`,
        );
        assert.ok(!state.overflow && state.loaded && state.copyFirst);
        assert.ok(Math.abs(state.ratio - 1.6) < 0.02);
        assert.equal(state.priority, "high");
        assert.equal(state.loading, "eager");
        assert.ok(state.caption.includes("0.3.5") && state.cta.length === 2);
        cases.push({ width, theme, text: text || "100%", ...state });
        if (!text && (theme === "dark" || width === 1366))
          await writeFile(
            `${output}/hero-${theme}-${width}.png`,
            await browser.screenshot(),
          );
      }
  await viewport(375);
  await evaluate(
    "document.documentElement.style.fontSize='';document.querySelector('.hero-capture-open').focus()",
  );
  await key("Enter");
  await waitFor(
    "Boolean(document.querySelector('.hero-capture dialog[open] img'))",
  );
  await evaluate("document.querySelector('.hero-capture dialog img').decode()");
  await key("Escape");
  await waitFor(
    "!document.querySelector('.hero-capture dialog').open && document.activeElement.matches('.hero-capture-open')",
  );
  await send("Emulation.setScriptExecutionDisabled", { value: true });
  await send("Page.navigate", { url: browser.base });
  await waitFor(
    "document.readyState==='complete' && !document.documentElement.dataset.enhanced && document.querySelector('.hero-capture img').complete",
  );
  assert.ok(
    await evaluate(
      "document.querySelector('.hero-capture img').naturalWidth>0 && document.querySelector('.hero-capture figcaption').textContent.includes('captura real')",
    ),
  );
  await evaluate("document.querySelector('.hero-capture-open').focus()");
  await key("Enter");
  await waitFor(
    "location.pathname.endsWith('.webp') && document.readyState==='complete' && document.querySelector('img')?.naturalWidth>0",
  );
  await evaluate("document.querySelector('img').decode()");
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  assert.deepEqual(browser.errors, []);
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(
      {
        cases,
        checks: [
          "Captura real, origem e versão",
          "36 cenários em seis larguras, texto ampliado e três temas",
          "Ampliação nativa, Escape e retorno de foco",
          "Imagem e link de ampliação sem JavaScript",
        ],
        errors: browser.errors,
      },
      null,
      2,
    ) + "\n",
  );
  globalThis.console.log(
    "Produto: hero com captura real, 36 cenários, teclado, foco e alternativa sem JS aprovados.",
  );
} finally {
  await browser.close();
}
