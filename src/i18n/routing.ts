import { defaultLocale, locales, type Locale } from "./config.ts";

type RouteTranslations = Partial<Record<Locale, `/${string}`>> & {
  "pt-BR": `/${string}`;
};

// Só registrar traduções completas e revisadas. O prefixo en está reservado;
// um catálogo de interface em inglês não torna o conteúdo traduzido.
export const publishedRoutes = {
  home: { "pt-BR": "/" },
  guide: { "pt-BR": "/aprender/" },
  install: { "pt-BR": "/aprender/ide/instalar/" },
  manual: { "pt-BR": "/manual/" },
  docs: { "pt-BR": "/documentacao/" },
  updates: { "pt-BR": "/atualizacoes/" },
  collaborate: { "pt-BR": "/colabore/" },
  rules: { "pt-BR": "/colabore/regras/" },
  site: { "pt-BR": "/documentacao/site/" },
} satisfies Record<string, RouteTranslations>;

export type RouteId = keyof typeof publishedRoutes;

export function pathWithBase(path: `/${string}`, base = "/"): string {
  return `${base.replace(/\/$/, "")}${path}`;
}

export function localeFromPath(pathname: string, base = "/"): Locale {
  const root = base.replace(/\/$/, "");
  if (root && pathname !== root && !pathname.startsWith(`${root}/`))
    return defaultLocale;
  const segment = pathname.slice(root.length).split("/")[1];
  return segment === locales["en-US"].prefix ? "en-US" : defaultLocale;
}

export function resolveRoute(id: RouteId, locale: Locale, base = "/") {
  const translations: RouteTranslations = publishedRoutes[id];
  const availableLocale = translations[locale] ? locale : defaultLocale;
  const path = translations[availableLocale] ?? translations[defaultLocale];
  return {
    href: pathWithBase(path, base),
    locale: availableLocale,
    isFallback: availableLocale !== locale,
  };
}

export function equivalentRoutes(pathname: string, base = "/") {
  const entry = Object.values(publishedRoutes).find((translations) =>
    Object.values(translations).some(
      (path) => pathWithBase(path, base) === pathname,
    ),
  );
  if (!entry) return [];
  return Object.entries(entry).map(([locale, path]) => ({
    locale: locale as Locale,
    href: pathWithBase(path, base),
  }));
}
