import assert from "node:assert/strict";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { uiFor } from "../src/i18n/ui.ts";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser();
const { send, evaluate, navigate } = browser;
const output = `test-results/b-2026-11-13/${process.env.KINEIN_TEST_BASE === "/" ? "root" : "pages"}`;
await mkdir(output, { recursive: true });
const matrix = [];
const articles = [];
async function waitFor(expression, context = "") {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return;
    await delay(30);
  }
  assert.fail(
    `${context}: ${expression}; ${JSON.stringify(await evaluate("({width:innerWidth,hash:location.hash,current:document.querySelector('[data-section-nav] [aria-current]')?.hash,scroll:scrollY,padding:getComputedStyle(document.documentElement).scrollPaddingTop,top:document.querySelector('.prose h2')?.getBoundingClientRect().top})"))}`,
  );
}
async function viewport(width) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
async function key(value, shiftKey = false) {
  const codes = { Enter: 13, Escape: 27, Tab: 9, ArrowRight: 39 };
  for (const type of ["keyDown", "keyUp"])
    await send("Input.dispatchKeyEvent", {
      type,
      key: value,
      code: value,
      windowsVirtualKeyCode: codes[value],
      modifiers: shiftKey ? 8 : 0,
      ...(type === "keyDown" && value === "Enter" ? { text: "\r" } : {}),
    });
}
async function anchorState() {
  return evaluate(`(() => {
    const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const header=document.querySelector('.site-header');
    const sticky=getComputedStyle(header).position==='sticky';
    return {id:target.id,top:target.getBoundingClientRect().top,header:sticky?header.getBoundingClientRect().bottom:0,focus:document.activeElement===target,current:document.querySelector('[data-section-nav] [aria-current]')?.hash};
  })()`);
}
try {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await viewport(1366);
  // Descobrir as páginas publicadas no build, sem outro catálogo editorial.
  const directory = process.env.KINEIN_TEST_DIST ?? "dist";
  for (const file of await readdir(directory, { recursive: true })) {
    if (!/^(aprender|estudos)\/.*\/index\.html$/.test(file)) continue;
    const html = await readFile(`${directory}/${file}`, "utf8");
    if (!/class="(?:guide|study)-article prose"/.test(html)) continue;
    const route = file.replace(/index\.html$/, "");
    await navigate(route);
    const state = await evaluate(`(() => {
      const headings=[...document.querySelectorAll('.prose h2,.prose h3')].map(h=>({hash:'#'+h.id,text:h.textContent}));
      const links=[...document.querySelectorAll('.article-outline a')].map(a=>({hash:decodeURIComponent(a.hash),text:a.textContent}));
      return {headings,links,breadcrumb:Boolean(document.querySelector('[aria-label="Caminho"] a')),outlines:document.querySelectorAll('.article-outline').length};
    })()`);
    assert.ok(state.breadcrumb && state.headings.length > 0);
    assert.equal(state.outlines, 1);
    assert.deepEqual(state.links, state.headings, route);
    articles.push({ route, headings: state.headings.length });
  }
  assert.equal(articles.length, 13);

  for (const route of [
    "aprender/ide/instalar/",
    "estudos/cpp/primeiros-passos/",
  ]) {
    await navigate(route);
    await evaluate(
      "Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{});} ))",
    );
    for (const width of [320, 375, 768, 1024, 1366, 1920])
      for (const theme of ["dark", "light", "warm"])
        for (const text of ["", "200%"]) {
          await viewport(width);
          await evaluate(
            `document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.style.fontSize=${JSON.stringify(text)}`,
          );
          // A HUD publica sua altura pelo ResizeObserver após o reflow.
          await evaluate(
            "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
          );
          await evaluate(
            "document.querySelector('.article-outline').open=true",
          );
          const geometry = await evaluate(`(() => {
            const panel=document.querySelector('.article-outline');
            return {overflow:document.documentElement.scrollWidth>innerWidth,navOverflow:panel.scrollWidth>panel.clientWidth,targets:[...panel.querySelectorAll('a')].every(a=>a.getBoundingClientRect().height>=44)};
          })()`);
          assert.ok(
            !geometry.overflow && !geometry.navOverflow && geometry.targets,
          );
          await evaluate(
            "document.querySelector('.article-outline a').focus()",
          );
          await key("Enter");
          await waitFor(
            "location.hash===document.querySelector('.article-outline a').hash",
          );
          await waitFor(
            "document.querySelector('[data-section-nav] [aria-current]')?.hash===location.hash",
            JSON.stringify({ route, width, theme, text }),
          );
          const anchor = await anchorState();
          assert.ok(
            anchor.top >= anchor.header - 1,
            JSON.stringify({ route, width, text, anchor }),
          );
          if (width <= 768) {
            assert.ok(anchor.focus);
            assert.equal(
              await evaluate("document.querySelector('.article-outline').open"),
              false,
            );
          }
          matrix.push({
            route,
            width,
            theme,
            text: text || "100%",
            ...geometry,
            anchor,
          });
          if (!text && theme === "dark") {
            await evaluate(
              "document.querySelector('.article-outline').open=true;document.querySelector('.article-outline').scrollIntoView({block:'start',behavior:'instant'})",
            );
            await writeFile(
              `${output}/${route.startsWith("aprender") ? "guide" : "study"}-${width}.png`,
              await browser.screenshot(),
            );
          }
        }
    await evaluate("document.documentElement.style.fontSize=''");
    await viewport(375);
    await navigate(route);
    await evaluate(
      "document.querySelector('.article-outline > summary').focus()",
    );
    await key("Enter");
    await waitFor("document.querySelector('.article-outline').open");
    await key("Tab");
    assert.ok(
      await evaluate("document.activeElement.matches('.article-outline a')"),
    );
    await key("Tab", true);
    assert.ok(
      await evaluate(
        "document.activeElement.matches('.article-outline > summary')",
      ),
    );
    await key("Tab");
    await key("Escape");
    assert.ok(
      await evaluate(
        "!document.querySelector('.article-outline').open && document.activeElement.matches('.article-outline > summary')",
      ),
    );
    // O helper preserva a abertura em cliques modificados.
    await evaluate(
      "document.querySelector('.article-outline').open=true;const link=document.querySelector('.article-outline a');link.addEventListener('click',e=>e.preventDefault(),{once:true});link.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,ctrlKey:true}))",
    );
    assert.ok(
      await evaluate("document.querySelector('.article-outline').open"),
    );
    const lastHash = await evaluate(
      "document.querySelector('.article-outline li:last-child a').hash",
    );
    await navigate(route + lastHash);
    await evaluate(
      "Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{});} ))",
    );
    const direct = await anchorState();
    assert.ok(direct.top >= direct.header - 1);
    await viewport(1366);
    await waitFor("document.querySelector('.article-outline').open");
    await viewport(375);
    await waitFor("!document.querySelector('.article-outline').open");
    await writeFile(
      `${output}/${route.startsWith("aprender") ? "guide" : "study"}-accessibility.json`,
      JSON.stringify(await send("Accessibility.getFullAXTree"), null, 2),
    );
  }

  // Consumidores do marcador compartilhado, inclusive HUD alta com texto 200%.
  const sharedIndexes = [];
  await viewport(1920);
  for (const route of ["documentacao/", "manual/"]) {
    await navigate(route);
    await evaluate("document.documentElement.style.fontSize='200%'");
    await evaluate(
      "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
    );
    await evaluate(
      'const link=document.querySelector(\'.docs-sidebar a[href^="#"], [data-section-nav] a[href^="#"]\');link.focus();link.click()',
    );
    await waitFor(
      "document.querySelector('.docs-sidebar [aria-current=true], [data-section-nav] [aria-current=true]')?.hash===location.hash",
      route,
    );
    const state = await anchorState();
    assert.ok(state.top >= state.header - 1);
    sharedIndexes.push({ route, ...state });
  }
  await viewport(375);
  // Clipboard real: o conteúdo copiado precisa ser idêntico, inclusive linhas.
  await send("Emulation.setFocusEmulationEnabled", { enabled: true });
  await send("Browser.grantPermissions", {
    origin: new globalThis.URL(browser.base).origin,
    permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
  });
  const consumers = [];
  for (const route of [
    "aprender/ide/instalar/",
    "estudos/c/primeiros-passos/",
    "manual/",
  ]) {
    await navigate(route);
    const original = await evaluate(
      "document.querySelector('.prose pre code').textContent",
    );
    await evaluate("document.querySelector('.code-copy').focus()");
    await key("Enter");
    await waitFor(
      "document.querySelector('.code-copy').dataset.state==='done'",
    );
    assert.equal(await evaluate("navigator.clipboard.readText()"), original);
    assert.equal(
      await evaluate(
        "document.querySelector('.code-block pre code').textContent",
      ),
      original,
    );
    assert.ok(await evaluate("document.activeElement.matches('.code-copy')"));
    consumers.push(route);
  }
  // Sem publicar rota inglesa: fixture troca apenas lang antes dos módulos.
  const fixture = await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `const observer=new MutationObserver(()=>{if(document.documentElement?.lang){document.documentElement.lang='en-US';observer.disconnect();}});observer.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['lang']});`,
  });
  for (const locale of ["en-US", "pt-BR"]) {
    if (locale === "pt-BR")
      await send("Page.removeScriptToEvaluateOnNewDocument", {
        identifier: fixture.identifier,
      });
    await navigate("estudos/c/primeiros-passos/");
    const messages = uiFor(locale).code;
    assert.equal(
      await evaluate("document.querySelector('.code-copy').textContent"),
      messages.copy,
    );
    assert.ok(
      await evaluate(
        `document.querySelector('.code-block-bar .label').textContent==='C' && [...document.querySelectorAll('.code-block-bar .label')].some(el=>el.textContent===${JSON.stringify(messages.output)})`,
      ),
    );
    await evaluate(
      "window.savedWrite=navigator.clipboard.writeText;window.copyCalls=0;navigator.clipboard.writeText=()=>{window.copyCalls++;return new Promise(resolve=>window.finishCopy=resolve)};document.querySelector('.code-copy').focus();document.querySelector('.code-copy').click()",
    );
    assert.ok(
      await evaluate(
        "document.querySelector('.code-copy').getAttribute('aria-disabled')==='true' && !document.querySelector('.code-copy').dataset.state && !document.querySelector('[aria-live=polite]').textContent",
      ),
    );
    await evaluate(
      "document.querySelector('.code-copy').click();new Promise(resolve=>setTimeout(resolve,200))",
    );
    assert.ok(
      await evaluate(
        "window.copyCalls===1 && document.activeElement.matches('.code-copy')",
      ),
    );
    await evaluate("window.finishCopy()");
    await waitFor(
      "document.querySelector('.code-copy').dataset.state==='done'",
    );
    assert.equal(
      await evaluate(
        "document.querySelector('[aria-live=polite]').textContent",
      ),
      messages.success,
    );
    await waitFor(
      `document.querySelector('.code-copy').textContent===${JSON.stringify(messages.copy)}`,
    );
    await evaluate(
      "navigator.clipboard.writeText=()=>Promise.reject(new Error('fixture'));document.querySelector('.code-copy').click()",
    );
    await waitFor(
      "document.querySelector('.code-copy').dataset.state==='error'",
    );
    assert.equal(
      await evaluate("document.querySelector('.code-copy').textContent"),
      messages.failed,
    );
    assert.equal(
      await evaluate(
        "document.querySelector('[aria-live=polite]').textContent",
      ),
      messages.failure,
    );
    assert.ok(
      await evaluate(
        "!document.querySelector('.code-copy').hasAttribute('aria-disabled') && document.querySelector('.prose pre code').textContent.length>0",
      ),
    );
    await evaluate("navigator.clipboard.writeText=window.savedWrite");
  }
  await evaluate(
    "const pre=document.querySelector('.code-block pre');pre.focus();pre.scrollLeft=0",
  );
  assert.ok(
    await evaluate(
      "document.activeElement.matches('pre[role=region][aria-label]') && document.activeElement.scrollWidth>document.activeElement.clientWidth",
    ),
  );
  await key("ArrowRight");
  await waitFor("document.activeElement.scrollLeft>0");
  await evaluate(
    "document.activeElement.scrollIntoView({block:'center',behavior:'instant'})",
  );
  await writeFile(
    `${output}/code-keyboard-focus.png`,
    await browser.screenshot(),
  );

  for (const [width, route] of [
    [375, "estudos/cpp/primeiros-passos/"],
    [375, "aprender/ide/instalar/"],
    [1366, "estudos/cpp/primeiros-passos/"],
    [1366, "aprender/ide/instalar/"],
  ]) {
    await viewport(width);
    await send("Emulation.setScriptExecutionDisabled", { value: true });
    const url = new globalThis.URL(route, browser.base).href;
    await send("Page.navigate", {
      url,
    });
    await waitFor(
      `location.href===${JSON.stringify(url)} && document.readyState==='complete' && !document.documentElement.dataset.enhanced && Boolean(document.querySelector('.article-outline'))`,
    );
    assert.ok(
      await evaluate(
        "document.querySelector('.article-outline').open && !document.querySelector('.code-copy') && document.querySelector('.prose pre code').textContent.length>0",
      ),
    );
    await evaluate(
      "document.querySelector('.article-outline > summary').focus()",
    );
    await key("Enter");
    await waitFor("!document.querySelector('.article-outline').open");
    await key("Enter");
    await key("Tab");
    await key("Enter");
    await waitFor(
      "location.hash===document.querySelector('.article-outline a').hash",
    );
    await send("Emulation.setScriptExecutionDisabled", { value: false });
  }
  assert.deepEqual(browser.errors, []);
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(
      {
        articles,
        matrix,
        sharedIndexes,
        consumers,
        locales: ["pt-BR", "en-US (fixture)"],
        noJavaScript: [375, 1366],
        errors: browser.errors,
      },
      null,
      2,
    ) + "\n",
  );
  globalThis.console.log(
    `Documentação: ${articles.length} artigos, ${matrix.length} cenários, âncoras, teclado, cópia real/falha/pendente, i18n e fallback sem JS aprovados.`,
  );
} finally {
  await browser.close();
}
