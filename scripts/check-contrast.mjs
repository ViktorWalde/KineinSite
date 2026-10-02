import { readFileSync } from "node:fs";
import process from "node:process";

// Confere o contraste (WCAG 2.2, luminância relativa) dos pares de cor que o
// site usa, em todas as combinações de tema e destaque de tokens.css. Lê o
// arquivo e refaz a cascata como o navegador: base, destaque, tema e a
// combinação tema+destaque, nessa ordem (destaque e tema têm a mesma
// especificidade, então o tema, que vem depois no arquivo, vence).
const css = readFileSync("src/styles/tokens.css", "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

// Texto comum precisa de 4,5:1 (critério 1.4.3); indicador de foco, 3:1
// (1.4.11). Os rótulos em mono são pequenos, então entram como texto comum.
const textPairs = [
  ["text", "page"],
  ["text", "surface"],
  ["text", "card"],
  ["muted", "page"],
  ["muted", "surface"],
  ["muted", "card"],
  ["accent", "page"],
  ["accent", "surface"],
  ["accent", "card"],
  ["accent-on", "accent"],
  ["hero-accent-on", "hero-accent"],
];
const focusPairs = [
  ["focus", "page"],
  ["focus", "surface"],
];

const mediaStart = css.indexOf("@media (prefers-color-scheme: light)");
const blocks = new Map();
for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const first = match[1].split(",")[0].trim().replace(/\s+/g, " ");
  const declarations = Object.fromEntries(
    match[2]
      .split(";")
      .map((part) => part.trim())
      .filter((part) => part.startsWith("--"))
      .map((part) => {
        const colon = part.indexOf(":");
        return [
          part.slice(2, colon).trim(),
          part
            .slice(colon + 1)
            .trim()
            .replace(/\s+/g, " "),
        ];
      }),
  );
  if (!("page" in declarations) && !("accent" in declarations)) continue;
  const inLightMedia =
    mediaStart !== -1 &&
    match.index > mediaStart &&
    first.startsWith(":root:not");
  blocks.set(inLightMedia ? `media ${first}` : first, declarations);
}

function block(key) {
  const found = blocks.get(key);
  if (!found) throw new Error(`bloco ausente em tokens.css: ${key}`);
  return found;
}

function scheme(themeKey, comboKey, accent) {
  const layers = [block(":root")];
  if (accent !== "amber") layers.push(block(`[data-accent="${accent}"]`));
  if (themeKey) layers.push(block(themeKey));
  if (comboKey && accent !== "amber") {
    layers.push(block(comboKey.replace("ACCENT", accent)));
  }
  return Object.assign({}, ...layers);
}

const combinations = [];
for (const accent of ["amber", "blue", "teal"]) {
  combinations.push([`escuro/${accent}`, scheme(null, null, accent)]);
  combinations.push([
    `claro/${accent}`,
    scheme(
      ':root[data-theme="light"]',
      ':root[data-theme="light"][data-accent="ACCENT"]',
      accent,
    ),
  ]);
  combinations.push([
    `quente/${accent}`,
    scheme(
      ':root[data-theme="warm"]',
      ':root[data-theme="warm"][data-accent="ACCENT"]',
      accent,
    ),
  ]);
  combinations.push([
    `sistema-claro/${accent}`,
    scheme(
      "media :root:not([data-theme])",
      'media :root:not([data-theme])[data-accent="ACCENT"]',
      accent,
    ),
  ]);
}

function hex(value) {
  const digits = value.slice(1);
  const full =
    digits.length === 3 ? [...digits].map((d) => d + d).join("") : digits;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

// Resolve var() e color-mix(in srgb, ...) para sRGB 0-255.
function resolve(tokens, name, depth = 0) {
  if (depth > 10) throw new Error(`referência circular em --${name}`);
  const value = tokens[name];
  if (value === undefined) throw new Error(`token ausente: --${name}`);
  return color(tokens, value, depth);
}

function color(tokens, value, depth) {
  if (value.startsWith("#")) return hex(value);
  const reference = value.match(/^var\(--([\w-]+)\)$/);
  if (reference) return resolve(tokens, reference[1], depth + 1);
  const mix = value.match(
    /^color-mix\(in srgb, (.+?) (\d+(?:\.\d+)?)%, (.+)\)$/,
  );
  if (mix) {
    const a = color(tokens, mix[1], depth + 1);
    const b = color(tokens, mix[3], depth + 1);
    const p = Number(mix[2]) / 100;
    return a.map((channel, i) => channel * p + b[i] * (1 - p));
  }
  throw new Error(`cor que o verificador não sabe ler: ${value}`);
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const errors = [];
let worst = { value: Infinity, where: "" };
for (const [label, tokens] of combinations) {
  for (const [pairs, minimum] of [
    [textPairs, 4.5],
    [focusPairs, 3],
  ]) {
    for (const [fg, bg] of pairs) {
      const value = ratio(resolve(tokens, fg), resolve(tokens, bg));
      const where = `${label}: --${fg} sobre --${bg}`;
      if (value < worst.value) worst = { value, where };
      if (value < minimum) {
        errors.push(`${where} = ${value.toFixed(2)}:1 (mínimo ${minimum}:1)`);
      }
    }
  }
}

for (const error of errors) process.stderr.write(`ERRO ${error}\n`);
process.stdout.write(
  `Contraste: ${combinations.length} combinações, ${errors.length} erros; ` +
    `menor razão ${worst.value.toFixed(2)}:1 (${worst.where}).\n`,
);
if (errors.length) process.exitCode = 1;
