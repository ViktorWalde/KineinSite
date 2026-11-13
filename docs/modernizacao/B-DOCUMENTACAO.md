# B — Documentação

Continuação local de 13 de novembro de 2026, a partir de `cb0a6a6`, branch
`main` e árvore limpa. H2 e A foram preservados; continuam pendentes de
avaliação e polimento visual pelo mantenedor. **Gate técnico de B aprovado**;
aprovação visual de B concedida pelo mantenedor em 13 de novembro de 2026,
junto da autorização de commit local. Este aceite não autoriza publicação.

## Lacunas e implementação

| Requisito | Evidência de entrada                                                                           | Alteração mínima e consumidores                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| B-01      | Documentação/manual já têm índices móveis nativos e marcação de seção                          | Preservar componentes, filtro e helper de teclado/foco; conferir consumidores nas suítes existentes                                          |
| B-02      | Oito guias e cinco estudos não tinham índice do conteúdo do artigo                             | `ArticleOutline.astro` recebe `headings` do `render()` do Astro e gera links para os IDs reais de h2/h3; nenhum catálogo de títulos paralelo |
| B-03      | A barra de cópia tinha mensagens fixas em português e blocos sem acesso explícito pelo teclado | Mensagens em `i18n/ui.ts`, idioma por `html.lang`, estado pendente sem confirmação antecipada e regiões de código focáveis para rolagem      |
| B-04      | Manual oficial já versionado e protegido por hash                                              | Fonte, metadados, renderização e índice preservados; hash conferido pelo build                                                               |

O índice contextual fica no fluxo antes do artigo, depois dos pré-requisitos
quando presentes. Não cria uma terceira coluna sticky. Usa `details/summary`,
abre no desktop e recolhe no móvel pelo `enhanceOutline` existente. Escape
devolve o foco ao summary; seleção móvel fecha o índice e foca o heading.
Sem JS, o índice vem aberto e continua recolhível e navegável nativamente.
O CSS usa os tokens e alvos mínimos de 44px, com quebra dos rótulos.

Breadcrumbs, metadados, índices de capítulos, percursos por linguagem,
anteriores/próximos, fontes e visualizadores existentes não foram refeitos.
Páginas editoriais de documentação já dotadas de índice conservam esse índice.
O novo componente só aparece nos guias e estudos publicados.

A matriz reproduziu uma lacuna do marcador compartilhado: em 1920px e texto
200%, o primeiro heading ficava em 305,6px, com scroll padding de 306px, mas
o limiar fixo de leitura era 270px. A âncora estava visível e não recebia
`aria-current`. `section-nav.ts` agora considera o maior valor entre 30% da
janela e o scroll padding real mais 1px. Isso reutiliza o contrato da HUD,
sem alterar sua altura, composição, CSS ou observador. Os consumidores da
documentação e do manual também precisam passar após essa correção.

A cópia conserva o texto original e os nomes técnicos das linguagens.
Botão, sucesso, falha, anúncio, rótulo da região e “Saída” usam o catálogo
tipado existente. O botão fica desabilitado enquanto o Clipboard não responde;
um resultado anterior é limpo ao repetir. Falha preserva o texto disponível
para seleção manual. A confirmação só aparece após a resolução da operação.
Na inspeção da captura, o overflow da moldura cortava as laterais do foco do
`pre`. O contorno agora fica dentro da região; a captura final registra o
foco visível e a rolagem horizontal por teclado.
O realce sintático continua desativado: linguagem, contraste por tokens e
texto original já atendem à leitura; não se demonstrou necessidade de outro
renderizador ou paleta para fechar B.

Não há nova dependência, busca global, seletor de idioma ou página inglesa.
O inglês é exercitado apenas como fixture da UI de cópia, sem anunciar
tradução de conteúdo editorial. C0 permanece a próxima unidade independente.

## Validação

| Verificação                                         | Resultado nesta árvore                                                                                                |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `npm run build:pages`                               | Aprovado: 25 páginas; tipos, lint, CSS, arquitetura, i18n/HUD, contraste, manual, formatação, HTML, links e segurança |
| Build Astro isolado em `/`, HTML Validate e suíte B | Aprovados: 25 páginas, 13 artigos e 72 cenários, sem substituir a prévia Pages                                        |
| `npm run check:experience`                          | Aprovado, incluindo HUD, colaboração, movimento, percursos, UI, conteúdo, produto e B                                 |
| `npm run check:browser`                             | Aprovado: navegação, mídia, cópia, manual, percursos e cenários da API pública com fixtures                           |

Chrome for Testing 157.0.8103.78, Node 24.21.0 e npm 11.19.0. O Chrome do
checkpoint não estava mais em `/tmp`; a mesma versão foi baixada novamente,
com permissão de rede. Servidores de teste em loopback exigiram execução fora
do sandbox. Isso não alterou dependências do projeto.

O novo `scripts/check-docs-browser.mjs` é acrescentado a `check:experience`,
mantendo todas as suítes anteriores. Descobre artigos no build, confronta
índice e headings, verifica seis larguras, temas, texto ampliado, âncoras,
teclado, foco, Clipboard real e estados pendente/falha, mensagens dos dois
idiomas e fallback sem JS. Usa `scripts/lib/browser.mjs` e não instala suíte.

