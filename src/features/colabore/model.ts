export interface Repository {
  readonly id: "ide" | "site";
  readonly name: string;
  readonly slug: string;
  readonly url: string;
}
export type TaskStatus = "open" | "progress" | "done";
export interface Task {
  number: number;
  title: string;
  description: string;
  labels: string[];
  assignees: string[];
  status: TaskStatus;
  repository: Repository;
  updatedAt: string;
}
export interface Contributor {
  login: string;
  commits: number;
  projects: string[];
}
export const columns = [
  {
    id: "open",
    title: "Abertas",
    symbol: "○",
    description: "Prontas para receber ajuda.",
    empty: "As próximas oportunidades para ajudar vão aparecer aqui.",
  },
  {
    id: "progress",
    title: "Em andamento",
    symbol: "◐",
    description: "Alguém já está cuidando disso.",
    empty: "Quando uma tarefa for assumida, você acompanha o andamento aqui.",
  },
  {
    id: "done",
    title: "Realizadas",
    symbol: "✓",
    description: "Concluídas e aceitas no GitHub.",
    empty: "Cada contribuição aceita passa a fazer parte desta história.",
  },
] as const;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-_:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function names(value: unknown, key: string): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item: unknown) => {
    if (typeof item === "string") return [item];
    return isRecord(item) && typeof item[key] === "string" ? [item[key]] : [];
  });
}
// Somente oportunidades selecionadas pelo mantenedor. A trilha principal,
// decisões pendentes e tarefas bloqueadas ficam fora da vitrine pública.
const invitationLabels = new Set([
  "help wanted",
  "good first issue",
  "colabore",
]);
const excludedLabels = new Set([
  "trilha principal",
  "maintainer only",
  "blocked",
  "bloqueada",
]);
const progressLabels = new Set([
  "in progress",
  "em andamento",
  "em progresso",
  "doing",
]);

export function parseTasks(records: unknown[], repository: Repository): Task[] {
  return records.flatMap((raw: unknown): Task[] => {
    if (
      !isRecord(raw) ||
      raw["pull_request"] ||
      typeof raw["number"] !== "number" ||
      !Number.isSafeInteger(raw["number"]) ||
      raw["number"] < 1 ||
      typeof raw["title"] !== "string"
    )
      return [];
    const labels = names(raw["labels"], "name");
    const normalized = labels.map(normalize);
    if (
      !normalized.some((name) => invitationLabels.has(name)) ||
      normalized.some((name) => excludedLabels.has(name))
    )
      return [];
    const assignees = names(raw["assignees"], "login");
    let status: TaskStatus;
    if (raw["state"] === "closed") {
      // Fechar por cancelamento/duplicidade, ou sem motivo conhecido, não
      // comprova uma entrega. Reabrir a issue volta a avaliar o estado aberto.
      if (raw["state_reason"] !== "completed") return [];
      status = "done";
    } else if (raw["state"] === "open") {
      status =
        assignees.length || normalized.some((name) => progressLabels.has(name))
          ? "progress"
          : "open";
    } else return [];
    return [
      {
        number: raw["number"],
        title: raw["title"],
        description:
          typeof raw["body"] === "string" ? raw["body"].slice(0, 6000) : "",
        labels,
        assignees,
        status,
        repository,
        updatedAt:
          typeof raw["updated_at"] === "string" ? raw["updated_at"] : "",
      },
    ];
  });
}

// Alguns autores de commits automatizados aparecem como User na API.
const automationAccounts = new Set([
  "claude",
  "codex",
  "copilot",
  "dependabot",
  "github-actions",
]);
export function parseContributors(
  records: unknown[],
  repository: Repository,
): Contributor[] {
  return records.flatMap((raw: unknown): Contributor[] => {
    if (
      !isRecord(raw) ||
      raw["type"] !== "User" ||
      typeof raw["login"] !== "string" ||
      !/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(raw["login"]) ||
      automationAccounts.has(raw["login"].toLowerCase()) ||
      typeof raw["contributions"] !== "number" ||
      !Number.isSafeInteger(raw["contributions"]) ||
      raw["contributions"] < 1
    )
      return [];
    return [
      {
        login: raw["login"],
        commits: raw["contributions"],
        projects: [repository.name],
      },
    ];
  });
}

export function mergeContributors(people: Contributor[]): Contributor[] {
  const byLogin = new Map<string, Contributor>();
  for (const person of people) {
    const key = person.login.toLowerCase();
    const previous = byLogin.get(key);
    byLogin.set(
      key,
      previous
        ? {
            login: previous.login,
            commits: previous.commits + person.commits,
            projects: [...new Set([...previous.projects, ...person.projects])],
          }
        : person,
    );
  }
  return [...byLogin.values()].sort((a, b) =>
    a.login.localeCompare(b.login, "pt-BR"),
  );
}

export function summary(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/[`*_>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}
