# Relatório da etapa de engenharia — 12 de novembro de 2026

## 1. Resumo

Especificações consolidadas em um plano incremental, confrontadas com a árvore
local. O fechamento inicial foi documental. As seções 12–14 registram a continuidade:
H1 documental, H2 funcional e A implementados/validados localmente. A seção 16
registra B implementado e validado em 13 de novembro de 2026. A seção 17 registra a aprovação de B e a
autorização de seu commit local; a avaliação e o polimento de H2/A permanecem separados.
C0 foi executado depois desse commit, conforme a seção 18; sua decisão técnica
foi preservada na adoção de C1, descrita na seção 20. D e os pacotes seguintes
continuam pendentes.

## 2. Problemas identificados

Os achados estão classificados em [BASELINE.md](BASELINE.md): composição e
altura da HUD, busca ausente, conteúdo inglês ainda inexistente e limites de
comparação visual. Preferências estéticas e riscos futuros estão separados
dos defeitos comprovados. Não houve falha nas suítes executadas.

## 3. Alterações implementadas

- `docs/modernizacao/README.md`: índice, estados, sequência e dependências.
- `BASELINE.md`: revisão, inventário, achados e evidências reproduzíveis.
- `ARQUITETURA.md`: decisões, contratos de navegação, busca, conteúdo e riscos.
- `REQUISITOS-E-ACEITE.md`: IDs e critérios por frente, ligados às verificações.
- `VALIDACAO.md`: comandos, matriz, casos funcionais e protocolo de revisão.
- Este relatório: fechamento e limites da etapa.
- `README.md`, `docs/ROADMAP.md`, `docs/INTERNATIONALIZATION.md`,
  `docs/VISUAL-SYSTEM.md` e `AGENTS.md`: referências ao plano e orientação vigente.

As alterações anteriores em `src/`, testes e `package.json` foram preservadas.
O fingerprint de execução/verificações permaneceu igual ao início desta etapa.
Logs, capturas e imagens conceituais ficam em artefatos locais ignorados.

## 4. Justificativas

Reutilizar a fundação existente evita dois sistemas de tema, navegação ou i18n.
Separar contrato, implementação, validação e aprovação permite revisar entregas
pequenas. Nenhuma dependência nova foi instalada para o planejamento.

## 5. Testes executados

`npm run build:pages` (inclui `check`), `check:browser`, `check:experience` e
`check:examples`: aprovados. Matriz complementar: 252 cenários em Chrome,
sem overflow horizontal global ou exceções de execução. Detalhes, ambiente,
comandos e limites estão em [BASELINE.md](BASELINE.md).

Foram preservados os três hints de tipagem e nove avisos informativos de
arquitetura preexistentes. A documentação recebeu conferência de formatação
dos novos registros, links locais e revisão de consistência.

## 6. Acessibilidade

As suítes existentes verificam casos de teclado, foco, movimento reduzido e
ampliação de texto; o build verifica o conjunto de contraste estático.
Isso não constitui auditoria integral WCAG. Leitor de tela, toque físico e
demais limites estão explicitados na baseline e no plano de validação.

## 7. Performance

Registrados tamanho do build e geometria do header. Core Web Vitals, FPS e
custo de GPU não foram medidos. Nenhum ganho de desempenho é declarado.

## 8. Internacionalização

Documentada a fundação tipada existente, preservação de URLs, critérios de
equivalência e rastreabilidade das traduções. Nenhuma página foi traduzida,
seletor habilitado ou rota inglesa criada nesta etapa.

## 9. Regressões

Nenhuma mudança nova em código de execução ou testes nesta etapa de planejamento.
As suítes passaram na árvore local identificada pelo fingerprint; capturas
não são referências visuais aprovadas automaticamente.

## 10. Pendências

Implementar os pacotes na ordem documentada; provar a viabilidade do indexador
antes de adotar busca; verificar release/assets oficiais antes de rever download;
revisar tecnicamente cada tradução antes de oferecer seu destino. Não há
afirmação de que todo o escopo A–G foi entregue.

