// Plano informado pelo mantenedor em 2026-10-08. A nova interface e o
// trabalho com embarcados chegam juntos na 0.4; a 0.3.5 segue como beta
// público. As capturas de desenvolvimento têm origem e rótulo próprios.
export const developmentSnapshot = {
  version: "0.4",
  title: "Conheça a Vectis 0.4.",
  updatedAt: "2026-10-08",
  groups: [
    {
      status: "A interface em construção",
      items: [
        {
          title: "Editor no centro",
          detail:
            "A organização inspirada nas IDEs JetBrains aproxima o editor, a árvore do projeto e os painéis. Você já pode comparar essa disposição nas capturas da prévia.",
        },
        {
          title: "Do código ao resultado",
          detail:
            "A demonstração compila e executa um projeto C++ e abre o terminal, as ferramentas detectadas e o histórico Git.",
        },
      ],
    },
    {
      status: "Embarcados na 0.4",
      items: [
        {
          title: "Interface e embarcados juntos",
          detail:
            "O trabalho com embarcados faz parte da mesma versão. A meta é tornar esses fluxos mais consistentes junto à nova interface.",
        },
        {
          title: "Alvos confirmados após os testes",
          detail:
            "Os dispositivos, SDKs e fluxos suportados serão anunciados conforme forem verificados. A prévia atual demonstra C++ no computador.",
        },
      ],
    },
  ],
} as const;
