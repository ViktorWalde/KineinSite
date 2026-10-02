import {
  accentChoices,
  accentStorageKey,
  defaultAccent,
  defaultTheme,
  themeChoices,
  themeStorageKey,
  type Accent,
  type Theme,
} from "./theme-preferences";

const root = document.documentElement;
const themeSelect = document.querySelector<HTMLSelectElement>("#theme-choice");
const accentSelect =
  document.querySelector<HTMLSelectElement>("#accent-choice");
const appearance = document.querySelector<HTMLDetailsElement>(".appearance");

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
  return value !== null && (themeChoices as readonly string[]).includes(value);
}

function isAccent(value: string | null): value is Accent {
  return value !== null && (accentChoices as readonly string[]).includes(value);
}

function applyTheme(theme: Theme): void {
  if (theme === defaultTheme) root.removeAttribute("data-theme");
  else root.dataset["theme"] = theme;
}

function applyAccent(accent: Accent): void {
  if (accent === defaultAccent) root.removeAttribute("data-accent");
  else root.dataset["accent"] = accent;
}

const savedTheme = storedValue(themeStorageKey);
const savedAccent = storedValue(accentStorageKey);
const initialTheme = isTheme(savedTheme) ? savedTheme : defaultTheme;
const initialAccent = isAccent(savedAccent) ? savedAccent : defaultAccent;

applyTheme(initialTheme);
applyAccent(initialAccent);

if (themeSelect && accentSelect) {
  themeSelect.value = initialTheme;
  accentSelect.value = initialAccent;
  root.dataset["enhanced"] = "true";

  themeSelect.addEventListener("change", () => {
    if (!isTheme(themeSelect.value)) return;
    applyTheme(themeSelect.value);
    saveValue(themeStorageKey, themeSelect.value);
  });

  accentSelect.addEventListener("change", () => {
    if (!isAccent(accentSelect.value)) return;
    applyAccent(accentSelect.value);
    saveValue(accentStorageKey, accentSelect.value);
  });
}

if (appearance) {
  appearance.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !appearance.open) return;
    appearance.open = false;
    appearance.querySelector("summary")?.focus();
  });

  document.addEventListener("pointerdown", (event) => {
    if (!appearance.open) return;
    const target = event.target;
    if (target instanceof Node && !appearance.contains(target)) {
      appearance.open = false;
    }
  });
}
