import assert from "node:assert/strict";
import { navigationGroups, resolveNavigation } from "../src/data/navigation.ts";
import { publicTag, publicVersion, releaseUrl } from "../src/site.ts";
import { uiFor } from "../src/i18n/ui.ts";

const guides = [{ id: "ide/instalar", data: { status: "verified" } }];
const updates = [
  { id: "future", data: { tag: "v99.0.0", version: "99.0.0" } },
  { id: "public-note", data: { tag: publicTag, version: publicVersion } },
];
assert.deepEqual(
  navigationGroups.map((group) => group.id),
  ["product", "docs", "community", "updates"],
);
assert.equal(
  new Set(
    navigationGroups.flatMap((group) => group.items.map((item) => item.id)),
  ).size,
  16,
);
for (const base of ["/", "/KineinSite", "/KineinSite/"]) {
  const pt = resolveNavigation({ guides, updates, base });
  const en = resolveNavigation({ guides, updates, base, locale: "en-US" });
  assert.equal(pt.flatMap((group) => group.items).length, 16);
  assert.deepEqual(
    pt.map((group) => group.items.map((item) => item.href)),
    en.map((group) => group.items.map((item) => item.href)),
  );
  for (const item of en.flatMap((group) => group.items)) {
    assert.equal(item.isFallback, !item.external);
    assert.equal(item.locale, "pt-BR");
    assert.ok(item.label.length > 0);
    if (!item.external)
      assert.ok(item.href.startsWith(base.replace(/\/$/, "") + "/"));
  }
  const note = pt.at(-1).items.at(-1);
  assert.equal(note.id, "updates-public-note");
  assert.ok(
    note.href.endsWith("/atualizacoes/public-note/"),
    "Nota por tag, não por ordem",
  );
  assert.ok(note.label.includes(publicVersion));
  const without = resolveNavigation({ guides, updates: [updates[0]], base });
  assert.deepEqual(
    without.at(-1).items.map((item) => item.id),
    ["updates-overview"],
  );
}
assert.throws(() => resolveNavigation({ guides: [], updates }), /obrigatória/);
assert.throws(
  () =>
    resolveNavigation({
      guides: [{ ...guides[0], data: { status: "draft" } }],
      updates,
    }),
  /obrigatória/,
);
assert.ok(releaseUrl.endsWith(`/releases/tag/${publicTag}`));
assert.equal(uiFor("unsupported").hud.fallback, "em português");
globalThis.console.log(
  "H1-T07/T08/T09: catálogo, fontes obrigatórias, nota por tag, bases e fallback aprovados.",
);
