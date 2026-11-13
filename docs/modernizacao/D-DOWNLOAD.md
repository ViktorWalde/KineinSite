# D — Download e instalação

Entrada em 13 de novembro de 2026: `50c5641`, branch `main`, árvore limpa.
O manifesto de execução/verificação tem 254 arquivos. C1 está publicado,
confirmado pelo manifesto público `50c5641c59dbc306866ab817f630844a55c67fe8`.
Na entrada, a autorização de C1 não abrangia D. O mantenedor depois autorizou
a publicação desta entrega e pediu a centralização em Instalar a IDE; o
fechamento dessa reformulação está no fim deste registro.

## Candidato inicial — problema e contrato de implementação

Os CTAs atuais levam à release oficial; o guia e as notas já cobrem instalação,
verificação e requisitos. A lacuna demonstrada na página inicial é a escolha
do arquivo: o botão não distingue o ZIP completo do AppImage avulso e os
requisitos de glibc/sessão gráfica só aparecem depois, no guia ou na release.
O pacote completo também precisa estar ligado à conferência antes de executar
e aos percursos de primeira execução já existentes.

Solução mínima: um painel nativo na área de primeira experiência, antes dos
três guias de linguagem. Substitui os dois botões isolados desse trecho por
arquivo/tamanho, requisitos, download do ZIP, instalação, notas e uma opção
recolhível para AppImage + seu checksum. Preservar os CTAs oficiais da HUD,
hero, galeria, documentação e rodapé, o catálogo de navegação e os percursos.
Não criar rota de download: o contexto já existe e uma página nova repetiria
o guia sem resolver outra lacuna. Não copiar comandos ou reescrever o guia.

`publicVersion`/`publicTag` continuam sendo a fonte da versão local. Os dados
dos assets são um snapshot conferido da release dessa tag. O build deve
recusar incompatibilidade entre snapshot, tag pública, guia verificado e nota.
Sem rede obrigatória no build, detecção de sistema, dependência ou JS adicional.
Não oferecer Windows/macOS/ARM64 sem artefato; checksum do AppImage não será
apresentado como se verificasse o ZIP. Catálogo e comportamento de busca,
manual, CSP, temas e movimento permanecem preservados.

## Conferência inicial da fonte

A API oficial lista `v0.3.5` (beta, publicada em 1 de outubro de 2026) e
`v0.2.0`; não há release 0.4 nessa lista. A conferência usou a tag explícita, sem
inferir publicação a partir de commits. Release, assets e tutorial da tag confirmam
Linux x86_64, glibc 2.36+ e Wayland/X11. O Qt/core vêm no AppImage; ferramentas
dos projetos continuam no sistema.

- `KV0.3.zip`: 39.744.416 bytes, digest SHA-256 informado pela API
  `d6f6a84bfdac6ca03c1317a93c3a875ef8d3088178ce41ddc0d2855fab0c2675`.
  O download real coincide com esse valor.
- AppImage: 40.352.248 bytes, SHA-256 da release/API e do manifesto publicado
  `c2710023928767f39b583c1e56fc946ee46f977985fbd08930229d991a33ecf7`.
  O AppImage extraído passou em `sha256sum -c`; o manifesto interno é idêntico
  ao asset `.sha256` avulso baixado.
- O ZIP contém AppImage, `.sha256`, `SHA256SUMS`, instalador, tutorial e notas.
  O instalador teve sintaxe conferida, sem execução no perfil do mantenedor.

