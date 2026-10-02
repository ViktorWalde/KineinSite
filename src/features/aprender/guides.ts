import { getCollection, type CollectionEntry } from "astro:content";

export type Guide = CollectionEntry<"aprender">;
export type GuideSection = "ide" | "projetos";

export const sectionNames: Record<GuideSection, string> = {
  ide: "Guia da IDE",
  projetos: "Projetos guiados",
};

// A pasta do capítulo diz a seção: ide/... ou projetos/...
export function sectionOf(guide: Guide): GuideSection {
  return guide.id.startsWith("projetos/") ? "projetos" : "ide";
}

// Só capítulos "verified" viram página. Ordem: o Guia da IDE antes dos
// projetos, e dentro de cada seção o campo order.
export async function getPublishedGuides(): Promise<Guide[]> {
  const entries = await getCollection(
    "aprender",
    ({ data }) => data.status === "verified",
  );
  return entries.sort((a, b) => {
    const sa = sectionOf(a);
    const sb = sectionOf(b);
    if (sa !== sb) return sa === "ide" ? -1 : 1;
    return a.data.order - b.data.order;
  });
}
