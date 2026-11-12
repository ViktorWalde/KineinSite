import { observeHudLayout } from "./hud-layout";

// Coordenação limitada à HUD. Preferências continuam em theme.ts.
const hud = document.querySelector<HTMLElement>(".site-header");
if (hud) initializeNavigation(hud);

function initializeNavigation(header: HTMLElement): void {
  const mobile = header.querySelector<HTMLDetailsElement>(".mobile-navigation");
  const appearance = header.querySelector<HTMLDetailsElement>(".appearance");
  if (!mobile || !appearance) return;
  const groups = [...header.querySelectorAll<HTMLDetailsElement>(".hud-group")];
  const panels = [...groups, mobile, appearance];
  const trigger = (panel: HTMLDetailsElement) =>
    panel.querySelector<HTMLElement>(":scope > summary");
  function close(panel: HTMLDetailsElement, restore = false): void {
    panel.open = false;
    if (panel === mobile)
      for (const group of groups)
        if (mobile.contains(group)) group.open = false;
    if (restore) trigger(panel)?.focus({ preventScroll: true });
  }
  function coordinate(panel: HTMLDetailsElement): void {
    if (!panel.open) {
      if (panel === mobile)
        for (const group of groups)
          if (mobile.contains(group)) group.open = false;
      return;
    }
    for (const peer of panels) {
      if (
        peer === panel ||
        (panel === mobile && mobile.contains(peer)) ||
        (panel !== mobile && peer === mobile && mobile.contains(panel))
      )
        continue;
      // O clique do contêiner limpa os filhos antes de abrir. Um toggle
      // atrasado dele preserva o grupo acionado na ação seguinte.
      close(peer);
    }
  }
  for (const panel of panels) {
    // toggle também cobre mudanças programáticas. Ler open evita eventos
    // atrasados reabrirem um peer; fechamento é sempre idempotente.
    panel.addEventListener("toggle", () => {
      if (panel.open) coordinate(panel);
      else if (panel === mobile) close(mobile);
    });
  }
  header.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const summary = target.closest("summary");
    if (
      summary &&
      panels.includes(summary.parentElement as HTMLDetailsElement)
    ) {
      const panel = summary.parentElement as HTMLDetailsElement;
      // Executa a exclusão na mesma ação; não depende da ordem dos toggles.
      if (!panel.open) {
        for (const peer of panels) {
          if (peer === panel || (peer === mobile && mobile.contains(panel)))
            continue;
          close(peer);
        }
      }
    }
    const link = target.closest<HTMLAnchorElement>("a[data-hud-item]");
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const group = link.closest<HTMLDetailsElement>(".hud-group");
    if (!group) return;
    const returnPanel = mobile.contains(link) ? mobile : group;
    close(group);
    if (mobile.contains(link)) close(mobile);
    if (link.target === "_blank") {
      trigger(returnPanel)?.focus({ preventScroll: true });
    } else if (
      link.origin === location.origin &&
      link.pathname === location.pathname &&
      link.search === location.search &&
      link.hash
    ) {
      focusAnchor(link.hash);
    }
  });
  header.addEventListener("keydown", (event) => {
    if (
      event.key !== "Escape" ||
      event.defaultPrevented ||
      !(event.target instanceof Element)
    )
      return;
    const owner = event.target.closest<HTMLDetailsElement>("details");
    // Um summary de grupo fechado pertence à camada móvel no segundo Escape.
    const panel =
      owner && panels.includes(owner) && owner.open
        ? owner
        : mobile.open && mobile.contains(event.target)
          ? mobile
          : undefined;
    if (!panel) return;
    event.preventDefault();
    event.stopPropagation();
    close(panel, true);
  });
  let pointerOrigin: Element | null = null;
  let pointerDown = false;
  document.addEventListener(
    "pointerdown",
    () => {
      pointerOrigin = document.activeElement;
      pointerDown = true;
    },
    { capture: true },
  );
  document.addEventListener("pointerup", () => {
    setTimeout(() => {
      pointerDown = false;
    }, 0);
  });
  document.addEventListener("pointercancel", () => {
    pointerDown = false;
  });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;
    const active =
      document.activeElement === document.body
        ? pointerOrigin
        : document.activeElement;
    pointerOrigin = null;
    pointerDown = false;
    // Filhos primeiro. Se M também fechar, seu summary será o retorno final.
    for (const panel of panels) {
      if (panel.open && !panel.contains(event.target)) {
        close(panel, active instanceof Node && panel.contains(active));
      }
    }
  });
  let lastHudFocus: Element | null = null;
  document.addEventListener("focusin", (event) => {
    lastHudFocus =
      event.target instanceof Element && header.contains(event.target)
        ? event.target
        : null;
  });
  header.addEventListener("focusout", (event) => {
    // Fechar um grupo em fluxo no pointerdown deslocaria o summary que
    // receberá o click. O click coordena o fechamento após aceitar seu alvo.
    if (pointerDown) return;
    // O navegador pode zerar activeElement antes de emitir a media query.
    // Só conservar o último foco se ele acabou de ser ocultado por CSS.
    if (
      event.relatedTarget === null &&
      event.target instanceof HTMLElement &&
      event.target.getBoundingClientRect().width > 0
    )
      lastHudFocus = null;
    const next = event.relatedTarget;
    if (next instanceof Node) {
      for (const panel of panels)
        if (panel.open && !panel.contains(next)) close(panel);
      return;
    }
    // Sem relatedTarget, aguarda a sequência nativa de foco terminar.
    setTimeout(() => {
      if (!document.hasFocus()) return;
      const active = document.activeElement;
      if (!active || active === document.body) return;
      for (const panel of panels)
        if (panel.open && !panel.contains(active)) close(panel);
    }, 0);
  });
  observeHudLayout(header, (isMobile) => {
    const active =
      document.activeElement === document.body &&
      lastHudFocus?.getBoundingClientRect().width === 0
        ? lastHudFocus
        : document.activeElement;
    const group =
      active instanceof Element
        ? active.closest<HTMLDetailsElement>(".hud-group")
        : null;
    const inMobile = active instanceof Node && mobile.contains(active);
    const inAppearance =
      active instanceof Node &&
      appearance.contains(active) &&
      active !== trigger(appearance);
    for (const panel of panels) close(panel);
    if (inAppearance) trigger(appearance)?.focus();
    else if (isMobile && group) trigger(mobile)?.focus();
    else if (!isMobile && inMobile) {
      const id =
        group?.dataset["hudGroup"] ??
        header.querySelector<HTMLElement>("[data-current-group]")?.dataset[
          "hudGroup"
        ] ??
        "product";
      header
        .querySelector<HTMLElement>(
          `.desktop-links [data-hud-group="${id}"] > summary`,
        )
        ?.focus();
    }
  });

  function anchorTarget(hash: string): HTMLElement | null {
    try {
      return hash
        ? document.getElementById(decodeURIComponent(hash.slice(1)))
        : null;
    } catch {
      return null;
    }
  }
  function focusAnchor(hash: string): void {
    const target = anchorTarget(hash);
    if (!target) return;
    if (!target.hasAttribute("tabindex")) {
      target.tabIndex = -1;
      target.addEventListener(
        "blur",
        () => {
          target.removeAttribute("tabindex");
        },
        { once: true },
      );
    }
    target.focus({ preventScroll: true });
  }
  function updateLocation(): void {
    for (const link of header.querySelectorAll<HTMLAnchorElement>(
      "a[data-hud-item]",
    )) {
      if (!link.hash || link.origin !== location.origin) continue;
      const current =
        header.querySelector("[data-current-group]") &&
        link.pathname === location.pathname &&
        link.hash === location.hash &&
        anchorTarget(link.hash);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  window.addEventListener("hashchange", updateLocation);
  // O SSG não recebe o fragmento. Na chegada de outra página, foco no alvo.
  updateLocation();
  if (location.hash) focusAnchor(location.hash);
}
