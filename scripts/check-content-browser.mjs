import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser();
const { send, navigate, evaluate } = browser;
const output = "test-results/phase-c/after";
await mkdir(output, { recursive: true });
async function viewport(width) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
async function key(value) {
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: value,
    code: value,
    ...(value === "Enter" ? { text: "\r" } : {}),
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: value,
    code: value,
  });
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await delay(50);
  }
  assert.fail(expression);
}
try {
  await send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "prefers-color-scheme", value: "dark" },
    ],
  });
  const galleryPositions = [];
  for (const width of [390, 768, 1440]) {
    await viewport(width);
    await navigate();
    const position = await evaluate(`(() => {
      scrollTo({top:0,behavior:'instant'});
      return {width:innerWidth,gallery:document.querySelector('#interface').getBoundingClientRect().top,status:document.querySelector('#estado').getBoundingClientRect().top,demo:document.querySelector('#desenvolvimento').getBoundingClientRect().top};
    })()`);
    assert.ok(
      position.gallery < position.status && position.status < position.demo,
      "Capturas antes da apresentação e demonstração",
    );
    galleryPositions.push(position);
    assert.ok(
      await evaluate(
        "document.querySelector('.gallery-versions [data-tab]').id==='gallery-beta-tab' && document.querySelector('#gallery-beta-tab').getAttribute('aria-selected')==='true' && document.querySelector('#gallery-preview-tab .version-state').textContent==='Em desenvolvimento'",
      ),
    );
    await evaluate("document.querySelector('#gallery-beta-tab').focus()");
    await key("End");
    assert.ok(
      await evaluate(
        "document.activeElement.id==='gallery-preview-tab' && !document.querySelector('#gallery-preview').hidden",
      ),
    );
    await key("Home");
    assert.ok(
      await evaluate(
        "document.activeElement.id==='gallery-beta-tab' && !document.querySelector('#gallery-beta').hidden",
      ),
    );
    await evaluate(
      "document.activeElement.blur();document.querySelector('#interface').scrollIntoView({block:'start',behavior:'instant'})",
    );
    await evaluate("document.querySelector('#gallery-beta img').decode()");
    await writeFile(
      `${output}/gallery-${width}.png`,
      await browser.screenshot(),
    );
  }
  for (const route of ["documentacao/", "documentacao/site/"]) {
    await navigate(route);
    for (const textSize of ["", "200%"]) {
      await evaluate(
        `document.documentElement.style.fontSize=${JSON.stringify(textSize)}`,
      );
      for (const width of [320, 390, 768, 1024, 1440]) {
        await viewport(width);
        await evaluate(
          "document.querySelector('[data-docs-outline]').open=true",
        );
        assert.ok(
          await evaluate(`(() => {
          const nav=document.querySelector('[data-docs-outline] nav');
          return document.documentElement.scrollWidth<=innerWidth && nav.scrollWidth<=nav.clientWidth && [...nav.querySelectorAll('a')].every(a=>{const r=a.getBoundingClientRect();return r.height>=44 && r.left>=0 && r.right<=innerWidth;});
        })()`),
          `${route}/${width}/${textSize || "100%"}: opções inteiras, sem rolagem lateral`,
        );
      }
    }
    await evaluate("document.documentElement.style.fontSize=''");
    await viewport(390);
    await navigate(route);
    assert.equal(
      await evaluate("document.querySelector('[data-docs-outline]').open"),
      false,
    );
    await evaluate(
      "document.querySelector('[data-docs-outline] > summary').focus()",
    );
    await key("Enter");
    assert.ok(
      await evaluate("document.querySelector('[data-docs-outline]').open"),
    );
    await evaluate("document.querySelector('[data-docs-outline] a').focus()");
    await key("Escape");
    assert.ok(
      await evaluate(
        "!document.querySelector('[data-docs-outline]').open && document.activeElement.matches('[data-docs-outline] > summary')",
      ),
    );
    await key("Enter");
    await evaluate("document.querySelector('[data-docs-outline] a').click()");
    await waitFor(
      "!document.querySelector('[data-docs-outline]').open && document.activeElement.matches('.docs-section[aria-labelledby]') && document.activeElement.id===location.hash.slice(1) && document.querySelector('[data-docs-outline] [aria-current=true]')?.hash===location.hash",
    );
    await viewport(1440);
    await waitFor("document.querySelector('[data-docs-outline]').open");
    await viewport(390);
    await waitFor("!document.querySelector('[data-docs-outline]').open");
  }
  await navigate("documentacao/");
  for (const width of [390, 1440]) {
    await viewport(width);
    await evaluate("scrollTo({top:0,behavior:'instant'})");
    await writeFile(
      `${output}/documentation-${width}.png`,
      await browser.screenshot(),
    );
  }
  await viewport(390);
  await evaluate(
    "document.querySelector('[data-docs-outline]').open=true;scrollTo({top:0,behavior:'instant'})",
  );
  await writeFile(
    `${output}/documentation-outline-open.png`,
    await browser.screenshot(),
  );
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await navigate("documentacao/");
  await evaluate("document.querySelector('[data-docs-outline]').open=true");
  await evaluate(
    "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
  );
  await evaluate(
    "Promise.allSettled(document.querySelector('[data-docs-outline]').getAnimations({subtree:true}).map(animation=>animation.finished))",
  );
  await evaluate("document.querySelector('[data-docs-outline] a').focus()");
  await key("Enter");
  await waitFor(
    "!document.querySelector('[data-docs-outline]').open && document.activeElement.id==='comece'",
  );
  await evaluate(
    "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
  );
  await evaluate(
    "Promise.allSettled(document.querySelector('[data-docs-outline]').getAnimations({subtree:true}).map(animation=>animation.finished))",
  );
  assert.ok(
    await evaluate(
      "document.activeElement.getBoundingClientRect().top>=0 && document.activeElement.getBoundingClientRect().top<innerHeight/2",
    ),
    "A seção de destino permanece visível após recolher o índice com movimento ativo",
  );
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await navigate("manual/");
  await evaluate(
    "document.querySelector('[data-manual-outline]').open=true;const input=document.querySelector('#manual-search');input.value='git';input.dispatchEvent(new Event('input'));input.focus()",
  );
  await key("Escape");
  assert.ok(
    await evaluate(
      "document.querySelector('#manual-search').value==='' && document.querySelector('[data-manual-outline]').open",
    ),
    "Primeiro Escape limpa a busca do manual",
  );
  await key("Escape");
  assert.ok(
    await evaluate(
      "!document.querySelector('[data-manual-outline]').open && document.activeElement.matches('[data-manual-outline] > summary')",
    ),
    "Segundo Escape recolhe o índice e devolve foco",
  );
  await send("Emulation.setScriptExecutionDisabled", { value: true });
  await send("Page.navigate", { url: browser.base });
  await waitFor(
    "document.readyState==='complete' && Boolean(document.querySelector('#gallery-beta'))",
  );
  assert.ok(
    await evaluate(`(() => {
    const panels=[...document.querySelectorAll('.gallery-versions > [data-tab-panel]')];
    return panels[0].id==='gallery-beta' && panels.every(p=>p.getBoundingClientRect().height>0) && getComputedStyle(document.querySelector('#gallery-preview .gallery-version-title')).display!=='none' && document.querySelector('#gallery-preview .gallery-version-title').textContent.includes('em desenvolvimento');
  })()`),
    "Sem JS, beta aparece primeiro e a prévia continua identificada",
  );
  await send("Page.navigate", {
    url: new globalThis.URL("documentacao/", browser.base).href,
  });
  await waitFor(
    "document.readyState==='complete' && Boolean(document.querySelector('[data-docs-outline]'))",
  );
  assert.ok(
    await evaluate(
      "document.querySelector('[data-docs-outline]').open && [...document.querySelectorAll('[data-docs-outline] a')].every(a=>a.getBoundingClientRect().height>=44)",
    ),
    "Índice disponível sem JavaScript",
  );
  await evaluate(
    "document.querySelector('[data-docs-outline] > summary').focus()",
  );
  await key("Enter");
  assert.equal(
    await evaluate("document.querySelector('[data-docs-outline]').open"),
    false,
  );
  await key("Enter");
  assert.equal(
    await evaluate("document.querySelector('[data-docs-outline]').open"),
    true,
  );
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
  await writeFile(
    "test-results/phase-c/content-report.json",
    JSON.stringify(
      {
        galleryPositions,
        documentationWidths: [320, 390, 768, 1024, 1440],
        textSizes: ["100%", "200%"],
        checks: [
          "Beta primeiro, inclusive sem JavaScript",
          "Abas por teclado",
          "Índice inteiro sem rolagem horizontal",
          "Enter, Escape, foco e seção ativa",
          "Resize",
          "Busca do manual preservada",
          "Navegação nativa sem JavaScript",
        ],
        errors: browser.errors,
      },
      null,
      2,
    ),
  );
  globalThis.console.log(
    "Conteúdo: galeria antecipada, versões identificadas, índice responsivo, teclado, foco e alternativas sem JavaScript aprovados.",
  );
} finally {
  await browser.close();
}
