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
const appearance = document.querySelector<HTMLDetailsElement>(".appearance");
const themeInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]'),
);
const accentInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[name="accent"]'),
);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

// A troca de tema passa pela transição nativa: a página inteira esmaece de
// uma vez para a nova paleta. Transições de cor por elemento deixavam partes
// trocando em tempos diferentes. Sem suporte, ou com movimento reduzido, a
// troca é imediata. data-switching escolhe a animação em base.css.
function withTransition(update: () => void): void {
  if (!("startViewTransition" in document) || reducedMotion.matches) {
    update();
    return;
  }
  root.dataset["switching"] = "theme";
  const transition = document.startViewTransition(update);
  void transition.finished.finally(() => {
    delete root.dataset["switching"];
  });
}

const savedTheme = storedValue(themeStorageKey);
const savedAccent = storedValue(accentStorageKey);
const initialTheme = isTheme(savedTheme) ? savedTheme : defaultTheme;
const initialAccent = isAccent(savedAccent) ? savedAccent : defaultAccent;

applyTheme(initialTheme);
applyAccent(initialAccent);

if (themeInputs.length > 0 && accentInputs.length > 0) {
  for (const input of themeInputs) input.checked = input.value === initialTheme;
  for (const input of accentInputs) {
    input.checked = input.value === initialAccent;
  }
  root.dataset["enhanced"] = "true";

  for (const input of themeInputs) {
    input.addEventListener("change", () => {
      const theme = input.value;
      if (!input.checked || !isTheme(theme)) return;
      withTransition(() => {
        applyTheme(theme);
      });
      saveValue(themeStorageKey, theme);
    });
  }

  for (const input of accentInputs) {
    input.addEventListener("change", () => {
      const accent = input.value;
      if (!input.checked || !isAccent(accent)) return;
      withTransition(() => {
        applyAccent(accent);
      });
      saveValue(accentStorageKey, accent);
    });
  }
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
