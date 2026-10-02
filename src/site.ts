export const repositoryUrl = "https://github.com/ViktorWalde/KineinVectis";

// Versão pública atual. Ao lançar uma versão nova, troque estes dois valores e
// acrescente a nota em src/content/atualizacoes/ (ver README, "Publicar uma
// nota de atualização").
export const publicVersion = "0.3.5";
export const publicTag = "v0.3.5";

export function releaseUrlFor(tag: string): string {
  return `${repositoryUrl}/releases/tag/${tag}`;
}

export const releaseUrl = releaseUrlFor(publicTag);
export const manualUrl =
  "https://github.com/ViktorWalde/KineinVectis/blob/main/DocsPublic/manual.md";
export const installTutorialUrl =
  "https://github.com/ViktorWalde/KineinVectis/blob/main/DocsPublic/tutorial.md";
export const changelogUrl =
  "https://github.com/ViktorWalde/KineinVectis/blob/main/CHANGELOG.md";
export const siteRepositoryUrl = "https://github.com/ViktorWalde/KineinSite";
export const discordUrl = "https://discord.gg/cWRkUGUmQU";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function sitePath(path: `/${string}`): string {
  return `${base}${path}`;
}
