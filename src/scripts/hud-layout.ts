// O CSS é a fonte da composição exposta, inclusive com texto ampliado.
// A altura real é necessária: o candidato com texto 200% encobria âncoras
// e índices sticky quando usava o offset fixo da moldura anterior.
export function observeHudLayout(
  header: HTMLElement,
  onChange: (mobile: boolean) => void,
): void {
  const desktop = header.querySelector<HTMLElement>(".desktop-links");
  if (!desktop) return;
  const root = document.documentElement;
  let previousMobile = getComputedStyle(desktop).display === "none";
  function sync(): void {
    if (!desktop) return;
    const mobile = getComputedStyle(desktop).display === "none";
    const changed = mobile !== previousMobile;
    previousMobile = mobile;
    // Aplicar a posição final antes de devolver foco: no móvel o header
    // sai do sticky, e o controle pode precisar entrar na janela novamente.
    root.dataset["hudLayout"] = mobile ? "mobile" : "desktop";
    root.style.setProperty(
      "--hud-height",
      mobile ? "0px" : `${String(header.getBoundingClientRect().height)}px`,
    );
    if (changed) onChange(mobile);
  }
  sync();
  new ResizeObserver(sync).observe(header);
}
