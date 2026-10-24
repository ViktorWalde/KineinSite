import { isRecord, type Repository } from "./model";
import { repositories } from "./repositories";

export const refreshInterval = 5 * 60_000;
interface Snapshot {
  records: unknown[];
  updatedAt: number;
  truncated: boolean;
}
export interface Feed<T> {
  items: T[];
  updatedAt: number;
  stale: boolean;
  truncated: boolean;
}
type Endpoint = "issues" | "contributors";
const memory = new Map<string, Snapshot>();
const cachePrefix = "kinein:colabore:v1:";

function readCache(key: string): Snapshot | undefined {
  const current = memory.get(key);
  if (current) return current;
  try {
    const raw: unknown = JSON.parse(
      sessionStorage.getItem(cachePrefix + key) ?? "null",
    );
    if (
      isRecord(raw) &&
      Array.isArray(raw["records"]) &&
      raw["records"].length <= 1000 &&
      typeof raw["updatedAt"] === "number" &&
      raw["updatedAt"] <= Date.now() &&
      Date.now() - raw["updatedAt"] < 7 * 24 * 60 * 60_000 &&
      typeof raw["truncated"] === "boolean"
    ) {
      return {
        records: raw["records"] as unknown[],
        updatedAt: raw["updatedAt"],
        truncated: raw["truncated"],
      };
    }
  } catch {
    /* O painel também funciona sem armazenamento disponível. */
  }
  return undefined;
}
function saveCache(key: string, snapshot: Snapshot): void {
  memory.set(key, snapshot);
  try {
    sessionStorage.setItem(cachePrefix + key, JSON.stringify(snapshot));
  } catch {
    /* Cache em memória ainda disponível. */
  }
}

class GitHubError extends Error {
  constructor(public retryAt = 0) {
    super("Não foi possível consultar o GitHub.");
  }
}
let retryAt = 0;
async function fetchSnapshot(
  repository: Repository,
  endpoint: Endpoint,
): Promise<Snapshot> {
  if (Date.now() < retryAt) throw new GitHubError(retryAt);
  const records: unknown[] = [];
  const prefix = `https://api.github.com/repos/${repository.slug}/${endpoint}`;
  let next =
    endpoint === "issues"
      ? `${prefix}?state=all&sort=updated&direction=desc&per_page=100`
      : `${prefix}?per_page=100&anon=false`;
  let truncated = false;
  // Limite explícito de dez páginas: não prometer totais completos ao
  // atingir o limite. A interface informa que está mostrando um recorte.
  for (let page = 0; next && page < 10; page++) {
    const response = await fetch(next, {
      headers: { Accept: "application/vnd.github+json" },
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok && response.status !== 204) {
      if (response.status === 403 || response.status === 429) {
        const reset = Number(response.headers.get("x-ratelimit-reset")) * 1000;
        const delay = Number(response.headers.get("retry-after")) * 1000;
        retryAt = Math.max(
          Date.now() + refreshInterval,
          reset || 0,
          Date.now() + delay,
        );
      }
      throw new GitHubError(retryAt);
    }
    const data: unknown = response.status === 204 ? [] : await response.json();
    if (!Array.isArray(data)) throw new GitHubError();
    records.push(...(data as unknown[]));
    const link = response.headers
      .get("link")
      ?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
    next = link?.startsWith(`${prefix}?`) ? link : "";
    truncated = Boolean(next);
  }
  return { records, updatedAt: Date.now(), truncated };
}

export async function loadFeed<T>(
  endpoint: Endpoint,
  parse: (records: unknown[], repository: Repository) => T[],
  force = false,
): Promise<Feed<T>> {
  const results = await Promise.all(
    repositories.map(async (repository) => {
      const key = `${repository.slug}:${endpoint}`;
      const cached = readCache(key);
      let snapshot = cached;
      let stale = false;
      if (
        force ||
        !cached ||
        Date.now() - cached.updatedAt >= refreshInterval
      ) {
        try {
          snapshot = await fetchSnapshot(repository, endpoint);
          saveCache(key, snapshot);
        } catch (error) {
          if (!cached) throw error;
          stale = true;
        }
      }
      if (!snapshot) throw new GitHubError();
      return {
        items: parse(snapshot.records, repository),
        updatedAt: snapshot.updatedAt,
        stale,
        truncated: snapshot.truncated,
      };
    }),
  );
  return {
    items: results.flatMap((result) => result.items),
    updatedAt: Math.min(...results.map((result) => result.updatedAt)),
    stale: results.some((result) => result.stale),
    truncated: results.some((result) => result.truncated),
  };
}

export function feedMessage(feed: Feed<unknown>): string {
  const date = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(feed.updatedAt);
  return `${feed.stale ? "GitHub indisponível. Última consulta válida" : "Consultado no GitHub"}: ${date}.${feed.truncated ? " Limite de consulta atingido; os números representam somente o recorte carregado." : ""}`;
}

export function autoRefresh(update: () => Promise<void>): void {
  globalThis.setInterval(() => {
    if (!document.hidden) void update();
  }, refreshInterval);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) void update();
  });
}
