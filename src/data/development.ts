// Estado informado pelo mantenedor em 2026-09-25. Revisar antes de publicar
// uma nova versão do site ou quando a 0.3.0 for distribuída.
export const developmentSnapshot = {
  version: "0.3.0",
  updatedAt: "2026-09-25",
  groups: [
    {
      status: "Fechado no desenvolvimento",
      items: [
        { code: "V0", title: "Base e decisões da versão" },
        { code: "V1", title: "Ergonomia do terminal" },
        { code: "V2", title: "Descoberta de conexões Remote" },
        { code: "V5", title: "Abas e Markdown" },
      ],
    },
    {
      status: "Em integração",
      items: [
        {
          code: "V3",
          title: "Comandos e janelas de ferramentas",
          detail: "Falta concluir a ligação de componentes das janelas.",
        },
        {
          code: "V4",
          title: "Remote como janela de ferramentas",
          detail: "Falta o caminho até o shell pelo terminal integrado.",
        },
        {
          code: "P0–P3",
          title: "Launcher e projeto cotidiano",
          detail: "O primeiro passo é parcial; falta o comando kinein.",
        },
      ],
    },
    {
      status: "Ainda não iniciado",
      items: [
        { code: "V6", title: "Símbolos e indentação" },
        { code: "V7", title: "Painel Grafana" },
        { code: "H0", title: "Bordas e cabeçalho" },
        { code: "V8", title: "Fechamento e distribuição" },
      ],
    },
  ],
} as const;
