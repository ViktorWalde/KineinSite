# Baseline de engenharia — 12 de novembro de 2026

## Identificação da árvore

- HEAD: `1be6137003dbe6f66729cca798996a61842956c9`.
- Árvore de trabalho com alterações anteriores de página inicial,
  documentação, helper de índices, testes e registros. **Não é uma árvore limpa.**
- Fingerprint SHA-256 dos arquivos de execução e verificações:
  `2f62aa9d0a1bca549110a7be6000d50b4c6bb97900b6f0f7354d2ab4e8ccd8f7`.

O fingerprint cobre `src/`, `scripts/`, `.github/workflows/`, `package.json`,
`package-lock.json`, `astro.config.mjs` e `tsconfig.json`, inclusive código
local ainda não rastreado. Não cobre documentação, screenshots ou `dist/`.
O manifesto de arquivos e hashes foi salvo em
`test-results/engineering-2026-11-12/source-manifest.json`.
Essa identificação evita atribuir ao HEAD uma validação de código local diferente.

## Ambiente e dependências

| Item                     | Versão/estado observado                                                      |
| ------------------------ | ---------------------------------------------------------------------------- |
| Node / npm               | 24.21.0 / 11.19.0; projeto exige Node `>=24 <25`                             |
| Astro / TypeScript       | 7.3.5 / 6.0.3                                                                |
| `@astrojs/check`         | 0.9.10                                                                       |
| ESLint / Stylelint       | 10.11.0 / 17.15.0                                                            |
| HTML Validate / Prettier | 11.16.0 / 3.9.9                                                              |
| Chrome for Testing       | 157.0.8103.78, temporário em `/tmp/kinein-browser/chrome-linux64/chrome`     |
| Firefox                  | 158.0, verificado na rodada local anterior; mínimo efetivo headless de 500px |
| Dependências de UI       | Sem React, Angular ou biblioteca de animação                                 |
| Busca e teste visual     | Sem Pagefind, Starlight ou Playwright instalados                             |
| Instalação               | Lockfile fixado e `.npmrc` com `ignore-scripts=true`                         |

Versões são as da árvore inspecionada, não uma recomendação para atualizar.

## Inventário dos fluxos

| Fluxo                  | Implementação real                                                       | Dependências e preservação                                                           |
| ---------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Conhecer a IDE         | `pages/index.astro`, `features/inicio/`, dados de capturas e versão      | Astro Assets, imagens reais, beta e prévia separados                                 |
| Baixar                 | `site.ts`, links no header, início, rodapé e documentação                | URL da tag configurada; não há backend ou download próprio                           |
| Instalar e começar     | `content/aprender/`, `guides.ts`, `project-paths.ts`, `CppJourney.astro` | Capítulos `verified`, versão/ambiente/data e sequência editorial explícita           |
| Consultar documentação | `DocsSidebar.astro`, `docs-navigation.css`, `section-nav.ts`             | Índice móvel local recolhível e seção ativa                                          |
| Consultar manual       | `pages/manual/`, `features/manual/`, `scripts/outline.ts`                | Índice hierárquico, filtro por títulos e origem protegida por hash                   |
| Copiar código/modelo   | `features/codigo/code-copy.ts`, `scripts/copy.ts`                        | Clipboard API, sucesso após confirmação, mensagem de falha                           |
| Ampliar capturas       | `features/imagens/`                                                      | Diálogo nativo, ajuste/zoom e retorno de foco                                        |
| Ver demonstrações      | `features/demonstracao/`, vídeos, posters e descrições                   | Vídeos mudos, controles, metadata; script respeita visibilidade e movimento reduzido |
| Ler atualizações       | Coleção `atualizacoes`, páginas e `updates.ts`                           | Uma entrada por versão e ordenação editorial por data                                |
| Colaborar              | `features/colabore/`, `features/contribuicao/`, `pages/colabore/`        | GitHub público, filtros, paginação, erros, limites, cache e dados desatualizados     |
| Trocar aparência       | `theme-preferences.ts`, `theme.ts`, `ThemeControls.astro`, tokens        | Sistema/claro/escuro/warm, três destaques e preferência local antes da pintura       |
| Navegar no celular     | `SiteHeader.astro`, `SiteNavigation.astro`, `navigation.ts`              | Disclosure nativo e Escape; ainda é a composição anterior à HUD 2.0                  |

