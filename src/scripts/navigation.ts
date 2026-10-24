export {};

const navigation =
  document.querySelector<HTMLDetailsElement>(".mobile-navigation");
if (navigation) {
  const menu = navigation;
  const trigger = menu.querySelector("summary");
  function close(restoreFocus = false): void {
    if (!menu.open) return;
    menu.open = false;
    if (restoreFocus) trigger?.focus();
  }
  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.open) return;
    event.preventDefault();
    close(true);
  });
  menu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) close();
  });
  document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !menu.contains(event.target)) close();
  });
  menu.addEventListener("focusout", (event) => {
    if (
      event.relatedTarget instanceof Node &&
      !menu.contains(event.relatedTarget)
    )
      close();
  });
  matchMedia("(width <= 54rem)").addEventListener("change", () => {
    close();
  });
}
