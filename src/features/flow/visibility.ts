import { flowRoutes } from "./paths";

// O navegador anima o SVG. JavaScript só pausa o que não está à vista;
// não há relógio de desenho, leitura de layout nem trabalho por quadro.
const fields = new Map<SVGSVGElement, boolean>();
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const initialized = new WeakSet<SVGSVGElement>();

function resize(field: SVGSVGElement, width: number, height: number): void {
  if (!width || !height) return;
  const routes = flowRoutes(width, height);
  field.setAttribute("viewBox", `0 0 ${String(width)} ${String(height)}`);
  field
    .querySelectorAll<SVGPathElement>(".flow-track")
    .forEach((path, index) => {
      path.setAttribute("d", routes[index] ?? "");
    });
  field
    .querySelectorAll<SVGAnimateMotionElement>("animateMotion")
    .forEach((motion, index) => {
      motion.setAttribute("path", routes[index] ?? "");
    });
  if (!initialized.has(field)) {
    for (const animation of field.querySelectorAll<SVGAnimationElement>(
      "animateMotion, animate",
    ))
      animation.beginElement();
    const delay = Math.abs(
      Number.parseFloat(
        getComputedStyle(field.parentElement ?? field).getPropertyValue(
          "--flow-delay",
        ),
      ) || 8,
    );
    field.setCurrentTime(delay);
  }
  initialized.add(field);
  field.setAttribute("data-flow-ready", "");
  update();
}

function update(): void {
  for (const [field, visible] of fields) {
    const active =
      visible && !document.hidden && !reduced.matches && initialized.has(field);
    field.toggleAttribute("data-flow-running", active);
    if (active) field.unpauseAnimations();
    else field.pauseAnimations();
  }
}

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.target instanceof SVGSVGElement)
      fields.set(entry.target, entry.isIntersecting);
  }
  update();
});
const sizes = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.target instanceof SVGSVGElement)
      resize(entry.target, entry.contentRect.width, entry.contentRect.height);
  }
});

for (const field of document.querySelectorAll<SVGSVGElement>(".flow-lines")) {
  fields.set(field, false);
  field.pauseAnimations();
  observer.observe(field);
  sizes.observe(field);
}

document.addEventListener("visibilitychange", update);
reduced.addEventListener("change", update);
window.addEventListener("pagehide", () => {
  for (const field of fields.keys()) {
    field.removeAttribute("data-flow-running");
    field.pauseAnimations();
  }
});
window.addEventListener("pageshow", update);
