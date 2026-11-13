# Estratégia de validação

## Pronto para começar um pacote

1. Identificar os requisitos do pacote e o problema reproduzido.
2. Ler os componentes atuais e seus consumidores; verificar se o recurso existe.
3. Registrar HEAD, alterações locais e evidência inicial. Preservar o trabalho
   anterior; não usar reset/checkout para obter artificialmente uma árvore limpa.
4. Definir solução mínima, contratos, risco e testes antes de editar.
5. Para conteúdo técnico, identificar fonte, versão e ambiente da prova.

Uma preferência visual pode orientar um candidato local, mas deve continuar
identificada como preferência e sujeita à avaliação do mantenedor.

## Comandos existentes

Executar na raiz. Confirmar `package.json` na revisão em uso; não copiar uma
lista antiga se os scripts mudarem legitimamente.

```bash
npm run check
npm run build:pages
CHROME_BIN=/caminho/do/chrome npm run check:browser
CHROME_BIN=/caminho/do/chrome npm run check:experience
```

`build:pages` já executa `check`; não é necessário repetir ambos sem mudança
de entrada. `check:examples` requer GCC/G++, Rust e Python e deve ser executado
quando exemplos/conteúdo técnico mudarem ou quando o publicador exigir.
Não modificar exemplos para compensar ferramenta ausente.

Em B, o Chrome temporário do checkpoint estava ausente. A mesma versão
157.0.8103.78 foi obtida novamente em `/tmp/kinein-browser/chrome-linux64/chrome`.
Conferir a existência antes de reproduzir; não é dependência fixada nos scripts.

| Mudança                     | Verificação direcionada                                            | Gate mais amplo                                                   |
| --------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Modelo documental H1        | Links locais, catálogo/âncoras no HTML, consistência e fingerprint | Build Pages para conferir o inventário; casos novos ficam para H2 |
| HUD, menus e tema           | Navegação, aparência, exclusão de peers, foco, resize e âncoras    | Build Pages, browser e experience nas páginas dependentes         |
| Home, imagem e demonstração | Versão, proporção, dimensões, lazy/prioridade, vídeo e teclado     | Build e suítes de mídia/conteúdo                                  |
| Documentação e manual       | Índices, consulta, texto, código, foco e hash                      | Build e suítes de manual/conteúdo/navegação                       |
| Busca                       | Índice real, consultas, URL/âncora, estados e CSP                  | Build com índice e browser da busca; não apenas mocks             |
| Download/instalação         | Release/assets, requisitos, integridade e percursos                | Links, conteúdo reproduzido e exemplos quando aplicável           |
| Comunidade/rodapé           | Fixtures de sucesso, vazio, cache, stale, erro e rate limit        | `check:collaboration`, navegador e links                          |
| i18n/SEO                    | Mensagens, equivalências, fallback, rotas diretas e metadados      | `check:i18n`, build, links e busca por idioma                     |
| CSS compartilhado           | Estados, temas, texto ampliado e consumidores                      | Contraste, CSS, arquitetura e amostra representativa              |

Quando um teste falhar, primeiro identificar causa e se o defeito já existia.
Só atualizar uma asserção quando o comportamento esperado mudar de propósito,
registrando o novo contrato. Não excluir o caso nem ampliar tolerâncias por conveniência.

## Matriz visual e responsiva

Larguras: **320, 375, 768, 1024, 1366 e 1920px**. Usar a área útil real,
altura declarada e fontes carregadas. Acrescentar altura baixa/paisagem quando
painéis ou mídia dependerem dela. Texto a 100%/200% e zoom do navegador são
verificações distintas; não substituir um pelo outro no relatório.

Páginas representativas: início, documentação, manual, instalação/primeiro
percurso, comunidade, atualizações e 404. Se existir download próprio ou
página inglesa válida, incluí-los. Todos os links internos continuam cobertos
pelo build, mesmo com uma amostra visual menor.

Temas: claro, escuro e warm; três destaques nos componentes de paleta.
Verificar superfícies sobre fundos reais, fallback opaco, contraste aumentado,
movimento reduzido e ausência de suporte quando houver ambiente apropriado.
Uma simulação de ramo CSS não equivale a testar um navegador antigo real.

### Capturas e comparação

- Reutilizar `scripts/lib/browser.mjs` e a infraestrutura existente; não
  instalar outra suíte só para produzir screenshots equivalentes.
- Fixar navegador, altura, escala, tema, tamanho de texto e fixtures.
- Aguardar fontes, imagem/vídeo relevante e estado esperado; não inserir
  sleeps longos para esconder ausência de sincronização.
- Reduzir movimento em comparações estáticas; testar movimento separadamente.
- Salvar candidatos fora das referências aprovadas. Screenshots atuais da
  baseline são evidência técnica, **não golden snapshots aprovados**.
