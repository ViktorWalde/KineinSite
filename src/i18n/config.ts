export const defaultLocale = "pt-BR";
export const locales = {
  "pt-BR": { label: "Português (Brasil)", prefix: "", ogLocale: "pt_BR" },
  "en-US": { label: "English (US)", prefix: "en", ogLocale: "en_US" },
} as const;

export type Locale = keyof typeof locales;

export function isLocale(value: string): value is Locale {
  return Object.hasOwn(locales, value);
}
