// Os textos pertencem ao componente: a mesma interação pode receber rótulos
// em português ou inglês sem duplicar a lógica de cópia.
export {};

for (const button of document.querySelectorAll<HTMLButtonElement>(
  "[data-copy-target]",
)) {
  const target = document.getElementById(button.dataset["copyTarget"] ?? "");
  const feedback =
    button.parentElement?.querySelector<HTMLElement>("[role=status]");
  if (!target || !feedback) continue;
  button.hidden = false;
  const source = target;
  const status = feedback;
  button.addEventListener("click", () => {
    void (async () => {
      button.disabled = true;
      try {
        await navigator.clipboard.writeText(source.textContent);
        status.textContent = button.dataset["copySuccess"] ?? "";
      } catch {
        status.textContent = button.dataset["copyFailure"] ?? "";
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(source);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } finally {
        button.disabled = false;
      }
    })();
  });
}
