import editor from "../../assets/ide/desenvolvimento/editor.png";
import ambiente from "../../assets/ide/desenvolvimento/ambiente.png";

export const developmentScreens = {
  version: "0.4 em desenvolvimento",
  capturedAt: "2026-10-08",
  environment: "Linux x86_64 com X11",
  shots: [
    {
      id: "editor",
      title: "Nova interface e build",
      image: editor,
      alt: "Executável de desenvolvimento da Kinein Vectis: árvore do projeto, editor C++ e painel com build concluído com sucesso, na interface em reformulação.",
      caption:
        "A nova organização da interface, com projeto CMake aberto e compilação concluída.",
    },
    {
      id: "ambiente",
      title: "Ferramentas do sistema",
      image: ambiente,
      alt: "Interface de desenvolvimento com o painel Ferramentas mostrando versões de CMake, Ninja, Make e Git e o estado das ferramentas encontradas.",
      caption:
        "As ferramentas continuam vindo do seu sistema; o painel mostra o que foi detectado neste ambiente.",
    },
  ],
} as const;
