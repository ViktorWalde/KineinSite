import { Buffer } from "node:buffer";
import { URL } from "node:url";
const { fetch, AbortSignal, console } = globalThis;
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { setTimeout } from "node:timers/promises";

const [
  directory,
  commit,
  address = "https://viktorwalde.github.io/KineinSite/",
] = process.argv.slice(2);
if (!directory || !/^[a-f0-9]{40}$/.test(commit ?? ""))
  throw new Error("Informe o build e seu commit.");
const base = new URL(address);
let ready = false;
for (let attempt = 0; attempt < 18; attempt++) {
  try {
    const response = await fetch(
      new URL(`site-version.json?version=${commit}&attempt=${attempt}`, base),
      { signal: AbortSignal.timeout(10000), cache: "no-store" },
    );
    if (response.ok && (await response.json()).sourceCommit === commit) {
      ready = true;
      break;
    }
  } catch {
    /* O Pages pode ainda estar preparando a publicação. */
  }
  console.info(`Aguardando o Pages (${attempt + 1}/18)…`);
  await setTimeout(10000);
}
if (!ready)
  throw new Error(
    "Envio concluído, mas o Pages não confirmou esta versão. Confira o build no GitHub antes de anunciar a publicação.",
  );
const assets = (await readdir(path.join(directory, "_astro"))).filter((name) =>
  /\.(css|js|svg)$/.test(name),
);
for (const file of ["index.html", ...assets.map((name) => `_astro/${name}`)]) {
  const local = await readFile(path.join(directory, file));
  const response = await fetch(new URL(`${file}?version=${commit}`, base), {
    signal: AbortSignal.timeout(15000),
  });
  if (
    !response.ok ||
    !local.equals(Buffer.from(await response.arrayBuffer()))
  ) {
    throw new Error(`O arquivo público difere do build: ${file}`);
  }
}
console.info(
  `Pages confirmado: ${commit}; HTML inicial, CSS, JavaScript e SVG conferidos.`,
);
