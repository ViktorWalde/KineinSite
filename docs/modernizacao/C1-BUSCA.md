# C1 — Busca global funcional

Implementação iniciada em 13 de novembro de 2026 a partir de `ef1cba8`,
branch `main`, árvore limpa. C0 já havia comprovado Pagefind 1.6.0 com worker
de mesma origem. H2, A, B e a correção de Clipboard de C0 foram preservados.
O pacote atende C-01–C-03; não inicia D ou conteúdo bilíngue.

## Implementação

A dependência de desenvolvimento `pagefind@1.6.0` está fixada no pacote e no
lockfile. A API nativa indexa o HTML do Astro depois de sua geração e antes
dos checks do artefato. Chrome/DOMParser permanecem restritos à prova opt-in
C0 e aos testes, sem participar do build publicado.

`BaseLayout` declara o corpo indexável somente nas páginas públicas. O corpus
exclui 404, navegação, controles, diálogos e listas dinâmicas da comunidade.
Layouts passam idioma e tipo; versão vem dos dados existentes de guias,
atualizações e prévia. O manual conserva versão, URL de origem e revisão.
Não há coleção editorial paralela. O build gera 24 páginas indexadas entre
25 HTMLs, com 35 arquivos/376.518 bytes em `pagefind/`; UIs e destaques
opcionais do pacote não são enviados. Isso é tamanho absoluto em disco,
sem equivalência com transferência de uma visita ou Core Web Vitals.

A HUD recebe um único botão de busca, visível após inicialização funcional.
O diálogo nativo fica fora do cabeçalho e do conteúdo indexado; abrir fecha
os painéis da HUD e foca o campo. Há estados inicial, carregando, resultados,
vazio e erro, contagem anunciada, até seis páginas e até duas seções por
página. Resultados apresentam tipo, versão e o estado da prévia 0.4.
`textContent` renderiza trechos e títulos; URLs são restritas à origem/base
atual e os links preservam a navegação nativa.

O índice só é solicitado na primeira consulta não vazia, com debounce de
180 ms. Abrir o diálogo não baixa Pagefind. O worker é servido pelo próprio
site; não há backend de pesquisa nem envio dos termos a terceiros. A CSP
permanece intacta. Sem worker utilizável ou em falha de recurso, a UI
apresenta erro, tentativa novamente e links de documentação/manual. O retry
renova a importação, inclusive após uma falha de carregamento do módulo.

Escape, botão de fechar e backdrop encerram a busca; foco retorna ao controle
que a abriu. Tab/Shift+Tab circulam pelos controles; setas percorrem os links.
A seleção de seção da página atual fecha e foca seu heading. Ctrl/Cmd+K
respeita campos editáveis, composição de texto e outra caixa modal. O
controlador invalida respostas ao editar/fechar, inclusive em reabertura rápida.
Sem JavaScript, o botão fica oculto e a navegação nativa continua disponível.
Mensagens estão no catálogo tipado pt/en; isso não publica páginas inglesas
ou seletor de idioma.

## Correções demonstradas durante o gate

- A normalização com `pathWithBase` evita importar `/pagefind/` fora de
  `/KineinSite/` quando `BASE_URL` não tem barra final.
- O evento nativo `close` pode chegar depois de reabrir o diálogo. Ele não
  invalida a nova consulta; o retorno de foco ocorre ao fechar, evitando
  roubar foco de um campo editável posteriormente selecionado.
- O ciclo completo de Tab/Shift+Tab cobre as bordas do diálogo. A proteção
  contra resposta antiga é provada retendo uma resposta real de CMake no
  worker e entregando-a depois que Python já apareceu, sem resultados falsos.
- Título e espaçamentos foram ajustados para 320 px e texto a 200%; o campo
  permanece visível também em 375×420. O texto de ajuda fica após o campo.
- Testes de cópia em `check:browser` e B agora identificam a região de anúncio
  da cópia, antes selecionada genericamente por `aria-live`. O novo status
  da busca não pode ser confundido com esse anúncio. Cobertura mantida.
- O teste sem JS de H2 confere o botão real de busca oculto, além dos links
  nativos e da ausência de seletor de idioma sem destinos.

## Verificação e evidências

Ambiente: Node 24.21.0, npm 11.19.0, Chrome for Testing 157.0.8103.78 e Firefox
158.0 via geckodriver 0.37.1 existente. Rust 1.100.0 foi instalado somente em
`/tmp/kinein-c1-rust/`, com arquivo oficial e SHA-256 conferido, para executar
os exemplos e o fluxo obrigatório de publicação; sem alterar o PATH global.

