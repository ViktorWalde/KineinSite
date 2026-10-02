// Acrescenta a cada bloco de código de um artigo (.prose pre) uma barra com
// a linguagem e o botão Copiar. Sem JavaScript, o bloco continua um <pre>
// comum, com o mesmo visual (codigo.css).
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
  text: "Saída",
};
const resetAfterMs = 2000;

// Uma região só, fora da vista, para o leitor de tela ouvir o resultado.
const announcer = document.createElement("p");
announcer.className = "visually-hidden";
announcer.setAttribute("aria-live", "polite");
document.body.append(announcer);

function showResult(button: HTMLButtonElement, ok: boolean): void {
  button.dataset["state"] = ok ? "done" : "error";
  button.textContent = ok ? "Copiado" : "Não copiou";
  announcer.textContent = ok
    ? "Código copiado."
    : "Não foi possível copiar; selecione o texto do bloco.";
  window.clearTimeout(Number(button.dataset["timer"]));
  button.dataset["timer"] = String(
    window.setTimeout(() => {
      delete button.dataset["state"];
      button.textContent = "Copiar";
    }, resetAfterMs),
  );
}

async function copy(button: HTMLButtonElement, text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    showResult(button, true);
  } catch {
    showResult(button, false);
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
  button.textContent = "Copiar";

  button.addEventListener("click", () => {
    void copy(button, (code ?? pre).textContent);
  });

  bar.append(name, button);
  pre.before(block);
  block.append(bar, pre);
}