- Comparar por componente/fluxo; distinguir mudança pretendida, ambiente,
  diferença de renderização e regressão. Definir tolerância somente após
  repetição estável no mesmo ambiente, com justificativa registrada.
- Atualizar referência apenas após revisão explícita do resultado concreto.

Playwright ou biblioteca de diff só entram se uma lacuna da infraestrutura
atual e o custo de manutenção forem demonstrados. Nenhuma nova ferramenta foi
instalada para este planejamento.

## Casos funcionais mínimos

### HUD

Abrir cada grupo com mouse, Enter e Space; conferir links e estado ativo.
Abrir outro e confirmar exclusão de peers. Escape interno deve preservar o
menu móvel; o segundo Escape fecha o móvel e restaura seu controle.
Testar clique fora, seleção, Tab/Shift+Tab, resize, texto ampliado, tema
persistido, âncoras e funcionamento sem JS. Não focar controles ocultos.

Para H2, os oráculos específicos estão em [H1-NAVEGACAO.md](H1-NAVEGACAO.md),
casos T01–T18. Cobrem rota exata separada de grupo/localização, capítulos,
404 servido sob caminho desconhecido, tradução ausente, duas instâncias com
IDs únicos, exclusão entre aparência/menu/grupos, seleção modificada e mapa
de foco no resize. Executar nas bases `/` e `/KineinSite/`, acrescentando
fronteiras ±1px às seis larguras. Preservar cobertura ao adaptar seletores
dos testes existentes; registrar resultados reais sem marcar casos do modelo
como aprovados antes da implementação.

### Busca

Testar consultas existentes no corpus, como CMake, Git, Python e atalhos,
conferindo o índice real antes de definir resultados esperados. Acrescentar
consulta sem correspondência, erro de carregamento, digitação rápida,
resultado antigo, teclado/toque, Escape/retorno de foco e URL com base.
Confirmar que não há requisição de pesquisa para terceiros. Atalho não deve
disparar durante edição ou composição de texto.

### Internacionalização e conteúdo

Conferir catálogo tipado e textos acessíveis, acesso direto às rotas,
equivalências e fallback declarado. Verificar `lang`, títulos, descrições,
canonical, Open Graph, alternates e sitemap somente para destinos reais.
Conferir data em UTC e rastreabilidade de versões/traduções. Idioma da UI não
comprova tradução do conteúdo editorial.

### Conteúdo técnico e integrações

Manter o hash do manual e reproduzir os exemplos alterados. Vídeos precisam
de versão, controles, ausência de áudio automático e alternativa textual.
Download deve ter destino oficial conferido, não só botão clicável.
Comunidade deve preservar timestamp, stale, cache, paginação e mensagens de
limite/erro, sem credenciais ou aumento arbitrário das consultas.

## Acessibilidade

Usar WCAG 2.2 AA como referência aplicável. Verificar HTML, sequência de
headings, nomes/estados acessíveis, contraste, foco, teclado, alvos, texto
ampliado e movimento reduzido. Complementar os testes automáticos com
leitor de tela e toque em ambiente disponível. Ausência de overflow não
comprova descoberta de todos os links nem conformidade integral.

## Performance

Registrar ambiente, build, cache frio/quente, rede/CPU, navegador, cenário e
repetições. Comparar a mesma operação e apresentar a dispersão/limitações.
Não mudar CSS ou dependências com base em uma hipótese de otimização.

| Medição                              | Método/limite                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| Bytes do build                       | Soma dos arquivos por tipo; não chamar de transferência da visita            |
| Transferência                        | Rede do navegador com cenário/cache declarados                               |
| LCP/FCP/CLS                          | Medição de laboratório identificada; verificar imagens e estabilidade        |
| TBT / execução JS / layouts e paints | Perfil do navegador e operação definida                                      |
| INP                                  | Distinguir dados reais de usuários de proxies locais de duração de interação |
| Frames/GPU/blur                      | Captura de performance em hardware descrito; não alegar FPS sem medição      |

LCP ≤2,5s, CLS ≤0,1 e INP ≤200ms são objetivos de experiência, não resultados
da baseline. Não adicionar telemetria para obter dados de campo sem autorização.
Nesta etapa só o tamanho do artefato e a geometria foram medidos.

## Pronto para encerrar um pacote

- Requisitos assumidos atendidos e evidências ligadas aos IDs.
- Checks pertinentes executados; falhas preexistentes e novas separadas.
- Diff revisado, sem dependência, abstração ou alteração incidental sem motivo.
- Segurança, manual, versão, i18n e consumidores preservados.
- Capturas candidatas disponíveis; limites de ambiente explícitos.
- Relatório com resumo, problemas, arquivos, justificativas, testes,
  acessibilidade, performance, i18n, regressões, pendências e próximo pacote.

