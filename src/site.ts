export const releaseUrl =
  "https://github.com/ViktorWalde/KineinVectis/releases/tag/v0.2.0";
export const manualUrl =
  "https://github.com/ViktorWalde/KineinVectis/blob/main/DocsPublic/manual.md";
export const changelogUrl =
  "https://github.com/ViktorWalde/KineinVectis/blob/main/CHANGELOG.md";
export const repositoryUrl = "https://github.com/ViktorWalde/KineinVectis";
export const siteRepositoryUrl = "https://github.com/ViktorWalde/KineinSite";
export const discordUrl = "https://discord.gg/cWRkUGUmQU";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function sitePath(path: `/${string}`): string {
  return `${base}${path}`;
}
