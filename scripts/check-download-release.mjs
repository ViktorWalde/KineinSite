import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { downloadRelease as snapshot } from "../src/data/download.ts";
import { publicTag, publicVersion, repositoryUrl } from "../src/site.ts";
const { fetch, AbortSignal, URL, console } = globalThis;

// Opt-in: a rede verifica a fonte oficial, sem tornar o build dependente dela.
assert.equal(snapshot.tag, publicTag);
assert.equal(snapshot.version, publicVersion);
const api = `https://api.github.com/repos${new URL(repositoryUrl).pathname}/releases/tags/${publicTag}`;
const response = await fetch(api, {
  headers: {
    Accept: "application/vnd.github+json",
    "User-Agent": "KineinSite-release-check",
  },
  signal: AbortSignal.timeout(20000),
});
assert.equal(response.status, 200, "A release pública deve estar disponível.");
const release = await response.json();
assert.equal(release.tag_name, publicTag);
assert.equal(release.draft, false);
assert.equal(release.prerelease, true, "O painel descreve o beta publicado.");
assert.ok(release.published_at);
const assets = [];
for (const expected of [
  snapshot.archive,
  snapshot.appImage,
  snapshot.checksum,
]) {
  const actual = release.assets.find((asset) => asset.name === expected.name);
  assert.ok(actual, `Asset ausente: ${expected.name}`);
  assert.equal(actual.state, "uploaded");
  assert.equal(actual.size, expected.bytes);
  assert.equal(actual.digest, `sha256:${expected.sha256}`);
  assert.equal(
    actual.browser_download_url,
    `${repositoryUrl}/releases/download/${publicTag}/${expected.name}`,
  );
  assets.push({
    name: actual.name,
    size: actual.size,
    digest: actual.digest,
    url: actual.browser_download_url,
  });
}
assert.ok(release.body.includes(snapshot.platform));
assert.ok(release.body.includes(`glibc ${snapshot.minimumGlibc}+`));
assert.ok(release.body.includes("Wayland ou X11"));
await mkdir("test-results/download-release", { recursive: true });
await writeFile(
  "test-results/download-release/report.json",
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      source: api,
      tag: release.tag_name,
      publishedAt: release.published_at,
      prerelease: release.prerelease,
      assets,
      requirements: {
        platform: snapshot.platform,
        minimumGlibc: snapshot.minimumGlibc,
        session: "Wayland ou X11",
      },
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Download: ${publicTag}, três assets/tamanhos/digests e requisitos conferidos na API oficial.`,
);