## 11. Próxima etapa na emissão do relatório inicial

H1: fechar o catálogo dos grupos da HUD, destinos reais, estados ativos e
contratos de foco. Depois, H2 implementa a composição e seus testes. A avaliação
visual é do mantenedor; publicação exige autorização específica.

## 12. Atualização H1 — Modelo de navegação

O [modelo H1](H1-NAVEGACAO.md) foi definido nesta continuação local. A entrega
acrescenta inventário das 25 páginas, acessos/âncoras e fontes externas,
catálogo proposto de 16 links em Produto/Documentação/Comunidade/Atualizações
e CTA separado. Distingue grupo atual, página exata, localização e expansão,
incluindo capítulos, 404 e fallback de idioma.

A composição escolhida reutiliza o componente compartilhado em duas
instâncias nativas, uma exposta por faixa, com aparência e download únicos.
Foram definidos peers conflitantes, Escape em camadas, seleção, clique fora,
ordem e retorno de foco, resize e fallback sem JS, com justificativas e
alternativas descartadas. Casos H1-T01–T18 são contratos a implementar/testar
em H2, não resultados de uma HUD funcional já entregue.

Arquivos desta entrega: novo `H1-NAVEGACAO.md` e atualizações deste relatório,
`README.md` do planejamento, `ARQUITETURA.md`, `REQUISITOS-E-ACEITE.md` e
`VALIDACAO.md`. A baseline e as alterações locais anteriores foram preservadas.
O fingerprint de execução permanece igual ao manifesto original; não houve
mudança em `src/`, scripts, dependências ou conteúdo técnico.

`npm run build:pages` passou nesta rodada, com 25 páginas, links/HTML/segurança
sem erros. Mantidos os três hints do boot de tema e nove avisos de arquitetura
preexistentes. O H1 registra também a auditoria dos destinos e verificações
documentais: 13 destinos internos nas duas bases, quatro externos do catálogo,
43 verificações de IDs, sete URLs externas de origem e 36 links documentais
locais conferidos. Formatação do novo documento, whitespace e preservação dos
arquivos aprovados, com evidências em `test-results/h1-2026-11-12/`. Não se
repetiram suítes de navegador/exemplos ou avaliação visual para a mudança
documental; as execuções da baseline continuam sendo evidências históricas.

H-01–H-04 têm modelo/contratos definidos; a funcionalidade e a geometria
continuam pendentes. H-05/F-01/F-03 e invariantes têm rastreabilidade no H1.
Não há nova medição de performance ou alegação de conformidade integral de
acessibilidade. Disponibilidade de release remota continua na frente D.

A próxima unidade é H2, pelo gate do H1: implementar dados, semântica e
coordenação, verificar os contratos e produzir candidato para avaliação
local. Breakpoints, altura, offsets e ordem de leitura na faixa intermediária
precisam de prova no candidato. Não houve commit, push, deploy ou publicação.

## 13. Execução H2 — entregue localmente

A HUD agora tem implementação funcional local, conforme [H2-HUD.md](H2-HUD.md).
O catálogo único e a composição compartilhada substituem os links planos; tema,
movimento, conteúdo técnico e alterações locais anteriores foram preservados.
Build Pages, browser/experience, H1 nas duas bases e zoom real passaram;
resultados e limites constam no registro H2. Avaliação visual e
publicação continuam decisões separadas do mantenedor.

## 14. Execução A e encerramento da rodada

A entrega [A-PRODUTO.md](A-PRODUTO.md) acrescenta ao hero a captura real do beta
0.3.5, preservando galeria antecipada, demonstrações e percursos. Astro Assets,
ImageViewer e fonte versionada da captura são reutilizados; a versão/data/
ambiente ficam visíveis. A arte decorativa recebe prioridade menor que a captura.

Build Pages, suíte geral de navegador, conteúdo e novo teste do produto passaram.
O hero foi verificado em 36 cenários, com teclado, foco e alternativa sem JS.
H2 teve 252 cenários e 1.008 aberturas de grupo em cada base, além de offsets,
404, fallback e zoom real. Os resultados pertencem aos manifestos de cada
pacote, sem estender uma execução antiga a uma árvore posterior não testada.

