# H2 — HUD funcional local

Implementação local em 12 de novembro de 2026. **Gate técnico aprovado**;
este registro não representa aprovação visual ou autorização de publicação.
O H1 continua sendo o contrato documental de entrada, não uma entrega de UI.

## Entrada preservada

HEAD `1be6137003dbe6f66729cca798996a61842956c9`, com as alterações anteriores
registradas em `test-results/h2-2026-11-12/status-before.txt`. Cópias e hashes de
229 arquivos de entrada permitem conferir a preservação do trabalho local.
Não houve descarte, commit, push, deploy ou alteração da IDE/release.

## Implementação

- `src/data/navigation.ts`: catálogo único dos quatro grupos, 16 identidades,
  adaptação de rotas/entradas/fontes externas, instalação obrigatória e nota
  pública selecionada pela tag configurada. Nota ausente omite só seu atalho.
- `SiteNavigation.astro`/`SiteHeader.astro`: composição compartilhada, IDs por
  instância, listas e disclosures nativos; aparência e download únicos.
- `i18n/ui.ts`/`routing.ts`: novas mensagens com paridade tipada, rota de regras
  real e indicação explícita de fallback. Nenhuma página inglesa foi criada.
- `navigation.ts`: um dono dos painéis da HUD; abertura, exclusão, Escape em
  camadas, seleção normal/modificada, clique fora, Tab, âncoras e retorno de foco.
  `theme.ts` conserva preferências, persistência e transições existentes.
- `hud-layout.ts`: observa composição/altura, coordena a troca de instância e
  fornece o offset aos consumidores. CSS da HUD separado da moldura/rodapé.
- Documentação e manual usam a altura real no posicionamento de seus índices.
  A fonte versionada do manual e os índices locais anteriores são preservados.

## Decisões sustentadas pelo candidato

O breakpoint inicial por viewport não comportava bem texto a 200%: quatro
rótulos se empilhavam na faixa desktop e offsets fixos encobriam âncoras.
A composição usa uma container query de **54rem de espaço interno disponível**.
Isso considera a ampliação da fonte. O script lê o resultado do CSS, sem
manter outro limite concorrente; nas amostras a 100%, 768px é móvel e 1024px
é desktop intermediário. Texto a 200% antecipa o móvel até 1366px.

A fronteira a 100%/fonte padrão fica próxima de 930px de viewport, considerando
shell, padding e bordas. Há testes de ±1px; o espaço útil, não a resolução
nominal, decide a composição. O DOM mantém a ordem marca → grupos desktop →
ferramentas → disclosure móvel. Não há movimentação de nós por script.

A medição reproduziu, antes da correção, header/âncora/índice em 467/288/192px
na documentação a 1024px e texto 200%. Isso justificou observar a altura real,
sem listener de scroll. A medição não retroalimenta o tamanho do header.
Sem inicialização de navegação, o header permanece no fluxo; grupos e links
funcionam nativamente, com fechamento manual e aparência só se seu script iniciar.

O fechamento por saída de foco aguarda o clique quando há pointerdown ativo:
fechar o grupo anterior antes do mouseup deslocava o summary seguinte no móvel.
Tab/Shift+Tab continuam fechando o painel que perdeu o foco. Resize preserva a
identidade estável mesmo quando o navegador já devolveu activeElement ao body.

Painéis são opacos nos tokens existentes. Grupo, página, localização e expansão
recebem estados independentes; peso, sublinhado e forma complementam a cor.
Não se adicionaram busca, atalhos, idioma, dependências ou outro sistema de tema.

## Evidências e limites

Build Pages, `check:browser`, `check:experience` e `check` passaram. O build
sem base, seu HTML e a suíte H1 em `/` também passaram. São 25 páginas em cada
base; H1-T07/T09 têm prova no teste de dados e os demais casos no navegador.
Cada base executou 252 cenários (sete páginas × seis larguras × três temas ×
dois tamanhos de texto), 1.008 aberturas de grupos e 24 cenários de offsets.
Teclado, Escape por camada, peers, clique fora, seleção, resize, 404, hash,
JavaScript ausente e falha isolada da navegação passaram. Zoom real no Firefox
158.0: 24 cenários, três páginas, quatro janelas e zoom 100%/200%, sem overflow.

Mantidos três hints do boot de tema e oito avisos informativos preexistentes
de arquitetura; o antigo aviso de tamanho do `layout.css` deixou de existir
com a separação por responsabilidade. Nenhuma tolerância foi ampliada. A suíte
geral de mídia recebeu 403 do GitHub numa tentativa inicial; agora usa uma
fixture vazia, enquanto a suíte de colaboração mantém toda a prova da API.

Logs,
matriz, árvores de acessibilidade e capturas candidatas ficam em
`test-results/h2-2026-11-12/`. São artefatos locais ignorados, não snapshots
aprovados pelo mantenedor.

O harness existente foi ampliado para base parametrizável e fixture 404 real.
As suítes antigas conservam os casos de navegação, colaboração, mídia, tema,
manual e ausência de JavaScript, com seletores adaptados aos disclosures.
`check-hud.mjs` e `check-hud-browser.mjs` exercitam os oráculos H1-T01–T18.

Zoom real usa Firefox/WebDriver com `fullZoom` 1/2 e verificação do viewport e
de devicePixelRatio; não é confundido com `font-size: 200%` da matriz Chrome.
Toque automatizado é sintetizado; leitor de tela e toque físico não foram
verificados. A árvore acessível Chrome complementa o HTML e o teclado; a árvore
AT-SPI do Firefox disponível não expôs o conteúdo da página nesta sessão.

A prévia local existente é `http://127.0.0.1:4321/KineinSite/`, reutilizada para
observar o candidato no Firefox. Aprovação visual pertence ao mantenedor.

### Geometria e tamanho

| Largura | Baseline do header | H2 a 100%, escuro |
| ------- | -----------------: | ----------------: |
| 320     |            225,6px |             182px |
| 375     |            172,0px |             182px |
| 768     |            130,8px |             130px |
| 1024    |            144,7px |             135px |
| 1366    |               86px |              80px |
| 1920    |               86px |              80px |

Em 375px a altura aumentou 10px, com marca e controles de pelo menos 44px;
não se declara redução uniforme. Texto ampliado muda a composição por espaço
útil. Os valores são geometria do candidato, sem equivaler a aprovação visual.

HTML: 1.171.868 bytes/25 arquivos; CSS: 68.874 bytes/6; JavaScript externo:
20.977 bytes/17. Scripts inline são contados no HTML, não no total de JS
externo. O custo adicional da HUD inclui markup das duas instâncias e scripts
inline. Estes números não são transferência da primeira visita nem LCP/CLS/INP.

O manifesto `source-manifest.json` identifica a árvore validada; `preservation.json`
confirma que não houve exclusão e que o lockfile foi preservado. Não houve
instalação de dependência. Capturas em `pages/` e `root/`, árvores acessíveis,
relatórios de matriz/offsets e `firefox-zoom.json` permanecem evidências locais.

Próximo pacote: A, apresentação do produto. H2 permanece pendente de aprovação
visual do mantenedor; esse estado não bloqueia a continuidade local autorizada.
