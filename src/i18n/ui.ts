import { defaultLocale, isLocale, type Locale } from "./config.ts";

const ptBR = {
  skip: "Pular para o conteúdo",
  home: "Kinein Vectis, página inicial",
  navigation: "Navegação principal",
  mobileNavigation: "Navegação móvel",
  explore: "Explorar o site",
  download: "Baixar",
  nav: {
    collaborate: "Colabore",
    guide: "Começar",
    manual: "Manual",
    docs: "Documentação",
    updates: "Atualizações",
  },
  appearance: {
    title: "Aparência",
    theme: "Tema",
    accent: "Cor de destaque",
    saved: "A preferência fica somente neste navegador.",
    themes: {
      system: "Sistema",
      light: "Claro",
      dark: "Escuro",
      warm: "Amber",
    },
    accents: { amber: "Âmbar", blue: "Azul", teal: "Verde-azulado" },
  },
  footer: {
    label: "Rodapé",
    intro:
      "Uma IDE open source que evolui para se especializar em sistemas embarcados. Experimente e faça parte dessa construção.",
    product: "Produto",
    learn: "Aprender",
    community: "Comunidade",
    updates: "Atualizações",
    download: "Baixar o beta",
    ideCode: "Código da IDE",
    guide: "Guia da IDE",
    docs: "Documentação",
    manual: "Manual da IDE",
    collaborate: "Colabore",
    contributors: "Quem contribui",
    about: "Sobre este site",
    siteCode: "Código do site",
    beta: "Beta público",
    platform: "para Linux x86_64. A IDE não tem telemetria.",
  },
};

// Catálogo de UI, sem publicar páginas editoriais parcialmente traduzidas.
const enUS: typeof ptBR = {
  skip: "Skip to content",
  home: "Kinein Vectis, home page",
  navigation: "Main navigation",
  mobileNavigation: "Mobile navigation",
  explore: "Explore the site",
  download: "Download",
  nav: {
    collaborate: "Contribute",
    guide: "Get started",
    manual: "Manual",
    docs: "Documentation",
    updates: "Updates",
  },
  appearance: {
    title: "Appearance",
    theme: "Theme",
    accent: "Accent color",
    saved: "Your preference is saved only in this browser.",
    themes: { system: "System", light: "Light", dark: "Dark", warm: "Amber" },
    accents: { amber: "Amber", blue: "Blue", teal: "Teal" },
  },
  footer: {
    label: "Footer",
    intro:
      "An open source IDE evolving toward a focus on embedded systems. Try it and help shape the project.",
    product: "Product",
    learn: "Learn",
    community: "Community",
    updates: "Updates",
    download: "Download beta",
    ideCode: "IDE source code",
    guide: "IDE guide",
    docs: "Documentation",
    manual: "IDE manual",
    collaborate: "Contribute",
    contributors: "Contributors",
    about: "About this site",
    siteCode: "Site source code",
    beta: "Public beta",
    platform: "for Linux x86_64. The IDE has no telemetry.",
  },
};

export const ui = { "pt-BR": ptBR, "en-US": enUS } satisfies Record<
  Locale,
  typeof ptBR
>;

export function uiFor(locale: string = defaultLocale) {
  return ui[isLocale(locale) ? locale : defaultLocale];
}