Não houve instalação, alteração do manual/release/código da IDE, commit, push,
deploy ou publicação. Os três hints e oito avisos atuais são preexistentes;
o aviso antigo do tamanho de layout.css desapareceu com a separação da HUD.
O 403 remoto encontrado na suíte geral foi isolado com fixture; os cenários
próprios de colaboração continuam cobrindo sucesso, cache, falhas e limites.

A prévia local é `http://127.0.0.1:4321/KineinSite/`. Capturas são candidatas,
sem aprovação visual presumida. Não foram medidos LCP/CLS/INP nem verificados
leitor de tela ou toque físico. O toque automatizado da HUD foi sintetizado.

A pedido do mantenedor, esta rodada encerra H2/A sem iniciar B. Próxima unidade:
B; depois C0/C1, D, E, F0/F1 e G, preservando suas dependências. A avaliação
visual e qualquer autorização de publicação permanecem separadas.

### Arquivos desta continuação

H2: `src/data/navigation.ts`; `components/SiteHeader.astro` e
`SiteNavigation.astro`; `i18n/routing.ts` e `ui.ts`; `scripts/navigation.ts`,
`hud-layout.ts` e `theme.ts`; `site.ts`; `layouts/BaseLayout.astro`;
`styles/hud.css`, `hud-responsive.css`, `layout.css` e `theme-panel.css`;
`features/documentacao/documentacao.css`; `features/manual/manual-navigation.css`.
Os caminhos abreviados desta lista pertencem a `src/`.

A: `src/pages/index.astro`, `src/features/inicio/HeroCapture.astro` e
`src/features/inicio/hero-product.css`.

Verificações: `package.json`, `scripts/check-hud.mjs`, `check-hud-browser.mjs`,
`check-product-browser.mjs`, `check-browser.mjs`, `check-navigation-browser.mjs`,
`check-collaboration-browser.mjs` e `scripts/lib/browser.mjs` (os nomes abreviados
pertencem a `scripts/`). Nenhum check anterior foi retirado.

Registros: índice, arquitetura, requisitos, validação, relatório, contextualização
histórica do H1 e novos `H2-HUD.md`/`A-PRODUTO.md`, todos em `docs/modernizacao/`.
`BASELINE.md` permanece intacto. As demais alterações anteriores foram preservadas;
os manifestos locais permitem distinguir a entrada e as mudanças desta rodada.

## 15. Checkpoint solicitado pelo mantenedor

Após o encerramento técnico, o mantenedor solicitou registrar as alterações
em um commit e preparar a próxima sessão, mantendo o site sem publicação.
O checkpoint local consolida também o trabalho anterior preservado na árvore,
com orientação de continuidade em [PROXIMA-SESSAO.md](PROXIMA-SESSAO.md).
Nenhum pacote B–G foi iniciado nesta operação; não houve push ou deploy.

Os 234 arquivos de execução/verificação coincidiram com o manifesto final de
A, fingerprint `2bf3075e6f0644e7b3b6dcb3eb0f5ef5a2aec9899811c9331d0532e25e432d56`.
Por não haver mudança de código desde as verificações aprovadas, esta operação
confere preservação, diff, formatação e links dos registros sem repetir as
suítes de navegador. A nova alteração é apenas o handoff documental.

## 16. Execução B — Documentação

B foi implementado a partir de `cb0a6a6`, branch `main`, árvore limpa,
preservando H2/A e o trabalho consolidado no checkpoint. O fechamento técnico
está em [B-DOCUMENTACAO.md](B-DOCUMENTACAO.md); a aprovação visual continua
pendente. C0 não foi iniciado nesta rodada.

