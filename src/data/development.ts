// Plano informado pelo mantenedor em 2026-10-08. A nova interface e o
// trabalho com embarcados chegam juntos na 0.4; a 0.3.5 segue como beta
// público. As capturas de desenvolvimento têm origem e rótulo próprios.
export const developmentSnapshot = {
  version: "0.4",
  title: "Uma nova interface. Um caminho para embarcados.",
  updatedAt: "2026-10-08",
  groups: [
    {
      status: "Interface em reformulação",
      items: [
        {
          title: "Organização inspirada nas IDEs JetBrains",
          detail:
            "O frontend está sendo refeito por completo, com uma organização familiar para quem já trabalha nesse tipo de IDE.",
        },
        {
          title: "O editor no centro do trabalho",
          detail:
            "A direção é aproximar código, navegação e ferramentas do projeto em um fluxo mais claro.",
        },
      ],
    },
    {
      status: "Embarcados como foco da 0.4",
      items: [
        {
          title: "Uma base prática para trabalhar",
          detail:
            "A próxima versão reúne a nova interface e o trabalho necessário para tornar o uso com projetos embarcados mais consistente.",
        },
        {
          title: "Escopo confirmado no lançamento",
          detail:
            "Alvos e integrações serão apresentados conforme os fluxos forem implementados e testados.",
        },
      ],
    },
  ],
} as const;
