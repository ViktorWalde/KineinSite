# C0 — Prova técnica de busca

Execução local de 13 de novembro de 2026, a partir de `dcf9287`, branch `main`
e árvore limpa. B aprovado foi preservado, assim como H2/A, conteúdo técnico,
manual, temas e CSP. C0 produz uma prova executável e uma decisão para C1;
não instala busca no produto nem acrescenta controle à HUD.
O gate integrado também exigiu uma correção pontual de foco na cópia de B,
descrita separadamente abaixo; sua aparência e demais entregas foram preservadas.

## Decisão

**Pagefind 1.6.0 é tecnicamente viável para C1 com seu worker de mesma origem.**
A prova nas bases `/KineinSite/` e `/` executou consultas sobre o HTML real
sem modificar a CSP. A adoção como dependência e etapa do build fica em C1,
junto da interface funcional e dos estados acessíveis.

O modo `noWorker: true` foi recusado pela CSP por compilação de WebAssembly.
O modo com worker executou a mesma consulta sem violação. Não adicionar
`unsafe-eval`, `wasm-unsafe-eval`, `blob:` ou outra permissão para habilitar
o fallback. Em navegador sem worker utilizável, C1 precisa oferecer estado
de indisponibilidade e manter os percursos nativos de documentação/manual.

