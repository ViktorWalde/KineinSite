import { normalize, summary, type Contributor, type Task } from "./model";

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}
function externalLink(
  href: string,
  className: string,
  text: string,
): HTMLAnchorElement {
  const link = element("a", className, text);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

// Conteúdo externo entra como texto, nunca como HTML ou URL arbitrária.
export function taskCard(task: Task): HTMLElement {
  const card = element("article", "task-card card");
  card.dataset["itemKey"] = `${task.repository.id}:${String(task.number)}`;
  card.dataset["itemVersion"] = JSON.stringify([
    task.updatedAt,
    task.status,
    task.title,
    task.labels,
    task.assignees,
  ]);
  const meta = element(
    "p",
    "task-meta",
    `${task.repository.name} / #${String(task.number)}`,
  );
  const title = element("h4", "task-title");
  const url = `${task.repository.url}/issues/${String(task.number)}`;
  title.append(externalLink(url, "", task.title));
  const description = element(
    "p",
    "task-description",
    summary(task.description) ||
      "Consulte o escopo e os critérios de aceite na issue.",
  );
  card.append(meta, title, description);
  const labels = element("ul", "task-labels");
  labels.setAttribute("aria-label", "Marcadores da tarefa");
  for (const label of task.labels.slice(0, 5)) {
    const badge = element(
      "li",
      normalize(label) === "good first issue"
        ? "task-label task-label-first"
        : "task-label",
      normalize(label) === "good first issue"
        ? "Boa primeira contribuição"
        : label,
    );
    labels.append(badge);
  }
  card.append(labels);
  if (task.assignees.length)
    card.append(
      element(
        "p",
        "task-assignees",
        `Responsáveis no GitHub: ${task.assignees.map((name) => `@${name}`).join(", ")}`,
      ),
    );
  if (task.description.length > 220) {
    const details = element("details", "task-details");
    details.append(
      element("summary", "", "Ler descrição da issue"),
      element("p", "task-full-description", task.description),
    );
    card.append(details);
  }
  const date = new Date(task.updatedAt);
  if (Number.isFinite(date.getTime())) {
    const stamp = element(
      "time",
      "task-date",
      `Atualizada em ${new Intl.DateTimeFormat("pt-BR").format(date)}`,
    );
    stamp.dateTime = date.toISOString();
    card.append(stamp);
  }
  card.append(
    externalLink(url, "inline-link task-action", "Ver tarefa no GitHub ↗"),
  );
  return card;
}

export function contributorCard(person: Contributor): HTMLElement {
  const card = element("li", "contributor-card card");
  card.dataset["itemKey"] = person.login.toLowerCase();
  card.dataset["itemVersion"] = JSON.stringify(person);
  const monogram = element(
    "span",
    "contributor-monogram",
    person.login.slice(0, 2).toUpperCase(),
  );
  monogram.setAttribute("aria-hidden", "true");
  const copy = element("div", "contributor-copy");
  copy.append(
    externalLink(
      `https://github.com/${encodeURIComponent(person.login)}`,
      "contributor-signature",
      `@${person.login}`,
    ),
  );
  const label =
    person.login.toLowerCase() === "viktorwalde" ? "Mantenedor · " : "";
  copy.append(
    element("p", "collab-note", `${label}${person.projects.join(" · ")}`),
  );
  copy.append(
    element(
      "p",
      "collab-note",
      `${person.commits.toLocaleString("pt-BR")} ${person.commits === 1 ? "commit registrado" : "commits registrados"} no GitHub`,
    ),
  );
  card.append(monogram, copy);
  return card;
}
