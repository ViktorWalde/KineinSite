import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser();
const { send, evaluate, navigate } = browser;
const output = "test-results/browser";
await mkdir(output, { recursive: true });
async function waitFor(expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await delay(50);
  }
  assert.fail(`Condição não atendida: ${expression}`);
}
try {
  // Respostas controladas, só no navegador descartável de teste. Nenhuma
  // issue, identidade ou crédito de demonstração vai para o site publicado.
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const originalFetch = window.fetch.bind(window);
      const originalNow = Date.now.bind(Date);
      window.__collab = { mode: 'success', offset: 0, reopened: false, requests: [] };
      Date.now = () => originalNow() + window.__collab.offset;
      const task = {number:1,title:'Testar guia de C++',body:'## Objetivo\\nReproduzir um guia com ambiente e resultado verificáveis. '.repeat(8),state:'open',labels:[{name:'help wanted'}],assignees:[],updated_at:'2026-10-24T12:00:00Z'};
      window.fetch = async (input, options) => {
        const address = String(input);
        if (!address.startsWith('https://api.github.com/repos/')) return originalFetch(input, options);
        window.__collab.requests.push(address);
        if (window.__collab.mode === 'fail') return new Response('{}', {status:503});
        if (window.__collab.mode === 'malformed') return new Response('{invalid', {status:200});
        if (window.__collab.mode === 'rate') return new Response('{}', {status:429, headers:{'retry-after':'600'}});
        const url = new URL(address);
        const site = url.pathname.includes('KineinSite');
        let data;
        const headers = {'Content-Type':'application/json'};
        if (url.pathname.endsWith('/contributors')) {
          data = [{login:site?'Alice':'alice',type:'User',contributions:site?3:2},{login:'dependabot[bot]',type:'Bot',contributions:9},{login:'claude',type:'User',contributions:19}];
        } else if (site) {
          data = [{...task,number:10,title:'Documentação e teclado <img src=x onerror=alert(1)>',labels:[{name:'good first issue'}]}];
        } else if (url.searchParams.get('page') === '2') {
          data = [{...task,number:3,title:'Exemplo concluído',state:window.__collab.reopened?'open':'closed',state_reason:'completed'}];
        } else {
          data = [task,{...task,number:2,title:'Compatibilidade Linux',assignees:[{login:'alice'}]},{...task,number:4,state:'closed',state_reason:'not_planned'},{...task,number:5,labels:[{name:'help wanted'},{name:'trilha-principal'}]},{...task,number:6,pull_request:{}}];
          headers.Link = '<https://api.github.com/repos/ViktorWalde/KineinVectis/issues?per_page=100&page=2>; rel="next"';
        }
        return new Response(JSON.stringify(data), {status:200,headers});
      };
    })();`,
  });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await navigate("colabore/");
  await waitFor(
    "document.querySelectorAll('.task-card').length === 4 && document.querySelectorAll('.contributor-card').length === 1",
  );
  assert.deepEqual(
    await evaluate(
      "[...document.querySelectorAll('[data-task-count]')].map(node=>node.textContent)",
    ),
    ["2", "1", "1"],
  );
  assert.ok(
    await evaluate(
      "window.__collab.requests.some(url=>url.includes('page=2'))",
    ),
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card img').length"),
    0,
  );
  assert.ok(
    await evaluate(
      "document.querySelector('.contributor-card').textContent.includes('5 commits')",
    ),
  );
  assert.ok(
    await evaluate(
      "[...document.querySelectorAll('.task-action')].every(link=>/^https:\\/\\/github.com\\/ViktorWalde\\/Kinein(?:Vectis|Site)\\/issues\\/\\d+$/.test(link.href) && link.rel.includes('noopener'))",
    ),
  );
  await evaluate(
    "document.querySelector('[data-task-search]').value='DOCUMENTACAO'; document.querySelector('[data-task-search]').dispatchEvent(new Event('input'))",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card').length"),
    1,
  );
  await evaluate(
    "document.querySelector('[data-task-search]').value='nenhuma-tarefa-corresponde'; document.querySelector('[data-task-search]').dispatchEvent(new Event('input'))",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card').length"),
    0,
  );
  assert.ok(
    await evaluate("!document.querySelector('[data-task-clear]').hidden"),
  );
  await evaluate("document.querySelector('[data-task-clear]').click()");
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card').length"),
    4,
  );
  assert.ok(
    await evaluate(
      "document.activeElement === document.querySelector('[data-task-search]') && document.querySelector('[data-task-clear]').hidden",
    ),
  );
  await evaluate(
    "document.querySelector('[data-task-search]').value=''; document.querySelector('[data-task-project]').value='ide'; document.querySelector('[data-task-project]').dispatchEvent(new Event('input'))",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card').length"),
    3,
  );
  await evaluate(
    "document.querySelector('[data-task-project]').value='all'; document.querySelector('[data-task-entry]').value='first'; document.querySelector('[data-task-entry]').dispatchEvent(new Event('input'))",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card').length"),
    1,
  );
  await evaluate(
    "document.querySelector('[data-task-entry]').value='all'; document.querySelector('[data-task-entry]').dispatchEvent(new Event('input'))",
  );
  await evaluate("document.querySelector('.task-details summary').click()");
  assert.ok(await evaluate("document.querySelector('.task-details').open"));

  for (const width of [320, 768, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    for (const theme of ["dark", "light", "warm"]) {
      await evaluate(`document.documentElement.dataset.theme='${theme}'`);
      assert.ok(
        await evaluate("document.documentElement.scrollWidth <= innerWidth"),
        `Overflow Colabore: ${width}/${theme}`,
      );
    }
    await evaluate("document.documentElement.style.fontSize='200%'");
    const enlarged = await evaluate(
      `({ width: innerWidth, scroll: document.documentElement.scrollWidth, offenders: [...document.querySelectorAll('main *')].filter(node=>node.getBoundingClientRect().right>innerWidth+1).slice(0,12).map(node=>({tag:node.tagName,classes:node.className,width:node.getBoundingClientRect().width})) })`,
    );
    assert.ok(
      enlarged.scroll <= enlarged.width,
      `Texto ampliado Colabore ${width}: ${JSON.stringify(enlarged)}`,
    );
    await evaluate("document.documentElement.style.fontSize=''");
    await evaluate(
      "document.documentElement.dataset.theme='dark'; document.querySelector('#tarefas').scrollIntoView()",
    );
    await writeFile(
      `${output}/colabore-tarefas-${width}.png`,
      await browser.screenshot(),
    );
  }
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await evaluate(
    "window.__preservedCard=document.querySelector('.task-card'); window.__preservedCard.querySelector('details').open=true; window.__preservedCard.querySelector('a').focus({preventScroll:true}); window.__preservedFocus=document.activeElement; window.__collab.offset += 61000; document.querySelector('[data-task-refresh]').disabled=false; document.querySelector('[data-task-refresh]').click()",
  );
  await waitFor(
    "document.querySelector('[data-task-refresh]').getAttribute('aria-busy')==='false'",
  );
  assert.ok(
    await evaluate(
      "window.__preservedCard.isConnected && window.__preservedCard.querySelector('details').open && document.activeElement === window.__preservedFocus",
    ),
  );
  await evaluate(
    "window.__collab.offset += 61000; window.__collab.reopened=true; document.querySelector('[data-task-refresh]').disabled=false; document.querySelector('[data-task-refresh]').click()",
  );
  await waitFor(
    "document.querySelector('[data-task-count=done]').textContent === '0'",
  );
  assert.equal(
    await evaluate(
      "document.querySelector('[data-task-count=open]').textContent",
    ),
    "3",
  );
  await evaluate(
    "window.__collab.offset += 61000; window.__collab.mode='fail'; document.querySelector('[data-task-refresh]').disabled=false; document.querySelector('[data-task-refresh]').click()",
  );
  await waitFor(
    "document.querySelector('[data-task-sync]').textContent.includes('Última consulta válida')",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card').length"),
    4,
  );
  // Cache antigo e consulta indisponível ao reabrir a página.
  const cached = await evaluate(
    "Object.fromEntries(Object.keys(sessionStorage).map(key=>[key,sessionStorage.getItem(key)]))",
  );
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.__collab.mode='fail'; window.__collab.offset=600000;`,
  });
  await navigate("colabore/");
  await waitFor(
    "document.querySelector('[data-task-sync]').textContent.includes('Última consulta válida')",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card').length"),
    4,
  );
  assert.ok(
    Object.keys(cached).some((key) => key.includes("kinein:colabore:v1:")),
  );
  await evaluate("sessionStorage.clear()");
  await navigate("colabore/");
  await waitFor(
    "document.querySelector('[data-task-sync]').textContent.includes('Não foi possível')",
  );
  assert.deepEqual(
    await evaluate(
      "[...document.querySelectorAll('[data-task-count]')].map(node=>node.textContent)",
    ),
    ["—", "—", "—"],
  );
  await evaluate(
    "window.__collab.offset += 61000; window.__collab.mode='malformed'; document.querySelector('[data-task-refresh]').disabled=false; document.querySelector('[data-task-refresh]').click()",
  );
  await waitFor(
    "document.querySelector('.task-board').getAttribute('aria-busy')==='false'",
  );
  assert.equal(
    await evaluate("document.querySelectorAll('.task-card').length"),
    0,
  );
  await evaluate(
    "window.__collab.offset += 61000; window.__collab.mode='rate'; document.querySelector('[data-task-refresh]').disabled=false; document.querySelector('[data-task-refresh]').click()",
  );
  await waitFor(
    "document.querySelector('.task-board').getAttribute('aria-busy')==='false'",
  );
  const requestCount = await evaluate("window.__collab.requests.length");
  await evaluate(
    "window.__collab.offset += 61000; document.querySelector('[data-task-refresh]').disabled=false; document.querySelector('[data-task-refresh]').click()",
  );
  await waitFor(
    "document.querySelector('.task-board').getAttribute('aria-busy')==='false'",
  );
  assert.equal(
    await evaluate("window.__collab.requests.length"),
    requestCount,
    "Respeitar Retry-After",
  );
  await navigate("colabore/regras/");
  assert.equal(
    await evaluate("document.querySelectorAll('.contribution-section').length"),
    11,
  );
  assert.ok(
    await evaluate(
      "document.querySelector('.contribution-template').textContent.includes('Independência da trilha principal')",
    ),
  );
  await send("Emulation.setFocusEmulationEnabled", { enabled: true });
  await send("Browser.grantPermissions", {
    origin: new globalThis.URL(browser.base).origin,
    permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
  });
  await evaluate("document.querySelector('[data-copy-target]').click()");
  await waitFor(
    "document.querySelector('.copy-feedback').textContent.includes('Modelo copiado')",
  );
  assert.ok(
    await evaluate(
      "(async()=> (await navigator.clipboard.readText()) === document.querySelector('#modelo-entrega').textContent)()",
    ),
  );
  await evaluate(
    "window.__originalClipboard = navigator.clipboard.writeText; navigator.clipboard.writeText = async()=>{throw new Error('Teste sem permissão')}; document.querySelector('[data-copy-target]').click()",
  );
  await waitFor(
    "document.querySelector('.copy-feedback').textContent.includes('Não foi possível')",
  );
  assert.ok(
    await evaluate(
      "getSelection().toString().trim() === document.querySelector('#modelo-entrega').textContent.trim()",
    ),
  );
  await evaluate("navigator.clipboard.writeText=window.__originalClipboard");
  await navigate("colabore/");
  const proposals = await evaluate(
    "[...document.querySelectorAll('.collab-way > a')].map(link=>{const url=new URL(link.href);return {host:url.hostname,body:url.searchParams.get('body'),labels:url.searchParams.has('labels')}})",
  );
  assert.equal(proposals.length, 4);
  assert.ok(
    proposals.every(
      (proposal) =>
        proposal.host === "github.com" &&
        proposal.body.includes("trilha principal") &&
        !proposal.labels,
    ),
  );
  await navigate();
  assert.ok(
    await evaluate(
      "document.querySelector('#gallery-beta-tab').getAttribute('aria-selected') === 'true' && document.querySelector('#compare-beta-tab').getAttribute('aria-selected') === 'true' && !document.querySelector('#gallery-beta').hidden && document.querySelector('#gallery-preview').hidden",
    ),
  );
  for (const width of [320, 768, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate(
      "document.documentElement.dataset.theme='dark'; scrollTo(0,0)",
    );
    if (width <= 768) {
      assert.ok(
        await evaluate(
          "document.querySelector('.desktop-links').getBoundingClientRect().width === 0 && !document.querySelector('.mobile-navigation').open",
        ),
      );
      await evaluate(
        "document.querySelector('.mobile-navigation > summary').click()",
      );
      assert.ok(
        await evaluate(
          "document.querySelector('.mobile-navigation').open && [...document.querySelectorAll('.mobile-links a')].every(link=>link.getBoundingClientRect().width>0)",
        ),
      );
      await evaluate("document.querySelector('.mobile-links a').focus()");
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
    }
    assert.ok(
      await evaluate("document.documentElement.scrollWidth <= innerWidth"),
      `Overflow na apresentação: ${width}`,
    );
    await writeFile(
      `${output}/inicio-comercial-${width}.png`,
      await browser.screenshot(),
    );
  }
  assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
  await writeFile(
    `${output}/colabore-report.json`,
    JSON.stringify(
      {
        checks: [
          "Paginação e estados",
          "Filtros e busca sem acentos",
          "Conteúdo externo como texto",
          "Créditos agregados sem bots",
          "Três larguras e três temas",
          "Reabertura",
          "Cache durante indisponibilidade",
          "Falha sem zeros fictícios",
          "Resposta inválida",
          "Retry-After",
          "11 seções e modelo de entrega",
          "Limpeza de filtros e recuperação da busca",
          "Propostas com escopo independente e sem labels automáticas",
          "Menu móvel com teclado e Escape",
          "Beta público como versão inicial",
          "Cópia do modelo e alternativa sem permissão",
          "Atualização preserva cartões, descrição e foco",
        ],
        errors: browser.errors,
      },
      null,
      2,
    ),
  );
  globalThis.console.log(
    "Colaboração no navegador: paginação, filtros, segurança, créditos, reabertura, cache, falhas e limites de API aprovados.",
  );
} finally {
  await browser.close();
}
