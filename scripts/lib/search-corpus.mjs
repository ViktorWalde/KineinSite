// Executado com DOMParser sobre HTML gerado, sem carregar a página ou editar
// a fonte editorial. Os atributos Pagefind existem somente na prova isolada.
export function prepareSearchDocument(html, route) {
  const doc = new globalThis.DOMParser().parseFromString(html, "text/html");
  if (doc.querySelector('meta[name="robots"][content*="noindex"]'))
    return { excluded: "noindex", route };
  const main = doc.querySelector("main#conteudo");
  const title = main?.querySelector("h1")?.textContent.trim();
  const language = doc.documentElement.lang;
  if (!main || !title || !main.textContent.trim())
    return { excluded: "empty", route };
  if (language !== "pt-BR") return { excluded: "unreviewed-language", route };
  const types = {
    aprender: "guia",
    estudos: "estudo",
    manual: "manual",
    atualizacoes: "atualizacao",
    documentacao: "documentacao",
    colabore: "comunidade",
  };
  const type = types[route.split("/")[1]] ?? "produto";
  const versionText =
    main.querySelector(
      ".guide-meta dd, .manual-version, .update-meta, .preview-page .kicker",
    )?.textContent ?? "";
  const version = /\d+\.\d+(?:\.\d+)?(?:-[a-zA-Z0-9.-]+)?/.exec(
    versionText,
  )?.[0];
  const status = main
    .querySelector(".preview-page .kicker")
    ?.textContent.trim();
  const source = main.querySelector(".manual-source a")?.getAttribute("href");
  const revision = main.querySelector(".manual-source code")?.textContent;
  const metadata = { type, language, version, status, source, revision };
  const keys = [];
  for (const [key, value] of Object.entries(metadata)) {
    if (!value) continue;
    main.setAttribute(`data-c0-${key}`, value);
    keys.push(`${key}[data-c0-${key}]`);
  }
  main.setAttribute("data-pagefind-meta", keys.join(", "));
  main.setAttribute(
    "data-pagefind-filter",
    "type[data-c0-type], language[data-c0-language]",
  );
  main.setAttribute("data-pagefind-body", "");
  const excluded =
    "nav, aside, dialog, button, summary, [hidden], svg, [role=status], [data-task-list], [data-contributors-list]";
  for (const element of main.querySelectorAll(excluded))
    element.setAttribute("data-pagefind-ignore", "");
  const headings = [
    ...main.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"),
  ]
    .filter((element) => !element.closest("[data-pagefind-ignore]"))
    .map((element) => ({ id: element.id, title: element.textContent.trim() }));
  return {
    route,
    title,
    metadata,
    headings,
    content: "<!doctype html>" + doc.documentElement.outerHTML,
  };
}
