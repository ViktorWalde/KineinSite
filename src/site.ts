import { pathWithBase } from "./i18n/routing.ts";
export { formatDate } from "./i18n/utils.ts";

export const repositoryUrl = "https://github.com/ViktorWalde/KineinVectis";

export type SiteSection =
  "home" | "guide" | "manual" | "docs" | "updates" | "collaborate";

// Versão pública atual. Ao lançar uma versão nova, troque estes dois valores e
// acrescente a nota em src/content/atualizacoes/ (ver README, "Publicar uma
// nota de atualização").
export const publicVersion = "0.3.5";
export const publicTag = "v0.3.5";

export function releaseUrlFor(tag: string): string {
  return `${repositoryUrl}/releases/tag/${tag}`;
}

export const releaseUrl = releaseUrlFor(publicTag);
export const changelogUrl =
  "https://github.com/ViktorWalde/KineinVectis/blob/main/CHANGELOG.md";
export const siteRepositoryUrl = "https://github.com/ViktorWalde/KineinSite";
export const discordUrl = "https://discord.gg/cWRkUGUmQU";
export const ideContributionUrl = `${repositoryUrl}/blob/main/CONTRIBUTING.md`;
export const ideRoadmapUrl = `${repositoryUrl}/blob/main/DocsPublic/roadmaps/40-estado-e-continuidade.md`;

export function sitePath(path: `/${string}`): string {
  return pathWithBase(path, import.meta.env.BASE_URL);
}
