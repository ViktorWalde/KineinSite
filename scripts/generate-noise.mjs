import { Buffer } from "node:buffer";
import { writeFileSync } from "node:fs";
import process from "node:process";
import { URL } from "node:url";
import { crc32, deflateSync } from "node:zlib";

// Gera assets/textures/noise.png: 64x64 pixels de cinza aleatório com alfa
// baixo. Repetido sobre degradês escuros, quebra as faixas visíveis que a
// tela de 8 bits produz em transições suaves (pontilhado). A semente fixa
// faz o arquivo sair idêntico a cada execução: `node scripts/generate-noise.mjs`.
const size = 64;
// Alfa 5/255: mexe no máximo ~2 níveis de cor num fundo escuro, o bastante
// para desfazer faixas sem virar granulação visível.
const alpha = 5;
let seed = 20261002;

// mulberry32: gerador pequeno e determinístico, suficiente para textura.
function random() {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "latin1");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])) >>> 0, 0);
  return Buffer.concat([head, data, crc]);
}

const rows = [];
for (let y = 0; y < size; y += 1) {
  const row = Buffer.alloc(1 + size * 2);
  for (let x = 0; x < size; x += 1) {
    row[1 + x * 2] = Math.floor(random() * 256);
    row[2 + x * 2] = alpha;
  }
  rows.push(row);
}

const header = Buffer.alloc(13);
header.writeUInt32BE(size, 0);
header.writeUInt32BE(size, 4);
header.set([8, 4, 0, 0, 0], 8); // 8 bits, cinza + alfa, sem entrelaçamento
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", header),
  chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);
writeFileSync(new URL("../assets/textures/noise.png", import.meta.url), png);
process.stdout.write(`noise.png: ${png.length} bytes\n`);