O índice contextual dos oito guias e cinco estudos deriva dos headings reais
do Astro, sem lista editorial paralela. Reutiliza outline, foco e marcador
existentes, em fluxo, com fallback nativo. Breadcrumbs, índices de capítulos,
percursos e anteriores/próximos foram preservados. O marcador compartilhado
passou a considerar o scroll padding real: a matriz reproduziu a seção sem
estado atual em 1920px/texto 200%, embora a âncora estivesse visível.

A cópia usa mensagens tipadas em português/inglês, incluindo sucesso, falha,
anúncios e rótulos. Aguarda o Clipboard, limpa a confirmação anterior ao
repetir e mantém o texto original. Os blocos são alcançáveis pelo teclado e
o foco fica dentro da moldura que corta overflow. Não houve nova dependência,
realçador, página traduzida, busca ou seletor inoperante.

`npm run build:pages`, `check:browser` e `check:experience` passaram na árvore
final, com 25 páginas, três hints do boot de tema e oito avisos informativos
de arquitetura preexistentes. Todas as suítes anteriores foram mantidas; a
experiência incorpora `check-docs-browser.mjs`. O gate integrado foi repetido
após uma execução anterior encerrar com 143 apesar de emitir os resultados;
a rodada final retornou zero.

A suíte B passou em `/KineinSite/` e no build isolado `/`: 13 artigos/100
links de headings, 72 cenários por base (seis larguras, três temas, dois
tamanhos de fonte), âncoras/estado atual, teclado/foco, Clipboard real,
pendência/falha e inglês por fixture, além de guias/estudos sem JS em duas
larguras. Documentação e manual receberam a prova adicional do marcador com
texto 200%. O HTML do build isolado também passou; não se atribui a ele uma
segunda execução dos checks estáticos completos do build Pages.

Manual, conteúdo técnico, lockfile e CSP preservados. Não se repetiu
`check:examples`, pois os exemplos não mudaram. O manifesto de 237 arquivos
tem 227 preservados da entrada, sete alterados e três novos, sem exclusões;
fingerprint `1b91fd5b5691999427baf033d61fb4f4beb3f63bac07b8f7802a71cd24a47969`.
Arquivos, decisões, tamanhos absolutos, comandos e limites constam no registro
do pacote. Capturas e logs estão em `test-results/b-2026-11-13/`, ignorados.

Índice, requisitos, arquitetura, validação e prompt de retomada foram
sincronizados. Prévia local: `http://127.0.0.1:4321/KineinSite/`, com o índice
em `/aprender/ide/instalar/` e `/estudos/cpp/primeiros-passos/` sob essa base.
Leitor de tela, toque físico, zoom real e Core Web Vitals não foram medidos
nesta rodada; as capturas são candidatas, sem referência visual aprovada.

Próxima unidade: C0, prova técnica antes de adotar busca. Polimento visual de
H2/A/B permanece separado. Não houve commit, push, deploy ou publicação.

## 17. Aprovação e commit local de B

Após a apresentação da prévia e dos resultados, o mantenedor aprovou a
entrega B e solicitou seu commit local em 13 de novembro de 2026. Índice,
requisitos, registro de B e prompt de retomada refletem esse aceite, sem
estendê-lo à avaliação e ao polimento de H2/A ou à publicação.

Os 237 arquivos de execução/verificação coincidem com o manifesto final de B,
fingerprint `1b91fd5b5691999427baf033d61fb4f4beb3f63bac07b8f7802a71cd24a47969`.
Apenas os registros de aprovação mudaram desde os testes; não se repetiram
as suítes de navegador para essa atualização documental. Foram conferidos
manifesto, diff, formatação do registro de B e links documentais.

O commit registra a entrega local. C0 continua como próxima unidade, ainda
não iniciada; não houve push, deploy ou publicação.

## 18. Execução C0 — Prova técnica de busca

Entrada: `dcf9287`, branch `main`, árvore limpa. C0 produziu scripts de prova,
índice isolado a partir do HTML real, relatórios e decisão documentada em
[C0-BUSCA.md](C0-BUSCA.md). Não se iniciou C1, instalou dependência de busca
no projeto ou expôs controle na HUD.

