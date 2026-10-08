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
async function viewport(width, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
async function waitFor(expression, message) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await delay(50);
  }
  assert.fail(message);
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
  const versions = await evaluate(`(() => {
    const tab = document.querySelector('#gallery-preview-tab');
    tab.focus(); tab.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}));
    return {selected: document.querySelector('#gallery-beta-tab').getAttribute('aria-selected'),hidden:document.querySelector('#gallery-preview').hidden,inner:document.querySelector('#preview-tab-ambiente').getAttribute('aria-selected'),focus:document.activeElement.id};
  })()`);
  assert.equal(versions.selected, "true");
  assert.ok(versions.hidden);
  assert.equal(versions.inner, "true");
  assert.equal(versions.focus, "gallery-beta-tab");
  report.push("Troca de versão nas capturas preserva as abas de cada galeria.");
  // Trocas interrompidas precisam manter somente o último painel acessível,
  // sem deixar a imagem de saída ou sua animação cobrindo os controles.
  const swapping = await evaluate(`(() => {
    const first=document.querySelector('#compare-preview-tab');
    const second=document.querySelector('#compare-beta-tab');
    second.click();
    const previous=document.querySelector('#compare-preview');
    const next=document.querySelector('#compare-beta');
    const result={hidden:previous.hidden,inert:previous.inert,leaving:previous.classList.contains('is-leaving'),entering:next.getAnimations().length>0};
    first.click();second.click();first.click();
    return result;
  })()`);
  assert.deepEqual(swapping, {
    hidden: true,
    inert: true,
    leaving: true,
    entering: true,
  });
  await delay(500);
  assert.ok(
    await evaluate(
      `document.querySelectorAll('.is-leaving').length===0 && !document.querySelector('#compare-preview').hidden && document.querySelector('#compare-beta').hidden`,
    ),
  );
  report.push(
    "Transição de painéis: saída sem interação, entrada suave e alternância rápida sem camadas pendentes.",
  );
  for (const route of [
    "",
    "documentacao/",
    "documentacao/site/",
    "documentacao/previa-0-4/",
    "manual/",
    "aprender/",
    "aprender/ide/instalar/",
    "aprender/ide/conhecer-a-tela/",
    "aprender/ide/busca-e-atalhos/",
    "aprender/ide/git/",
    "aprender/ide/quando-algo-da-errado/",
    "atualizacoes/",
    "atualizacoes/0-3-5/",
    "atualizacoes/0-2-0/",
    "404.html",
    "estudos/c/primeiros-passos/",
    "estudos/cpp/primeiros-passos/",
    "estudos/rust/primeiros-passos/",
    "estudos/python/primeiros-passos/",
    "aprender/ide/primeiro-projeto-cpp/",
    "aprender/ide/primeiro-projeto-rust/",
    "aprender/ide/primeiro-projeto-python/",
    "estudos/cpp/telemetria-local/",
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
  report.push("23 páginas, 3 larguras: sem overflow; ondas em funcionamento.");
  await media(true);
  for (const route of [
    "",
    "documentacao/",
    "documentacao/previa-0-4/",
    "manual/",
    "aprender/",
    "aprender/ide/busca-e-atalhos/",
    "estudos/cpp/primeiros-passos/",
    "atualizacoes/0-3-5/",
  ]) {
    await navigate(route);
    await evaluate("document.documentElement.style.fontSize='200%'");
    for (const width of [320, 768, 1440]) {
      await viewport(width);
      assert.ok(
        await evaluate("document.documentElement.scrollWidth <= innerWidth"),
        `Texto ampliado: ${route} ${width}`,
      );
      if (route === "") {
        assert.ok(
          await evaluate(
            `(() => {const copy=document.querySelector('.hero-copy').getBoundingClientRect();const layout=document.querySelector('.hero-layout').getBoundingClientRect();return copy.left>=layout.left-1 && copy.right<=layout.right+1;})()`,
          ),
          `Texto principal cortado: ${width}`,
        );
      }
    }
  }
  report.push("Texto ampliado a 200%: 8 páginas, 3 larguras sem overflow.");
  await media();
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
    `(async()=>{const v=document.querySelector('video');v.load();await new Promise((resolve,reject)=>{v.addEventListener('loadeddata',resolve,{once:true});v.addEventListener('error',()=>reject(new Error('Falha no vídeo')),{once:true});});return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,controls:v.controls,autoplay:v.autoplay,paused:v.paused,loop:v.loop,muted:v.muted,inline:v.playsInline,preload:v.preload,track:!!v.querySelector('track')};})()`,
  );
  assert.equal(video.duration, 42);
  assert.equal(video.width, 1600);
  assert.equal(video.height, 1000);
  assert.ok(video.controls && !video.autoplay && !video.track && video.paused);
  assert.ok(video.loop && video.muted && video.inline);
  assert.equal(video.preload, "metadata");
  report.push(
    "Vídeo decodificado: 42 s, 1600×1000, loop e controles; movimento reduzido impede autoplay.",
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
  await media();
  await navigate();
  await viewport(1366, 768);
  await evaluate(
    "document.querySelector('#compare-preview video').scrollIntoView({block:'center'})",
  );
  await waitFor(
    "!document.querySelector('#compare-preview video').paused && document.querySelector('#compare-preview video').currentTime > 0",
    "A prévia deve iniciar automaticamente ao aparecer",
  );
  assert.ok(
    await evaluate(
      "document.querySelector('#compare-preview video').muted && document.querySelector('#compare-beta video').paused",
    ),
  );
  await evaluate(
    "document.querySelector('#compare-preview video').currentTime = 41.8",
  );
  await waitFor(
    "document.querySelector('#compare-preview video').currentTime < 2 && !document.querySelector('#compare-preview video').paused",
    "O vídeo deve repetir ao chegar ao fim",
  );
  await evaluate(
    "document.querySelector('#compare-preview [data-demo-toggle]').click()",
  );
  await waitFor(
    "document.querySelector('#compare-preview video').paused",
    "Pausar deve interromper a reprodução",
  );
  await evaluate("scrollTo(0,0)");
  await delay(150);
  await evaluate(
    "document.querySelector('#compare-preview video').scrollIntoView({block:'center'})",
  );
  await delay(150);
  assert.ok(
    await evaluate("document.querySelector('#compare-preview video').paused"),
    "A pausa escolhida deve persistir ao rolar",
  );
  await evaluate(
    "document.querySelector('#compare-preview [data-demo-toggle]').click()",
  );
  await waitFor(
    "!document.querySelector('#compare-preview video').paused",
    "Reproduzir deve retomar o vídeo",
  );
  await evaluate(
    "document.querySelector('#compare-preview-tab').dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}))",
  );
  await waitFor(
    "document.querySelector('#compare-preview video').paused && !document.querySelector('#compare-beta video').paused",
    "Só a versão visível deve reproduzir",
  );
  await evaluate("scrollTo(0,0)");
  await waitFor(
    "[...document.querySelectorAll('video')].every(v=>v.paused)",
    "Vídeos fora da tela devem pausar",
  );
  report.push(
    "Vídeos: autoplay visível, loop, pausa persistente, alternância de versão e pausa fora da tela.",
  );

  for (const [route, next] of [
    ["aprender/ide/instalar/", "aprender/ide/primeiro-projeto-cpp/"],
    ["aprender/ide/primeiro-projeto-cpp/", "estudos/cpp/primeiros-passos/"],
    ["estudos/cpp/primeiros-passos/", "estudos/cpp/telemetria-local/"],
    ["aprender/ide/primeiro-projeto-rust/", "estudos/rust/primeiros-passos/"],
    [
      "aprender/ide/primeiro-projeto-python/",
      "estudos/python/primeiros-passos/",
    ],
  ]) {
    await navigate(route);
    assert.equal(
      await evaluate("document.querySelector('a[rel=next]').href"),
      new globalThis.URL(next, browser.base).href,
    );
  }
  report.push(
    "C++, Rust e Python: cada etapa leva à continuação do próprio projeto.",
  );
  await navigate();
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 900],
    [1366, 768],
    [1440, 900],
  ]) {
    await viewport(width, height);
    assert.ok(
      await evaluate(
        `(() => {const v=document.querySelector('#compare-preview video');const image=document.querySelector('#gallery-preview .ide-shot:not([hidden]) img');return [v,image].every(el=>{const r=el.getBoundingClientRect();return r.width <= innerWidth && r.height <= innerHeight * .65 + 1 && Math.abs(r.width/r.height-1.6)<.02;});})()`,
      ),
      `Proporção e tamanho da mídia: ${width}×${height}`,
    );
  }
  await viewport(390, 844);
  await evaluate(
    "document.querySelector('#gallery-preview .ide-shot:not([hidden]) [data-image-open]').click()",
  );
  await evaluate("document.querySelector('dialog[open] img').decode()");
  assert.ok(
    await evaluate(
      "document.querySelector('dialog[open]').classList.contains('is-zoomed') && document.querySelector('dialog[open] .ide-image-stage').scrollWidth > document.querySelector('dialog[open] .ide-image-stage').clientWidth",
    ),
  );
  await evaluate(
    "document.querySelector('dialog[open] [data-image-zoom]').click()",
  );
  assert.ok(
    await evaluate(
      "!document.querySelector('dialog[open]').classList.contains('is-zoomed')",
    ),
  );
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
    "!document.querySelector('dialog[open]') && document.activeElement.matches('[data-image-open]')",
    "Escape deve fechar a captura e devolver o foco",
  );
  report.push(
    "Mídias em 5 tamanhos: proporção preservada, altura limitada; captura amplia, ajusta e fecha por teclado.",
  );

  await navigate("aprender/ide/primeiro-projeto-cpp/");
  await evaluate("document.querySelector('.guide-image-open').click()");
  await evaluate("document.querySelector('dialog[open] img').decode()");
  assert.ok(
    await evaluate(
      "document.querySelector('dialog[open] img').naturalWidth > 0",
    ),
  );
  await evaluate("document.querySelector('dialog[open] form button').click()");
  await waitFor(
    "!document.querySelector('dialog[open]') && document.activeElement.matches('.guide-image-open')",
    "Fechar a captura do guia deve devolver o foco",
  );
  report.push(
    "As capturas dos tutoriais também podem ser ampliadas sem sair da lição.",
  );

  await media();
  await viewport(1366, 900);
  await navigate("manual/");
  assert.ok(
    await evaluate(
      `document.getElementById('2-o-layout').nextElementSibling.matches('.manual-layout') && !document.querySelector('.manual-article').textContent.includes('App Bar:')`,
    ),
    "O layout deve mostrar a captura real no lugar do desenho",
  );
  await evaluate(
    `document.querySelector('.manual-layout').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('.manual-layout img').decode()`,
  );
  assert.ok(
    await evaluate(
      `document.querySelector('.manual-layout img').naturalWidth > 0 && document.querySelector('.manual-layout img').srcset.includes('720w') && document.querySelector('.manual-layout .label').textContent.includes('0.3.5')`,
    ),
    "A captura do beta deve ter versões responsivas e decodificar",
  );
  await writeFile(
    `${output}/manual-layout-desktop.png`,
    await browser.screenshot(),
  );
  await evaluate(`document.querySelector('.manual-layout-open').click()`);
  await evaluate(
    `document.querySelector('.manual-layout dialog img').decode()`,
  );
  assert.ok(
    await evaluate(`document.querySelector('.manual-layout dialog').open`),
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await waitFor(
    `!document.querySelector('.manual-layout dialog').open && document.activeElement.matches('.manual-layout-open')`,
    "Escape deve fechar a captura do manual e devolver o foco",
  );
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
  assert.equal(
    await evaluate("document.querySelectorAll('[data-manual-chapter]').length"),
    12,
  );
  assert.ok(
    await evaluate(
      `document.querySelector('[data-manual-outline]').open && document.querySelectorAll('.manual-table-scroll').length===document.querySelectorAll('.manual-article table').length`,
    ),
  );
  await evaluate(
    `document.querySelector('#manual-search').value='git';document.querySelector('#manual-search').dispatchEvent(new Event('input'));`,
  );
  assert.ok(
    await evaluate(
      `document.querySelectorAll('[data-manual-chapter]:not([hidden])').length===1 && document.querySelector('[data-manual-chapter]:not([hidden]) details').open && [...document.querySelectorAll('[data-manual-topic]:not([hidden]) a')].some(a=>a.textContent.includes('Git'))`,
    ),
  );
  await evaluate(
    `document.querySelector('#manual-search').value='analise';document.querySelector('#manual-search').dispatchEvent(new Event('input'));`,
  );
  assert.equal(
    await evaluate(
      "document.querySelectorAll('[data-manual-chapter]:not([hidden])').length",
    ),
    1,
  );
  await evaluate(
    `document.querySelector('#manual-search').value='zzsemresultado';document.querySelector('#manual-search').dispatchEvent(new Event('input'));`,
  );
  assert.ok(
    await evaluate(
      `!document.querySelector('[data-manual-empty]').hidden && document.querySelector('[data-manual-results]').textContent.startsWith('0')`,
    ),
  );
  await evaluate(
    `document.querySelector('#manual-search').value='';document.querySelector('#manual-search').dispatchEvent(new Event('input'));`,
  );
  assert.equal(
    await evaluate(
      "document.querySelectorAll('[data-manual-chapter]:not([hidden])').length",
    ),
    12,
  );
  await evaluate(
    `Promise.allSettled(document.querySelector('.manual-header').getAnimations({subtree:true}).map(animation=>animation.finished))`,
  );
  await writeFile(`${output}/manual-desktop.png`, await browser.screenshot());
  await viewport(390, 844);
  await waitFor(
    "!document.querySelector('[data-manual-outline]').open",
    "Índice do manual deve recolher no celular",
  );
  await delay(250);
  await writeFile(`${output}/manual-mobile.png`, await browser.screenshot());
  await evaluate(
    `document.querySelector('[data-manual-outline] > summary').click();document.querySelector('#manual-search').value='git';document.querySelector('#manual-search').dispatchEvent(new Event('input'));`,
  );
  await delay(300);
  await evaluate(
    `document.querySelector('[data-manual-topic]:not([hidden]) a').click()`,
  );
  await waitFor(
    `!document.querySelector('[data-manual-outline]').open && document.activeElement.matches('h3') && document.querySelector('[data-section-nav] [aria-current="true"]')?.hash === '#'+document.activeElement.id`,
    "Escolher subseção deve fechar o índice, levar ao título e marcá-lo em leitura",
  );
  await delay(250);
  assert.ok(
    await evaluate(
      `document.querySelector('.manual-sidebar').getBoundingClientRect().top===8 && document.activeElement.getBoundingClientRect().top >= document.querySelector('.manual-sidebar').getBoundingClientRect().bottom`,
    ),
  );
  await evaluate(
    `document.querySelector('#manual-search').value='';document.querySelector('#manual-search').dispatchEvent(new Event('input'));document.querySelector('.manual-table-scroll').scrollIntoView({behavior:'instant',block:'start'});`,
  );
  assert.ok(
    await evaluate(
      `(() => {const table=document.querySelector('.manual-table-scroll');const before=table.scrollLeft;table.scrollLeft=100;return table.scrollLeft>before && document.documentElement.scrollWidth<=innerWidth;})()`,
    ),
  );
  await evaluate(
    `(() => {const table=document.querySelector('.manual-table-scroll');table.scrollLeft=0;table.previousElementSibling.scrollIntoView({behavior:'instant',block:'start'});})()`,
  );
  await writeFile(
    `${output}/manual-mobile-table.png`,
    await browser.screenshot(),
  );
  report.push(
    "Manual: busca sem depender de acentos, subseções, aviso de busca vazia, índice móvel com foco e tabelas sem overflow da página.",
  );

  await media(true);
  await navigate();
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('button')].every(button => getComputedStyle(button).transitionDuration.split(',').every(value => parseFloat(value) === 0))",
    ),
  );
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('.demo-switcher'),'::before').transitionDuration",
    ),
    "0s",
  );
  await evaluate(`document.querySelector('#compare-beta-tab').click()`);
  assert.ok(
    await evaluate(
      `document.querySelectorAll('.is-leaving').length===0 && document.querySelector('#compare-beta').getAnimations().length===0`,
    ),
  );
  report.push(
    "Movimento reduzido desliga também as transições dos botões e do seletor.",
  );
  await media();
  await viewport(1366, 768);
  await navigate();
  await evaluate("scrollTo({top:0,behavior:'instant'})");
  await writeFile(`${output}/hero.png`, await browser.screenshot());
  await evaluate(
    "document.querySelector('.gallery-versions').scrollIntoView({behavior:'instant'})",
  );
  await evaluate(
    "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
  );
  const imageReady = await evaluate(
    `(async()=>{const image=document.querySelector('#gallery-preview .ide-shot:not([hidden]) img');await image.decode();return image.complete && image.naturalWidth>0;})()`,
  );
  assert.ok(imageReady, "Captura da prévia deve carregar e decodificar");
  await writeFile(`${output}/gallery.png`, await browser.screenshot());
  await evaluate(
    "document.querySelector('#desenvolvimento').scrollIntoView({behavior:'instant'})",
  );
  await writeFile(`${output}/desenvolvimento.png`, await browser.screenshot());
  await viewport(320);
  await evaluate(
    "document.querySelector('#desenvolvimento').scrollIntoView({behavior:'instant'})",
  );
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
