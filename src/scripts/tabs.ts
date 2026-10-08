// Cada grupo controla apenas suas próprias abas, inclusive quando há um
// grupo dentro de outro (versões da IDE e telas daquela versão).
const tabMotion = matchMedia("(prefers-reduced-motion: reduce)");

for (const frame of document.querySelectorAll<HTMLElement>("[data-tabs]")) {
  const own = <T extends HTMLElement>(selector: string): T[] =>
    [...frame.querySelectorAll<T>(selector)].filter(
      (element) => element.closest("[data-tabs]") === frame,
    );
  const tablist = own<HTMLElement>('[role="tablist"]')[0];
  const tabs = own<HTMLButtonElement>("[data-tab]");
  const panels = own<HTMLElement>("[data-tab-panel]");
  if (!tablist || tabs.length !== panels.length || !tabs.length) continue;
  const stage = document.createElement("div");
  stage.className = "tab-stage";
  panels[0]?.before(stage);
  stage.append(...panels);
  let active = -1;
  let leaving: HTMLElement | undefined;
  let animations: Animation[] = [];
  function settle(): void {
    animations.forEach((animation) => {
      animation.cancel();
    });
    animations = [];
    leaving?.classList.remove("is-leaving");
    leaving = undefined;
  }
  function select(index: number, focus = false): void {
    if (index === active) return;
    settle();
    const previous = panels[active];
    const current = panels[index];
    const direction = index > active ? 1 : -1;
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels[i];
      if (panel) {
        panel.hidden = !selected;
        panel.inert = !selected;
        panel.setAttribute("aria-hidden", String(!selected));
      }
    });
    active = index;
    if (focus || previous?.contains(document.activeElement))
      tabs[index]?.focus();
    if (!previous || !current || tabMotion.matches) return;
    // O painel anterior deixa uma última imagem durante o esmaecimento,
    // já oculto para navegação, leitor de tela e reprodução de vídeo.
    leaving = previous;
    previous.classList.add("is-leaving");
    const outgoing = previous.animate(
      [
        { opacity: 1, translate: "0" },
        { opacity: 0, translate: `${String(direction * -6)}px 0` },
      ],
      { duration: 220, easing: "ease-out", fill: "both" },
    );
    const incoming = current.animate(
      [
        { opacity: 0, translate: `${String(direction * 6)}px 0` },
        { opacity: 1, translate: "0" },
      ],
      { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    animations = [outgoing, incoming];
    void outgoing.finished
      .then(() => {
        if (leaving !== previous) return;
        previous.classList.remove("is-leaving");
        leaving = undefined;
        outgoing.cancel();
      })
      .catch(() => {});
  }
  panels.forEach((panel) => {
    panel.setAttribute("role", "tabpanel");
    panel.tabIndex = 0;
  });
  tablist.hidden = false;
  select(0);
  frame.dataset["tabsReady"] = "true";
  tabMotion.addEventListener("change", settle);
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      if (tab.getAttribute("aria-selected") !== "true") select(index);
    });
    tab.addEventListener("keydown", (event) => {
      const choices: Record<string, number> = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      const next = choices[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
}