Pagefind 1.6.0 passou nas duas bases com o worker servido pela mesma origem,
sem alterar a CSP. O modo sem worker falhou ao compilar WASM sob a política
existente. A decisão para C1 exige o worker e estado explícito de erro quando
ele não estiver disponível; não autoriza ampliar permissões. O documento
registra a diferença de política entre página e worker externo e a condição
de hosting comprovada, sem estender a prova a outros navegadores/headers.

O corpus tem 24 páginas indexadas, 197 headings reais e 404 excluída. Título,
idioma, tipo, versões do beta/prévia e origem do manual foram conferidos.
Consultas CMake/Git/Python/atalhos/depuracao/C++ e consulta sem correspondência
retornaram contagens iguais nas duas bases. URLs/fragmentos foram auditados.
Filtros de manual/idioma, fallback para conteúdo português, carregamento sob
demanda, cache, offline e falha de asset têm prova real. Todas as requisições
observadas do worker permaneceram na mesma origem.

Dados: 172.062 bytes; controlador/worker/WASM pt-BR: 149.494 bytes. O bundle
completo tem 810.539 bytes e inclui UIs opcionais não carregadas. Na consulta
fria CMake foram observadas 14 requisições/189.557 bytes de transferência
com cabeçalhos, em laboratório local instrumentado, sem equivaler a métrica
de produção. O relatório legível passou HTML Validate e seis larguras sem
overflow; está em `http://127.0.0.1:4322/`.

O harness recebeu callback de eventos e sessão CDP opcionais para observar e
interromper recursos do worker. O primeiro gate integrado também encontrou
perda de foco no Clipboard lento de B, reproduzida com o harness original do
checkpoint. A correção usa `aria-disabled` com guarda de repetição; preserva
a aparência e fortalece o teste pendente. Os registros before/after mostram
o foco voltando ao body antes da correção e permanecendo no botão depois.
Essa correção necessária ao gate é distinguida do escopo de busca.

Build Pages, `check:browser`, `check:experience` e a prova C0 nas duas bases
passaram na árvore final. O gate mantém a matriz existente de 252 cenários
da HUD, produto, conteúdo, percursos e os 72 cenários de B, com a asserção de
foco e repetição pendente ampliada. O HTML isolado sem base também passou.
Continuam três hints do boot de tema e oito avisos informativos de arquitetura,
sem limites aumentados. Manual, conteúdo, CSP e lockfile foram preservados.
O manifesto final tem 242 arquivos, 233 preservados, quatro alterados e cinco
novos, sem exclusões; fingerprint
`ae187a4d07916796e7f675349a476b70fdd710ed7b0734f4b641c988915d79fe`.

Comandos, arquivos e limites estão no registro de C0 e em VALIDACAO.md.
Índice, requisitos, arquitetura e retomada foram sincronizados. Artefatos
em `test-results/c0-2026-11-13/` são locais e ignorados. A prévia do produto
continua em `http://127.0.0.1:4321/KineinSite/`.

Próxima unidade: C1, adoção no build e busca funcional, com aceite próprio de
UI/teclado/foco/estados e compatibilidade. Não houve commit, push, deploy ou
publicação nesta rodada.

## 19. Commit local e prévia de C0

O mantenedor solicitou registrar C0 em commit local e disponibilizar a versão
local para análise em 13 de novembro de 2026. O manifesto de 242 arquivos
coincide integralmente com a árvore tecnicamente validada, fingerprint
`ae187a4d07916796e7f675349a476b70fdd710ed7b0734f4b641c988915d79fe`.
Somente os registros de autorização/continuidade mudaram nesta operação;
manifesto, diff, formatação e links foram conferidos sem repetir as suítes.

Relatório técnico: `http://127.0.0.1:4322/`. Site local:
`http://127.0.0.1:4321/KineinSite/`. Ambos responderam HTTP 200. A busca ainda
não tem interface no produto; C1 permanece como próxima unidade. Não houve
push, deploy ou publicação, nem aprovação visual presumida de C1.

## 20. Execução C1 — Busca global funcional

