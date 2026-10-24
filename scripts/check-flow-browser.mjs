import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser({ desktopPointer: true });
const { send, evaluate, navigate } = browser;
const output = "test-results/browser";
await mkdir(output, { recursive: true });
async function waitFor(expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await delay(50);
  }
  assert.fail(expression);
}
async function motion(reduce) {
  await send("Emulation.setEmulatedMedia", {
    features: [
      {
        name: "prefers-reduced-motion",
        value: reduce ? "reduce" : "no-preference",
      },
    ],
  });
  await evaluate(
    "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
  );
}
async function viewport(width) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
try {
  await send("Emulation.setFocusEmulationEnabled", { enabled: true });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source:
      "const originalFetch=window.fetch.bind(window);window.fetch=(input,options)=>String(input).startsWith('https://api.github.com/')?Promise.resolve(new Response('[]',{headers:{'Content-Type':'application/json'}})):originalFetch(input,options);",
  });
  await viewport(1440);
  await motion(true);
  await navigate();
  assert.ok(
    await evaluate(
      "document.querySelectorAll('.flow-lines').length===document.querySelectorAll('.home-topic').length && !document.querySelector('.hero .flow-field') && !document.querySelector('.ocean-canvas')",
    ),
  );
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('.flow-field')].every(field=>field.getAttribute('aria-hidden')==='true' && getComputedStyle(field).pointerEvents==='none')",
    ),
  );
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('.flow-lines')].every(field=>field.animationsPaused())",
    ),
  );
  await evaluate(
    "document.querySelector('.journey').scrollIntoView({behavior:'instant',block:'start'})",
  );
  await motion(false);
  await waitFor(
    "document.querySelector('.flow-field-intro .flow-lines').hasAttribute('data-flow-running')",
  );
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('animateMotion')].every(motion=>motion.getAttribute('calcMode')==='paced' && parseFloat(motion.getAttribute('dur'))>=30 && motion.getAttribute('repeatCount')==='indefinite')",
    ),
    "O fluxo precisa ser lento e contínuo",
  );
  await evaluate(
    "window.__field=document.querySelector('.flow-lines');window.__vector=window.__field.querySelector('.flow-pulse');window.__flowTime=window.__field.getCurrentTime();window.__flowX=window.__vector.getCTM().e",
  );
  await delay(250);
  assert.ok(
    await evaluate(
      "window.__field.getCurrentTime()>window.__flowTime && window.__vector.getCTM().e!==window.__flowX",
    ),
  );
  await writeFile(
    `${output}/fluxo-inicio-1440.png`,
    await browser.screenshot(),
  );

  await evaluate(
    "document.querySelector('.home-topic:last-child').scrollIntoView({behavior:'instant'})",
  );
  await waitFor("window.__field.animationsPaused()");
  await evaluate(
    "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
  );
  await evaluate("window.__flowTime=window.__field.getCurrentTime()");
  await delay(200);
  assert.ok(
    await evaluate(
      "Math.abs(window.__field.getCurrentTime()-window.__flowTime)<0.0005",
    ),
    "O fluxo fora da tela precisa pausar",
  );
  await evaluate(
    "document.querySelector('.journey').scrollIntoView({behavior:'instant',block:'start'})",
  );
  await waitFor("!window.__field.animationsPaused()");
  await delay(150);
  assert.ok(
    await evaluate(
      "window.__field.getCurrentTime()>window.__flowTime && window.__field.getCurrentTime()-window.__flowTime<0.5",
    ),
    "Retomada sem salto de fase",
  );
  await evaluate(
    "Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))",
  );
  await waitFor("document.querySelectorAll('[data-flow-running]').length===0");
  await evaluate(
    "delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))",
  );
  await waitFor(
    "document.querySelector('.flow-field-intro .flow-lines').hasAttribute('data-flow-running')",
  );

  await motion(true);
  for (const width of [320, 768, 1440]) {
    await viewport(width);
    for (const size of ["", "200%"]) {
      await evaluate(
        `document.documentElement.style.fontSize=${JSON.stringify(size)}`,
      );
      await waitFor(
        "(()=>{const svg=document.querySelector('.flow-lines'),box=svg.getBoundingClientRect();return Math.abs(svg.viewBox.baseVal.width-box.width)<0.1 && Math.abs(svg.viewBox.baseVal.height-box.height)<0.1})()",
      );
      assert.ok(
        await evaluate(
          "(()=>{const glyph=document.querySelector('.flow-pulse path').getBBox();return glyph.width===24 && glyph.height===0})()",
        ),
        "O trecho de luz precisa manter o tamanho nas diferentes larguras",
      );
      assert.ok(
        await evaluate("document.documentElement.scrollWidth<=innerWidth"),
        `Overflow: ${width}/${size}`,
      );
      assert.ok(
        await evaluate(
          "(()=>{const field=document.querySelector('.flow-field-intro'),lines=field.querySelector('svg'),box=lines.getBoundingClientRect(),nav=document.querySelector('.journey').getBoundingClientRect(),copy=document.querySelector('#estado .section-intro').getBoundingClientRect();return field.getBoundingClientRect().height===0 && box.top+box.height*.25>=nav.bottom-1 && box.top+box.height*.85<=copy.top+1})()",
        ),
        `Fluxo deve ficar no intervalo entre atalhos e texto: ${width}/${size}`,
      );
    }
    await evaluate(
      "document.documentElement.style.fontSize='';document.querySelector('.journey').scrollIntoView({behavior:'instant',block:'start'})",
    );
    if (width !== 1440) {
      await motion(false);
      await writeFile(
        `${output}/fluxo-inicio-${width}.png`,
        await browser.screenshot(),
      );
      await motion(true);
    }
  }
  for (const theme of ["dark", "light", "warm"]) {
    for (const accent of ["amber", "blue", "teal"]) {
      await evaluate(
        `document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.dataset.accent=${JSON.stringify(accent)}`,
      );
      assert.ok(
        await evaluate(
          "(()=>{const path=document.querySelector('.flow-pulse');return getComputedStyle(path).stroke!=='none' && getComputedStyle(path).strokeWidth==='1.75px'})()",
        ),
      );
    }
  }
  await evaluate(
    "document.documentElement.dataset.theme='light';document.documentElement.dataset.accent='amber'",
  );
  await writeFile(
    `${output}/fluxo-inicio-claro-1440.png`,
    await browser.screenshot(),
  );
  await evaluate("document.documentElement.dataset.theme='dark'");

  await motion(false);
  await evaluate(
    "document.querySelector('#gallery-preview-tab').scrollIntoView({behavior:'instant',block:'center'})",
  );
  const hover = await evaluate(
    "(()=>{const box=document.querySelector('#gallery-preview-tab').getBoundingClientRect();return{x:box.left+box.width/2,y:box.top+box.height/2}})()",
  );
  await send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: hover.x,
    y: hover.y,
  });
  await delay(100);
  assert.ok(
    await evaluate("!document.querySelector('.vector-feedback')"),
    "O hover não deve disparar a repulsão",
  );
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 0, y: 0 });
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: hover.x,
    y: hover.y,
    button: "left",
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: hover.x,
    y: hover.y,
    button: "left",
    clickCount: 1,
  });
  await waitFor("Boolean(document.querySelector('.vector-feedback'))");
  assert.ok(
    await evaluate(
      `(()=>{const svg=document.querySelector('.vector-feedback');return Math.abs(Number(svg.dataset.originX)-${String(hover.x)})<1 && Math.abs(Number(svg.dataset.originY)-${String(hover.y)})<1})()`,
    ),
    "A repulsão deve nascer no ponto clicado",
  );
  await evaluate(
    "window.__repulsion=document.querySelector('.vector-feedback');window.__radii=[...window.__repulsion.querySelectorAll('.repulsion-vector')].map((vector,i)=>{const m=vector.getCTM(),x=m.e-Number(window.__repulsion.dataset.originX),y=m.f-Number(window.__repulsion.dataset.originY);return {r:Math.hypot(x,y),dot:x*Math.cos(i*Math.PI/4)+y*Math.sin(i*Math.PI/4),cross:x*Math.sin(i*Math.PI/4)-y*Math.cos(i*Math.PI/4)}})",
  );
  assert.ok(
    await evaluate(
      "window.__radii.length===8 && window.__radii.every(vector=>vector.dot>9 && Math.abs(vector.cross)<0.5)",
    ),
    "As oito setas devem apontar para fora do clique",
  );
  await delay(100);
  assert.ok(
    await evaluate(
      "[...window.__repulsion.querySelectorAll('.repulsion-vector')].every((vector,i)=>Math.hypot(vector.getCTM().e-Number(window.__repulsion.dataset.originX),vector.getCTM().f-Number(window.__repulsion.dataset.originY))>window.__radii[i].r+1)",
    ),
    "As setas devem se afastar, e não apenas aparecer",
  );
  await writeFile(
    `${output}/repulsao-clique-1440.png`,
    await browser.screenshot(),
  );
  await waitFor("!document.querySelector('.vector-feedback')");
  await evaluate(
    "document.querySelector('#gallery-preview-tab').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('#gallery-preview-tab').focus()",
  );
  await evaluate(
    "window.__buttonBox=document.querySelector('#gallery-preview-tab').getBoundingClientRect().toJSON()",
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    text: "\r",
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13,
  });
  await waitFor("Boolean(document.querySelector('.vector-feedback'))");
  assert.ok(
    await evaluate(
      "document.querySelector('#gallery-preview-tab').getAttribute('aria-selected')==='true' && document.activeElement.id==='gallery-preview-tab'",
    ),
    "Teclado e seleção devem funcionar normalmente",
  );
  assert.ok(
    await evaluate(
      "(()=>{const svg=document.querySelector('.vector-feedback'),arrows=[...svg.querySelectorAll('.repulsion-vector')],box=document.querySelector('#gallery-preview-tab').getBoundingClientRect();return svg.getAttribute('aria-hidden')==='true' && getComputedStyle(svg).pointerEvents==='none' && arrows.length===8 && arrows.every(arrow=>arrow.getAnimations()[0].effect.getTiming().duration<=800) && Math.abs(Number(svg.dataset.originX)-(box.left+box.width/2))<1 && Math.abs(box.width-window.__buttonBox.width)<1 && Math.abs(box.height-window.__buttonBox.height)<1})()",
    ),
  );
  await delay(120);
  await writeFile(
    `${output}/fluxo-resposta-botao-1440.png`,
    await browser.screenshot(),
  );
  await waitFor("!document.querySelector('.vector-feedback')");
  await evaluate(
    "document.querySelector('#gallery-preview-tab').click();document.querySelector('#gallery-preview-tab').click();document.querySelector('#gallery-preview-tab').click()",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.vector-feedback').length"),
    1,
    "Cliques rápidos não podem acumular efeitos",
  );
  await motion(true);
  assert.ok(
    await evaluate(
      "!document.querySelector('.vector-feedback') && [...document.querySelectorAll('.flow-lines')].every(field=>field.animationsPaused())",
    ),
  );
  await evaluate("document.querySelector('#gallery-beta-tab').click()");
  assert.ok(
    await evaluate(
      "!document.querySelector('.vector-feedback') && document.querySelector('#gallery-beta-tab').getAttribute('aria-selected')==='true'",
    ),
  );
  await motion(false);
  await evaluate(
    "document.querySelector('.hero-actions .button-quiet').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('.hero-actions .button-quiet').click()",
  );
  await waitFor("location.hash==='#desenvolvimento'");
  assert.ok(
    await evaluate("Boolean(document.querySelector('.vector-feedback'))"),
    "O efeito não pode impedir a navegação por âncora",
  );
  // O efeito acompanha o clique sem impedir o link nem a transição nativa.
  await evaluate(
    "[...document.querySelectorAll('a.button')].find(link=>new URL(link.href).pathname.endsWith('/colabore/')).click()",
  );
  await waitFor(
    "location.pathname.endsWith('/colabore/') && document.documentElement.dataset.enhanced==='true' && document.readyState==='complete'",
  );
  assert.equal(
    await evaluate(
      "document.querySelectorAll('.page-background .flow-lines').length",
    ),
    2,
  );
  await waitFor("document.querySelector('[data-task-refresh]').disabled");
  await evaluate(
    "document.querySelector('[data-task-refresh]').dispatchEvent(new MouseEvent('click',{bubbles:true}))",
  );
  assert.ok(await evaluate("!document.querySelector('.vector-feedback')"));

  await send("Emulation.setScriptExecutionDisabled", { value: true });
  await send("Page.navigate", { url: browser.base });
  await waitFor(
    "location.pathname.endsWith('/KineinSite/') && document.readyState==='complete' && Boolean(document.querySelector('.flow-lines'))",
  );
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await delay(100);
  assert.ok(
    await evaluate(
      "document.querySelectorAll('.flow-lines').length===8 && document.querySelectorAll('[data-flow-running]').length===0 && [...document.querySelectorAll('.flow-track')].every(path=>getComputedStyle(path).stroke!=='none') && [...document.querySelectorAll('.flow-pulse')].every(vector=>getComputedStyle(vector).opacity==='0')",
    ),
    "O fundo deve permanecer legível e estático sem JavaScript",
  );
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
  await writeFile(
    `${output}/flow-report.json`,
    JSON.stringify(
      {
        checks: [
          "SVG estático presente sem JavaScript",
          "Trajetos lentos com velocidade linear",
          "Pausa fora da tela e com página oculta",
          "Retomada sem salto",
          "Três larguras e texto a 200%",
          "Fluxo no espaço livre antes da seção",
          "Nove paletas explícitas",
          "Repulsão com oito setas e origem no controle ao usar teclado",
          "Duração e tamanho do controle preservados",
          "Limpeza após cliques rápidos",
          "Movimento reduzido durante a animação",
          "Navegação real e controle desabilitado",
        ],
        errors: browser.errors,
      },
      null,
      2,
    ),
  );
  globalThis.console.log(
    "Fluxo: fundo, pausa, responsividade, temas, resposta aos botões, teclado e movimento reduzido aprovados.",
  );
} finally {
  await browser.close();
}
