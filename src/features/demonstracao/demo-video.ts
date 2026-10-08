const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

for (const figure of document.querySelectorAll<HTMLElement>("[data-demo]")) {
  const video = figure.querySelector<HTMLVideoElement>("video");
  const toggle = figure.querySelector<HTMLButtonElement>("[data-demo-toggle]");
  const fullscreen = figure.querySelector<HTMLButtonElement>(
    "[data-demo-fullscreen]",
  );
  if (!video || !toggle) continue;
  const player = video;
  const button = toggle;
  let inView = false;
  let wanted = true;
  function eligible(): boolean {
    return (
      inView &&
      !document.hidden &&
      !figure.closest("[hidden]") &&
      !reducedMotion.matches
    );
  }
  function updateButton(): void {
    button.textContent = player.paused ? "Reproduzir" : "Pausar";
    button.setAttribute("aria-label", `${button.textContent} demonstração`);
  }
  function update(): void {
    player.autoplay = eligible() && wanted;
    if (eligible() && wanted) void player.play().catch(updateButton);
    else player.pause();
    updateButton();
  }
  player.muted = true;
  button.hidden = false;
  button.addEventListener("click", () => {
    wanted = player.paused;
    if (wanted) void player.play().catch(updateButton);
    else player.pause();
  });
  player.addEventListener("play", () => {
    wanted = true;
    updateButton();
  });
  player.addEventListener("pause", () => {
    if (eligible()) wanted = false;
    updateButton();
  });
  if (fullscreen && typeof player.requestFullscreen === "function") {
    fullscreen.hidden = false;
    fullscreen.addEventListener("click", () => {
      void player.requestFullscreen().catch(() => {});
    });
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = (entry?.intersectionRatio ?? 0) >= 0.15;
      update();
    },
    { threshold: 0.15 },
  );
  observer.observe(player);
  const panel = figure.closest<HTMLElement>(".demo-panel");
  if (panel)
    new MutationObserver(update).observe(panel, {
      attributes: true,
      attributeFilter: ["hidden"],
    });
  document.addEventListener("visibilitychange", update);
  reducedMotion.addEventListener("change", update);
  update();
}
