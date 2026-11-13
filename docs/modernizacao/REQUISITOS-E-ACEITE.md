# Requisitos rastreáveis e critérios de aceite

Os IDs permitem relacionar cada alteração ao requisito, evidência e teste.
Estado de implementação refere-se à **árvore local**, não à produção nem à
aprovação visual final. Avanços documentais como H1 são indicados à parte;
“modelo definido” e “parcial” não equivalem a funcionalidade concluída.

## Invariantes de todas as entregas

| ID   | Requisito                                                                   | Evidência de aceite                                                                   |
| ---- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| N-01 | Astro/TypeScript, SSG, base `/KineinSite/`, sem backend obrigatório         | Build Pages, links/assets válidos e navegação direta nas rotas                        |
| N-02 | Preservar temas, tokens, movimento reduzido e View Transitions              | Checks de contraste, navegador, experiência e casos do componente alterado            |
| N-03 | Preservar testes, CSP, manual, conteúdo verificado e integrações existentes | Nenhum check removido; hash íntegro; diff e segurança do artefato aprovados           |
| N-04 | Não anunciar dados ilustrativos ou capacidades não verificadas              | Cada afirmação técnica ligada à release, manual, guia reproduzido ou estado editorial |
| N-05 | Trabalho local e reversível; publicação separada                            | Nenhum push, commit remoto ou deploy sem pedido explícito; avaliação por prévia       |

N-01 a N-04 já têm mecanismos de verificação e devem ser preservados. N-05
é a regra de execução vigente, reforçada após a correção do envio anterior.

## H — Dependência: HUD 2.0

| ID   | Requisito e estado                                                                                                              | Evidência/critério de conclusão                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H-01 | Quatro grupos: Produto, Documentação, Comunidade, Atualizações — **implementado localmente em H2; validação técnica aprovada**  | Catálogo único de destinos reais, acesso preservado e rota exata/grupo ativo distintos                                                                    |
| H-02 | Menus e foco consistentes — **implementado localmente em H2; validação técnica aprovada**                                       | Acionar, Escape interno/externo, clique fora, seleção, Tab/Shift+Tab, resize e HTML sem JS testados; apenas peers conflitantes fechados                   |
| H-03 | Barra compacta e responsiva — **implementado localmente em H2; validação técnica aprovada**                                     | Matriz de seis larguras, zoom/texto, controles de 40–44px ou mais, sem scroll lateral; altura comparada à baseline sem encolher texto para forçar medidas |
| H-04 | Download prioritário, aparência preservada e controles honestos — **implementado localmente em H2; validação técnica aprovada** | Arquivos oficiais preservados; download leva a Instalar a IDE por pedido posterior; tema persistido e controles funcionais                                |
| H-05 | Superfície e movimento consistentes — **implementado localmente em H2; validação técnica aprovada**                             | Contraste, alternativa opaca, empilhamento, âncoras, menu aberto/ativo e redução de movimento conferidos; nenhuma promessa de FPS                         |

64px de altura e raios da referência são pontos de partida, não justificativa
para cortar nomes, reduzir alvos ou quebrar texto ampliado. Busca depende de C;
seletor depende de F. A HUD não precisa ser reescrita novamente nessas fases.

### Rastreabilidade do modelo H1

Especificação e evidências: [H1-NAVEGACAO.md](H1-NAVEGACAO.md). O inventário e
o build validam os destinos atuais; os casos abaixo foram executados em H2,
conforme seu registro. O fechamento funcional depende dessas evidências de
execução, e não apenas da documentação H1.

| IDs              | Evidência documental H1                                                                         | Aceite restante de implementação                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| H-01             | Catálogo de 16 links mais CTA; decisões D02/D03; inventário de 25 páginas e âncoras             | T01–T09: destinos, rota exata, contexto, fragmentos, 404, nota pública e fallback      |
| H-02             | D01/D04; tabelas de peers, Escape, seleção, ordem/retorno de foco e resize                      | T10–T16: contratos executados nas duas composições, inclusive sem JS                   |
| H-03             | D01/D05; composição desktop/intermediária/mobile e política de quebra                           | T15/T17: matriz, fronteiras, zoom, texto, alvos e medição de altura                    |
| H-04             | D02/D05; CTA único da release configurada; aparência única; dependências C1/F1                  | T08/T09/T11/T16/T18: prioridade real, persistência e ausência de controles inoperantes |
| H-05, N-02       | D05; painéis opacos preferidos, âncoras/índices e movimento existente                           | T04/T05/T17/T18: contraste, empilhamento, offsets e movimento                          |
| F-01, F-03, N-01 | Reuso do registro, base, catálogo tipado e fallback explícito                                   | T01–T09 nas duas bases, sem rotas/alternates ou seletor fictícios                      |
| N-03–N-05, G-04  | Fingerprint preservado; build Pages aprovado com avisos preexistentes; entrega local documental | Preservar checks, segurança, fontes e trabalho anterior também na implementação        |