Encerrar tecnicamente um pacote não o declara visualmente aprovado e não
autoriza commit remoto, push, publicação ou alteração de releases.

## Reprodução da H2

`check:i18n` inclui `check-hud.mjs`; `check:experience` inclui a suíte
`check-hud-browser.mjs`, sem retirar as suítes existentes. O harness aceita
`KINEIN_TEST_BASE=/` para testar um build sem base, e entrega HTML 404 no
caminho desconhecido quando a fixture específica é solicitada. Não executar
navegadores enquanto outro processo estiver substituindo `dist/`.

```bash
npm run build:pages
CHROME_BIN=/caminho/do/chrome npm run check:browser
CHROME_BIN=/caminho/do/chrome npm run check:experience
# Em rodada separada, depois de encerrar os consumidores do build Pages:
npm run build
KINEIN_TEST_BASE=/ CHROME_BIN=/caminho/do/chrome node scripts/check-hud-browser.mjs
# Restaurar a prévia Pages ao terminar:
npm run build:pages
```

O gate detalhado, geometria, capturas candidatas e limites estão em
[H2-HUD.md](H2-HUD.md). Nenhum teste atualiza uma referência visual aprovada.

## Reprodução de B

`check:experience` acrescenta `scripts/check-docs-browser.mjs`, sem retirar
suítes. O novo teste descobre os artigos publicados no build e compara os
links do índice aos headings reais. Cobre seis larguras, três temas, texto
100%/200%, âncoras, estado atual, teclado/foco, Clipboard real, confirmação
pendente, falha, reset e mensagens em português/inglês. O inglês é uma fixture
de `lang` da UI de cópia, sem criar uma rota pública. Documentação e manual
também são conferidos a 1920px/texto 200% como consumidores do marcador.

Depois do build Pages e antes das suítes, um build isolado sem base pode ser
gerado sem substituir `dist/` ou interromper a prévia:

```bash
npm run build:pages
ASTRO_TELEMETRY_DISABLED=1 ./node_modules/.bin/astro build --outDir test-results/b-2026-11-13/root-dist
./node_modules/.bin/html-validate 'test-results/b-2026-11-13/root-dist/**/*.html' --max-warnings 0
KINEIN_TEST_BASE=/ KINEIN_TEST_DIST=test-results/b-2026-11-13/root-dist CHROME_BIN=/caminho/do/chrome node scripts/check-docs-browser.mjs
CHROME_BIN=/caminho/do/chrome npm run check:browser
CHROME_BIN=/caminho/do/chrome npm run check:experience
```

O comando Astro isolado é build complementar, não outra execução do gate
completo `npm run build`. Os checks estáticos completos pertencem ao build
Pages; o HTML e o navegador do build sem base têm resultados próprios.
Artefatos de B ficam em `test-results/b-2026-11-13/`, com `pages/` e `root/`
separados. As capturas são candidatas; texto ampliado não equivale a zoom real.
O registro [B-DOCUMENTACAO.md](B-DOCUMENTACAO.md) contém o fechamento efetivo.

## Reprodução de C0

A prova é opt-in e não faz parte do build publicado. Requer Chrome e o pacote
Pagefind exato instalado temporariamente fora do checkout. Não adicionar a
dependência ao projeto para reproduzir a decisão de C0.

```bash
npm install --prefix /tmp/kinein-c0-pagefind --no-save --package-lock=false --ignore-scripts --no-audit --no-fund pagefind@1.6.0
npm run build:pages
KINEIN_PAGEFIND_DIR=/tmp/kinein-c0-pagefind/node_modules/pagefind CHROME_BIN=/caminho/do/chrome npm run check:search-proof
ASTRO_TELEMETRY_DISABLED=1 ./node_modules/.bin/astro build --outDir test-results/c0-2026-11-13/root-dist
./node_modules/.bin/html-validate 'test-results/c0-2026-11-13/root-dist/**/*.html' --max-warnings 0
KINEIN_TEST_BASE=/ KINEIN_TEST_DIST=test-results/c0-2026-11-13/root-dist KINEIN_C0_OUTPUT=test-results/c0-2026-11-13/root KINEIN_PAGEFIND_DIR=/tmp/kinein-c0-pagefind/node_modules/pagefind CHROME_BIN=/caminho/do/chrome npm run check:search-proof
node scripts/report-search-proof.mjs
./node_modules/.bin/html-validate test-results/c0-2026-11-13/review/index.html --max-warnings 0
python3 -m http.server 4322 --bind 127.0.0.1 --directory test-results/c0-2026-11-13/review
```

