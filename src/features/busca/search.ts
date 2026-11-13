import { uiFor } from "../../i18n/ui";
import { resetSearch, searchPages } from "./engine";
import { renderSearchResults } from "./results";

const trigger = document.querySelector<HTMLButtonElement>(".search-trigger");
const dialog = document.querySelector<HTMLDialogElement>(".search-dialog");
const input = document.querySelector<HTMLInputElement>("#search-query");
const list = document.querySelector<HTMLOListElement>("#search-results");
const status = document.querySelector<HTMLElement>(".search-status");
const retry = document.querySelector<HTMLButtonElement>(".search-retry");
const close = document.querySelector<HTMLButtonElement>(".search-close");
if (trigger && dialog && input && list && status && retry && close) {
  initialize({ trigger, dialog, input, list, status, retry, close });
}
function initialize(elements: {
  trigger: HTMLButtonElement;
  dialog: HTMLDialogElement;
  input: HTMLInputElement;
  list: HTMLOListElement;
  status: HTMLElement;
  retry: HTMLButtonElement;
  close: HTMLButtonElement;
}): void {
  const { trigger, dialog, input, list, status, retry, close } = elements;
  if (typeof dialog.showModal !== "function") return;
  const locale = document.documentElement.lang;
  const messages = uiFor(locale).search;
  let sequence = 0;
  let timer = 0;
  let returnTarget: HTMLElement = trigger;
  function invalidate(): number {
    window.clearTimeout(timer);
    return ++sequence;
  }
  function state(name: string, text: string): void {
    dialog.dataset["state"] = name;
    status.textContent = text;
    list.setAttribute("aria-busy", String(name === "loading"));
    retry.hidden = name !== "error";
  }
  async function run(): Promise<void> {
    const request = invalidate();
    const query = input.value.trim();
    list.replaceChildren();
    if (!query) {
      state("initial", messages.initial);
      return;
    }
    state("loading", messages.loading);
    try {
      const result = await searchPages(query, locale);
      if (request !== sequence || !dialog.open) return;
      renderSearchResults(list, result.pages, locale);
      state(
        result.count ? "results" : "empty",
        result.count
          ? (result.count === 1 ? messages.one : messages.count).replace(
              "{count}",
              new Intl.NumberFormat(locale).format(result.count),
            )
          : messages.empty,
      );
    } catch {
      if (request === sequence && dialog.open) state("error", messages.error);
    }
  }
  function openSearch(target: HTMLElement = trigger): void {
    if (document.querySelector("dialog[open]") && !dialog.open) return;
    trigger.dispatchEvent(new Event("kinein:search-open", { bubbles: true }));
    if (!dialog.open) {
      returnTarget = target;
      dialog.showModal();
    }
    input.focus();
    void run();
  }
  function closeSearch(returnFocus = true): void {
    invalidate();
    dialog.close();
    if (returnFocus) {
      const target =
        returnTarget.isConnected &&
        returnTarget.getBoundingClientRect().width > 0
          ? returnTarget
          : trigger;
      target.focus();
    }
  }
  trigger.addEventListener("click", () => {
    openSearch();
  });
  close.addEventListener("click", () => {
    closeSearch();
  });
  dialog.addEventListener("close", () => {
    // O close nativo pode chegar depois de uma reabertura rápida.
    if (dialog.open) return;
    invalidate();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSearch();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      closeSearch();
  });
  input.addEventListener("input", () => {
    invalidate();
    list.replaceChildren();
    if (!input.value.trim()) {
      state("initial", messages.initial);
      return;
    }
    state("loading", messages.loading);
    timer = window.setTimeout(() => {
      void run();
    }, 180);
  });
  retry.addEventListener("click", () => {
    const request = invalidate();
    state("loading", messages.loading);
    void resetSearch().then(
      async () => {
        if (request === sequence && dialog.open) await run();
      },
      () => {
        if (request === sequence && dialog.open) state("error", messages.error);
      },
    );
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.isComposing) return;
    if (event.key === "Tab") {
      const controls = [
        ...dialog.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input, a[href]",
        ),
      ].filter((element) => element.getBoundingClientRect().width > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeSearch();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = [...list.querySelectorAll<HTMLAnchorElement>("a")];
    if (!links.length) return;
    const current = links.findIndex((link) => link === document.activeElement);
    if (event.target !== input && current < 0) return;
    event.preventDefault();
    const next =
      current < 0
        ? event.key === "ArrowDown"
          ? 0
          : links.length - 1
        : (current + (event.key === "ArrowDown" ? 1 : -1) + links.length) %
          links.length;
    links[next]?.focus();
  });
  dialog.addEventListener("click", (event) => {
    const anchor =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a")
        : null;
    if (
      !anchor ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey
    )
      return;
    closeSearch(false);
    if (
      anchor.pathname === location.pathname &&
      anchor.search === location.search &&
      anchor.hash
    ) {
      const target = document.getElementById(
        decodeURIComponent(anchor.hash.slice(1)),
      );
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.isComposing ||
      event.altKey ||
      event.shiftKey ||
      !(event.ctrlKey || event.metaKey) ||
      event.key.toLowerCase() !== "k"
    )
      return;
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        target.closest("input, textarea, select, [role=textbox]"))
    )
      return;
    if (document.querySelector("dialog[open]") && !dialog.open) return;
    event.preventDefault();
    openSearch(
      document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
        ? document.activeElement
        : trigger,
    );
  });
  state("initial", messages.initial);
  trigger.hidden = false;
}
