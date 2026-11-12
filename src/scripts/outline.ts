// Índices nativos: abertos no desktop, recolhidos no celular. O manual e a
// documentação compartilham teclado e foco, preservando seus conteúdos.
export function enhanceOutline(
  panel: HTMLDetailsElement,
  mobile: MediaQueryList,
): void {
  const trigger = panel.querySelector("summary");
  const sync = (): void => {
    panel.open = !mobile.matches;
  };
  sync();
  mobile.addEventListener("change", sync);
  panel.addEventListener("keydown", (event) => {
    if (
      event.key !== "Escape" ||
      event.defaultPrevented ||
      !mobile.matches ||
      !panel.open
    )
      return;
    event.preventDefault();
    panel.open = false;
    trigger?.focus();
  });
  panel.addEventListener("click", (event) => {
    const link =
      event.target instanceof Element ? event.target.closest("a") : null;
    if (
      !link ||
      !mobile.matches ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      link.origin !== location.origin ||
      link.pathname !== location.pathname ||
      !link.hash
    )
      return;
    const target = document.getElementById(
      decodeURIComponent(link.hash.slice(1)),
    );
    if (!target) return;
    panel.open = false;
    // Focar o próprio destino preserva a navegação nativa nos dois casos:
    // títulos no manual e seções nomeadas por aria-labelledby nos docs.
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  });
}