Entrada: `ef1cba8`, branch `main`, árvore limpa. Implementação e evidências em
[C1-BUSCA.md](C1-BUSCA.md). Pagefind 1.6.0 foi adotado após a prova C0,
com API nativa no build, metadados dos layouts/dados reais e UI própria na
HUD. São 24 páginas públicas entre 25 HTMLs; bundle de busca com 35 arquivos
e 376.518 bytes. O build não depende de browser e a CSP não mudou.

A UI pesquisa por worker de mesma origem, sob demanda, com estados reais,
resultados e seções locais, vazio/erro/retry, proteção contra respostas
antigas, APIs seguras e teclado/foco. Sem JS o controle fica oculto; sem
worker utilizável há indisponibilidade explícita e links nativos. Não há
seletor de idioma ou tradução nova. H2/A/B, manual, índices e percursos
foram preservados. O conteúdo do manual, a configuração da CSP e os
workflows coincidem com a entrada; só o lockfile recebe a adoção comprovada.

O gate encontrou e corrigiu base de módulo sem barra final, fechamento
nativo tardio após reabertura, retorno de foco que podia interferir com
edição, ciclo completo de Tab e campo fora da janela baixa com fonte 200%.
Os testes anteriores de cópia agora identificam seu próprio anúncio, pois
o novo diálogo também tem `aria-live`; não houve redução de cobertura.
O fallback da HUD confere o controle real de busca oculto sem JS.

Build Pages, `check:browser`, `check:experience` e exemplos aprovados. A busca
passou em 36 cenários por base, com seis larguras, três temas e texto 100/200%,
URLs/âncoras reais, teclado, foco, concorrência e falhas/retry. A resposta
antiga de CMake é liberada pelo worker real após Python já aparecer; não há
mocks de ranking. Reexecutada C0 nas duas bases sem sobrescrever seu histórico:
24 páginas/197 headings e a mesma decisão sobre worker/CSP. Firefox 158
passou com índice real, digitação, âncoras, texto ampliado, tema e foco.

As suítes integradas preservam 252 cenários da HUD, 36 de A e 72 de B,
além dos testes anteriores de mídia, tema, movimento e comunidade. Há três
hints do boot de tema e oito avisos informativos de arquitetura preexistentes,
sem aumentar tolerâncias. C/C++, Rust, Python e telemetria tiveram exemplos,
exercícios e casos previstos executados antes da publicação. Rust foi
provisionado temporariamente fora do checkout, sem configuração global.

Manifesto final: 254 arquivos, 227 preservados, 15 alterados, 12 novos e
nenhuma exclusão. Hash e algoritmo no registro C1. Artefatos ignorados em
`test-results/c1-2026-11-13/`. Capturas candidatas foram inspecionadas; isso
não equivale à aprovação visual do mantenedor. Safari, leitor de tela físico,
toque físico e zoom real permanecem sem prova.

## 21. Autorização de publicação desta entrega

Durante C1, o mantenedor pediu explicitamente: “quando finalizar o escopo pode
subir a versao atual do site”. A autorização cobre o commit/push e o fluxo
existente de publicação desta entrega, incluindo B/C0 locais preservados.
Não equivale à aprovação visual de H2/A/C1 nem a envio dos próximos pacotes.

O fluxo é `scripts/publicar-pages.sh`: exemplos, build Pages, navegador,
commit de artefato em `gh-pages` e confirmação pública do commit de origem.
`verify-publication.mjs` agora compara também todos os arquivos de busca,
inclusive worker/WASM/fragmentos, com o build local. A evidência operacional
é registrada em `test-results/c1-2026-11-13/publication.log` e no manifesto
`site-version.json` público, separada deste fechamento técnico. Prévia local:
`http://127.0.0.1:4321/KineinSite/`. Destino autorizado:
`https://viktorwalde.github.io/KineinSite/`.

Próxima unidade: D, download e instalação, com conferência das fontes oficiais.
E, F0/F1 e G continuam pendentes. Polimento visual de H2/A permanece separado;
B preserva sua aprovação anterior.
