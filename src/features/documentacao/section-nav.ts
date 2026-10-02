// Marca no índice lateral (DocsSidebar) a seção em leitura: a última cujo topo
// já passou de 30% da altura da janela. Sem JavaScript, o índice continua
// sendo uma lista de âncoras comum.
const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('.docs-sidebar a[href^="#"]'),
);
const sections = links.map((link) =>
  document.getElementById(decodeURIComponent(link.hash.slice(1))),
);
let scheduled = false;

function update(): void {
  scheduled = false;
  const line = window.innerHeight * 0.3;
  const atEnd =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;
  let current = -1;
  sections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= line) current = index;
  });
  if (atEnd) current = sections.length - 1;
  links.forEach((link, index) => {
    if (index === current) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

function schedule(): void {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(update);
}

if (links.length > 0) {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
}
