// A próxima versão como ela é anunciada: uma 0.3.6 só. Na IDE, o trabalho
// está dividido em 0.3.6-0.3.9 para organizar as tarefas (roadmap 53 §11);
// para quem usa, tudo isso sai como a 0.3.6. O conteúdo vem do resultado
// prometido no roadmap 53 §1 (R1-R6) e §13.1 (direção visual), conferido no
// código da IDE em 2026-10-02; os códigos R* são os do roadmap, para cada item
// ser rastreável. Nada aqui está no download; revisar a cada fatia.
export const developmentSnapshot = {
  version: "0.3.6",
  focus: "reorganizar a interface em torno do editor",
  updatedAt: "2026-10-01",
  groups: [
    {
      status: "Já no código",
      items: [
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
      status: "Em desenvolvimento: navegação",
      items: [
        {
          code: "R3",
          title: "Trilho por áreas",
          detail:
            "Aparece o que o projeto usa; o resto continua no menu Mais e na paleta.",
        },
        {
          code: "R3",
          title: "Painel inferior contextual",
          detail: "Mostra o que está em uso no momento.",
        },
        {
          code: "R3",
          title: "Contexto efetivo no cabeçalho e no status",
        },
        {
          code: "R4",
          title: "Teclado em toda a interface",
          detail:
            "Toda área pelo teclado e pela paleta, foco sempre visível e Esc de volta ao editor.",
        },
      ],
    },
    {
      status: "Em desenvolvimento: visual e memória",
      items: [
        {
          code: "R5",
          title: "Layout salvo por projeto e modo Foco",
          detail:
            "A IDE reabre os painéis como estavam, com arranjos prontos para codificar, depurar e revisar.",
        },
        {
          code: "UI",
          title: "Base visual nova",
          detail:
            "Componentes arredondados e hierarquia clara entre ação, estado e conteúdo.",
        },
        {
          code: "R6",
          title: "Mais fluida, com medida antes e depois",
          detail: "Nenhuma carga travando a tela; nenhum tempo medido piora.",
        },
        {
          code: "R2",
          title: "AppImage sem mensagens do Qt",
          detail: "Integração com Wayland e composição de acentos.",
        },
      ],
    },
  ],
  // A versão anunciada depois desta (roadmap 52 §1).
  next: {
    version: "0.4",
    summary:
      "dedicada aos embarcados: abrir, entender, compilar, gravar e depurar no alvo, com PlatformIO e emuladores como QEMU e Renode",
  },
} as const;
