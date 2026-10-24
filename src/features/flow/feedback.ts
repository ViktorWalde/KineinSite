import { motionDuration } from "../../scripts/motion";

const namespace = "http://www.w3.org/2000/svg";
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let active: (() => void) | undefined;

function burst(element: Element, x: number, y: number): void {
  active?.();
  const duration = motionDuration("--duration-feedback", 640);
  if (!duration) return;
  const dialog = element.closest<HTMLDialogElement>("dialog[open]");
  const svg = document.createElementNS(namespace, "svg");
  svg.classList.add("vector-feedback");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.dataset["originX"] = String(x);
  svg.dataset["originY"] = String(y);
  let width = document.documentElement.clientWidth;
  let height = document.documentElement.clientHeight;
  if (dialog) {
    const box = dialog.getBoundingClientRect();
    const scaleX = box.width / dialog.offsetWidth;
    const scaleY = box.height / dialog.offsetHeight;
    x = (x - box.left) / scaleX - dialog.clientLeft + dialog.scrollLeft;
    y = (y - box.top) / scaleY - dialog.clientTop + dialog.scrollTop;
    width = dialog.clientWidth;
    height = dialog.clientHeight;
    svg.classList.add("vector-feedback-contained");
  }
  svg.setAttribute("viewBox", `0 0 ${String(width)} ${String(height)}`);
  const origin = document.createElementNS(namespace, "g");
  origin.setAttribute("transform", `translate(${String(x)} ${String(y)})`);
  svg.append(origin);
  const animations: Animation[] = [];
  for (let index = 0; index < 8; index++) {
    const angle = document.createElementNS(namespace, "g");
    angle.setAttribute("transform", `rotate(${String(index * 45)})`);
    const vector = document.createElementNS(namespace, "g");
    vector.classList.add("repulsion-vector");
    for (const className of ["repulsion-outline", "repulsion-arrow"]) {
      const path = document.createElementNS(namespace, "path");
      path.classList.add(className);
      path.setAttribute("d", "M -7 0 H 4 M 0 -3.25 L 4 0 L 0 3.25");
      vector.append(path);
    }
    angle.append(vector);
    origin.append(angle);
    animations.push(
      vector.animate([{ translate: "10px 0" }, { translate: "48px 0" }], {
        duration,
        easing: "cubic-bezier(0.16, 0.65, 0.3, 1)",
        fill: "both",
      }),
    );
  }
  (dialog ?? document.body).append(svg);
  const fade = svg.animate(
    [
      { opacity: 0 },
      { opacity: 0.9, offset: 0.15 },
      { opacity: 0.7, offset: 0.55 },
      { opacity: 0 },
    ],
    { duration, easing: "linear" },
  );
  animations.push(fade);
  let disposed = false;
  function cleanup(): void {
    if (disposed) return;
    disposed = true;
    for (const animation of animations) animation.cancel();
    svg.remove();
    if (active === cleanup) active = undefined;
  }
  active = cleanup;
  void fade.finished.then(cleanup, cleanup);
}

document.addEventListener("click", (event) => {
  if (
    reduced.matches ||
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  )
    return;
  const element = event.target;
  const control = element.closest(
    "button, a, summary, input, select, textarea, [role='button']",
  );
  if (control?.matches(":disabled, [aria-disabled='true'], [aria-busy='true']"))
    return;
  if (event.detail > 0) {
    burst(element, event.clientX, event.clientY);
  } else if (
    control instanceof HTMLElement &&
    control.matches("button, a, summary, [role='button']")
  ) {
    const box = control.getBoundingClientRect();
    if (!box.width || !box.height || box.bottom <= 0 || box.top >= innerHeight)
      return;
    burst(element, box.left + box.width / 2, box.top + box.height / 2);
  }
});

reduced.addEventListener("change", () => {
  if (reduced.matches) active?.();
});
window.addEventListener("pagehide", () => active?.());
window.addEventListener("resize", () => active?.());
document.addEventListener("visibilitychange", () => {
  if (document.hidden) active?.();
});
