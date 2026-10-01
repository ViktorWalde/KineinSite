// Estado informado pelo mantenedor em 2026-10-01, com a 0.3.5 publicada.
// Fonte: roadmap 49 do projeto (casca da IDE na 0.3.6). Revisar a cada fatia.
export const developmentSnapshot = {
  version: "0.3.6",
  focus: "reorganizar a interface da IDE em torno do editor",
  updatedAt: "2026-10-01",
  groups: [
    {
      status: "Planejado",
      items: [
        {
          code: "F0",
          title: "Inventário e medidas",
          detail:
            "Cada elemento da tela com dono e custo medido antes de mudar.",
        },
        { code: "F1", title: "Trilho curto por áreas" },
        { code: "F2", title: "Painéis contextuais e presets de layout" },
      ],
    },
    {
      status: "Em seguida",
      items: [
        { code: "F3", title: "Cabeçalho e status com o contexto efetivo" },
        { code: "F4", title: "Foco, teclado, densidade e modo Foco" },
        { code: "F5", title: "Prova antes/depois" },
      ],
    },
    {
      status: "Depois da 0.3.6",
      items: [
        { code: "0.4", title: "Versão dedicada aos embarcados" },
        {
          code: "0.5",
          title: "Library por capacidades, Welcome e assistente de projeto",
        },
      ],
    },
  ],
} as const;
