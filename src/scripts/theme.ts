type Theme = "system" | "light" | "dark" | "warm";
type Accent = "amber" | "blue" | "teal";

const themeChoices: readonly Theme[] = ["system", "light", "dark", "warm"];
const accentChoices: readonly Accent[] = ["amber", "blue", "teal"];
const root = document.documentElement;
const themeSelect = document.querySelector<HTMLSelectElement>("#theme-choice");
const accentSelect =
  document.querySelector<HTMLSelectElement>("#accent-choice");

function storedValue(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // O tema continua utilizável mesmo sem armazenamento local.
  }
}

function isTheme(value: string | null): value is Theme {
  return value !== null && themeChoices.includes(value as Theme);
}

function isAccent(value: string | null): value is Accent {
  return value !== null && accentChoices.includes(value as Accent);
}

function applyTheme(theme: Theme): void {
  if (theme === "system") root.removeAttribute("data-theme");
  else root.dataset["theme"] = theme;
}

function applyAccent(accent: Accent): void {
  if (accent === "amber") root.removeAttribute("data-accent");
  else root.dataset["accent"] = accent;
}

const savedTheme = storedValue("kinein-theme");
const savedAccent = storedValue("kinein-accent");
const initialTheme = isTheme(savedTheme) ? savedTheme : "system";
const initialAccent = isAccent(savedAccent) ? savedAccent : "amber";

applyTheme(initialTheme);
applyAccent(initialAccent);

if (themeSelect && accentSelect) {
  themeSelect.value = initialTheme;
  accentSelect.value = initialAccent;
  root.dataset["enhanced"] = "true";

  themeSelect.addEventListener("change", () => {
    if (!isTheme(themeSelect.value)) return;
    applyTheme(themeSelect.value);
    saveValue("kinein-theme", themeSelect.value);
  });

  accentSelect.addEventListener("change", () => {
    if (!isAccent(accentSelect.value)) return;
    applyAccent(accentSelect.value);
    saveValue("kinein-accent", accentSelect.value);
  });
}
