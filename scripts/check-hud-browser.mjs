import process from "node:process";
import assert from "node:assert/strict";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const dist = process.env.KINEIN_TEST_DIST ?? "dist";
const browser = await openBrowser({ serveNotFound: true });
const { send, evaluate, navigate } = browser;
const output = `test-results/h2-2026-11-12/${new globalThis.URL(browser.base).pathname === "/" ? "root" : "pages"}`;
await mkdir(output, { recursive: true });
const widths = [320, 375, 768, 1024, 1366, 1920];
const groupIds = ["product", "docs", "community", "updates"];
const matrix = [];
const checks = [];
let scriptsDisabled = false;
const desktop = (id) => `.desktop-links [data-hud-group="${id}"]`;
const mobile = (id) => `.mobile-links [data-hud-group="${id}"]`;
async function waitFor(expression, message = expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return;
    await delay(20);
  }
  assert.fail(message);
}
async function frame() {
  if (scriptsDisabled) return;
  await evaluate(
    "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
  );
}
async function viewport(width, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await frame();
}
async function key(key, modifiers = 0) {
  const codes = { " ": "Space", Enter: "Enter", Escape: "Escape", Tab: "Tab" };
  for (const type of ["keyDown", "keyUp"])
    await send("Input.dispatchKeyEvent", {
      type,
      key,
      code: codes[key] ?? key,
      modifiers,
      ...(type === "keyDown" && ["Enter", " "].includes(key)
        ? { text: key === "Enter" ? "\r" : " " }
        : {}),
    });
  await frame();
}
async function activate(selector, method = "mouse") {
  await evaluate(
    `document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'nearest',behavior:'instant'})`,
  );
  if (method === "mouse" || method === "touch") {
    const point = await evaluate(
      `(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`,
    );
    if (method === "touch") {
      await send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ ...point, radiusX: 1, radiusY: 1 }],
      });
      await send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    } else
      for (const type of ["mousePressed", "mouseReleased"])
        await send("Input.dispatchMouseEvent", {
          type,
          ...point,
          button: "left",
          clickCount: 1,
        });
  } else {
    await evaluate(
      `document.querySelector(${JSON.stringify(selector)}).focus()`,
    );
    await key(method);
  }
  await frame();
}
async function reset() {
  await evaluate(
    "document.activeElement.blur();document.querySelectorAll('.site-header details').forEach(p=>p.open=false);scrollTo({top:0,behavior:'instant'})",
  );
  await frame();
}
async function is(expression, message) {
  assert.ok(
    await evaluate(expression),
    (message ?? expression) +
      " " +
      JSON.stringify(
        await evaluate(
          "({focus:document.activeElement?.outerHTML?.slice(0,250),open:[...document.querySelectorAll('.site-header details[open]')].map(p=>p.className),hasFocus:document.hasFocus()})",
        ),
      ),
  );
}
try {
  await send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "prefers-color-scheme", value: "dark" },
    ],
  });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source:
      "const originalFetch=window.fetch.bind(window);window.fetch=(input,options)=>String(input).startsWith('https://api.github.com/repos/')?Promise.resolve(new Response('[]',{headers:{'Content-Type':'application/json'}})):originalFetch(input,options);",
  });
  await viewport(1366);
  const routes = (await readdir(dist, { recursive: true })).filter((file) =>
    file.endsWith(".html"),
  );
  for (const file of routes) {
    const route = file.replace(/(?:^|\/)index\.html$/, "/").replace(/^\//, "");
    await navigate(route);
    const html = await readFile(`${dist}/${file}`, "utf8");
    const group =
      route === "404.html"
        ? null
        : route === ""
          ? "product"
          : route.startsWith("colabore/")
            ? "community"
            : route.startsWith("atualizacoes/")
              ? "updates"
              : "docs";
    const state = await evaluate(`(()=>{
      const nav=document.querySelector('.desktop-links');
      const items=[...nav.querySelectorAll('a')];
      const exact=items.filter(a=>!a.hash && a.origin===location.origin && a.pathname===location.pathname).map(a=>a.dataset.hudItem);
      const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
      return {group:nav.querySelector('[data-current-group]')?.dataset.hudGroup??null, exact, actual:items.filter(a=>a.getAttribute('aria-current')==='page').map(a=>a.dataset.hudItem),
        open:document.querySelectorAll('.site-header details[open]').length, unique:new Set(ids).size===ids.length,
        copies:['.desktop-links','.mobile-links'].map(s=>[...document.querySelectorAll(s+' a')].map(a=>[a.dataset.hudItem,a.getAttribute('href'),a.textContent.trim()])),
        tools:[document.querySelectorAll('.appearance').length,document.querySelectorAll('.header-download').length],
        external:items.filter(a=>a.origin!==location.origin).every(a=>a.target==='_blank'&&a.rel.includes('noopener')&&a.rel.includes('noreferrer')&&!a.hasAttribute('aria-current')&&a.textContent.includes('nova aba'))};
    })()`);
    assert.equal(state.group, group, route);
    assert.deepEqual(state.actual, group ? state.exact : [], route);
    assert.equal(state.open, 0);
    assert.ok(state.unique && state.external);
    assert.deepEqual(state.copies[0], state.copies[1]);
    assert.deepEqual(state.tools, [1, 1]);
    assert.ok(!html.includes('role="menu"'));
    // Todos os destinos e fragmentos do catálogo contra o artefato gerado.
    for (const [, href] of state.copies[0]) {
      if (href.startsWith("https:")) continue;
      const url = new globalThis.URL(href, browser.base);
      const relative = url.pathname.slice(
        new globalThis.URL(browser.base).pathname.length,
      );
      const destination = await readFile(
        `${dist}/${relative}index.html`,
        "utf8",
      );
      if (url.hash)
        assert.ok(destination.includes(`id="${url.hash.slice(1)}"`), href);
    }
  }
  checks.push(
    "H1-T01/T02/T03/T08: todas as páginas, catálogo, semântica, IDs, fontes, destinos e âncoras",
  );
  for (const route of ["404.html", "documentacao/inexistente/"]) {
    const before = browser.errors.length;
    await navigate(route);
    await is(
      "!document.querySelector('.site-header [aria-current],.site-header [data-current-group],link[rel=canonical],link[rel=alternate]')",
    );
    // Único erro esperado: status 404 da fixture no caminho desconhecido.
    if (route !== "404.html") {
      assert.ok(
        browser.errors
          .slice(before)
          .every((error) => error.text?.includes("404")),
      );
      browser.errors.splice(before);
    }
  }
  checks.push(
    "H1-T06: 404 real sob prefixo conhecido, sem estado atual/metadados falsos",
  );
  for (const [route, hash, item] of [
    ["", "interface", "product-interface"],
    ["", "estado", "product-status"],
    ["", "desenvolvimento", "product-demos"],
    ["documentacao/", "referencias", "docs-references"],
  ]) {
    await navigate("manual/");
    await navigate(`${route}#${hash}`);
    await is(
      `document.querySelector('.desktop-links [aria-current=location]')?.dataset.hudItem===${JSON.stringify(item)} && document.activeElement.id===${JSON.stringify(hash)} && !document.querySelector('.site-header details[open]')`,
    );
  }
  await navigate("#interface");
  await evaluate("location.hash='estado'");
  await frame();
  await is(
    "document.querySelector('.desktop-links [aria-current=location]').dataset.hudItem==='product-status'",
  );
  await evaluate("history.back()");
  await waitFor("location.hash==='#interface'");
  await is(
    "document.querySelector('.desktop-links [aria-current=location]').dataset.hudItem==='product-interface'",
  );
  await evaluate("history.forward()");
  await waitFor("location.hash==='#estado'");
  for (const hash of ["novidades", "inexistente"]) {
    await evaluate(`location.hash=${JSON.stringify(hash)}`);
    await frame();
    await is(
      "!document.querySelector('.site-header [aria-current=location]') && document.querySelector('.desktop-links [data-current-group]').dataset.hudGroup==='product'",
    );
  }
  await navigate("manual/#3-editor");
  await is(
    "!document.querySelector('.site-header [aria-current=location]') && document.querySelector('.desktop-links [aria-current=page]').dataset.hudItem==='docs-manual'",
  );
  checks.push(
    "H1-T04/T05: chegada por hash, estados independentes, hashchange, histórico e manual",
  );

  for (const width of [375, 1366]) {
    await viewport(width);
    await navigate();
    const prefix = width < 864 ? mobile : desktop;
    if (width < 864) await activate(".mobile-navigation > summary");
    const ax = await send("Accessibility.getFullAXTree");
    const navigationNames = ax.nodes
      .filter((node) => !node.ignored && node.role?.value === "navigation")
      .map((node) => node.name?.value);
    assert.equal(
      navigationNames.filter(
        (name) => name === "Navegação principal" || name === "Navegação móvel",
      ).length,
      1,
    );
    await writeFile(
      `${output}/accessibility-${width}.json`,
      JSON.stringify(ax, null, 2),
    );

    for (const method of ["mouse", "touch", "Enter", " "]) {
      await reset();
      if (width < 864) await activate(".mobile-navigation > summary", method);
      for (const id of groupIds) {
        await activate(`${prefix(id)} > summary`, method);
        await is(
          `document.querySelector(${JSON.stringify(prefix(id))}).open && document.querySelectorAll('.hud-group[open]').length===1`,
        );
        if (width < 864)
          await is("document.querySelector('.mobile-navigation').open");
        await activate(`${prefix(id)} > summary`, method);
        await is(`!document.querySelector(${JSON.stringify(prefix(id))}).open`);
      }
    }
    await reset();
    if (width < 864) await activate(".mobile-navigation > summary");
    await activate(`${prefix("product")} > summary`);
    await activate(`${prefix("docs")} > summary`);
    await is("document.querySelectorAll('.hud-group[open]').length===1");
    await activate(".appearance > summary");
    await is(
      "document.querySelector('.appearance').open && !document.querySelector('.hud-group[open],.mobile-navigation[open]')",
    );
    await activate('.appearance input[value="light"]', " ");
    await is(
      "document.querySelector('.appearance').open && localStorage.getItem('kinein-theme')==='light'",
    );
    if (width < 864) await activate(".mobile-navigation > summary");
    await activate(`${prefix("docs")} > summary`);
    await is("!document.querySelector('.appearance').open");
    await evaluate(
      `document.querySelector(${JSON.stringify(`${prefix("docs")} a`)}).focus()`,
    );
    await key("Escape");
    await is(
      `!document.querySelector(${JSON.stringify(prefix("docs"))}).open && document.activeElement===document.querySelector(${JSON.stringify(`${prefix("docs")} > summary`)})`,
    );
    if (width < 864) {
      await is("document.querySelector('.mobile-navigation').open");
      await key("Escape");
      await is(
        "!document.querySelector('.mobile-navigation').open && document.activeElement.matches('.mobile-navigation > summary')",
      );
    }
    await activate(".appearance > summary");
    await key("Tab");
    await key("Escape");
    await is(
      "!document.querySelector('.appearance').open && document.activeElement.matches('.appearance > summary')",
    );
    await reset();
    await evaluate(
      `${width < 864 ? "document.querySelector('.mobile-navigation > summary').click();" : ""}document.querySelector(${JSON.stringify(`${prefix("product")} > summary`)}).click();document.querySelector(${JSON.stringify(`${prefix("docs")} > summary`)}).click();`,
    );
    await frame();
    await is(
      `document.querySelector(${JSON.stringify(prefix("docs"))}).open && document.querySelectorAll('.hud-group[open]').length===1`,
    );
    // Externo fecha a origem e mantém retorno visível; CTA conserva foco.
    await reset();
    if (width < 864) await activate(".mobile-navigation > summary");
    await activate(`${prefix("community")} > summary`);
    await evaluate(
      "document.addEventListener('click',event=>event.preventDefault(),{once:true})",
    );
    await activate(`#${width < 864 ? "mobile" : "desktop"}-community-ide-code`);
    await is(
      `!document.querySelector('.site-header details[open]') && document.activeElement.matches(${JSON.stringify(width < 864 ? ".mobile-navigation > summary" : `${prefix("community")} > summary`)})`,
    );
    await evaluate(
      "document.addEventListener('click',event=>event.preventDefault(),{once:true})",
    );
    await activate(".header-download");
    await is("document.activeElement.matches('.header-download')");
    // Tab entra no link; sair do último fecha G e conserva o próximo foco.
    await reset();
    if (width < 864) await activate(".mobile-navigation > summary");
    await activate(`${prefix("product")} > summary`, "Enter");
    await key("Tab");
    await is("document.activeElement.dataset.hudItem==='product-overview'");
    await key("Tab", 8);
    await is("document.activeElement.matches('.hud-group > summary')");
    await evaluate(
      `document.querySelector(${JSON.stringify(`${prefix("product")} li:last-child a`)}).focus()`,
    );
    await key("Tab");
    await is(
      `!document.querySelector(${JSON.stringify(prefix("product"))}).open && document.activeElement===document.querySelector(${JSON.stringify(`${prefix("docs")} > summary`)})`,
    );
    if (width < 864)
      await is("document.querySelector('.mobile-navigation').open");
    // Escape fora da HUD não a fecha, nem é consumido.
    await activate(`${prefix("docs")} > summary`);
    await is(
      "(()=>{const event=new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});document.querySelector('main').dispatchEvent(event);return !event.defaultPrevented&&document.querySelector('.hud-group[open]');})()",
    );
    // Clique externo não focável devolve ao controle visível.
    await evaluate(
      `document.querySelector(${JSON.stringify(`${prefix("docs")} a`)}).focus()`,
    );
    await evaluate(
      "document.querySelector('main').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));document.querySelector('main').click()",
    );
    await is(
      `!document.querySelector('.hud-group[open],.mobile-navigation[open]') && document.activeElement.matches(${JSON.stringify(width < 864 ? ".mobile-navigation > summary" : `${prefix("docs")} > summary`)})`,
    );
    // Seleção modificada mantém origem; cancela só a navegação de teste.
    await reset();
    if (width < 864) await activate(".mobile-navigation > summary");
    await activate(`${prefix("product")} > summary`);
    for (const modifier of ["ctrlKey", "metaKey", "shiftKey", "altKey"]) {
      await evaluate(
        `(()=>{const a=document.querySelector(${JSON.stringify(`${prefix("product")} a`)});document.addEventListener('click',e=>e.preventDefault(),{once:true});a.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,${modifier}:true}));})()`,
      );
      await is(
        `document.querySelector(${JSON.stringify(prefix("product"))}).open`,
      );
    }
    await evaluate(
      `document.querySelector(${JSON.stringify(`${prefix("product")} a`)}).dispatchEvent(new MouseEvent('auxclick',{bubbles:true,button:1}))`,
    );
    await is(
      `document.querySelector(${JSON.stringify(prefix("product"))}).open`,
    );
    // Âncora local, inclusive repetir o mesmo hash, deve sair com foco no alvo.
    for (let i = 0; i < 2; i++) {
      if (i) {
        if (width < 864) await activate(".mobile-navigation > summary");
        await activate(`${prefix("product")} > summary`);
      }
      await activate(
        `#${width < 864 ? "mobile" : "desktop"}-product-interface`,
      );
      await waitFor("location.hash==='#interface'");
      await is(
        "document.activeElement.id==='interface' && !document.querySelector('.site-header details[open]')",
      );
      const position = await evaluate(
        "({top:document.querySelector('#interface').getBoundingClientRect().top,header:document.querySelector('.site-header').getBoundingClientRect().bottom,sticky:getComputedStyle(document.querySelector('.site-header')).position==='sticky'})",
      );
      assert.ok(
        position.top >= (position.sticky ? position.header : 0),
        JSON.stringify(position),
      );
    }
  }
  checks.push(
    "H1-T10/T11/T12/T13/T14: mouse, toque sintetizado, Enter/Space, peers, Escape, Tab/Shift+Tab, seleção modificada e âncora repetida",
  );
  globalThis.console.log(
    "Contratos de interação aprovados nas duas composições.",
  );
  // Resize com foco ocultado, rádio, controles persistentes e conteúdo.
  await viewport(1366);
  await navigate();
  await activate(`${desktop("docs")} > summary`);
  await key("Tab");
  await viewport(375);
  await is(
    "document.activeElement.matches('.mobile-navigation > summary') && !document.querySelector('.site-header details[open]')",
  );
  await activate(".mobile-navigation > summary");
  await activate(`${mobile("docs")} > summary`);
  await key("Tab");
  await viewport(1366);
  await is(
    "document.activeElement.id==='desktop-docs-trigger' && !document.querySelector('.site-header details[open]')",
  );
  await viewport(375);
  await activate(".mobile-navigation > summary");
  await viewport(1366);
  await is("document.activeElement.id==='desktop-product-trigger'");
  await activate(".appearance > summary");
  await key("Tab");
  await viewport(375);
  await is(
    "document.activeElement.matches('.appearance > summary') && !document.querySelector('.appearance').open",
  );
  await evaluate("document.querySelector('.brand').focus()");
  await viewport(1366);
  await is("document.activeElement.matches('.brand')");
  await activate(`${desktop("product")} > summary`);
  await viewport(1024);
  await is(
    "document.querySelector('.desktop-links .hud-group').open && document.activeElement.id==='desktop-product-trigger'",
  );
  await viewport(1366);
  await reset();
  await evaluate("scrollTo({top:1200,behavior:'instant'})");
  await activate(`${desktop("docs")} > summary`);
  await key("Tab");
  await viewport(375);
  await is(
    "document.activeElement.matches('.mobile-navigation > summary') && document.activeElement.getBoundingClientRect().top>=0 && document.activeElement.getBoundingClientRect().bottom<=innerHeight",
  );
  checks.push(
    "H1-T15: troca de instância e passagem intermediária com mapa de foco",
  );

  const pages = [
    "",
    "documentacao/",
    "manual/",
    "aprender/ide/instalar/",
    "colabore/",
    "atualizacoes/",
    "404.html",
  ];
  for (const page of pages) {
    await navigate(page);
    await evaluate("document.fonts.ready");
    for (const theme of ["dark", "light", "warm"])
      for (const textSize of ["", "200%"])
        for (const width of widths) {
          await reset();
          await evaluate(
            `document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.style.fontSize=${JSON.stringify(textSize)}`,
          );
          await viewport(width);
          const metrics = await evaluate(
            "({mobile:getComputedStyle(document.querySelector('.desktop-links')).display==='none',overflow:document.documentElement.scrollWidth>innerWidth,height:document.querySelector('.site-header').getBoundingClientRect().height,navs:[...document.querySelectorAll('.primary-nav')].filter(n=>n.checkVisibility()).length,targets:[...document.querySelectorAll('.brand,.header-download,.appearance > summary,.desktop-links summary,.mobile-navigation > summary')].filter(n=>n.getBoundingClientRect().width>0).every(n=>n.getBoundingClientRect().height>=44)})",
          );
          assert.ok(
            !metrics.overflow &&
              metrics.navs === (metrics.mobile ? 0 : 1) &&
              metrics.targets,
            JSON.stringify({ page, theme, textSize, width, metrics }),
          );
          const prefix = metrics.mobile ? mobile : desktop;
          if (metrics.mobile)
            await activate(".mobile-navigation > summary", "Enter");
          for (const id of groupIds) {
            await activate(`${prefix(id)} > summary`, "Enter");
            const result = await evaluate(
              `(()=>{const p=document.querySelector(${JSON.stringify(prefix(id))});return [...p.querySelectorAll('a')].every(a=>{const r=a.getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth&&r.height>=44})&&document.documentElement.scrollWidth<=innerWidth})()`,
            );
            assert.ok(
              result,
              `Painel ${page}/${theme}/${textSize}/${width}/${id}`,
            );
          }
          matrix.push({
            page: page || "home",
            theme,
            textSize: textSize || "100%",
            width,
            ...metrics,
          });
          if (!textSize && page === "" && theme === "dark") {
            await reset();
            await writeFile(
              `${output}/hud-${width}.png`,
              await browser.screenshot(),
            );
            if (width <= 864) await activate(".mobile-navigation > summary");
            await activate(`${prefix("docs")} > summary`);
            await writeFile(
              `${output}/hud-open-${width}.png`,
              await browser.screenshot(),
            );
          }
        }
  }
  globalThis.console.log(
    "Matriz: 252 cenários e 1008 aberturas de grupo aprovados.",
  );
  // Fronteiras e pouca altura; último link continua rolável/alcançável.
  await navigate();
  for (const width of [929, 930, 931, 1199, 1200, 1201]) {
    await viewport(width, 360);
    await reset();
    const compact = await evaluate(
      "getComputedStyle(document.querySelector('.desktop-links')).display==='none'",
    );
    const prefix = compact ? mobile : desktop;
    if (compact) await activate(".mobile-navigation > summary");
    await activate(`${prefix("community")} > summary`);
    await evaluate(
      `document.querySelector(${JSON.stringify(`${prefix("community")} li:last-child a`)}).focus()`,
    );
    await is(
      "document.activeElement.getBoundingClientRect().bottom<=innerHeight && document.activeElement.getBoundingClientRect().top>=0 && document.documentElement.scrollWidth<=innerWidth",
    );
  }
  checks.push(
    "H1-T17/T18: 252 cenários, seis larguras, 200% texto, três temas, painéis, fronteiras e paisagem",
  );
  const offsets = [];
  for (const [route, target, sidebar] of [
    ["documentacao/", "referencias", ".docs-sidebar"],
    ["manual/", "3-editor", ".manual-sidebar"],
  ])
    for (const width of widths)
      for (const size of ["", "200%"]) {
        await viewport(width);
        await navigate(route);
        await evaluate(
          `document.documentElement.style.fontSize=${JSON.stringify(size)}`,
        );
        await frame();
        await evaluate(
          `document.getElementById(${JSON.stringify(target)}).scrollIntoView({behavior:'instant',block:'start'})`,
        );
        await frame();
        const geometry = await evaluate(
          `(()=>{const sticky=getComputedStyle(document.querySelector('.site-header')).position==='sticky';const index=document.querySelector(${JSON.stringify(sidebar)}).getBoundingClientRect();return {mode:document.documentElement.dataset.hudLayout,sticky,header:document.querySelector('.site-header').getBoundingClientRect().bottom,indexTop:index.top,indexBottom:index.bottom,target:document.getElementById(${JSON.stringify(target)}).getBoundingClientRect().top};})()`,
        );
        assert.ok(
          geometry.target >= (geometry.sticky ? geometry.header : 0),
          JSON.stringify({ route, width, size, ...geometry }),
        );
        if (geometry.sticky)
          assert.ok(
            geometry.indexTop >= geometry.header,
            JSON.stringify(geometry),
          );
        offsets.push({ route, width, size: size || "100%", ...geometry });
      }
  await writeFile(`${output}/offsets.json`, JSON.stringify(offsets, null, 2));
  checks.push(
    "H1-T04/T17/T18: âncoras e índices reais livres da HUD em 24 cenários de tamanho/texto",
  );
  // Fallback sem JS desde a chegada. Aparência depende de inicialização real.
  scriptsDisabled = true;
  await send("Emulation.setScriptExecutionDisabled", { value: true });
  for (const width of [375, 1366]) {
    await viewport(width);
    await send("Page.navigate", { url: browser.base });
    await waitFor(
      "document.readyState==='complete' && location.hash==='' && !document.documentElement.dataset.enhanced",
    );
    const compact = await evaluate(
      "getComputedStyle(document.querySelector('.desktop-links')).display==='none'",
    );
    const prefix = compact ? mobile : desktop;
    if (compact) await activate(".mobile-navigation > summary", "Enter");
    for (const id of groupIds) {
      await activate(`${prefix(id)} > summary`, "Enter");
      await is(
        `document.querySelector(${JSON.stringify(prefix(id))}).open && [...document.querySelectorAll(${JSON.stringify(`${prefix(id)} a`)})].every(a=>a.getBoundingClientRect().width>0)`,
      );
    }
    await is(
      "getComputedStyle(document.querySelector('.appearance')).visibility==='hidden' && !document.querySelector('[data-search-trigger],[data-locale-switcher]')",
    );
    // O fallback permite peers abertos; fechá-los manualmente antes de
    // selecionar evita sobrepor os painéis nativos no desktop sem JS.
    for (const id of ["docs", "community", "updates"])
      await activate(`${prefix(id)} > summary`, "Enter");
    await activate(
      `#${compact ? "mobile" : "desktop"}-product-interface`,
      "Enter",
    );
    await waitFor("location.hash==='#interface'");
  }
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  scriptsDisabled = false;
  checks.push(
    "H1-T16: grupos, âncora e CTA nativos sem JS; aparência inoperante oculta",
  );
  const disabledNavigation = await send(
    "Page.addScriptToEvaluateOnNewDocument",
    {
      source:
        "const originalQuery=Document.prototype.querySelector;Document.prototype.querySelector=function(selector){if(selector==='.site-header'){Document.prototype.querySelector=originalQuery;return null;}return originalQuery.call(this,selector);};",
    },
  );
  await viewport(375);
  await navigate("documentacao/");
  await activate(".mobile-navigation > summary", "Enter");
  for (const id of ["product", "docs"])
    await activate(`${mobile(id)} > summary`, "Enter");
  await is(
    "document.querySelectorAll('.mobile-links details[open]').length===2 && getComputedStyle(document.querySelector('.appearance')).visibility==='visible' && !document.documentElement.dataset.hudLayout",
  );
  await send("Page.removeScriptToEvaluateOnNewDocument", {
    identifier: disabledNavigation.identifier,
  });
  checks.push(
    "H1-T16: falha isolada da inicialização de navegação; destinos nativos e tema continuam disponíveis",
  );
  assert.deepEqual(browser.errors, [], JSON.stringify(browser.errors));
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(
      {
        checks,
        matrix,
        errors: browser.errors,
        limits: [
          "Toque sintetizado, sem dispositivo físico",
          "Zoom real e leitor de tela registrados separadamente",
        ],
      },
      null,
      2,
    ) + "\n",
  );
  for (const check of checks) globalThis.console.log(check);
} finally {
  await browser.close();
}
