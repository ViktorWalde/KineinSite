import assert from "node:assert/strict";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser();
const { send, evaluate, navigate } = browser;
const output = "test-results/browser";
const routes = (await readdir("dist", { recursive: true }))
  .filter((file) => file.endsWith(".html"))
  .map((file) => file.replace(/(?:^|\/)index\.html$/, "/").replace(/^\//, ""));
await mkdir(output, { recursive: true });
async function viewport(width) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
try {
  await send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "prefers-color-scheme", value: "dark" },
    ],
  });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `const originalFetch = window.fetch.bind(window); window.fetch = (input, options) => String(input).startsWith('https://api.github.com/repos/') ? Promise.resolve(new Response('[]',{headers:{'Content-Type':'application/json'}})) : originalFetch(input,options);
    window.addEventListener('pagereveal', event=>{window.__pageTransition=Boolean(event.viewTransition);});`,
  });
  for (const route of routes) {
    await navigate(route);
    for (const size of ["", "200%"]) {
      await evaluate(
        `document.documentElement.style.fontSize=${JSON.stringify(size)}`,
      );
      for (const width of [320, 768, 1440]) {
        await viewport(width);
        assert.ok(
          await evaluate("document.documentElement.scrollWidth <= innerWidth"),
          `Overflow ${route} / ${width} / ${size || "100%"}`,
        );
      }
    }
  }
  await viewport(320);
  await navigate("colabore/");
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('.collab-section-nav a, .action-link')].every(link=>link.getBoundingClientRect().height>=44)",
    ),
    "Atalhos devem ter área de toque de pelo menos 44 px",
  );
  await evaluate(
    "document.querySelector('#como-ajudar').scrollIntoView({behavior:'instant',block:'start'})",
  );
  await delay(100);
  assert.equal(
    await evaluate(
      "document.querySelector('.collab-section-nav [aria-current=true]')?.hash",
    ),
    "#como-ajudar",
  );
  await evaluate("window.scrollTo({top:0,behavior:'instant'})");
  for (let attempt = 0; attempt < 100; attempt++) {
    if (
      await evaluate(
        "!document.querySelector('[data-task-empty-action]').hidden",
      )
    )
      break;
    await delay(50);
  }
  assert.ok(
    await evaluate(
      "!document.querySelector('[data-task-empty-action]').hidden && document.querySelector('[data-task-empty-action]').hash === '#como-ajudar'",
    ),
  );
  await evaluate(
    "document.querySelector('.mobile-navigation > summary').focus()",
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    text: "\r",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
  });
  assert.ok(
    await evaluate("document.querySelector('.mobile-navigation').open"),
  );
  await evaluate("document.documentElement.style.fontSize='200%'");
  assert.ok(
    await evaluate(
      "document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll('.mobile-links a')].every(link=>link.getBoundingClientRect().width>0)",
    ),
  );
  await evaluate(
    "document.documentElement.style.fontSize=''; document.querySelector('.mobile-links a').focus()",
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    code: "Escape",
  });
  assert.ok(
    await evaluate(
      "!document.querySelector('.mobile-navigation').open && document.activeElement === document.querySelector('.mobile-navigation > summary')",
    ),
  );
  for (const width of [320, 1440]) {
    await viewport(width);
    await evaluate(
      "document.activeElement.blur(); scrollTo({top:0,behavior:'instant'})",
    );
    await writeFile(
      `${output}/colabore-convite-${width}.png`,
      await browser.screenshot(),
    );
  }
  await viewport(1440);
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await navigate();
  const manualLink = await evaluate(
    "(()=>{const box=document.querySelector('.desktop-links a[href$=\"/manual/\"]').getBoundingClientRect();return{x:box.left+box.width/2,y:box.top+box.height/2}})()",
  );
  for (const type of ["mousePressed", "mouseReleased"])
    await send("Input.dispatchMouseEvent", {
      type,
      ...manualLink,
      button: "left",
      clickCount: 1,
    });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (
      await evaluate(
        "location.pathname.endsWith('/manual/') && document.readyState==='complete' && document.documentElement.dataset.enhanced==='true'",
      )
    )
      break;
    await delay(50);
  }
  assert.ok(
    await evaluate(
      "location.pathname.endsWith('/manual/') && document.querySelector('.desktop-links a[aria-current=page]').textContent.trim()==='Manual'",
    ),
    "O clique deve abrir o manual com movimento e navegação nativa habilitados",
  );
  await delay(500);
  assert.ok(
    await evaluate("window.__pageTransition"),
    "A página de destino deve participar da transição nativa",
  );
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await viewport(320);
  await send("Emulation.setScriptExecutionDisabled", { value: true });
  await send("Page.navigate", {
    url: new globalThis.URL("colabore/regras/", browser.base).href,
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (
      await evaluate(
        "location.pathname.endsWith('/colabore/regras/') && document.readyState === 'complete' && Boolean(document.querySelector('#modelo-entrega'))",
      )
    )
      break;
    await delay(50);
  }
  assert.ok(
    await evaluate(
      "document.querySelector('[data-copy-target]').hidden && document.querySelector('#modelo-entrega').textContent.includes('Critérios de aceite')",
    ),
  );
  await evaluate(
    "document.querySelector('.mobile-navigation > summary').focus()",
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    text: "\r",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
  });
  assert.ok(
    await evaluate(
      "document.querySelector('.mobile-navigation').open && document.querySelector('.mobile-links a').getBoundingClientRect().width>0",
    ),
  );
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
  await writeFile(
    `${output}/navigation-report.json`,
    JSON.stringify(
      {
        pages: routes.length,
        widths: [320, 768, 1440],
        textSizes: ["100%", "200%"],
        checks: [
          "Layout de todas as páginas",
          "Menu móvel com teclado",
          "Clique entre páginas com movimento e transição nativa habilitados",
          "Estado vazio com próximo passo",
          "Menu e modelo disponíveis sem JavaScript",
        ],
        errors: browser.errors,
      },
      null,
      2,
    ),
  );
  globalThis.console.log(
    `Navegação: ${routes.length} páginas, três larguras, texto ampliado e alternativa sem JavaScript aprovados.`,
  );
} finally {
  await browser.close();
}
