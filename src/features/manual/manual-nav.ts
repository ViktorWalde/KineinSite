import { enhanceOutline } from "../../scripts/outline";

const outline = document.querySelector<HTMLDetailsElement>(
  "[data-manual-outline]",
);
const search = document.querySelector<HTMLInputElement>("#manual-search");

if (outline && search) {
  const panel = outline;
  const input = search;
  const chapters = [
    ...panel.querySelectorAll<HTMLElement>("[data-manual-chapter]"),
  ];
  const empty = panel.querySelector<HTMLElement>("[data-manual-empty]");
  const results = panel.querySelector<HTMLElement>("[data-manual-results]");
  const normalize = (text: string): string =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const initial = new Map<HTMLDetailsElement, boolean>();
  function filter(): void {
    const query = normalize(input.value.trim());
    let count = 0;
    for (const chapter of chapters) {
      const heading = chapter.querySelector<HTMLAnchorElement>(
        ".manual-section-link",
      );
      const details = chapter.querySelector<HTMLDetailsElement>("details");
      const topics = [
        ...chapter.querySelectorAll<HTMLElement>("[data-manual-topic]"),
      ];
      const matches = normalize(heading?.textContent ?? "").includes(query);
      let childMatch = false;
      topics.forEach((topic) => {
        const found = normalize(topic.textContent).includes(query);
        topic.hidden = !matches && !found;
        childMatch ||= found;
      });
      chapter.hidden = !matches && !childMatch;
      if (!chapter.hidden) count++;
      if (details) {
        if (query && !initial.has(details)) initial.set(details, details.open);
        if (query) details.open = !chapter.hidden;
        else {
          details.open = initial.get(details) ?? details.open;
          initial.delete(details);
        }
      }
    }
    if (empty) empty.hidden = count > 0;
    if (results)
      results.textContent = query
        ? `${String(count)} ${count === 1 ? "seção encontrada" : "seções encontradas"}.`
        : "Todas as seções do manual.";
  }
  enhanceOutline(panel, matchMedia("(width <= 54rem)"));
  const searchArea = panel.querySelector<HTMLElement>("[data-manual-search]");
  if (searchArea) searchArea.hidden = false;
  input.addEventListener("input", filter);
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !input.value) return;
    event.preventDefault();
    input.value = "";
    filter();
  });
}
