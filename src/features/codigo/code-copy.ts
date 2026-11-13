// Acrescenta a cada bloco de código de um artigo (.prose pre) uma barra com
// a linguagem e o botão Copiar. Sem JavaScript, o bloco continua um <pre>
// comum, com o mesmo visual (codigo.css).
import { uiFor } from "../../i18n/ui";

const messages = uiFor(document.documentElement.lang).code;
const languageNames: Record<string, string> = {
  bash: "Shell",
  sh: "Shell",
  shell: "Shell",
  c: "C",
  cpp: "C++",
  rust: "Rust",
  rs: "Rust",
  python: "Python",
  py: "Python",
  cmake: "CMake",
  json: "JSON",
  toml: "TOML",
  yaml: "YAML",
  text: messages.output,
};
const resetAfterMs = 2000;

// Uma região só, fora da vista, para o leitor de tela ouvir o resultado.
const announcer = document.createElement("p");
announcer.className = "visually-hidden";
announcer.setAttribute("aria-live", "polite");
document.body.append(announcer);

function showResult(button: HTMLButtonElement, ok: boolean): void {
  button.dataset["state"] = ok ? "done" : "error";
  button.textContent = ok ? messages.copied : messages.failed;
  announcer.textContent = ok ? messages.success : messages.failure;
  window.clearTimeout(Number(button.dataset["timer"]));
  button.dataset["timer"] = String(
    window.setTimeout(() => {
      delete button.dataset["state"];
      button.textContent = messages.copy;
    }, resetAfterMs),
  );
}

async function copy(button: HTMLButtonElement, text: string): Promise<void> {
  if (button.getAttribute("aria-disabled") === "true") return;
  delete button.dataset["state"];
  button.textContent = messages.copy;
  // Preservar o foco durante o Clipboard: disabled nativo pode focar o body.
  button.setAttribute("aria-disabled", "true");
  announcer.textContent = "";
  window.clearTimeout(Number(button.dataset["timer"]));
  try {
    await navigator.clipboard.writeText(text);
    showResult(button, true);
  } catch {
    showResult(button, false);
  } finally {
    button.removeAttribute("aria-disabled");
  }
}

for (const pre of document.querySelectorAll<HTMLPreElement>(".prose pre")) {
  const code = pre.querySelector("code");
  const language = /\blanguage-(\S+)/.exec(code?.className ?? "")?.[1];

  const block = document.createElement("div");
  block.className = "code-block";
  const bar = document.createElement("div");
  bar.className = "code-block-bar";
  const name = document.createElement("span");
  name.className = "label";
  name.textContent = language ? (languageNames[language] ?? language) : "";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy";
  button.textContent = messages.copy;

  // O bloco que rola também precisa ser alcançável pelo teclado.
  pre.tabIndex = 0;
  pre.setAttribute("role", "region");
  pre.setAttribute(
    "aria-label",
    name.textContent
      ? `${messages.block}: ${name.textContent}`
      : messages.block,
  );

  button.addEventListener("click", () => {
    void copy(button, (code ?? pre).textContent);
  });

  bar.append(name, button);
  pre.before(block);
  block.append(bar, pre);
}