Essa diferença tem uma condição concreta: o worker é o arquivo
`pagefind-worker.js` servido pela mesma origem. A política atual permite sua
origem pelo fallback de `worker-src` para `script-src 'self'`; o worker
externo não herda a CSP meta do documento. A resposta do servidor de teste
não envia cabeçalho CSP ao worker, como no modelo estático atual. Uma futura
política HTTP sobre esse arquivo exige repetir a prova. Não foi usada URL
`blob:`, remoção de meta, bypass de CSP do CDP ou inicialização via script
inline. A chamada parte de um módulo externo na cópia isolada do manual.
Referências: [worker-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/worker-src),
[CSP de workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#content_security_policy)
e [orientação de hosting do Pagefind](https://pagefind.app/docs/hosting/).

## Instalação e isolamento

O pacote foi instalado somente em `/tmp/kinein-c0-pagefind`, versão exata
1.6.0, com scripts de instalação desabilitados. A API usa o binário opcional
`@pagefind/linux-x64` da mesma versão. Versão, URL e integridade do registro
estão em `test-results/c0-2026-11-13/pagefind-package.json`. Licença MIT.
Nenhuma dependência foi adicionada ao projeto; o lockfile não mudou.

A instalação temporária foi necessária para medir o candidato indicado no
plano, não para presumir sua aprovação. A API de indexação e os atributos
foram conferidos na [documentação Node](https://pagefind.app/docs/node-api/),
na [configuração do corpus](https://pagefind.app/docs/indexing/), nos
[metadados](https://pagefind.app/docs/metadata/) e nos
[filtros](https://pagefind.app/docs/filtering/).

O fluxo da prova é build HTML → cópia isolada → preparação de atributos no
HTML copiado → Pagefind → auditoria do corpus/URLs → navegador com a CSP real.
`dist/` não recebe arquivos do Pagefind. A prova compara hashes antes/depois;
o HTML usado também coincide com o build final. O índice e a página de teste
existem apenas em `test-results/`, fora do artefato publicável.

## Corpus e origem

- 25 páginas geradas; 24 indexadas. A 404 foi excluída pelo `noindex` real.
- 197 headings com IDs, descobertos no HTML, incluindo as seções do manual.
  Cada URL de resultado/subresultado carregada pela prova foi conferida
  contra a página e seu ID efetivos.
- Corpo limitado a `main#conteudo`. Navegação, índices, asides, diálogos,
  botões, summaries, SVGs, elementos hidden, status e listas dinâmicas da API
  são excluídos. Não se indexa HUD/rodapé nem dados buscados no GitHub.
- O corpus contém somente páginas geradas. Drafts não publicados e arquivos
  de teste não estão nesse diretório. Só há conteúdo `pt-BR`; nenhuma rota
  inglesa foi criada. A prova mantém esse idioma explicitamente autorizado.
- Título vem do h1; idioma vem de `html.lang`; tipo deriva da família da rota.
  Versão vem dos metadados visíveis de guias, manual e notas. A prévia é
  identificada como `0.4` e `EM DESENVOLVIMENTO`, a partir do seu cabeçalho;
  não é convertida em uma release pública.
- Manual: versão `0.3.5`, origem `DocsPublic/manual.md` na tag `v0.3.5`, revisão
  curta `e3368a5` do HTML. Fonte editorial e seu hash permanecem intactos.

O helper usa DOMParser do navegador para a preparação desta prova. Não é
uma exigência proposta para o build de produção. Em C1, os atributos devem
vir dos layouts/props existentes e o Pagefind deve consumir o HTML gerado;
não manter um catálogo editorial de títulos, trechos ou slugs paralelo.

## Consultas e relevância observadas

As duas bases retornaram as mesmas contagens e os mesmos primeiros títulos.
URLs incluem a base correta e fragmentos reais, inclusive IDs com acentos.
Os resultados completos estão nos relatórios JSON; não são uma lista mantida
para alimentar o mecanismo.

| Consulta                     | Páginas | Primeiro resultado observado     |
| ---------------------------- | ------: | -------------------------------- |
| CMake                        |      10 | Primeiro projeto em C++          |
| Git                          |      18 | Git                              |
| Python                       |      12 | Primeiro projeto em Python       |
| atalhos                      |       6 | Busca e atalhos                  |
| depuracao                    |       2 | A próxima Vectis, por dentro.    |
| C++                          |      18 | C++20: processe telemetria local |
| zzzzkineinsemcorrespondencia |       0 | Sem resultados                   |

`depuracao` também encontra o manual como segundo resultado. Com filtro
`type=manual`, `depuração` retorna só o manual e suas seções, com versão e
origem. A prévia aparecer antes é um resultado de relevância observado,
não uma falha escondida por um peso editorial. C1 deve mostrar tipo, versão
e estado da prévia para tornar a escolha clara.

Filtro `language=pt-BR` retorna conteúdo real; `language=en-US` retorna zero.
Uma requisição de UI em inglês, simulada apenas na fixture, cai no índice
português e mantém metadados/URLs portugueses. Isso não comprova tradução.
A API fornece subresultados de headings; a interface de C1 ainda precisa
renderizar texto com APIs seguras e limitar a quantidade exibida.

## Tamanho e carregamento

Valores do build Pages, sem compressão HTTP do servidor. Os arquivos de dados
do Pagefind já têm a compressão interna do próprio pacote.

| Conjunto                                             |   Bytes |
| ---------------------------------------------------- | ------: |
| Dados: metadados, índices, filtros e fragmentos      | 172.062 |
| Runtime necessário: controlador, worker e WASM pt-BR | 149.494 |
| Bundle completo emitido, 42 arquivos                 | 810.539 |

O bundle completo inclui UIs opcionais e outro WASM que não foram carregados
pela consulta. C1 usará a interface do site; esses arquivos não devem ser
confundidos com a transferência inicial da busca.

Nenhum arquivo Pagefind foi solicitado antes da primeira chamada. Na primeira
consulta `CMake`, a instrumentação observou 14 requisições e 189.557 bytes
de transferência informados pelo CDP, incluindo cabeçalhos. A medição cobre
documento e workers, em servidor local, Chrome 157.0.8103.78, uma execução
instrumentada. Não é benchmark de produção nem medição de Core Web Vitals.
Consultas posteriores reutilizam cache e carregam outros chunks conforme os
termos; não se promete que todo o índice já esteja disponível offline.

Requisições do worker foram observadas diretamente, não inferidas apenas do
Performance Timing do documento. Todas permaneceram na mesma origem. Não
houve consulta enviada a um serviço de busca externo.

## Falhas e limites

A prova confirmou: resultado vazio; falha de importação a frio offline;
falha de WASM bloqueado no worker; e repetição de consulta já carregada sem
novas requisições, com documento offline e recursos do worker bloqueados.
O erro do modo sem worker foi preservado como diagnóstico esperado. Não se
contou esse erro como regressão nem se suprimiu o registro do navegador.

### Correção necessária ao preservar o gate de B

A primeira execução integrada falhou no teste de foco após copiar código.
O botão usava `disabled` nativo enquanto aguardava o Clipboard. Com resposta
mais lenta, o navegador devolvia o foco ao body. O caso foi reproduzido com
o harness original de `dcf9287`, antes da extensão de C0, e uma operação de
Clipboard atrasada em 200ms: `focused=false`, embora o estado fosse `done`.

O bloqueio temporário agora usa `aria-disabled` e guarda contra repetição,
mantendo o botão no fluxo de foco. Sucesso, falha e recuperação continuam
dependentes da resposta real. O teste de B conserva seus casos e acrescenta
espera pendente com foco e segundo clique sem duplicar a operação. O mesmo
reprodutor com o harness original passou após a correção (`focused=true`).
Não houve ajuste visual, relaxamento do teste ou refatoração dos percursos.
Evidências: `b-focus-before.json`, `b-focus-after.json` e `experience-first.log`.

Os testes cobrem Chrome 157.0.8103.78. Firefox/Safari, teclado/foco da futura
busca, respostas antigas, composição de texto, estados de carregamento e
anúncios acessíveis da UI continuam no aceite de C1. Não há interface nova
do produto para aprovar visualmente em C0. A matriz visual existente é
preservada; os resultados das suítes integradas ficam no fechamento abaixo.

Alternativas comparadas sem instalar outro mecanismo: um índice JSON com
busca própria exigiria manter ranking/tokenização; MiniSearch oferece busca
em JavaScript, mas exigiria provar extração, serialização, idioma, tamanho e
CSP neste corpus. A [documentação primária do MiniSearch](https://github.com/lucaong/minisearch)
foi consultada, sem atribuir a ele bytes ou compatibilidade não medidos.
O worker do Pagefind passou na prova real, eliminando a necessidade de trocar
automaticamente o candidato ou relaxar a política.

## Reprodução e arquivos

`npm run check:search-proof` é opt-in e preserva todos os checks existentes.
Exige o pacote temporário apontado por `KINEIN_PAGEFIND_DIR` e Chrome existente.
Comandos completos em [VALIDACAO.md](VALIDACAO.md#reprodução-de-c0).

- `scripts/probe-search.mjs`: índice isolado, metadados, hashes e tamanho.
- `scripts/lib/search-corpus.mjs`: preparação do HTML real, sem editoriais novos.
- `scripts/lib/search-probe-client.mjs`: chamadas externas sob a CSP da página.
- `scripts/probe-search-browser.mjs`: consultas, URLs, idioma, rede e falhas.
- `scripts/lib/browser.mjs`: callback de eventos e envio a sessão CDP opcionais,
  necessários para observar e interromper requisições do worker. Chamadas
  anteriores conservam o mesmo comportamento.
- `scripts/report-search-proof.mjs`: relatório local com resultados medidos,
  sem campo de busca ou dependência de JavaScript.
- `package.json`: comando opt-in, sem novas dependências.
- `src/features/codigo/code-copy.ts` e `scripts/check-docs-browser.mjs`:
  correção de foco e teste de repetição pendente exigidos pelo gate existente.

Prévia do relatório: `http://127.0.0.1:4322/`. A prévia do produto permanece
em `http://127.0.0.1:4321/KineinSite/`. Artefatos ignorados em
`test-results/c0-2026-11-13/`, com `pages/` e `root/` separados.

## Fechamento

Gate técnico de C0 aprovado. `npm run build:pages`, `check:browser` e
`check:experience` passaram na árvore final. `check:search-proof` passou nas
duas bases; HTML Validate aprovou o build isolado sem base e o relatório.
O gate final mantém três hints do boot de tema e oito avisos informativos de
arquitetura preexistentes. Nenhuma tolerância ou verificação foi reduzida.

A experiência reexecutou a matriz existente de 252 cenários da HUD, produto,
conteúdo e os 72 cenários de B, com teclado, foco e ausência de JS. O relatório
legível de C0 foi conferido nas seis larguras sem overflow. Isso não constitui
aprovação visual da futura busca nem prova em Firefox/Safari. Exemplos não
mudaram; `check:examples` não foi repetido.

O manifesto final tem 242 arquivos: 233 preservados, quatro alterados e cinco
novos, sem exclusões. Manual, conteúdo, configuração da CSP e lockfile
coincidem com a entrada. Fingerprint:
`ae187a4d07916796e7f675349a476b70fdd710ed7b0734f4b641c988915d79fe`.
Os hashes do HTML indexado coincidem com os builds finais nas duas bases.
C1 é a próxima unidade, com adoção e interface ainda pendentes.
Não houve commit, push, deploy ou publicação nesta rodada.

## Registro local solicitado

Após o fechamento técnico, o mantenedor solicitou o commit local de C0 e
os links da versão local para análise, em 13 de novembro de 2026. Os 242
arquivos de execução/verificação coincidem com o manifesto validado; somente
os registros de continuidade receberam essa atualização documental. Foram
conferidos manifesto, diff, formatação e links locais, sem repetir as suítes.

Relatório técnico e site continuam disponíveis nos endereços acima. O pedido
não autoriza push, deploy ou publicação, nem representa aprovação da UI de
C1, que ainda não foi implementada.