### Execução H2

Implementação e decisões em [H2-HUD.md](H2-HUD.md). `check-hud.mjs` cobre
fontes obrigatórias, nota por tag, catálogo, bases e fallback; a suíte de
navegador cobre rotas, estados, foco e matriz. O gate técnico passou; os resultados reais e limites estão consolidados no
registro H2. Aprovação visual pendente.

## A — Apresentação do produto

| ID   | Requisito e estado                                                                            | Evidência/critério de conclusão                                                                                                                  |
| ---- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| A-01 | Hero objetivo com interface real — **implementado e validado localmente em A**                | Versão/plataforma claras, dois CTAs úteis, captura real com Astro Assets e prioridade adequada quando visível; layout estreito e largo conferido |
| A-02 | Recursos e demonstrações honestos — **existente, preservado e revalidado em A**               | Beta e prévia identificados; fontes de cada capacidade; capturas sem simulação; vídeo mudo/controlável com alternativa textual                   |
| A-03 | Conhecer → baixar → instalar → primeiro projeto — **existente, preservado e revalidado em A** | Fluxo com destinos reais, sem wizard ou repetição de seções; conteúdo preservado sem JS                                                          |

A galeria antecipada e o beta primeiro já estão na rodada local anterior.
A acrescentou a captura real ao hero e validou a composição tecnicamente;
aprovação visual continua pendente. Evidências em [A-PRODUTO.md](A-PRODUTO.md).

## B — Documentação

| ID   | Requisito e estado                                                       | Evidência/critério de conclusão                                                                                                                                 |
| ---- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B-01 | Hierarquia, índice móvel e seção atual — **preservado e corrigido em B** | Índices de documentação/manual preservados; marcador considera o scroll padding da HUD com texto ampliado; teclado, foco e fallback sem JS conferidos           |
| B-02 | Percursos, breadcrumbs e índice contextual — **implementado em B**       | Índice gerado dos 100 headings reais de 13 artigos; breadcrumbs e percursos preservados; âncoras livres da HUD, sem lista editorial paralela                    |
| B-03 | Código legível e cópia confirmada — **implementado em B**                | Catálogo tipado pt-BR/en-US; Clipboard real, estados pendente/sucesso/falha, texto íntegro, rolagem por teclado e foco visível; realce adicional não necessário |
| B-04 | Manual oficial rastreável — **preservado e revalidado em B**             | Tag v0.3.5, commit e hash íntegros; nenhuma mudança da fonte, versão, apresentação ou índice oficial                                                            |

Não adicionar outro filtro ao manual ou outro índice mantido à mão. Uma
eventual divisão em páginas é uma decisão própria, sustentada por benefício
de consulta e manutenção, não um requisito automático.

Implementação, evidências e limites em [B-DOCUMENTACAO.md](B-DOCUMENTACAO.md).
`check-docs-browser.mjs`, integrado a `check:experience`, confronta o índice
com os headings renderizados e cobre 72 cenários por base, cópia e fallback.
O pacote mantém o gate do build e todas as suítes anteriores. B recebeu
aprovação visual e autorização de commit local do mantenedor em 13 de novembro
de 2026. A avaliação e o polimento de H2/A permanecem separados.
O gate de C0 encontrou perda de foco durante Clipboard lento; a correção e a
prova de repetição pendente estão registradas em C0, preservando o aceite visual de B.

## C — Busca global

| ID   | Requisito e estado                                                                            | Evidência/critério de conclusão                                                                                                   |
| ---- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| C-01 | Índice do conteúdo efetivamente gerado — **implementado em C1; validação técnica registrada** | 24 páginas/198 headings do HTML real após D, 404 excluída, sem navegação duplicada; idioma, tipo, versão e origem identificados   |
| C-02 | UI funcional na HUD — **implementada em C1; polimento aprovado em D**                         | Foco inicial, pesquisa imediata, resultados, vazio, erro, teclado/toque, Escape e retorno de foco; consultas não saem do site     |
| C-03 | Base, CSP, carregamento e idioma — **implementado em C1; duas bases e CSP preservadas**       | Duas bases, bytes e rede medidos, CSP intacta, idioma/filtros/falhas conferidos; sem worker, C1 deve apresentar indisponibilidade |

Pagefind 1.6.0 passou na prova real de C0 usando o worker de mesma origem,
conforme [C0-BUSCA.md](C0-BUSCA.md). C1 adota a versão comprovada e integra 24 páginas do HTML real no build,
com metadados, exclusões e UI na HUD. [C1-BUSCA.md](C1-BUSCA.md) registra os
estados, concorrência, falhas/retry, seis larguras, três temas e texto ampliado
nas duas bases, além do Firefox disponível. Safari, toque físico e leitor de
tela continuam sem prova. Publicação desta entrega foi explicitamente autorizada;
isso não equivale a aprovação visual de C1.
Ctrl/Cmd+K só aparece após C-02 funcionar e deve
respeitar campos editáveis, composição de texto e atalhos do navegador.

