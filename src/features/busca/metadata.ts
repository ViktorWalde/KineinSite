import type { SiteSection } from "../../site";

export type SearchType =
  | "produto"
  | "guia"
  | "estudo"
  | "manual"
  | "atualizacao"
  | "documentacao"
  | "comunidade";
export interface SearchMetadata {
  type?: SearchType;
  version?: string;
  status?: string;
  source?: string;
  revision?: string;
}

const types: Record<SiteSection, SearchType> = {
  home: "produto",
  guide: "guia",
  manual: "manual",
  updates: "atualizacao",
  docs: "documentacao",
  collaborate: "comunidade",
};

export function searchMetadata(
  current: SiteSection | undefined,
  locale: string,
  meta: SearchMetadata,
) {
  return {
    type: meta.type ?? (current ? types[current] : "documentacao"),
    language: locale,
    ...meta,
  };
}
