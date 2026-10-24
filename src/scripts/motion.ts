const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const running = new Set<Animation>();

export function motionDuration(token: `--${string}`, fallback: number): number {
  if (reducedMotion.matches) return 0;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const number = Number.parseFloat(value);
  return Number.isFinite(number)
    ? number * (value.endsWith("ms") ? 1 : 1000)
    : fallback;
}

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches)
    for (const animation of running) animation.cancel();
});

// Preserva nós que não mudaram: uma atualização da API não fecha descrições
// nem refaz todos os cartões. Novos itens recebem apenas uma entrada curta.
export function updateList(container: HTMLElement, next: HTMLElement[]): void {
  const previous = [...container.children].filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  );
  const byKey = new Map(
    previous.map((node) => [node.dataset["itemKey"], node]),
  );
  const entering: HTMLElement[] = [];
  const resolved = next.map((node, index) => {
    const key = node.dataset["itemKey"];
    const old = key ? byKey.get(key) : previous[index];
    if (
      old &&
      (key
        ? old.dataset["itemVersion"] === node.dataset["itemVersion"]
        : old.tagName === node.tagName && old.textContent === node.textContent)
    )
      return old;
    if (old) {
      const details = [...node.querySelectorAll("details")];
      [...old.querySelectorAll("details")].forEach((detail, detailIndex) => {
        if (details[detailIndex]) details[detailIndex].open = detail.open;
      });
    }
    entering.push(node);
    return node;
  });
  if (
    previous.length === resolved.length &&
    previous.every((node, index) => node === resolved[index])
  )
    return;
  const focused =
    container.contains(document.activeElement) &&
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : undefined;
  container.replaceChildren(...resolved);
  if (focused?.isConnected) focused.focus({ preventScroll: true });
  const duration = motionDuration("--duration-base", 240);
  if (!duration) return;
  entering.slice(0, 12).forEach((node, index) => {
    const bounds = node.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
    const animation = node.animate(
      [
        { opacity: 0, translate: "0 4px" },
        { opacity: 1, translate: "0 0" },
      ],
      {
        duration,
        delay: Math.min(index, 4) * 25,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      },
    );
    running.add(animation);
    void animation.finished.then(
      () => {
        running.delete(animation);
      },
      () => {
        running.delete(animation);
      },
    );
  });
}
