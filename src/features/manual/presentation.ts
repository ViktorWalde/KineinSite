// Transforma somente o HTML de apresentação. O Markdown e seu hash
// continuam sendo os da release oficial.
export function prepareManualPresentation(html: string): {
  beforeLayout: string;
  afterLayout: string;
} {
  let tableHeading = "";
  const prepared = html
    .replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/, "")
    .replace(
      /<h[23]\b[^>]*>[\s\S]*?<\/h[23]>|<table\b[^>]*>[\s\S]*?<\/table>/g,
      (markup) => {
        if (markup.startsWith("<h")) {
          tableHeading = /\bid="([^"]+)"/.exec(markup)?.[1] ?? "";
          return markup;
        }
        if (!tableHeading)
          throw new Error("Tabela do manual sem um título de referência.");
        return `<section class="manual-table-scroll" tabindex="0" aria-labelledby="${tableHeading}">${markup}</section>`;
      },
    );
  const layout =
    /<h2\b[^>]*>2\. O layout<\/h2>\s*(<pre\b[^>]*>[\s\S]*?<\/pre>)/.exec(
      prepared,
    );
  const diagram = layout?.[1];
  if (!layout || !diagram?.includes("App Bar:"))
    throw new Error(
      "O layout do manual mudou. Confira a captura antes de atualizar sua apresentação.",
    );
  const diagramStart = layout.index + layout[0].indexOf(diagram);
  return {
    beforeLayout: prepared.slice(0, diagramStart),
    afterLayout: prepared.slice(diagramStart + diagram.length),
  };
}