São 100 links de headings confrontados com os artigos renderizados em cada
base. A matriz tem duas páginas × seis larguras (320, 375, 768, 1024, 1366 e
1920px) × três temas × texto 100%/200%, altura de 900px. Teclado inclui
Enter, Tab/Shift+Tab, Escape e seta para rolar código; cobre hash direto,
seleção repetida, clique modificado e resize. Documentação e manual também
recebem prova de estado atual/âncora a 1920px/texto 200%. A cópia real é
conferida integralmente contra o texto do DOM nos guias, estudos e manual;
pendência/falha e mensagens inglesas usam fixtures explícitas. Guias e estudos
têm prova sem JS em 375/1366px. Nenhuma exceção de execução nesses cenários.

Os testes inicialmente precisaram aguardar imagens lazy explicitamente e o
reflow/ResizeObserver antes de mudar a composição na matriz. O limiar de
leitura descrito acima e o contorno cortado foram lacunas do produto corrigidas;
as esperas da automação não foram tratadas como defeitos da página.
Uma execução anterior da suíte integrada emitiu aprovação de todos os casos,
mas retornou 143 no encerramento. Ela foi preservada como `experience-first.log`
e repetida: a rodada final terminou com status zero.

Os três hints do boot de tema e oito avisos informativos de arquitetura
continuam preexistentes. Não se alteraram limites ou tolerâncias. Exemplos
e conteúdo técnico não mudaram; `check:examples` não foi repetido.

O manual continua na tag `v0.3.5`, commit
`e3368a5ea6c8f4e49eda733caeac2c84565fb4ef`, origem `DocsPublic/manual.md`, hash
`72600bba237c8dbbd4b96484de039bbeea0c2663fdd877abc22b28954808e97e`.
O manifesto final cobre 237 arquivos: 227 preservados da entrada, sete
alterados e três novos, sem exclusões; todos os arquivos de conteúdo e o
lockfile coincidem com a entrada. Fingerprint de execução/verificações:
`1b91fd5b5691999427baf033d61fb4f4beb3f63bac07b8f7802a71cd24a47969`.

Tamanho absoluto do build Pages: HTML 1.199.125 bytes/25 arquivos; CSS 70.074
bytes/6; JavaScript externo 25.009 bytes/18. Scripts inline estão no HTML.
Isso não mede transferência de visita, Core Web Vitals ou ganho de performance.
Não há comparação visual com uma referência aprovada.

## Arquivos e evidências

- `src/features/documentacao/ArticleOutline.astro` e `article-outline.css`:
  índice gerado e apresentação local.
- `src/pages/aprender/[...slug].astro` e `src/pages/estudos/[...slug].astro`:
  passagem dos headings renderizados, preservando o restante dos templates.
- `src/features/documentacao/section-nav.ts`: limiar de leitura compatível
  com a altura já observada pela HUD.
- `src/features/codigo/code-copy.ts`, `codigo.css` e `src/i18n/ui.ts`:
  localização, confirmação, acesso ao bloco pelo teclado e foco visível.
- `scripts/check-docs-browser.mjs` e `package.json`: cobertura incremental.
- Índice, requisitos, validação, relatório e retomada do planejamento:
  estado sincronizado com os resultados efetivos desta rodada.

Artefatos ignorados em `test-results/b-2026-11-13/`: entrada e hashes,
logs, relatórios, árvores acessíveis e capturas candidatas. Não são snapshots
visuais aprovados nem acompanham um clone novo.

Comandos de reprodução em [VALIDACAO.md](VALIDACAO.md#reprodução-de-b).
Prévia local do build Pages: `http://127.0.0.1:4321/KineinSite/`, com exemplos
em `/aprender/ide/instalar/` e `/estudos/cpp/primeiros-passos/` sob essa base.

## Limites e continuidade

A entrega B foi aprovada pelo mantenedor após a prévia local. A avaliação e
o polimento de H2/A permanecem separados. Busca só pode avançar por C0, com HTML real,
consultas, tamanho, base, idioma e CSP, antes da escolha do indexador e de C1.
Leitor de tela, toque físico e zoom real do navegador não foram verificados
nesta rodada; ampliação de fonte e árvore acessível não equivalem a esses testes.
O mantenedor autorizou o commit local de B. Não houve push, deploy ou publicação.

## Correção pontual encontrada no gate de C0

A execução integrada posterior reproduziu perda de foco com Clipboard mais
lento, também usando o harness anterior a C0. O bloqueio nativo `disabled`
foi substituído por `aria-disabled` com guarda de repetição, preservando o foco
e a aparência aprovada. O teste mantém confirmação/falha e acrescenta pendência
com foco e segundo clique sem duplicar a cópia. Evidências e validação dessa
árvore posterior estão em [C0-BUSCA.md](C0-BUSCA.md); o manifesto acima continua
sendo o registro histórico da entrega B.
