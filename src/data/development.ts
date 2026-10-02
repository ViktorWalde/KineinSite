// Estado conferido em 2026-10-02 no código da IDE e no roadmap 53 do projeto
// (§1 e §11: o trem 0.3.6-0.3.9, decisão do mantenedor de 2026-10-01) e no
// roadmap 52 (§11, a 0.4). Os códigos são os do roadmap 53 (G0, R1...), para
// cada item ser rastreável. Nada aqui está no download; revisar a cada fatia.
export const developmentSnapshot = {
  version: "0.3.6",
  focus: "limpar e medir a interface antes de reorganizá-la",
  updatedAt: "2026-10-01",
  groups: [
    {
      status: "Já no código da 0.3.6",
      items: [
        {
          code: "G0",
          title: "Verificações antes de qualquer código novo",
          detail:
            "Cada regra reprova o defeito que promete pegar, provado de propósito.",
        },
        {
          code: "R1",
          title: "Abrir pela linha de comando",
          detail:
            "Abrir uma pasta pelo comando kinein devolve o prompt na hora, sem prender o terminal.",
        },
        {
          code: "R2",
          title: "Primeiros avisos do Qt corrigidos na causa",
          detail:
            "Seções da lista do Git que não apareciam no AppImage e um laço de layout no painel do Git.",
        },
      ],
    },
    {
      status: "Próximo na 0.3.6",
      items: [
        {
          code: "F0",
          title: "Inventário da tela e medidas de desempenho",
          detail: "Cada elemento com dono e custo medido antes de mudar.",
        },
        {
          code: "R5",
          title: "Layout salvo por projeto",
          detail: "A IDE reabre os painéis como estavam.",
        },
        {
          code: "R2",
          title: "AppImage sem mensagens do Qt",
          detail: "Integração com Wayland e composição de acentos.",
        },
      ],
    },
    {
      status: "Planejado depois",
      items: [
        {
          code: "0.3.7",
          title: "Trilho por áreas e painel inferior contextual",
        },
        { code: "0.3.8", title: "Contexto efetivo no cabeçalho e no status" },
        {
          code: "0.3.9",
          title: "Teclado, foco, modo Foco e prova antes/depois",
        },
        {
          code: "0.4",
          title: "Embarcados de ponta a ponta",
          detail:
            "Abrir, entender, compilar, gravar e depurar no alvo, com PlatformIO e emuladores como QEMU e Renode.",
        },
        {
          code: "0.5",
          title: "Central de ambiente e Biblioteca por capacidades",
        },
      ],
    },
  ],
} as const;
