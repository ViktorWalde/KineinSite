import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { downloadRelease as release } from "../src/data/download.ts";
import { publicVersion, releaseUrl, repositoryUrl } from "../src/site.ts";
import { openBrowser } from "./lib/browser.mjs";

const output = `test-results/d-install-2026-11-13/${process.env.KINEIN_TEST_BASE === "/" ? "root" : "pages"}`;
await mkdir(output, { recursive: true });
const browser = await openBrowser();
const { send, evaluate, navigate } = browser;
const report = { matrix: [], checks: [] };
async function waitFor(expression) {
  for (let i = 0; i < 150; i++) {
    if (await evaluate(expression)) return;
    await delay(40);
  }
  assert.fail(expression);
}
async function key(value) {
  const code = value === " " ? "Space" : value;
  for (const type of ["keyDown", "keyUp"])
    await send("Input.dispatchKeyEvent", {
      type,
      key: value,
      code,
      windowsVirtualKeyCode: value === " " ? 32 : 13,
      ...(type === "keyDown" ? { text: value === " " ? " " : "\r" } : {}),
    });
}
async function viewport(width, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
async function panelState() {
  return evaluate(
    "(()=>{const panel=document.querySelector('.download-panel');return {overflow:document.documentElement.scrollWidth>innerWidth,panelOverflow:panel.scrollWidth>panel.clientWidth,controls:[...panel.querySelectorAll('a,summary')].filter(el=>el.checkVisibility()).map(el=>({text:el.textContent.trim(),height:el.getBoundingClientRect().height})),alternative:panel.querySelector('details').open}})()",
  );
}
try {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source:
      "const originalFetch=window.fetch.bind(window);window.fetch=(input,options)=>String(input).startsWith('https://api.github.com/repos/')?Promise.resolve(new Response('[]',{headers:{'Content-Type':'application/json'}})):originalFetch(input,options);",
  });
  await viewport(1366);
  await navigate();
  const home = await evaluate(
    "({install:document.querySelector('[data-hud-item=docs-install]').href,header:document.querySelector('.header-download').href,headerTarget:document.querySelector('.header-download').target,hero:document.querySelector('.hero-actions a').href,starts:[...document.querySelectorAll('.product-starts > a')].map(a=>a.href),panels:document.querySelectorAll('.download-panel').length,footer:[...document.querySelectorAll('.site-footer a')].filter(a=>a.textContent.trim().startsWith('Baixar')).map(a=>a.href)})",
  );
  assert.equal(home.panels, 0, "Download concentrado em Instalar a IDE.");
  assert.equal(home.header, `${home.install}#baixar-beta`);
  assert.equal(home.hero, home.header);
  assert.equal(home.headerTarget, "");
  assert.deepEqual(home.footer, [home.header]);
  await evaluate("document.querySelector('#desktop-docs-trigger').focus()");
  await key("Enter");
  await evaluate("document.querySelector('#desktop-docs-install').focus()");
  await key("Enter");
  await waitFor(
    `location.href===${JSON.stringify(home.install)} && document.readyState==='complete' && document.documentElement.dataset.enhanced==='true' && document.querySelector('.download-panel')`,
  );
  const initial = await evaluate(
    "(()=>{const panel=document.querySelector('.download-panel');return {text:panel.textContent,links:[...panel.querySelectorAll('a')].map(a=>({href:a.href,target:a.target,rel:a.rel,text:a.textContent.trim()})),note:document.querySelector('[data-hud-item=updates-public-note]').href,install:document.querySelector('[data-hud-item=docs-install]').href,verification:document.querySelector('.download-verify').href,panels:document.querySelectorAll('.download-panel').length,order:panel.compareDocumentPosition(document.querySelector('.guide-article')),heading:panel.querySelector('h2').textContent}})()",
  );
  assert.equal(initial.panels, 1);
  assert.ok(initial.order & 4, "Download aparece antes do passo a passo.");
  assert.ok(initial.text.includes(`DOWNLOAD · BETA ${publicVersion}`));
  assert.ok(
    initial.text.includes(release.platform) &&
      initial.text.includes(`glibc ${release.minimumGlibc}+`) &&
      /Wayland ou X11/.test(initial.text),
  );
  assert.ok(
    initial.text.includes("37,9 MiB") && initial.text.includes("38,5 MiB"),
  );
  for (const asset of [release.archive, release.appImage, release.checksum]) {
    const link = initial.links.find(
      (link) =>
        link.href ===
        `${repositoryUrl}/releases/download/${release.tag}/${asset.name}`,
    );
    assert.ok(
      link &&
        link.target === "_blank" &&
        link.rel.includes("noopener") &&
        link.rel.includes("noreferrer"),
    );
  }
  assert.ok(initial.links.some((link) => link.href === releaseUrl));
  assert.ok(initial.links.some((link) => link.href === initial.note));
  assert.ok(initial.links.some((link) => link.href === initial.verification));
  assert.deepEqual(
    home.starts.map((href) =>
      new globalThis.URL(href).pathname.split("/").at(-2),
    ),
    [
      "primeiro-projeto-cpp",
      "primeiro-projeto-rust",
      "primeiro-projeto-python",
    ],
  );
  report.links = { home, install: initial };
  for (const width of [320, 375, 768, 1024, 1366, 1920])
    for (const theme of ["dark", "light", "warm"])
      for (const text of ["", "200%"])
        for (const open of [false, true]) {
          await viewport(width);
          await evaluate(
            `document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.style.fontSize=${JSON.stringify(text)};document.querySelector('.download-alternative').open=${open}`,
          );
          await evaluate(
            "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
          );
          const state = await panelState();
          assert.ok(
            !state.overflow &&
              !state.panelOverflow &&
              state.controls.every((control) => control.height >= 44),
            JSON.stringify({ width, theme, text, open, state }),
          );
          report.matrix.push({
            width,
            theme,
            text: text || "100%",
            open,
            ...state,
          });
        }
  report.captures = [];
  for (const width of [320, 375, 1366])
    for (const theme of width === 375 ? ["dark", "light", "warm"] : ["dark"]) {
      await viewport(width, 1700);
      await evaluate(
        `document.documentElement.style.fontSize='';document.documentElement.dataset.theme=${JSON.stringify(theme)};document.querySelector('.download-alternative').open=true;document.querySelector('.download-panel').scrollIntoView({block:'start',behavior:'instant'})`,
      );
      await evaluate(
        "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
      );
      await writeFile(
        `${output}/download-${width}-${theme}.png`,
        await browser.screenshot(),
      );
      report.captures.push({
        width,
        height: 1700,
        theme,
        text: "100%",
        open: true,
      });
    }
  await viewport(375);
  await evaluate(
    "document.documentElement.style.fontSize='';document.querySelector('.download-alternative').open=false;document.querySelector('.download-alternative summary').focus()",
  );
  await key(" ");
  assert.ok(
    await evaluate(
      "document.querySelector('.download-alternative').open && document.activeElement.matches('.download-alternative summary')",
    ),
  );
  await key(" ");
  assert.ok(
    await evaluate(
      "!document.querySelector('.download-alternative').open && document.activeElement.matches('.download-alternative summary')",
    ),
  );
  await evaluate("document.querySelector('.download-verify').focus()");
  await key("Enter");
  await waitFor(`location.href===${JSON.stringify(initial.verification)}`);
  assert.ok(
    await evaluate(
      "(()=>{const h=document.getElementById(decodeURIComponent(location.hash.slice(1)));const r=h.getBoundingClientRect();return h.textContent.includes('íntegro') && r.top>=0 && r.top<innerHeight})()",
    ),
  );
  assert.ok(
    await evaluate(
      "document.querySelector('.prose').textContent.includes('sha256sum -c')",
    ),
  );
  await navigate("aprender/ide/instalar/");
  await evaluate("document.querySelector('.download-links a').focus()");
  await key("Enter");
  await waitFor(
    `location.href===${JSON.stringify(initial.note)} && document.readyState==='complete'`,
  );
  assert.ok(
    await evaluate(
      `document.querySelector('h1').textContent.includes(${JSON.stringify(publicVersion)})`,
    ),
  );
  await navigate();
  await evaluate("document.querySelector('.product-starts > a').focus()");
  await key("Enter");
  await waitFor(
    `location.href===${JSON.stringify(home.starts[0])} && document.readyState==='complete'`,
  );
  assert.ok(
    await evaluate("document.querySelector('h1').textContent.includes('C++')"),
  );
  report.checks.push(
    "Requisitos e assets oficiais; CTAs levam ao painel de instalação, com nota e três percursos preservados.",
    "Menu Documentação → Instalar a IDE, verificação por âncora, nota e primeiro projeto por teclado.",
  );
  for (const width of [375, 1366]) {
    await viewport(width);
    await send("Emulation.setScriptExecutionDisabled", { value: true });
    await send("Page.navigate", { url: browser.base });
    await waitFor(
      "document.readyState==='complete' && !document.documentElement.dataset.enhanced && document.querySelector('.hero-actions')",
    );
    if (width === 375) {
      await evaluate(
        "document.querySelector('.mobile-navigation > summary').focus()",
      );
      await key("Enter");
    }
    const prefix = width === 375 ? "mobile" : "desktop";
    await evaluate(`document.querySelector('#${prefix}-docs-trigger').focus()`);
    await key("Enter");
    await evaluate(`document.querySelector('#${prefix}-docs-install').focus()`);
    await key("Enter");
    await waitFor(
      `location.href===${JSON.stringify(home.install)} && document.readyState==='complete' && !document.documentElement.dataset.enhanced && document.querySelector('.download-panel')`,
    );
    await evaluate(
      "document.querySelector('.download-alternative summary').focus()",
    );
    await key(" ");
    assert.ok(
      await evaluate(
        "document.querySelector('.download-alternative').open && document.activeElement.matches('.download-alternative summary') && document.querySelector('.download-actions a').href.includes('/releases/download/')",
      ),
    );
    const state = await panelState();
    assert.ok(!state.overflow && !state.panelOverflow);
    await send("Emulation.setScriptExecutionDisabled", { value: false });
  }
  report.checks.push(
    "Links e opção nativa funcionam sem JavaScript em mobile/desktop.",
  );
  assert.deepEqual(browser.errors, []);
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  globalThis.console.log(
    `Download: ${report.matrix.length} cenários, assets/requisitos, teclado/foco, instalação/notas/projetos e ausência de JS aprovados.`,
  );
} finally {
  await browser.close();
}
