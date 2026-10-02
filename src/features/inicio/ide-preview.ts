// Abas das capturas da IDE (padrão de abas do WAI-ARIA APG): clique ou
// setas esquerda/direita, Home e End. Sem JavaScript as abas ficam ocultas e
// as capturas aparecem uma embaixo da outra.
const tablist = document.querySelector<HTMLElement>(".ide-tabs");
const tabs = Array.from(
  document.querySelectorAll<HTMLButtonElement>(".ide-tab"),
);
const panels = Array.from(document.querySelectorAll<HTMLElement>(".ide-shot"));

function select(index: number, focus: boolean): void {
  tabs.forEach((tab, i) => {
    const active = i === index;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    const panel = panels[i];
    if (panel) panel.hidden = !active;
  });
  if (focus) tabs[index]?.focus();
}

if (tablist && tabs.length === panels.length && tabs.length > 0) {
  tablist.hidden = false;
  for (const panel of panels) panel.setAttribute("role", "tabpanel");
  select(0, false);

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      select(index, false);
    });
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      const next: Record<string, number> = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
      };
      const target = next[event.key];
      if (target === undefined) return;
      event.preventDefault();
      select(target, true);
    });
  });
}
