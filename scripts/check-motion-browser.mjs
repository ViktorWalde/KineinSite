import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser({ desktopPointer: true });
const { send, evaluate, navigate } = browser;
const output = "test-results/browser";
await mkdir(output, { recursive: true });
async function motion(reduced) {
  await send("Emulation.setEmulatedMedia", {
    features: [
      {
        name: "prefers-reduced-motion",
        value: reduced ? "reduce" : "no-preference",
      },
      { name: "prefers-color-scheme", value: "dark" },
    ],
  });
  await evaluate(
    "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
  );
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await delay(50);
  }
  assert.fail(expression);
}
async function settle(selector) {
  await evaluate(
    `(async()=>{const node=document.querySelector(${JSON.stringify(selector)});node.getBoundingClientRect();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));await Promise.allSettled(node.getAnimations({subtree:true}).map(animation=>animation.finished));})()`,
  );
}
try {
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Emulation.setFocusEmulationEnabled", { enabled: true });
  await motion(true);
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `const originalFetch=window.fetch.bind(window);window.fetch=(input,options)=>String(input).startsWith('https://api.github.com/repos/')?Promise.resolve(new Response(JSON.stringify(String(input).includes('/issues?')?[{number:1,title:'Tarefa de teste',body:'Descrição pública para conferir a apresentação.',state:'open',labels:[{name:'help wanted'}],assignees:[],updated_at:'2026-10-24T12:00:00Z'}]:[]),{headers:{'Content-Type':'application/json'}})):originalFetch(input,options);`,
  });
  await navigate("colabore/");
  await waitFor("document.querySelectorAll('.task-card').length === 2");
  for (const theme of ["dark", "light", "warm"]) {
    for (const accent of ["amber", "blue", "teal"]) {
      await evaluate(
        `document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.dataset.accent=${JSON.stringify(accent)}`,
      );
      assert.ok(
        await evaluate(
          "getComputedStyle(document.querySelector('.collab-actions .button-quiet')).backgroundColor===getComputedStyle(document.querySelector('.field-control')).backgroundColor",
        ),
        `Botão fora do tema: ${theme}/${accent}`,
      );
    }
  }
  await evaluate(
    "document.documentElement.dataset.theme='dark';document.documentElement.dataset.accent='amber'",
  );
  await motion(false);
  assert.ok(
    await evaluate("matchMedia('(hover: hover) and (pointer: fine)').matches"),
  );
  await evaluate(
    "document.querySelector('.field-control').focus({preventScroll:true})",
  );
  await waitFor(
    "getComputedStyle(document.activeElement).boxShadow!=='none' && getComputedStyle(document.activeElement).outlineStyle!=='none'",
  );
  await evaluate(
    "document.activeElement.blur();document.querySelector('.collab-way').scrollIntoView({block:'center',behavior:'instant'})",
  );
  const point = await evaluate(
    "(()=>{const box=document.querySelector('.collab-way').getBoundingClientRect();return {x:box.left+32,y:box.top+32}})()",
  );
  await send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: point.x,
    y: point.y,
  });
  await waitFor(
    "getComputedStyle(document.querySelector('.collab-way'),'::before').opacity==='1'",
  );
  assert.ok(
    await evaluate(
      "getComputedStyle(document.querySelector('.collab-way'),'::before').opacity==='1' && getComputedStyle(document.querySelector('.collab-way'),'::before').content!=='none' && getComputedStyle(document.querySelector('.collab-way'),'::before').transitionProperty==='opacity'",
    ),
  );
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 0, y: 0 });
  await evaluate(
    "document.querySelector('.collab-disclosure summary').click()",
  );
  await settle(".collab-disclosure");
  assert.ok(
    await evaluate("document.querySelector('.collab-disclosure').open"),
  );
  if (await evaluate("CSS.supports('interpolate-size','allow-keywords')"))
    await waitFor(
      "(()=>{const details=document.querySelector('.collab-disclosure'),style=getComputedStyle(details,'::details-content');return details.getBoundingClientRect().height>details.querySelector('summary').getBoundingClientRect().height+10 && style.opacity==='1' && style.transitionDuration.includes('0.32s')})()",
    );
  await evaluate(
    "document.querySelector('.collab-disclosure summary').click()",
  );
  await settle(".collab-disclosure");
  assert.ok(
    await evaluate("!document.querySelector('.collab-disclosure').open"),
  );
  await evaluate(
    "document.querySelector('.collab-disclosure summary').click();document.querySelector('.collab-disclosure summary').click();document.querySelector('.collab-disclosure summary').click()",
  );
  await settle(".collab-disclosure");
  assert.ok(
    await evaluate("document.querySelector('.collab-disclosure').open"),
  );
  await evaluate(
    "document.querySelector('#tarefas').scrollIntoView({behavior:'instant'});document.querySelector('[data-task-search]').value='sem resultado';document.querySelector('[data-task-search]').dispatchEvent(new Event('input'));document.querySelector('[data-task-clear]').click()",
  );
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('.task-card')].some(card=>card.getAnimations().some(animation=>animation.effect.getKeyframes().some(frame=>frame.translate)))",
    ),
    "Novos resultados devem ter entrada suave",
  );
  await evaluate(
    "document.querySelector('[data-task-refresh]').setAttribute('aria-busy','true')",
  );
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('[data-task-refresh]'),'::after').animationName",
    ),
    "loading-turn",
  );
  await motion(true);
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('.task-card')].every(card=>card.getAnimations().length===0) && getComputedStyle(document.querySelector('[data-task-refresh]'),'::after').animationName==='none'",
    ),
  );
  await evaluate(
    "document.querySelector('[data-task-refresh]').setAttribute('aria-busy','false')",
  );
  await navigate();
  await motion(false);
  await evaluate(
    "document.querySelector('#gallery-beta [data-image-open]').focus()",
  );
  assert.ok(
    await evaluate(
      "document.activeElement.matches('#gallery-beta [data-image-open]')",
    ),
  );
  await evaluate("document.querySelector('#gallery-preview-tab').click()");
  assert.ok(
    await evaluate(
      "document.querySelector('#gallery-beta').hidden && document.querySelector('#gallery-beta').inert && document.querySelector('#gallery-beta').classList.contains('is-leaving')",
    ),
  );
  assert.ok(
    await evaluate("document.activeElement.id==='gallery-preview-tab'"),
    "O foco deve sair do painel oculto e acompanhar a aba selecionada",
  );
  await evaluate(
    "document.querySelector('#gallery-beta-tab').click();document.querySelector('#gallery-preview-tab').click();document.querySelector('#gallery-beta-tab').click()",
  );
  await motion(true);
  assert.ok(
    await evaluate(
      "!document.querySelector('#gallery-beta').hidden && document.querySelectorAll('.is-leaving').length===0",
    ),
  );
  await motion(false);
  await evaluate(
    "document.querySelector('#gallery-beta [data-image-open]').click()",
  );
  await waitFor("Boolean(document.querySelector('dialog[open]'))");
  await settle("dialog[open]");
  await evaluate("document.querySelector('dialog[open] img').decode()");
  assert.ok(
    await evaluate(
      "getComputedStyle(document.querySelector('dialog[open]')).opacity==='1' && getComputedStyle(document.querySelector('dialog[open]')).transitionProperty.includes('overlay')",
    ),
  );
  await writeFile(
    `${output}/modal-polido-1440.png`,
    await browser.screenshot(),
  );
  await evaluate("window.__dialog=document.querySelector('dialog[open]')");
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
    nativeVirtualKeyCode: 27,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
    nativeVirtualKeyCode: 27,
  });
  await waitFor(
    "!window.__dialog.open && document.activeElement.matches('#gallery-beta [data-image-open]')",
  );
  await evaluate(
    "Promise.allSettled(window.__dialog.getAnimations().map(animation=>animation.finished))",
  );
  assert.ok(
    await evaluate("getComputedStyle(window.__dialog).display==='none'"),
  );
  await motion(true);
  await evaluate(
    "document.querySelector('#gallery-beta [data-image-open]').click()",
  );
  assert.ok(
    await evaluate(
      "document.querySelector('dialog[open]').getAnimations().every(animation=>animation.effect.getTiming().duration<=1)",
    ),
  );
  await evaluate("document.querySelector('dialog[open]').close()");
  assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
  await writeFile(
    `${output}/motion-report.json`,
    JSON.stringify(
      {
        checks: [
          "Controles nos nove temas/destaques",
          "Foco visível",
          "Crossfade dos cartões",
          "Detalhes com abertura e fechamento suaves",
          "Entrada de novos resultados",
          "Indicador de consulta",
          "Cancelamento ao reduzir movimento",
          "Troca rápida de abas",
          "Foco preservado ao sair de um painel",
          "Modal com Escape e foco de retorno",
        ],
        errors: browser.errors,
      },
      null,
      2,
    ),
  );
  globalThis.console.log(
    "Movimento: controles, cartões, resultados, abas, modal e movimento reduzido aprovados.",
  );
} finally {
  await browser.close();
}
