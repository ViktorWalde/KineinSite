# Página inicial e documentação — fase C local

O mantenedor escolheu “Página inicial e documentação” para esta rodada.
Todas as alterações ficam locais, sem novo commit, push ou publicação.
A prévia está em <http://127.0.0.1:4321/KineinSite/>.
O polimento da HUD para um vidro mais suave permanece pendente.

## Auditoria desta fase

Base: commit `1be6137`, árvore limpa antes das alterações. O build e as suítes
da fundação anterior estavam aprovados; não houve mudança de dependências.

As medições iniciais em Chrome, janela de 1000px de altura e texto a 100%,
mostraram a seção da galeria a 3.764px do topo em 390px de largura e a
3.455px em 1440px. Ela vinha depois da apresentação e da demonstração.
O beta era selecionado por JavaScript, mas o HTML colocava a prévia antes
dele. Sem JavaScript, a ordem visual começava pela versão em desenvolvimento.

Em 390px, o índice da documentação tinha 1.121px de conteúdo numa área de
343px, com opções fora da parte visível. A página não tinha overflow global;
o problema era a necessidade de rolar a faixa lateralmente.

O manual já oferecia índice recolhível, busca, seção ativa e foco de retorno.
Foi escolhido reutilizar esse comportamento, mantendo o filtro e o texto
versionado intactos. Não havia motivo para substituir o sistema de documentação.

## Alterações

- `src/pages/index.astro`: galeria antes da apresentação e demonstração,
  preservando a arte do hero, a ordem dos demais assuntos e os fundos existentes.
- `src/features/inicio/IdePreview.astro` e `ide-preview.css`: beta primeiro no
  HTML e nas abas; estado “Disponível para Linux” separado de “Em desenvolvimento”.
  Títulos de versão continuam visíveis quando JavaScript está desativado.
  Nenhuma captura foi alterada ou simulada.
- `src/features/documentacao/DocsSidebar.astro`, `docs-navigation.css` e
  `section-nav.ts`: índice móvel nativo, recolhível e com todos os links numa
  lista vertical. Desktop mantém índice lateral e identificação da seção ativa.
- `src/scripts/outline.ts` e `src/features/manual/manual-nav.ts`: comportamento
  compartilhado de recolhimento, Escape, foco e resize. O foco segue o destino
  real da âncora: título no manual ou seção nomeada na documentação. A busca
  do manual e sua precedência de Escape foram preservadas.
- `src/features/aprender/CppJourney.astro`: passou a usar o container que seu
  CSS já definia. A ausência dele foi comprovada em 1024px com texto a 200%:
  os quatro cartões se comprimiam e a seta expandia a página até 1045px.
  As regras existentes agora ajustam as colunas à largura disponível.
- `src/styles/interaction.css`: o novo índice reutiliza as transições nativas
  de disclosure e os tokens existentes, incluindo movimento reduzido.
- `scripts/check-content-browser.mjs`, `check-browser.mjs` e `package.json`:
  teste permanente da fase C e seleção de galerias por identidade, sem depender
  da posição no HTML. As verificações de teclado anteriores foram preservadas.
- `AGENTS.md` e registros da fase anterior: continuidade local não equivale a
  autorização de publicação. Foi corrigida a afirmação anterior de que
  “pode prosseguir” autorizava o envio remoto.

## Resultado medido

| Largura | Galeria antes | Galeria depois |
| ------- | ------------- | -------------- |
| 390px   | 3.764px       | 1.208px        |
| 1440px  | 3.455px       | 986px          |

São posições da seção em relação ao topo da página, nas condições acima.
Não são medições de carregamento, renderização ou FPS.

## Verificações

- `npm run build:pages`: aprovado; 25 páginas, tipagem, lint, CSS, arquitetura,
  colaboração, i18n, contraste, integridade do manual, formatação, HTML, links e segurança.
- `CHROME_BIN=/tmp/kinein-browser/chrome-linux64/chrome npm run check:browser`:
  aprovado, incluindo galeria, abas, temas, guias e manual.
- `CHROME_BIN=/tmp/kinein-browser/chrome-linux64/chrome npm run check:experience`:
  aprovado, incluindo o novo teste de conteúdo.
- Teste específico: 320, 390, 768, 1024 e 1440px; texto a 100%/200%; índice
  inteiro sem rolagem lateral; Enter, Escape, foco e seção ativa; resize;
  clique com movimento normal; índice e versões disponíveis sem JavaScript.
- Firefox 158.0: início e documentação em 500, 768, 1024 e 1440px, texto a
  100%/200%, versões, Enter/Escape, foco e capturas decodificadas aprovados.
  O limite mínimo do Firefox headless continua sendo 500px.

Os três hints do script de tema e os nove avisos informativos da arquitetura
continuam presentes, sem erros nem novas exceções. Não foram alterados
conteúdos dos guias, exemplos, vídeos, manual ou dependências.

Evidências em `test-results/phase-c/`: capturas anteriores em `before/`,
capturas desta versão em `after/`, medições em `content-report.json` e
`firefox-report.json`. Esses artefatos permanecem ignorados pelo Git.

## Busca global e continuidade

Pagefind pode indexar o HTML depois do build e gerar um pacote de busca estático,
sem exigir migração do sistema de documentação. Uma avaliação local futura
deve conferir CSP, prefixo `/KineinSite/`, idioma, versão do manual, exclusão da
404 e tamanho real do índice. [Documentação oficial do Pagefind](https://pagefind.app/docs/).

Starlight já inclui busca com Pagefind. Adotá-lo apenas para obter busca não
justifica substituir os índices, componentes e sincronização existentes nesta
rodada. [Busca do Starlight](https://starlight.astro.build/guides/site-search/).

Próximos escopos: avaliação visual desta fase, polimento glass da HUD, busca
global em uma entrega própria e revisão técnica de conteúdo inglês antes de
disponibilizar rotas ou seletor. Nenhum desses pontos é considerado concluído
por esta revisão local.