## Estrutura e invariantes

O Astro gera 25 páginas estáticas. As coleções são `aprender`, `estudos`,
`atualizacoes` e `manual`. Drafts dos guias e estudos não viram páginas.
Não há servidor de aplicação em produção.

`KINEIN_PAGES_BUILD=1` configura site `https://viktorwalde.github.io` e base
`/KineinSite`. `sitePath()` e `i18n/routing.ts` compartilham o tratamento de
base. O preview normal e o build do Pages não devem ser confundidos.

O site está configurado para beta `0.3.5`, tag `v0.3.5`, Linux x86_64.
**A release mais recente do repositório da IDE não foi revalidada nesta etapa
de planejamento.** A frente D deve consultá-la antes de alterar informações.

O manual local corresponde à tag `v0.3.5`, commit da IDE
`e3368a5ea6c8f4e49eda733caeac2c84565fb4ef`, origem `DocsPublic/manual.md`,
hash `72600bba237c8dbbd4b96484de039bbeea0c2663fdd877abc22b28954808e97e`.
O corpo oficial não foi modificado.

O módulo i18n contém configuração de `pt-BR`/`en-US`, catálogos tipados da
moldura compartilhada, datas UTC e registro de rotas reais. Só há conteúdo
português registrado. Não existe seletor, tradução inglesa de páginas,
busca global, índice de busca ou sitemap gerado neste build.

A CSP é emitida pelo Astro em meta, com hashes dos scripts e estilos. O
HTML gerado é verificado contra código inline não autorizado, embeds e
links externos inseguros. A consulta pública ao GitHub não usa credenciais
no cliente; o intervalo nominal é cinco minutos, com cache e backoff.

Ambos os workflows de validação/publicação usam `workflow_dispatch` e actions
fixadas por SHA. Essa inspeção comprova a configuração manual; não comprova
a situação atual de cobrança ou disponibilidade do serviço GitHub Actions.

## Achados classificados

| ID   | Categoria                             | Evidência                                                                                                         | Tratamento                                                                     |
| ---- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| U-01 | Usabilidade/organização               | Cinco destinos internos e Discord estão no mesmo nível da HUD; Começar, Manual e Documentação competem por espaço | Planejar quatro grupos com destinos reais, mantendo cada acesso                |
| U-02 | Usabilidade                           | Header ocupa 225,6px em 320px, 172,0px em 375px e 144,7px em 1024px, com texto a 100% e janela de 900px de altura | Projetar uma composição compacta sem reduzir a legibilidade ou ocultar acessos |
| P-01 | Preferência estética                  | Referências pedem composição moderna e transparência seletiva                                                     | Submeter candidatos locais; não tratar a preferência como bug funcional        |
| F-01 | Funcionalidade ausente, intencional   | Existe filtro do manual, mas nenhuma busca global                                                                 | C0/C1, sem campo ou atalho fictício                                            |
| F-02 | Funcionalidade parcialmente preparada | UI compartilhada traduzível, sem páginas inglesas                                                                 | F0/F1; não inventar equivalências                                              |
| Q-01 | Limite de QA                          | Capturas existem, mas não há comparação automática com referências aprovadas                                      | Formalizar candidatos, revisão e atualização explícita das referências         |
| Q-02 | Diagnóstico preexistente              | Três hints do Astro sobre variáveis do boot de tema e nove avisos de tamanho/coesão                               | Registrar separadamente; não desligar checks nem aumentar limites              |
| R-01 | Risco a investigar                    | Indexador ainda não foi confrontado com CSP, base e conteúdo real                                                 | Prova técnica antes de escolher biblioteca                                     |

