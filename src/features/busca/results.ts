import { uiFor } from "../../i18n/ui";
import { pathWithBase } from "../../i18n/routing";
import type { SearchPage } from "./engine";

// Somente texto e links locais válidos. Excerpts HTML do indexador não são inseridos.
function localUrl(value: string): string | undefined {
  const url = new URL(value, location.origin);
  if (
    url.origin !== location.origin ||
    !url.pathname.startsWith(pathWithBase("/", import.meta.env.BASE_URL))
  )
    return;
  return url.href;
}
function link(
  text: string,
  href: string,
  className: string,
): HTMLAnchorElement | undefined {
  const url = localUrl(href);
  if (!url) return;
  const node = document.createElement("a");
  node.href = url;
  node.textContent = text;
  node.className = className;
  return node;
}
export function renderSearchResults(
  list: HTMLOListElement,
  pages: SearchPage[],
  locale: string,
): void {
  const messages = uiFor(locale);
  const fragment = document.createDocumentFragment();
  for (const page of pages) {
    const title = page.meta["title"];
    const anchor = title
      ? link(title, page.url, "search-result-title")
      : undefined;
    if (!anchor) continue;
    const item = document.createElement("li");
    item.className = "search-result";
    const type = page.meta["type"];
    const types: Record<string, string> = messages.search.types;
    const meta = document.createElement("p");
    meta.className = "search-result-meta";
    meta.textContent = [
      type ? types[type] : undefined,
      page.meta["version"],
      page.meta["status"],
      page.meta["language"] !== locale ? messages.hud.fallback : undefined,
    ]
      .filter(Boolean)
      .join(" · ");
    const excerpt = document.createElement("p");
    excerpt.className = "search-excerpt";
    excerpt.textContent = page.plain_excerpt;
    anchor.hreflang = page.meta["language"] ?? "pt-BR";
    item.append(meta, anchor, excerpt);
    const sections = (page.sub_results ?? [])
      .filter((section) => section.url !== page.url)
      .slice(0, 2);
    if (sections.length) {
      const nav = document.createElement("nav");
      nav.className = "search-sections";
      nav.setAttribute("aria-label", messages.search.sections);
      for (const section of sections) {
        const child = link(section.title, section.url, "search-section-link");
        if (child) nav.append(child);
      }
      item.append(nav);
    }
    fragment.append(item);
  }
  list.replaceChildren(fragment);
}
