import ambiente from "../../assets/ide/ambiente.png";
import editor from "../../assets/ide/editor.png";

// Capturas reais da IDE exibidas na página inicial, geradas por
// scripts/capturar-ide.sh a partir do AppImage publicado. Quando a interface
// mudar (a série 0.3.6-0.3.9 reorganiza a casca), rode o script com o
// AppImage novo e troque version e capturedAt aqui.
export const ideScreens = {
  version: "0.3.5",
  capturedAt: "2026-10-02",
  environment: "Linux x86_64 com X11",
  shots: [
    {
      id: "editor",
      title: "Editor e build",
      image: editor,
      alt: "Janela da Kinein Vectis 0.3.5 com um projeto CMake aberto: a árvore de arquivos à esquerda, src/main.cpp no editor e, no painel de baixo, o build concluído com sucesso.",
      caption:
        "Projeto CMake aberto, código C++20 no editor e o build no painel de baixo.",
    },
    {
      id: "ambiente",
      title: "Ambiente detectado",
      image: ambiente,
      alt: "A mesma janela com a aba Ferramentas aberta: Cargo, rustc, rustup, CMake, Ninja, Make e Git com as versões encontradas, rust-analyzer com aviso e Bear como ausente.",
      caption:
        "A aba Ferramentas mostra o que a IDE encontrou na máquina e o que falta.",
    },
  ],
} as const;