| Verificação                                                                                                   | Resultado                                                                                                            |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Build Pages, tipos, lint, CSS, arquitetura, i18n, contraste, manual, formato, HTML, links, segurança e índice | Aprovados; três hints de tema e oito avisos informativos de arquitetura preexistentes                                |
| UI de busca em `/KineinSite/` e `/`                                                                           | 36 cenários por base: seis larguras × três temas × texto 100/200%; sem overflow global ou do diálogo                 |
| Corpus e consultas                                                                                            | 24 URLs auditadas; CMake, Git, Python, atalhos, depuracao e C++; todas as seções retornadas existem no HTML          |
| Estados e concorrência                                                                                        | Inicial/loading/resultados/vazio/erro, conteúdo seguro, foco/teclado, composição, outra modal e resposta antiga real |
| Falhas deliberadas                                                                                            | Módulo e WASM bloqueados, retry efetivo, worker ausente e alternativa sem JS; erros esperados separados              |
| Firefox                                                                                                       | Índice real sob a CSP atual, 768/1366 px, fonte 200%, tema quente, digitação/seta/Escape/foco e âncora do manual     |
| C0 reexecutado nas duas bases                                                                                 | 24 páginas/197 headings; worker aprovado e modo sem worker bloqueado pela CSP, mantendo a decisão original           |
| Exemplos                                                                                                      | C, C++, Rust, Python e telemetria: exemplos, exercícios e casos previstos aprovados                                  |
| Suítes integradas `check:browser` e `check:experience`                                                        | Aprovadas na árvore final; inclui 252 cenários da HUD, 36 de produto, 72 de B e busca real                           |

Consultas retornaram, respectivamente, 10, 18, 12, 6, 2 e 18 páginas nas duas
bases. A UI limita a apresentação a seis; os números não representam uma
avaliação universal de relevância. Em CMake o primeiro resultado foi o guia
do primeiro projeto em C++; em Git, o capítulo Git.

Artefatos ignorados em `test-results/c1-2026-11-13/`: entrada, manifestos,
logs, relatórios, rede do worker, árvore acessível e capturas candidatas.
`pages/` e `root/` contêm a busca efetivamente integrada; `c0-pages/` e
`c0-root/` preservam a reexecução isolada sem sobrescrever a prova histórica.
Os comandos estão em [VALIDACAO.md](VALIDACAO.md#reprodução-de-c1).

Tamanho do build Pages: HTML 1.248.534 bytes/25 arquivos, CSS em `_astro/`
73.296 bytes/6 arquivos e JS em `_astro/` 33.891 bytes/20 arquivos. Runtime,
WASM e fragmentos Pagefind estão contabilizados separadamente acima. Scripts
inline estão no HTML. Não há nova tolerância ou exceção de arquitetura.

O conteúdo do manual continua fiel à tag `v0.3.5`, commit
`e3368a5ea6c8f4e49eda733caeac2c84565fb4ef`, hash
`72600bba237c8dbbd4b96484de039bbeea0c2663fdd877abc22b28954808e97e`.
Os arquivos de conteúdo, a configuração da CSP e os workflows coincidem
com a entrada. O lockfile muda exclusivamente pela adoção da dependência.
O manifesto final cobre 254 arquivos de execução/verificação: 227
preservados, 15 alterados e 12 novos, sem exclusões. Fingerprint SHA-256
(das linhas ordenadas caminho + NUL + hash + LF):
`9360ee755731e0bca303f29a04791abf0db7cbf0b9a67ef5a699842681abb4ac`.

## Prévia, autorização e continuidade

Prévia concreta: `http://127.0.0.1:4321/KineinSite/`. Em qualquer página,
use Buscar ou Ctrl/Cmd+K; exemplos: CMake, Git, Python e depuração. As capturas
foram inspecionadas nesta execução; são candidatas, sem snapshots aprovados.

O mantenedor autorizou explicitamente subir a versão atual ao concluir este
escopo em 13 de novembro de 2026. Usar o fluxo existente de GitHub Pages:
commit/push de `main`, `scripts/publicar-pages.sh` e confirmação pública.
O verificador compara os 35 arquivos da busca, inclusive worker, WASM,
índice e fragmentos, além dos assets e HTML já conferidos. O resultado
operacional fica em `publication.log` e no `site-version.json` público,
separado do gate técnico deste registro.

A autorização de publicação desta entrega não equivale a aprovação visual
presumida de C1 ou H2/A, nem autoriza publicar os próximos pacotes. B mantém
seu aceite anterior. Safari, leitor de tela físico, toque físico, zoom real
do navegador e métricas de campo não foram verificados. Ampliação de fonte,
árvore acessível e eventos sintetizados têm os limites descritos.

Próxima unidade: D, download e instalação, conferindo as fontes oficiais antes
de alterar versão, assets ou requisitos. E, F0/F1 e G continuam pendentes.

## Continuação visual solicitada durante D

O mantenedor pediu melhorias visuais no painel de pesquisa durante o pacote
D. O registro e as evidências dessa árvore posterior estão em
[D-DOWNLOAD.md](D-DOWNLOAD.md#polimento-visual-de-c1-solicitado-nesta-continuação).
O ajuste é CSS: espaçamento, densidade, estados e foco; preserva motor,
controlador, renderer, índice e testes de C1. Os bytes, manifestos e resultados
acima continuam sendo o registro histórico de C1 em `50c5641`, sem atribuir
a ele a validação de uma árvore posterior. O mantenedor aprovou esse polimento ao autorizar a publicação de D.
A reformulação posterior do download não reescreve a busca.