Fontes: [release v0.3.5](https://github.com/ViktorWalde/KineinVectis/releases/tag/v0.3.5),
[API de releases](https://api.github.com/repos/ViktorWalde/KineinVectis/releases),
[tutorial da tag](https://github.com/ViktorWalde/KineinVectis/blob/v0.3.5/DocsPublic/tutorial.md).
Evidências ignoradas em `test-results/d-2026-11-13/`, incluindo metadados,
manifesto de entrada e arquivos oficiais. Não modificar a release ou a IDE.

## Polimento visual de C1 solicitado nesta continuação

O mantenedor acrescentou explicitamente melhorias visuais no painel de
pesquisa durante D. Esse ajuste fica registrado separadamente: altera apenas
`src/features/busca/search.css`, sem reescrever a interface, o controlador,
o renderer, o motor de busca, o corpus ou os contratos funcionais de C1.

A ajuda ganhou espaço abaixo do campo; a reserva da barra de rolagem evita
mudar a largura entre estados. Os cartões têm espaçamento mais compacto,
títulos na escala de corpo e trechos limitados visualmente a três linhas,
com o texto integral mantido no DOM e a página acessível pelo link. Seções
correspondentes aparecem como links com borda e alvos de pelo menos 44 px.
O cartão em foco ganha borda de destaque; foco nativo dos links é preservado.
Estados inicial/carregando/vazio/erro ganham uma superfície própria, e o
botão de retry mantém alvo mínimo de 44 px. Cabeçalho, Escape, Ctrl/Cmd+K,
foco/retorno, concorrência, retry, workers e CSP conservam a implementação.

Foram capturadas 14 imagens antes e 14 depois, nas larguras 375/1366, nos três
temas, com estados reais inicial/resultados/vazio/erro. A falha de módulo é
provocada somente no navegador de teste e registrada como esperada. As
capturas são candidatas inspecionadas nesta execução; o mantenedor aprovou posteriormente o polimento da busca ao autorizar a publicação. Não são snapshots aprovados.

## Verificação e evidências do candidato inicial

O AppImage extraído do ZIP também executou `--version` com resultado
`kinein-vectis 0.3.5`, usando extração temporária e configuração/cache isolados.
O instalador não foi executado no perfil do mantenedor. Nenhuma data de teste
ou captura dos guias foi alterada.

O build liga snapshot, versão/tag pública, guia de instalação verificado e
nota da versão. `check:download-release` é opt-in: confere tag publicada/beta,
três assets, tamanhos, digests/URLs e requisitos na API oficial. Não cria uma
dependência de rede no build. `check:download` foi acrescentado ao final de
`check:experience`, preservando todas as suítes anteriores.

| Verificação                      | Resultado                                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Release oficial e arquivos reais | API, ZIP, manifesto externo/interno, hash do AppImage e versão CLI conferidos                                                              |
| Build Pages e artefato root      | Pages: estáticos, HTML, links, segurança e índice; root: HTML, índice e browser aprovados                                                  |
| Painel D nas duas bases          | 72 cenários por base: seis larguras × três temas × texto 100/200% × opção avulsa aberta/fechada                                            |
| Teclado e ausência de JS         | Space mantém foco ao recolher/expandir; Enter chega a instalação, nota e primeiro projeto; links/detalhes nativos sem JS em mobile/desktop |
| Busca após polimento             | Consultas, URLs/âncoras, 36 cenários por base, foco/teclado, concorrência, falhas/retry e ausência de JS; sem reduzir testes de C1         |
| Firefox 158                      | Índice real, foco, âncoras, texto ampliado e tema quente aprovados na árvore com o polimento                                               |
| Suítes integradas                | `check:browser` e `check:experience` aprovados com código zero, incluindo HUD/A/B e os novos casos                                         |

A primeira versão do painel D transbordava internamente em 320 px com texto a
200%. Quebra de texto e padding locais foram corrigidos; as 72 combinações
passaram. A ampliação de texto não equivale a zoom real. Uma execução
intermediária imprimiu os resultados de todos os checks e terminou com código
143; a confirmação final veio de nova execução com código zero, registrada
separadamente, sem declarar o encerramento anterior como gate aprovado.

A execução seguinte encontrou um 404 intermitente no teste de A ao abrir
uma imagem avulsa sem JS. Reproduzido no build original de C1: Chrome cria
um documento de imagem e pede `/favicon.ico` da raiz da origem, fora da base
do projeto. O servidor de teste agora responde 204 somente a esse pedido
implícito com referer de imagem da própria origem/base. Ícones declarados
pelas páginas e assets ausentes continuam 404; não se filtraram erros. O teste
de A também aguarda e decodifica a imagem nativa antes do fechamento. A
fixture teve suas três fronteiras HTTP conferidas e as suítes completas foram
reexecutadas com código zero após esse ajuste, sem alterar a galeria publicada.

Os scripts anteriores gravam em diretórios fixos. A evidência anterior foi
preservada em `test-results/d-2026-11-13/previous-evidence/`; os resultados
desta rodada são arquivados separadamente antes de restaurar os caminhos
históricos. Logs, fontes oficiais, manifestos, capturas e relatórios de D
ficam em `test-results/d-2026-11-13/`. Os comandos de reprodução estão em
[VALIDACAO.md](VALIDACAO.md#reprodução-de-d-e-polimento-visual-da-busca).

O gate mantém os três hints do boot de tema e oito avisos informativos de
arquitetura preexistentes, sem ampliar limites. Ambiente: Node 24.21.0, npm
11.19.0, Chrome for Testing 157.0.8103.78 e Firefox 158.0/geckodriver 0.37.1.
Não houve instalação de dependência; o lockfile coincide com a entrada.

Manifesto do candidato inicial: 259 arquivos de execução/verificação; 249 preservados,
cinco alterados e cinco novos, sem exclusões. Fingerprint SHA-256 das linhas
ordenadas caminho + NUL + hash + LF:
`b29c05766ab82f78724b70a3094407cd8d6f38b4d2d785c194b4ba6baad4dc91`.
Conteúdo, manual, CSP e workflows foram comparados com a entrada. O manual
mantém SHA-256 `72600bba237c8dbbd4b96484de039bbeea0c2663fdd877abc22b28954808e97e`.

Build Pages: 25 HTMLs/1.250.284 bytes; CSS em `_astro/`: seis arquivos/75.312
bytes; JS em `_astro/`: 20 arquivos/33.891 bytes, sem acréscimo frente a C1.
Pagefind: 24 páginas, 35 arquivos/377.175 bytes. O inventário HTML registra
198 headings com ID, um a mais pelo painel D. Tamanhos em disco não medem
transferência de visita ou Core Web Vitals. Exemplos não mudaram e
`check:examples` não foi repetido nesta entrega local.

Arquivos principais: `src/data/download.ts`, `features/download/`,
`features/inicio/FirstTry.astro`, `features/busca/search.css` (sob `src/`),
os dois novos checks de download e o ajuste pontual no harness/teste de A.
Índice, requisitos, arquitetura, validação, relatório e retomada foram
sincronizados. Os 107 arquivos de evidência regenerados por suítes antigas
foram arquivados com hashes em `gate-evidence/manifest.json`, ligados ao
fingerprint acima; seus caminhos históricos foram restaurados da cópia inicial.

## Limites e continuidade

A revisão não representa uma reprodução completa da instalação em outra
máquina/distribuição, nem altera datas/ambientes testados dos guias. Safari,
leitor de tela físico, toque físico, zoom real e métricas de campo continuam
sem prova. O manual, os arquivos de conteúdo, a CSP, o lockfile, os dados da
prévia 0.4 e o código funcional de C1 coincidem com a entrada.

Prévia atual: `http://127.0.0.1:4321/KineinSite/aprender/ide/instalar/#baixar-beta`.
A busca pode ser aberta pelo botão da HUD ou Ctrl/Cmd+K. Sugestões para avaliar:
CMake, Git, Python e uma consulta sem correspondência. O pedido posterior centraliza os CTAs atuais no painel do guia, conforme a
seção seguinte; os links da release e dos arquivos continuam oficiais.

O fechamento técnico inicial permaneceu local. Em seguida, o mantenedor
aprovou a entrega e autorizou colocá-la no ar. Antes do envio pediu centralizar
o download em Documentação → Instalar a IDE e reformular o painel para esse
contexto. Essa solicitação altera o candidato inicial, preservado acima.
A autorização de publicação cobre a entrega com esse ajuste; não se estende
a E ou a outras publicações posteriores.

## Reformulação solicitada antes da publicação

O acesso principal passa a ser **Documentação → Instalar a IDE**, na rota já
existente `/aprender/ide/instalar/`. O painel foi removido da primeira
experiência da home e aparece no início do guia, depois da apresentação e
antes dos pré-requisitos/passo a passo. Não há nova página nem uma segunda
cópia do painel. Os capítulos, índices, breadcrumbs e conteúdo Markdown
verificado continuam preservados.

A reformulação é própria de uma página de instalação: heading de nível 2,
requisitos compactos, pacote completo com ação principal, nota sobre verificar
antes de executar, arquivos avulsos em linhas identificadas e notas/release.
“Conferir o download” aponta à seção real de integridade do artigo, usando o
slug retornado por `render()`; não recarrega a própria página sem destino.
Não se copiou o procedimento do guia para o painel.

A rota `install` foi registrada no roteamento existente, somente em português.
`installPath`/`downloadPath` ligam os CTAs do beta atual ao guia e ao seu
`#baixar-beta`. Cabeçalho, hero, galeria, encerramento, rodapé e cartão da
Documentação levam a esse destino interno. Indicadores de nova aba foram
removidos desses links. As URLs oficiais dos três assets e da release
permanecem no painel, e notas históricas conservam seus próprios downloads.
O item Produto → Beta disponível mantém sua função de apresentar o estado;
não é necessário passar por ele para baixar.

A posição e o destino anteriores eram parte do candidato já validado. Os
novos destinos são uma mudança intencional pedida antes da publicação, sem
reduzir cobertura: o check de download agora começa pelo menu Documentação,
confere todos os CTAs principais, uma única instância no guia e nenhuma na
home, usa Enter na âncora de verificação e cobre os menus desktop/mobile
sem JavaScript. Conserva os 72 cenários de tamanho/tema/texto/alternativa,
assets, foco, nota e três percursos. O conteúdo e as datas dos guias não mudam.

Evidências desta revisão: `test-results/d-install-2026-11-13/`, separadas do
candidato inicial. A entrada é o manifesto `b29c0576…`; fontes oficiais e
exemplos foram novamente conferidos antes da publicação. O novo gate passou: build Pages, HTML/índice root, `check:browser`,
`check:experience`, 72 cenários de download por base, 36 de busca e Firefox
158, com os três hints de tema e oito avisos informativos de arquitetura
preexistentes. O menu Documentação → Instalar a IDE funciona com teclado e
sem JS nas duas composições. Exemplos C/C++/Rust/Python/telemetria e API oficial
também foram reconferidos para a publicação.

Manifesto final da reformulação: 259 arquivos; 247 coincidem com o candidato
inicial de D e 12 mudaram, sem acréscimos ou exclusões nessa revisão. Frente a
C1 (`50c5641`), 241 preservados, 13 alterados e cinco novos. Fingerprint
SHA-256 das linhas ordenadas caminho + NUL + hash + LF:
`1a2eb37e859b5b4e376c247910ad0b746c9da3c568f7f1651e6a1d9e46f9af2f`.

Build Pages final: 25 HTMLs/1.245.222 bytes; seis CSS em `_astro/`/75.881 bytes;
21 JS em `_astro/`/34.319 bytes. O roteamento/compartilhamento do bundle muda
428 bytes frente a C1; nenhum controlador de download foi acrescentado.
Pagefind: 24 páginas/198 headings, 35 arquivos/377.085 bytes. São tamanhos em
disco, sem inferir desempenho de visita. Manual, conteúdo, lockfile, CSP,
workflows e funcionamento de C1 permanecem preservados. Os resultados dos
candidatos anteriores acima continuam associados a seus próprios manifestos. O mantenedor aprovou explicitamente a nova composição com “reformulação
aprovada”, após a prévia, além da aprovação anterior de D/polimento da busca.
A reformulação é a condição solicitada antes do envio já autorizado.

## Publicação autorizada

O pedido explícito foi “muito bom, pode colocar no Ar, esta autorizado”,
seguido da centralização/reformulação antes do envio. O fluxo mantém
`publicar-pages.sh`, com commit/push de main, exemplos, build Pages, navegador,
artefato gh-pages e confirmação pública. `publication.log` e `live-report.json`
na evidência desta revisão registram o resultado operacional; o manifesto
público identifica o commit efetivamente servido. Autorização não é prova
de envio: a confirmação é feita pelo verificador e por consultas reais no ar.

Próxima unidade após esta entrega: E — Comunidade e rodapé.
