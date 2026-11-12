import { defaultLocale, type Locale } from "./config.ts";

// Datas editoriais sem horário não podem voltar um dia no fuso do leitor.
export function formatDate(date: Date, locale: Locale = defaultLocale): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
