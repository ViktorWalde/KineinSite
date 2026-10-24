import { autoRefresh, feedMessage, loadFeed } from "./github";
import { columns, normalize, parseTasks, type Task } from "./model";
import { taskCard } from "./render";
import { updateList } from "../../scripts/motion";

const root = document.querySelector<HTMLElement>("[data-task-board]");
if (root) {
  const search = root.querySelector<HTMLInputElement>("[data-task-search]");
  const project = root.querySelector<HTMLSelectElement>("[data-task-project]");
  const entry = root.querySelector<HTMLSelectElement>("[data-task-entry]");
  const status = root.querySelector<HTMLElement>("[data-task-sync]");
  const results = root.querySelector<HTMLElement>("[data-task-results]");
  const refresh = root.querySelector<HTMLButtonElement>("[data-task-refresh]");
  const board = root.querySelector<HTMLElement>(".task-board");
  const clear = root.querySelector<HTMLButtonElement>("[data-task-clear]");
  const emptyAction = root.querySelector<HTMLElement>(
    "[data-task-empty-action]",
  );
  let tasks: Task[] = [];
  let hasData = false;
  let busy = false;
  let lastAttempt = 0;
  let visibleLimit = 12;
  const more = document.createElement("button");
  more.type = "button";
  more.className = "button button-quiet task-more";
  more.textContent = "Mostrar mais tarefas";
  more.hidden = true;
  board?.after(more);
  function render(): void {
    if (!root) return;
    const hasFilters = Boolean(
      search?.value || project?.value !== "all" || entry?.value !== "all",
    );
    if (clear) clear.hidden = !hasFilters;
    if (!hasData) return;
    if (emptyAction) emptyAction.hidden = tasks.length > 0;
    const query = normalize(search?.value ?? "");
    const filtered = tasks.filter(
      (task) =>
        (project?.value === "all" || project?.value === task.repository.id) &&
        (entry?.value !== "first" ||
          task.labels.some(
            (label) => normalize(label) === "good first issue",
          )) &&
        normalize(
          [
            task.title,
            task.description,
            `#${String(task.number)}`,
            ...task.labels,
            ...task.assignees,
          ].join(" "),
        ).includes(query),
    );
    let hasMore = false;
    for (const column of columns) {
      const list = root.querySelector<HTMLElement>(
        `[data-task-list="${column.id}"]`,
      );
      const count = root.querySelector<HTMLElement>(
        `[data-task-count="${column.id}"]`,
      );
      const selected = filtered.filter((task) => task.status === column.id);
      if (count) count.textContent = String(selected.length);
      if (!list) continue;
      if (selected.length)
        updateList(list, selected.slice(0, visibleLimit).map(taskCard));
      else {
        const empty = document.createElement("p");
        empty.className = "task-empty";
        empty.textContent =
          tasks.length && hasFilters
            ? "Nenhuma tarefa por aqui com esses filtros. Tente outro termo ou limpe a busca."
            : column.empty;
        updateList(list, [empty]);
      }
      hasMore ||= selected.length > visibleLimit;
    }
    more.hidden = !hasMore;
    if (results) {
      results.hidden = false;
      const message = tasks.length
        ? `${String(filtered.length)} ${filtered.length === 1 ? "tarefa encontrada" : "tarefas encontradas"}${hasFilters ? ` de ${String(tasks.length)} no quadro` : ""}.`
        : "As oportunidades aparecem após a revisão do mantenedor. Enquanto isso, conheça as formas de ajudar ou proponha uma contribuição pequena.";
      if (results.textContent !== message) results.textContent = message;
    }
  }
  for (const control of [search, project, entry])
    control?.addEventListener("input", () => {
      visibleLimit = 12;
      render();
    });
  more.addEventListener("click", () => {
    visibleLimit += 12;
    render();
  });
  clear?.addEventListener("click", () => {
    if (search) search.value = "";
    if (project) project.value = "all";
    if (entry) entry.value = "all";
    visibleLimit = 12;
    render();
    search?.focus();
  });
  async function update(force = false): Promise<void> {
    if (busy || document.hidden || Date.now() - lastAttempt < 60_000) return;
    busy = true;
    lastAttempt = Date.now();
    if (refresh) refresh.disabled = true;
    refresh?.setAttribute("aria-busy", "true");
    board?.setAttribute("aria-busy", "true");
    if (status && !hasData)
      status.textContent = "Consultando oportunidades no GitHub…";
    try {
      const feed = await loadFeed("issues", parseTasks, force);
      tasks = feed.items;
      hasData = true;
      if (status) status.textContent = feedMessage(feed);
      render();
    } catch {
      if (status)
        status.textContent =
          "Não foi possível consultar as tarefas agora. O GitHub pode estar indisponível ou ter limitado as consultas. Use os links diretos abaixo e tente novamente mais tarde.";
    } finally {
      busy = false;
      board?.setAttribute("aria-busy", "false");
      refresh?.setAttribute("aria-busy", "false");
      if (refresh)
        globalThis.setTimeout(
          () => {
            refresh.disabled = false;
          },
          Math.max(0, 60_000 - (Date.now() - lastAttempt)),
        );
    }
  }
  const controls = root.querySelector<HTMLElement>("[data-task-controls]");
  if (controls) controls.hidden = false;
  if (refresh) {
    refresh.hidden = false;
    refresh.addEventListener("click", () => {
      void update(true);
    });
  }
  void update();
  autoRefresh(update);
}
