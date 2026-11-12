import assert from "node:assert/strict";
import { defaultLocale, isLocale } from "../src/i18n/config.ts";
import {
  equivalentRoutes,
  localeFromPath,
  pathWithBase,
  publishedRoutes,
  resolveRoute,
} from "../src/i18n/routing.ts";
import { uiFor } from "../src/i18n/ui.ts";
import { formatDate } from "../src/i18n/utils.ts";

for (const base of ["/", "/KineinSite", "/KineinSite/"]) {
  assert.equal(localeFromPath(pathWithBase("/", base), base), "pt-BR");
  assert.equal(localeFromPath(pathWithBase("/en/", base), base), "en-US");
  assert.equal(
    localeFromPath(pathWithBase("/en/manual/", base), base),
    "en-US",
  );
  assert.equal(localeFromPath(pathWithBase("/english/", base), base), "pt-BR");
  for (const id of Object.keys(publishedRoutes)) {
    const original = resolveRoute(id, "pt-BR", base);
    assert.equal(original.isFallback, false);
    const requested = resolveRoute(id, "en-US", base);
    assert.deepEqual(requested, { ...original, isFallback: true });
    assert.deepEqual(equivalentRoutes(original.href, base), [
      { locale: original.locale, href: original.href },
    ]);
  }
  assert.deepEqual(
    equivalentRoutes(pathWithBase("/en/missing/", base), base),
    [],
  );
}
assert.equal(localeFromPath("/KineinSiteExtra/en/", "/KineinSite"), "pt-BR");
assert.equal(
  pathWithBase("/manual/#editor", "/KineinSite/"),
  "/KineinSite/manual/#editor",
);
assert.equal(isLocale("en-US"), true);
assert.equal(isLocale("en"), false);
assert.equal(uiFor("fr-FR"), uiFor(defaultLocale));
assert.equal(uiFor("en-US").skip, "Skip to content");
assert.equal(uiFor("en-US").appearance.themes.dark, "Dark");
const date = new Date("2026-10-02T00:00:00Z");
assert.equal(formatDate(date), "2 de outubro de 2026");
assert.equal(formatDate(date, "en-US"), "October 2, 2026");
globalThis.console.log(
  "i18n: idiomas, interface, datas UTC, base, equivalências e fallback aprovados.",
);
