for (const viewer of document.querySelectorAll<HTMLElement>(
  "[data-image-viewer]",
)) {
  const dialog = viewer.querySelector<HTMLDialogElement>("dialog");
  const stage = dialog?.querySelector<HTMLElement>(".ide-image-stage");
  const zoom = dialog?.querySelector<HTMLButtonElement>("[data-image-zoom]");
  const title = dialog?.querySelector<HTMLElement>(".ide-image-toolbar p");
  if (!dialog || !stage || !zoom || !title) continue;
  const image = document.createElement("img");
  image.decoding = "async";
  stage.append(image);
  const modal = dialog;
  const zoomButton = zoom;
  for (const screenshot of viewer.querySelectorAll<HTMLImageElement>(
    ".guide-article img",
  )) {
    if (screenshot.closest("a")) continue;
    const link = document.createElement("a");
    link.className = "guide-image-open";
    link.href = screenshot.src;
    link.dataset["imageOpen"] = "";
    link.setAttribute("aria-label", "Ampliar captura do tutorial");
    link.setAttribute("aria-haspopup", "dialog");
    const hint = document.createElement("span");
    hint.className = "guide-image-hint";
    hint.textContent = "Ampliar captura ⤢";
    screenshot.replaceWith(link);
    link.append(screenshot, hint);
  }
  let opener: HTMLElement | null = null;
  function setZoom(original: boolean): void {
    modal.classList.toggle("is-zoomed", original);
    zoomButton.textContent = original
      ? "Ver imagem inteira"
      : "Tamanho original";
    zoomButton.setAttribute("aria-pressed", String(original));
  }
  for (const link of viewer.querySelectorAll<HTMLAnchorElement>(
    "[data-image-open]",
  )) {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      const thumbnail = link.querySelector<HTMLImageElement>("img");
      if (!thumbnail || typeof dialog.showModal !== "function") return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = thumbnail.alt;
      image.width =
        Number(thumbnail.getAttribute("width")) ||
        thumbnail.naturalWidth ||
        1600;
      image.height =
        Number(thumbnail.getAttribute("height")) ||
        thumbnail.naturalHeight ||
        1000;
      title.textContent =
        link
          .closest("figure")
          ?.querySelector("figcaption")
          ?.textContent.trim() ?? "Captura da Kinein Vectis";
      setZoom(matchMedia("(max-width: 40rem)").matches);
      dialog.showModal();
      stage.scrollTo(0, 0);
    });
  }
  zoom.addEventListener("click", () => {
    setZoom(!dialog.classList.contains("is-zoomed"));
  });
  dialog.addEventListener("close", () => {
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
}
