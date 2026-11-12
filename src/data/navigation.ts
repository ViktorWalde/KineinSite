import { defaultLocale, type Locale } from "../i18n/config.ts";
import { pathWithBase, resolveRoute, type RouteId } from "../i18n/routing.ts";
import { uiFor } from "../i18n/ui.ts";
import {
  discordUrl,
  publicTag,
  repositoryUrl,
  siteRepositoryUrl,
  type SiteSection,
} from "../site.ts";

const externalDestinations = { repositoryUrl, siteRepositoryUrl, discordUrl };
type Destination =
  | { type: "route"; route: RouteId; fragment?: string }
  | { type: "entry"; entry: "install" | "public-note" }
  | { type: "external"; key: keyof typeof externalDestinations };
type LabelKey = keyof ReturnType<typeof labelsFor>;
interface NavigationItem {
  id: string;
  labelKey: LabelKey;
  destination: Destination;
}
interface NavigationGroup {
  id: string;
  items: readonly NavigationItem[];
}

// Identidade e ordem únicas; URLs e textos vêm das fontes existentes.
export const navigationGroups = [
  {
    id: "product",
    items: [
      {
        id: "product-overview",
        labelKey: "hud.overview",
        destination: { type: "route", route: "home" },
      },
      {
        id: "product-interface",
        labelKey: "hud.interface",
        destination: { type: "route", route: "home", fragment: "interface" },
      },
      {
        id: "product-status",
        labelKey: "hud.availableBeta",
        destination: { type: "route", route: "home", fragment: "estado" },
      },
      {
        id: "product-demos",
        labelKey: "hud.demos",
        destination: {
          type: "route",
          route: "home",
          fragment: "desenvolvimento",
        },
      },
    ],
  },
  {
    id: "docs",
    items: [
      {
        id: "docs-overview",
        labelKey: "nav.docs",
        destination: { type: "route", route: "docs" },
      },
      {
        id: "docs-start",
        labelKey: "nav.guide",
        destination: { type: "route", route: "guide" },
      },
      {
        id: "docs-install",
        labelKey: "hud.install",
        destination: { type: "entry", entry: "install" },
      },
      {
        id: "docs-manual",
        labelKey: "nav.manual",
        destination: { type: "route", route: "manual" },
      },
      {
        id: "docs-references",
        labelKey: "hud.references",
        destination: { type: "route", route: "docs", fragment: "referencias" },
      },
    ],
  },
  {
    id: "community",
    items: [
      {
        id: "community-overview",
        labelKey: "nav.collaborate",
        destination: { type: "route", route: "collaborate" },
      },
      {
        id: "community-rules",
        labelKey: "hud.rules",
        destination: { type: "route", route: "rules" },
      },
      {
        id: "community-ide-code",
        labelKey: "footer.ideCode",
        destination: { type: "external", key: "repositoryUrl" },
      },
      {
        id: "community-site-code",
        labelKey: "footer.siteCode",
        destination: { type: "external", key: "siteRepositoryUrl" },
      },
      {
        id: "community-discord",
        labelKey: "hud.discord",
        destination: { type: "external", key: "discordUrl" },
      },
    ],
  },
  {
    id: "updates",
    items: [
      {
        id: "updates-overview",
        labelKey: "hud.versionHistory",
        destination: { type: "route", route: "updates" },
      },
      {
        id: "updates-public-note",
        labelKey: "hud.versionNotes",
        destination: { type: "entry", entry: "public-note" },
      },
    ],
  },
] as const satisfies readonly NavigationGroup[];
export type HudGroup = (typeof navigationGroups)[number]["id"];
export const groupForSection: Record<SiteSection, HudGroup> = {
  home: "product",
  guide: "docs",
  manual: "docs",
  docs: "docs",
  collaborate: "community",
  updates: "updates",
};

function labelsFor(locale: Locale) {
  const messages = uiFor(locale);
  return {
    "hud.overview": messages.hud.overview,
    "hud.interface": messages.hud.interface,
    "hud.availableBeta": messages.hud.availableBeta,
    "hud.demos": messages.hud.demos,
    "hud.install": messages.hud.install,
    "hud.references": messages.hud.references,
    "hud.rules": messages.hud.rules,
    "hud.discord": messages.hud.discord,
    "hud.versionHistory": messages.hud.versionHistory,
    "hud.versionNotes": messages.hud.versionNotes,
    "nav.docs": messages.nav.docs,
    "nav.guide": messages.nav.guide,
    "nav.manual": messages.nav.manual,
    "nav.collaborate": messages.nav.collaborate,
    "footer.ideCode": messages.footer.ideCode,
    "footer.siteCode": messages.footer.siteCode,
  };
}

interface GuideSource {
  id: string;
  data: { status: string };
}
interface NoteSource {
  id: string;
  data: { tag: string; version: string };
}
interface Sources {
  guides: readonly GuideSource[];
  updates: readonly NoteSource[];
  locale?: Locale;
  base?: string;
}

export function resolveNavigation({
  guides,
  updates,
  locale = defaultLocale,
  base = "/",
}: Sources) {
  const install = guides.find(
    (entry) => entry.id === "ide/instalar" && entry.data.status === "verified",
  );
  if (!install)
    throw new Error(
      "HUD: instalação obrigatória não publicada (ide/instalar).",
    );
  const publicNote = updates.find((entry) => entry.data.tag === publicTag);
  const labels = labelsFor(locale);
  return navigationGroups.map((group) => ({
    id: group.id,
    label: uiFor(locale).hud.groups[group.id],
    items: group.items.flatMap((item: NavigationItem) => {
      const target = item.destination;
      const external = target.type === "external";
      if (
        target.type === "entry" &&
        target.entry === "public-note" &&
        !publicNote
      )
        return [];
      const resolved =
        target.type === "route"
          ? resolveRoute(target.route, locale, base)
          : {
              locale: defaultLocale,
              isFallback: !external && locale !== defaultLocale,
              href:
                target.type === "external"
                  ? externalDestinations[target.key]
                  : pathWithBase(
                      target.entry === "install"
                        ? `/aprender/${install.id}/`
                        : `/atualizacoes/${publicNote?.id ?? ""}/`,
                      base,
                    ),
            };
      return [
        {
          id: item.id,
          label: labels[item.labelKey].replace(
            "{version}",
            publicNote?.data.version ?? "",
          ),
          ...resolved,
          href:
            resolved.href +
            (target.type === "route" && target.fragment
              ? `#${target.fragment}`
              : ""),
          external,
        },
      ];
    }),
  }));
}
export type ResolvedNavigation = ReturnType<typeof resolveNavigation>;