## D — Download e instalação

| ID   | Requisito e estado                                                                   | Evidência/critério de conclusão                                                                      |
| ---- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| D-01 | Release, plataforma e arquitetura verificadas — **conferidas na fonte oficial em D** | Consultar release publicada e assets; não inferir versão de commits; manter manual e notas coerentes |
| D-02 | Requisitos, integridade e início conectado — **conectados no painel existente em D** | Guia/release/notas/primeiro projeto ligados; hashes somente da fonte oficial para o mesmo arquivo    |
| D-03 | Página dedicada — **dispensada em D; fluxo existente suficiente**                    | Demonstrar benefício sobre o fluxo existente antes de criar rota; não copiar o guia de instalação    |

[D-DOWNLOAD.md](D-DOWNLOAD.md) registra API oficial, ZIP/manifesto e AppImage
conferidos, snapshot ligado à versão pública e painel na área de primeira
experiência. ZIP e AppImage têm links distintos; o `.sha256` é do AppImage.
Instalação, nota e três percursos anteriores permanecem conectados. Não se
criou outra rota nem se duplicou o guia. O mantenedor aprovou o candidato e o polimento CSS de C1 e autorizou a
publicação. Antes do envio pediu levar/reformular o painel no início do guia
Instalar a IDE, acessível diretamente por Documentação e pelos CTAs de download.
Os destinos foram atualizados de forma intencional e revalidados; a nova
composição foi aprovada explicitamente pelo mantenedor após a prévia.

Sem botões decorativos de Windows/macOS, checksums inventados ou alegação de
compatibilidade universal. Não alterar uma release da IDE como parte do site.

## E — Comunidade e rodapé

| ID   | Requisito e estado                                                      | Evidência/critério de conclusão                                                                                 |
| ---- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| E-01 | Quadro público confiável — **existente**                                | Preservar paginação, filtros, cache, timestamp, stale, vazio, erro e rate limit; saída para GitHub funcional    |
| E-02 | Fluxo de contribuição compreensível — **existente em português**        | Repositórios, tarefas, regras, ambiente e entrega claros; sem categorias fictícias ou chamadas extras à API     |
| E-03 | Rodapé complementar e traduzível — **existente, refinamento a avaliar** | Links úteis reais, contraste e toque, rótulos no catálogo; não duplicar dezenas de destinos ou inventar licença |

## F — Internacionalização e SEO

| ID   | Requisito e estado                                                                           | Evidência/critério de conclusão                                                                                                              |
| ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| F-01 | Reutilizar configuração, mensagens e roteamento — **existente para a moldura compartilhada** | Paridade tipada, datas UTC, base e fallback; ampliar textos dos demais componentes sem duplicar HTML                                         |
| F-02 | Conteúdo essencial completo e revisado por destino — **pendente**                            | Lista de rotas assumidas antes de traduzir; glossário, identidade estável, fonte/revisão e atualizações pendentes verificáveis               |
| F-03 | Seletor e metadados reais — **parcial**                                                      | Só equivalências existentes; fallback explícito; `lang`, canonical, Open Graph e hreflang coerentes; sitemap só com páginas indexáveis reais |

Hoje não há edição inglesa de páginas. Não declarar o site inteiro bilíngue
ao traduzir apenas a HUD. Revisão técnica e completude editorial fazem parte
do aceite, não apenas do build. Manter as URLs portuguesas existentes.

## G — Qualidade

| ID   | Requisito e estado                                                                                 | Evidência/critério de conclusão                                                                                             |
| ---- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| G-01 | Testes funcionais e visuais complementares — **funcionais existentes; comparação visual pendente** | Matriz, fixtures, capturas candidatas, referências aprovadas separadas e investigação de diferenças                         |
| G-02 | Acessibilidade aplicável — **verificações parciais existentes**                                    | Semântica, headings, teclado, foco, contraste, alvos e leitores de tela; registrar limites sem alegar conformidade integral |
| G-03 | Performance medida — **tamanho de artefato registrado; métricas de execução pendentes**            | Metodologia e ambiente repetíveis; laboratório separado de usuários reais; não alegar FPS ou ganho sem evidência            |
| G-04 | Segurança, arquitetura e build preservados — **existentes**                                        | Checks originais, diff mínimo, nenhuma dependência injustificada, CSP íntegra e estático válido                             |

## Conclusão de cada pacote

Entregar: resumo, IDs atendidos, problema/evidência, arquivos, decisões,
comandos/resultados, acessibilidade, medições ou sua ausência, i18n,
regressões e limites, pendências e próxima unidade. Usar o protocolo de
[VALIDACAO.md](VALIDACAO.md). Cumprir o gate técnico não autoriza publicação.
