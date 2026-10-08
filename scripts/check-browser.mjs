const { console } = globalThis;
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser();
const { send, evaluate, navigate } = browser;
const output = "test-results/browser";
await mkdir(output, { recursive: true });
const report = [];
async function media(reduced = false, color = "dark") {
  await send("Emulation.setEmulatedMedia", {
    features: [
      {
        name: "prefers-reduced-motion",
        value: reduced ? "reduce" : "no-preference",
      },
      { name: "prefers-color-scheme", value: color },
    ],
  });
  await evaluate(
    "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
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
try {
  await media();
  await viewport(1440);
  await navigate();
  // Duas transições reais sobrepostas: a finalização da primeira não pode
  // limpar a marca da segunda nem trocar a animação por page-in.
  const rapid = await evaluate(`(async () => {
    const start = document.startViewTransition.bind(document);
    const transitions = [];
    document.startViewTransition = (callback) => { const t = start(callback); transitions.push(t); return t; };
    const change = (value) => { const input = document.querySelector('input[name="theme"][value="'+value+'"]'); input.checked = true; input.dispatchEvent(new Event('change')); };
    change('light'); await transitions[0].ready;
    await new Promise(resolve => setTimeout(resolve,80));
    change('warm'); await transitions[1].ready;
    const marker = document.documentElement.dataset.switching;
    const names = document.getAnimations().map(animation=>animation.animationName);
    await transitions[1].finished;
    document.startViewTransition = start;
    return { marker, names, theme: document.documentElement.dataset.theme, cleaned: !document.documentElement.dataset.switching };
  })()`);
  assert.equal(rapid.marker, "theme");
  assert.ok(rapid.names.includes("theme-in"));
  assert.ok(!rapid.names.includes("page-in"));
  assert.equal(rapid.theme, "warm");
  assert.ok(rapid.cleaned);
  report.push("Troca rápida de tema: transições e limpeza corretas.");
  for (const theme of ["dark", "light", "warm", "system"]) {
    for (const accent of ["amber", "blue", "teal"]) {
      await evaluate(
        `(() => { for(const [name,value] of [['theme','${theme}'],['accent','${accent}']]) {const input=document.querySelector('input[name="'+name+'"][value="'+value+'"]'); input.checked=true; input.dispatchEvent(new Event('change'));} })()`,
      );
      await delay(500);
      assert.ok(
        await evaluate(
          `(() => {const page=getComputedStyle(document.documentElement).getPropertyValue('--page').trim(); return [...document.querySelectorAll('meta[name="theme-color"]')].every(meta=>meta.content===page);})()`,
        ),
      );
    }
  }
  await media(false, "light");
  assert.ok(
    await evaluate(
      `(()=>{const page=getComputedStyle(document.documentElement).getPropertyValue('--page').trim();return [...document.querySelectorAll('meta[name="theme-color"]')].every(meta=>meta.content===page);})()`,
    ),
  );
  report.push(
    "12 paletas e mudança do sistema: cor da barra do navegador sincronizada.",
  );
  await navigate();
  const gallery = await evaluate(
    `(() => {const frames=[...document.querySelectorAll('.ide-preview-frame')]; const tabs=frames[0].querySelectorAll('.ide-tab');tabs[0].focus();tabs[0].dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true})); return {count:frames.length,selected:tabs[1].getAttribute('aria-selected'),focus:document.activeElement.id,other:frames[1].querySelector('.ide-tab').getAttribute('aria-selected'),panels:[...frames[0].querySelectorAll('.ide-shot')].map(p=>p.hidden)};})()`,
  );
  assert.equal(gallery.count, 2);
  assert.equal(gallery.selected, "true");
  assert.equal(gallery.other, "true");
  assert.deepEqual(gallery.panels, [true, false]);
  assert.ok(gallery.focus.endsWith("ambiente"));
  report.push(
    "Galerias independentes: navegação por teclado e painéis corretos.",
  );
  for (const route of [
    "",
    "documentacao/",
    "documentacao/previa-0-4/",
    "aprender/",
    "estudos/c/primeiros-passos/",
    "estudos/cpp/primeiros-passos/",
    "estudos/rust/primeiros-passos/",
    "estudos/python/primeiros-passos/",
  ]) {
    await navigate(route);
    for (const width of [320, 768, 1440]) {
      await viewport(width);
      assert.ok(
        await evaluate("document.documentElement.scrollWidth <= innerWidth"),
        `Overflow: ${route} ${width}`,
      );
      const count = await evaluate(
        "document.getAnimations().filter(a=>a.animationName==='wave-sway').length",
      );
      assert.equal(count, route === "" ? 14 : 2);
    }
  }
  report.push("8 páginas, 3 larguras: sem overflow; ondas em funcionamento.");
  await navigate();
  assert.ok(
    await evaluate(
      `(()=>{const hero=document.querySelector('.hero');const flow=document.querySelector('.home-flow'); return !hero.querySelector('.wave-field') && Math.abs(hero.getBoundingClientRect().bottom-flow.getBoundingClientRect().top)<1;})()`,
    ),
  );
  // Paint order mede a composição real do navegador, incluindo os pseudos.
  for (const width of [320, 768, 1440]) {
    await viewport(width);
    const snapshot = await send("DOMSnapshot.captureSnapshot", {
      computedStyles: [],
      includePaintOrder: true,
    });
    const { nodes, layout } = snapshot.documents[0];
    const strings = snapshot.strings;
    const topics = new Set();
    nodes.attributes.forEach((attrs, index) => {
      for (let i = 0; i < attrs.length; i += 2)
        if (
          strings[attrs[i]] === "class" &&
          strings[attrs[i + 1]].split(/\s+/).includes("home-topic")
        )
          topics.add(index);
    });
    const waves = [],
      content = [];
    layout.nodeIndex.forEach((node, index) => {
      let ancestor = node;
      let topic = -1;
      while (ancestor >= 0) {
        if (topics.has(ancestor)) {
          topic = ancestor;
          break;
        }
        ancestor = nodes.parentIndex[ancestor];
      }
      if (topic < 0) return;
      if (
        nodes.pseudoType?.index.includes(node) &&
        nodes.parentIndex[node] === topic
      )
        waves.push(layout.paintOrders[index]);
      else if (node !== topic) content.push(layout.paintOrders[index]);
    });
    assert.ok(waves.length > 0 && content.length > 0);
    assert.ok(
      Math.max(...waves) < Math.min(...content),
      `Ondas sobre o conteúdo: ${width}`,
    );
  }
  report.push(
    "Ondas abaixo de todo o conteúdo; limite inferior do hero preservado.",
  );
  await evaluate("document.querySelector('.appearance summary').focus()");
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
  assert.ok(await evaluate("document.querySelector('.appearance').open"));
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
  });
  assert.ok(
    await evaluate(
      "!document.querySelector('.appearance').open && document.activeElement.matches('.appearance summary')",
    ),
  );
  report.push(
    "Aparência por teclado: Enter abre, Escape fecha e devolve o foco.",
  );
  await media(true);
  await navigate();
  assert.equal(
    await evaluate(
      "document.getAnimations().filter(a=>a.animationName==='wave-sway').length",
    ),
    0,
  );
  await evaluate(
    `(()=>{const input=document.querySelector('input[name="theme"][value="dark"]');input.checked=true;input.dispatchEvent(new Event('change'));})()`,
  );
  assert.ok(
    await evaluate(
      "document.getAnimations().every(animation => animation.effect.getTiming().duration <= 1)",
    ),
  );
  assert.ok(
    await evaluate(
      "!document.documentElement.dataset.switching && document.documentElement.dataset.theme === 'dark'",
    ),
  );
  report.push("Movimento reduzido: ondas estáticas e troca de tema imediata.");
  await navigate("documentacao/previa-0-4/");
  const video = await evaluate(
    `(async()=>{const v=document.querySelector('video');v.load();await new Promise((resolve,reject)=>{v.addEventListener('loadeddata',resolve,{once:true});v.addEventListener('error',()=>reject(new Error('Falha no vídeo')),{once:true});});return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,controls:v.controls,autoplay:v.autoplay,preload:v.preload,track:!!v.querySelector('track[default]')};})()`,
  );
  assert.equal(video.duration, 42);
  assert.equal(video.width, 1600);
  assert.equal(video.height, 1000);
  assert.ok(video.controls && !video.autoplay && video.track);
  assert.equal(video.preload, "none");
  report.push(
    "Vídeo decodificado: 42 s, 1600×1000, legendas, controles, sem autoplay.",
  );
  await navigate("estudos/c/primeiros-passos/");
  await send("Emulation.setFocusEmulationEnabled", { enabled: true });
  await send("Browser.grantPermissions", {
    origin: new globalThis.URL(browser.base).origin,
    permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
  });
  const copied = await evaluate(
    `(async()=>{const code=document.querySelector('.prose pre code').textContent;document.querySelector('.code-copy').click();await new Promise(resolve=>setTimeout(resolve,100));return {expected:code,actual:await navigator.clipboard.readText(),message:document.querySelector('[aria-live="polite"]').textContent};})()`,
  );
  assert.equal(copied.actual, copied.expected);
  assert.equal(copied.message, "Código copiado.");
  report.push(
    "Código copiado integralmente e resultado anunciado ao leitor de tela.",
  );
  await viewport(1440);
  await navigate();
  const mediaFiles = await evaluate(
    `(async()=>{const result=[];for(const video of document.querySelectorAll('video')){video.load();await new Promise((resolve,reject)=>{video.addEventListener('loadeddata',resolve,{once:true});video.addEventListener('error',()=>reject(new Error('Vídeo não carregou')),{once:true});});result.push(video.duration);}return result;})()`,
  );
  assert.deepEqual(mediaFiles, [42, 24]);
  report.push(
    "As duas gravações locais decodificam corretamente na página inicial.",
  );
  await evaluate("scrollTo(0,0)");
  await writeFile(`${output}/hero.png`, await browser.screenshot());
  await evaluate(
    "document.querySelector('#desenvolvimento .ide-preview-frame').scrollIntoView()",
  );
  await evaluate(
    "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
  );
  const imageReady = await evaluate(
    `(async()=>{const image=document.querySelector('#desenvolvimento .ide-shot:not([hidden]) img');await image.decode();return image.complete && image.naturalWidth>0;})()`,
  );
  assert.ok(imageReady, "Captura da prévia deve carregar e decodificar");
  await writeFile(`${output}/gallery.png`, await browser.screenshot());
  await evaluate("document.querySelector('#desenvolvimento').scrollIntoView()");
  await writeFile(`${output}/desenvolvimento.png`, await browser.screenshot());
  await viewport(320);
  await evaluate("document.querySelector('#desenvolvimento').scrollIntoView()");
  await writeFile(`${output}/mobile.png`, await browser.screenshot());
  assert.deepEqual(browser.errors, [], "Erros de console/CSP");
  for (const line of report) console.info(line);
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
