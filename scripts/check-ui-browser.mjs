import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { openBrowser } from "./lib/browser.mjs";

const browser = await openBrowser({ desktopPointer: true });
const { send, evaluate, navigate } = browser;
const output = "test-results/browser";
const widths = [320, 390, 560, 768, 865, 900, 1024, 1200, 1280, 1440];
await mkdir(output, { recursive: true });
async function media(features = []) {
  await send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "prefers-color-scheme", value: "dark" },
      ...features,
    ],
  });
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
  await media();
  await navigate("manual/");
  for (const textSize of ["", "200%"]) {
    await evaluate(
      `document.documentElement.style.fontSize=${JSON.stringify(textSize)}`,
    );
    for (const width of widths) {
      await viewport(width);
      const layout = await evaluate(`(() => {
        const header = document.querySelector('.header-inner');
        const nav = document.querySelector('.desktop-links');
        const download = document.querySelector('.header-download');
        const box = download.getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          navOverflow: nav.scrollWidth > nav.clientWidth,
          headerOverflow: header.scrollWidth > header.clientWidth,
          downloadVisible: box.width > 0 && box.left >= 0 && box.right <= innerWidth && box.height >= 44
        };
      })()`);
      assert.equal(layout.overflow, false, `Página ${width}/${textSize}`);
      assert.equal(layout.navOverflow, false, `Links ${width}/${textSize}`);
      assert.equal(layout.headerOverflow, false, `HUD ${width}/${textSize}`);
      assert.ok(layout.downloadVisible, `Download ${width}/${textSize}`);
    }
  }
  await evaluate("document.documentElement.style.fontSize=''");
  await viewport(1440);
  await evaluate("document.querySelector('.appearance').open=true");
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('.appearance-panel')).backdropFilter",
    ),
    "none",
    "O painel deve preservar a superfície de leitura sem blur aninhado",
  );
  const contrast = [];
  for (const theme of ["dark", "light", "warm", "system"]) {
    for (const accent of ["amber", "blue", "teal"]) {
      await media([
        {
          name: "prefers-color-scheme",
          value: theme === "system" ? "light" : "dark",
        },
      ]);
      await evaluate(
        `${theme === "system" ? "delete document.documentElement.dataset.theme" : `document.documentElement.dataset.theme=${JSON.stringify(theme)}`}; document.documentElement.dataset.accent=${JSON.stringify(accent)}`,
      );
      const ratios = await evaluate(`(() => {
        const probe = document.createElement('span'); document.body.append(probe);
        const ctx = document.createElement('canvas').getContext('2d');
        function color(name) {
          probe.style.color='var(--'+name+')';
          ctx.clearRect(0,0,1,1); ctx.fillStyle=getComputedStyle(probe).color; ctx.fillRect(0,0,1,1);
          const c=[...ctx.getImageData(0,0,1,1).data]; return [c[0],c[1],c[2],c[3]/255];
        }
        function over(a,b) { return a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])).concat(1); }
        function luminance(c) { return c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0); }
        const result=[];
        for(const extreme of [[0,0,0,1],[255,255,255,1]]) {
          const overlay=over(color('surface-overlay'),extreme);
          const control=over(color('surface-control'),overlay);
          for(const surface of [overlay,control]) for(const foreground of ['text','muted','accent','focus']) {
            const a=luminance(color(foreground)), b=luminance(surface);
            result.push({foreground,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)});
          }
        }
        probe.remove(); return result;
      })()`);
      for (const item of ratios)
        assert.ok(
          item.ratio >= (item.foreground === "focus" ? 3 : 4.5),
          `${theme}/${accent}/${item.foreground}: ${item.ratio}`,
        );
      contrast.push({
        theme,
        accent,
        minimum: Math.min(...ratios.map((item) => item.ratio)),
      });
      assert.ok(
        await evaluate(
          "[...document.querySelectorAll('.theme-option,.accent-option,.appearance summary')].every(el=>el.getBoundingClientRect().height>=44)",
        ),
        "Alvos de aparência",
      );
    }
  }
  for (const feature of [
    "prefers-reduced-transparency",
    "prefers-contrast",
    "forced-colors",
  ]) {
    await media([
      {
        name: feature,
        value:
          feature === "prefers-reduced-transparency"
            ? "reduce"
            : feature === "prefers-contrast"
              ? "more"
              : "active",
      },
    ]);
    assert.equal(
      await evaluate(
        "getComputedStyle(document.documentElement).getPropertyValue('--blur-overlay').trim()",
      ),
      "0px",
      feature,
    );
  }
  await media();
  // Simula a ausência do ramo @supports sem alterar a aplicação nem a CSP.
  const removed = await evaluate(`(() => {
    let count=0;
    for(const sheet of document.styleSheets) for(let i=sheet.cssRules.length-1;i>=0;i--) {
      const rule=sheet.cssRules[i];
      if(rule instanceof CSSSupportsRule && rule.conditionText.includes('backdrop-filter')) {sheet.deleteRule(i);count++;}
    }
    return count;
  })()`);
  assert.ok(removed > 0, "Ramo de suporte ao vidro encontrado");
  assert.equal(
    await evaluate(
      "getComputedStyle(document.documentElement).getPropertyValue('--blur-overlay').trim()",
    ),
    "0px",
  );
  await navigate();
  assert.equal(
    await evaluate(
      "document.querySelector('.hero-actions .button-quiet').hash",
    ),
    "#interface",
  );
  assert.ok(
    await evaluate(
      "document.documentElement.lang==='pt-BR' && !document.querySelector('link[hreflang=\"en-US\"]') && ![...document.querySelectorAll('a')].some(a=>a.pathname.startsWith('/KineinSite/en/'))",
    ),
    "Nenhuma tradução inexistente anunciada",
  );
  for (const theme of ["dark", "light", "warm"]) {
    await evaluate(
      `document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
    );
    for (const width of [390, 1024, 1440]) {
      await viewport(width);
      await writeFile(
        `${output}/hud-${theme}-${width}.png`,
        await browser.screenshot(),
      );
    }
  }
  await viewport(390);
  await evaluate(
    "document.documentElement.dataset.theme='dark'; document.querySelector('.mobile-navigation').open=true",
  );
  await writeFile(`${output}/hud-mobile-menu.png`, await browser.screenshot());
  await evaluate(
    "document.querySelector('.mobile-navigation').open=false; document.querySelector('.appearance').open=true",
  );
  await writeFile(
    `${output}/hud-mobile-appearance.png`,
    await browser.screenshot(),
  );
  assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
  await writeFile(
    `${output}/ui-report.json`,
    JSON.stringify(
      {
        widths,
        textSizes: ["100%", "200%"],
        contrast,
        opaqueFallback: "Ramo @supports removido por CSSOM",
        errors: browser.errors,
      },
      null,
      2,
    ),
  );
  globalThis.console.log(
    "UI: HUD em dez larguras, download, texto ampliado, 12 paletas, contraste do vidro e alternativas opacas aprovados.",
  );
} finally {
  await browser.close();
}
