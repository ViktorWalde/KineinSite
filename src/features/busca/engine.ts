import { pathWithBase } from "../../i18n/routing";

export interface SearchSection {
  title: string;
  url: string;
  plain_excerpt?: string;
}
export interface SearchPage {
  url: string;
  meta: Record<string, string | undefined>;
  plain_excerpt: string;
  sub_results?: SearchSection[];
}
interface Pagefind {
  options: (options: { baseUrl: string; noWorker: boolean }) => Promise<void>;
  search: (
    query: string,
    options: { filters: { language: string } },
  ) => Promise<{ results: { data: () => Promise<SearchPage> }[] }>;
  destroy: () => Promise<void>;
}
let pending: Promise<Pagefind> | undefined;
let loaded: Pagefind | undefined;
let attempt = 0;

function timeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Search timeout"));
    }, 12000);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(
          error instanceof Error ? error : new Error("Search unavailable"),
        );
      },
    );
  });
}
async function load(): Promise<Pagefind> {
  if (typeof Worker === "undefined")
    throw new Error("Search requires a worker");
  pending ??= (async () => {
    const url = new URL(
      pathWithBase("/pagefind/pagefind.js", import.meta.env.BASE_URL),
      location.origin,
    );
    if (attempt) url.searchParams.set("retry", String(attempt));
    const engine = (await import(/* @vite-ignore */ url.href)) as Pagefind;
    await engine.options({
      baseUrl: pathWithBase("/", import.meta.env.BASE_URL),
      noWorker: false,
    });
    loaded = engine;
    return engine;
  })().catch((error: unknown) => {
    pending = undefined;
    throw error;
  });
  return timeout(pending);
}

export async function searchPages(
  query: string,
  language: string,
): Promise<{ count: number; pages: SearchPage[] }> {
  const engine = await load();
  const results = await timeout(
    engine.search(query, { filters: { language } }),
  );
  const pages = await timeout(
    Promise.all(results.results.slice(0, 6).map((result) => result.data())),
  );
  return { count: results.results.length, pages };
}

export async function resetSearch(): Promise<void> {
  attempt++;
  pending = undefined;
  const engine = loaded;
  loaded = undefined;
  if (engine) await timeout(engine.destroy());
}
