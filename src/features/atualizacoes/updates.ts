import { getCollection, type CollectionEntry } from "astro:content";

export type UpdateEntry = CollectionEntry<"atualizacoes">;

// Mais recente primeiro. Em empate de data, a versão maior vem antes.
export async function getUpdates(): Promise<UpdateEntry[]> {
  const entries = await getCollection("atualizacoes");
  return entries.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() ||
      b.data.version.localeCompare(a.data.version, "en", { numeric: true }),
  );
}

export async function getLatestUpdate(): Promise<UpdateEntry | undefined> {
  return (await getUpdates())[0];
}
