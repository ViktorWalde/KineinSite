import assert from "node:assert/strict";
import process from "node:process";
import {
  mergeContributors,
  normalize,
  parseContributors,
  parseTasks,
  summary,
} from "../src/features/colabore/model.ts";

const repository = {
  id: "ide",
  name: "IDE",
  slug: "owner/ide",
  url: "https://github.com/owner/ide",
};
const issue = {
  number: 42,
  title: "Melhorar guia de C++",
  state: "open",
  labels: [{ name: "help wanted" }],
  assignees: [],
  body: "Um exemplo reproduzível.",
  updated_at: "2026-10-24T12:00:00Z",
};
const tasks = (...changes) =>
  parseTasks(
    changes.map((change) => ({ ...issue, ...change })),
    repository,
  );
assert.equal(tasks({})[0].status, "open");
assert.equal(tasks({ assignees: [{ login: "alice" }] })[0].status, "progress");
for (const label of ["in-progress", "em andamento", "em_progresso", "doing"]) {
  assert.equal(tasks({ labels: ["help wanted", label] })[0].status, "progress");
}
assert.equal(
  tasks({ state: "closed", state_reason: "completed" })[0].status,
  "done",
);
for (const reason of ["not_planned", "duplicate", null, undefined]) {
  assert.equal(
    tasks({ state: "closed", state_reason: reason }).length,
    0,
    "Não confundir fechamento com entrega aceita",
  );
}
assert.equal(
  tasks({ state: "open", state_reason: "completed" })[0].status,
  "open",
  "Reabertura prevalece sobre o motivo anterior",
);
for (const label of [
  "trilha-principal",
  "maintainer-only",
  "blocked",
  "bloqueada",
]) {
  assert.equal(
    tasks({ labels: ["help wanted", label] }).length,
    0,
    "Trilha principal e bloqueios não são oportunidades",
  );
}
assert.equal(
  tasks({ labels: ["bug"] }, { labels: [] }, { pull_request: {} }).length,
  0,
);
assert.equal(
  tasks({ labels: ["good first issue"] }, { labels: ["colabore"] }).length,
  2,
);
assert.equal(
  parseTasks(
    [
      null,
      {},
      "inválido",
      { ...issue, number: -1 },
      { ...issue, number: 1.5 },
      { ...issue, state: "invalid" },
    ],
    repository,
  ).length,
  0,
);
assert.equal(
  normalize(" Documentação: C++_EM-ANDAMENTO "),
  "documentacao c++ em andamento",
);
assert.equal(
  summary(
    "# Objetivo\n\nCorrigir **um guia** com [fonte](https://example.com).",
  ),
  "Corrigir um guia com fonte.",
);
const rawPeople = [
  { login: "alice", type: "User", contributions: 2 },
  { login: "Alice", type: "User", contributions: 3 },
  { login: "dependabot[bot]", type: "Bot", contributions: 4 },
  { login: "claude", type: "User", contributions: 19 },
  { login: "<script>", type: "User", contributions: 4 },
];
assert.deepEqual(mergeContributors(parseContributors(rawPeople, repository)), [
  { login: "alice", commits: 5, projects: ["IDE"] },
]);
process.stdout.write(
  "Colaboração: seleção, trilha principal, andamento, conclusão, cancelamento, reabertura e créditos verificados.\n",
);