As verificações existentes passaram. Isso não é uma auditoria completa de
acessibilidade nem prova de ausência de defeitos em todas as situações.

## Verificações e artefatos

`npm run build:pages` e `check:experience` foram executados nesta árvore
antes de qualquer implementação da HUD 2.0: aprovados. O build inclui `check`
com tipagem, lint, CSS, arquitetura, colaboração, i18n, contraste, manual e
formatação, além de HTML, links e segurança. Menor razão do conjunto de
contraste estático: 4,69:1, em 12 combinações. São nove avisos informativos
de arquitetura, três hints e zero erros.

Logs, matriz responsiva, capturas e relatório complementar de navegador
ficam em `test-results/engineering-2026-11-12/`, ignorado pelo Git. A matriz
usa dados vazios determinísticos para a API do GitHub; não representa as
issues reais nem uma referência visual aprovada pelo mantenedor.

`check:browser` também foi reexecutado e passou. A matriz complementar
executou 252 cenários: sete páginas representativas × seis larguras
(320, 375, 768, 1024, 1366 e 1920px) × três temas × dois tamanhos de texto,
com altura de 900px e movimento reduzido. Não houve overflow horizontal
global nem exceção de execução. Esse teste de geometria não comprova que
todos os controles internos estejam descobríveis ou plenamente acessíveis.

Na página inicial, a altura total do header foi 225,6 / 172,0 / 130,8 /
144,7 / 86 / 86px, respectivamente nessas larguras, com tema escuro e texto
a 100%. A marca tem área de 34px de altura nessa condição; ampliar seu alvo
é uma oportunidade ergonômica, não uma alegação de violação automática da WCAG.

`check:examples` passou com GCC/G++, Python e Rust disponível temporariamente
em `/tmp/kinein-rust/bin`. Foram conferidos os exemplos e exercícios de C,
C++, Rust e Python e o estudo de telemetria. Nenhum exemplo foi alterado.

### Reprodução e limites

Os comandos de build e navegador estão em [VALIDACAO.md](VALIDACAO.md).
Logs desta execução: `build.log`, `experience.log`, `browser.log`, `examples.log`
e `matrix.log` no diretório de artefatos. A captura complementar foi preservada
como `capture-baseline.mjs` no mesmo diretório, com import relativo ao harness.
Para reproduzi-la após o build, na raiz do repositório:

```bash
CHROME_BIN=/caminho/do/chrome node test-results/engineering-2026-11-12/capture-baseline.mjs
```

Esses artefatos são locais e ignorados; não acompanharão um clone novo.
Uma comparação futura deve preservar esta pasta antes de gerar novas capturas.
O fingerprint agrega os arquivos em ordem de caminho, com separador nulo
entre caminho, conteúdo e próximo arquivo; o manifesto também registra o
SHA-256 individual de cada arquivo.

Nesta rodada o navegador da matriz e das suítes foi Chrome. Firefox tem
evidências da rodada local anterior, sem equivaler a esta matriz completa.
Safari/WebKit, leitor de tela, toque em dispositivo físico, zoom real do
navegador e fallback em navegador sem backdrop-filter não foram verificados
nesta rodada. Eles permanecem casos da estratégia de validação, sem alegação
de aprovação. A ampliação de texto testada não equivale ao zoom real.

### Tamanho do build observado

| Tipo                      | Arquivos |     Bytes |
| ------------------------- | -------: | --------: |
| HTML                      |       25 |   924.365 |
| CSS                       |        6 |    67.671 |
| JavaScript                |       17 |    20.977 |
| Imagens (JPEG, PNG, WebP) |       66 | 1.814.063 |
| MP4 e VTT                 |        4 |   412.013 |
| Total                     |      118 | 3.239.089 |

É a soma dos arquivos de `dist/`, sem compressão HTTP, não a transferência
da primeira visita. Não foram medidos LCP, CLS, INP, FCP, TBT, FPS ou custo de
GPU nesta etapa. Não há alegação de ganho de desempenho.