O último comando serve apenas o relatório legível. A fixture do mecanismo fica
na cópia isolada, sem link no produto. Não há campo de busca fictício no relatório.
`probe-search.mjs` só escreve em `test-results/` e limpa apenas seu bundle gerado
antes de repetir a indexação. Artefatos de outras etapas são preservados.

`probe-search-browser.mjs` mede consultas e URLs do índice real, CSP nos dois
modos, filtros, fallback de idioma, cache, offline e erro de asset. O harness
aceita callback de eventos e sessão CDP opcionais para observar o worker e
bloquear seu recurso de WASM; os consumidores anteriores não precisam mudar.
As falhas esperadas ficam registradas. A prova deve falhar se o modo escolhido
deixar de funcionar ou se os resultados apontarem a página/ID inexistente.

Preservar `check:browser` e `check:experience` e executá-los ao alterar o
harness compartilhado. A UI de C1 ainda exige teclado/foco, estados,
concorrência, seis larguras, texto ampliado, temas e alternativa sem JS.
Resultados e limites reais em [C0-BUSCA.md](C0-BUSCA.md).

## Reprodução de C1

C1 fixa `pagefind@1.6.0` como dependência de desenvolvimento. `npm ci
--ignore-scripts` restaura o lockfile; o build usa a API nativa, sem browser.
O comando de busca está incluído no fim de `check:experience`; Firefox é um
gate complementar opt-in que usa geckodriver/Firefox já disponíveis, sem
instalar outra suíte. `CHROME_BIN` aponta ao navegador existente.

```bash
npm run build:pages
CHROME_BIN=/caminho/do/chrome npm run check:browser
CHROME_BIN=/caminho/do/chrome npm run check:experience
CHROME_BIN=/caminho/do/chrome npm run check:search:firefox
npm run check:examples
ASTRO_TELEMETRY_DISABLED=1 ./node_modules/.bin/astro build --outDir test-results/c1-2026-11-13/root-dist
KINEIN_TEST_DIST=test-results/c1-2026-11-13/root-dist npm run build:search
KINEIN_TEST_DIST=test-results/c1-2026-11-13/root-dist npm run check:search-index
./node_modules/.bin/html-validate 'test-results/c1-2026-11-13/root-dist/**/*.html' --max-warnings 0
KINEIN_TEST_BASE=/ KINEIN_TEST_DIST=test-results/c1-2026-11-13/root-dist CHROME_BIN=/caminho/do/chrome npm run check:search
KINEIN_C0_OUTPUT=test-results/c1-2026-11-13/c0-pages KINEIN_PAGEFIND_DIR="$PWD/node_modules/pagefind" CHROME_BIN=/caminho/do/chrome npm run check:search-proof
KINEIN_TEST_BASE=/ KINEIN_TEST_DIST=test-results/c1-2026-11-13/root-dist KINEIN_C0_OUTPUT=test-results/c1-2026-11-13/c0-root KINEIN_PAGEFIND_DIR="$PWD/node_modules/pagefind" CHROME_BIN=/caminho/do/chrome npm run check:search-proof
```

A instalação temporária descrita em C0 é o procedimento histórico anterior à
adoção. Na reexecução de C1 usa-se o pacote fixado do checkout e outro diretório
de evidências, preservando C0. Não executar builds que substituam `dist/`
durante uma suíte que o consome. Os artefatos desta rodada são ignorados e
não acompanham um clone novo.

`check:search-index` confere corpus, exclusões, idioma, versão, origem do
manual e estado da prévia. `check:search` usa índice e worker reais: seis
consultas, URLs/IDs existentes, três temas, seis larguras, texto a 200%,
janela baixa, ausência de JS, teclado/foco, composição, outra modal, respostas
antigas e falhas de módulo/WASM com retry. A resposta antiga é retida no
worker real e liberada após o resultado mais recente. Não trocar por mocks
de ranking ou de resultados. Requisições do worker e falhas deliberadas
ficam no relatório; erros normais devem continuar vazios.

Os seletores de anúncio de cópia das suítes anteriores identificam a região
visualmente oculta de B, pois o diálogo de busca possui outro `aria-live`.
Preservam as mesmas verificações de conteúdo, sucesso/falha, foco e repetição.
O fallback de H2 verifica o controle de busca real oculto sem JS.

Antes de publicar, executar o fluxo do repositório com compiladores disponíveis
(C/C++, Rust edition 2024 e Python). A conferência pública agora compara todos
os arquivos de `pagefind/` com o build, além do HTML e assets existentes.
Autorização de publicação é específica; o pedido explícito desta sessão cobre
a entrega C1. Resultados e limites em [C1-BUSCA.md](C1-BUSCA.md).
