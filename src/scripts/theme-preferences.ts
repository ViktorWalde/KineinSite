// Um dono para as preferências de aparência: o script que roda antes da
// primeira pintura (BaseLayout) e o painel de tema (theme.ts) leem daqui.
export const themeChoices = ["system", "light", "dark", "warm"] as const;
export const accentChoices = ["amber", "blue", "teal"] as const;

export type Theme = (typeof themeChoices)[number];
export type Accent = (typeof accentChoices)[number];

// O padrão não grava atributo: "system" segue o sistema pelo CSS e "amber" é
// a paleta base de tokens.css.
export const defaultTheme: Theme = "system";
export const defaultAccent: Accent = "amber";
export const themeStorageKey = "kinein-theme";
export const accentStorageKey = "kinein-accent";

// Valores que o script do <head> (BaseLayout) aceita do armazenamento local.
export const themeBootValues = {
  themeKey: themeStorageKey,
  accentKey: accentStorageKey,
  themes: themeChoices.filter((theme) => theme !== defaultTheme),
  accents: accentChoices.filter((accent) => accent !== defaultAccent),
};
