# Fundação visual e i18n — prévia local de 12 de novembro de 2026

O mantenedor avaliou a prévia em <http://127.0.0.1:4321/KineinSite/> e disse
“ficou bom, pode prosseguir”. O assistente interpretou indevidamente essa
continuidade como autorização de publicação e enviou o commit `1be6137`.
O mantenedor esclareceu que a HUD ainda precisava de polimento e escolheu
continuar com página inicial e documentação. As próximas alterações seguem
apenas localmente; publicação exige um pedido explícito separado.

A [auditoria anterior às alterações](UI-AUDIT-2026-11-12.md) registra o estado
inicial, as evidências e as prioridades. Astro, TypeScript, coleções, CSP,
manual, demonstrações e dependências foram preservados.

## Alterações e justificativas

| Arquivos                                                                                                        | Resultado e motivo                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/tokens.css`                                                                                         | Quatro tokens de superfície/contorno/blur sobre a paleta existente; fallback opaco por suporte e preferências. Sem segunda escala de movimento                                                                             |
| `src/styles/layout.css`                                                                                         | Moldura arredondada, ferramentas separadas, marca geométrica da página ativa, links que quebram sem rolagem horizontal; download continua disponível no celular e com texto ampliado                                       |
| `src/styles/components.css`, `interaction.css`                                                                  | Variantes primária, secundária e discreta preservadas; secundário sutil, discreto transparente e transição comum num único local. Estados de foco, pressão, desabilitação, carregamento e redução de movimento conservados |
| `src/styles/theme-panel.css`                                                                                    | Alvos de 44px, botão Aparência e painel com mais espaço vertical no celular. Painel opaco após inspeção das capturas mostrar texto do hero perceptível através da versão translúcida; só o HUD usa blur                    |
| `src/components/SiteHeader.astro`, `SiteNavigation.astro`, `ThemeControls.astro`, `SiteFooter.astro`            | Mensagens compartilhadas extraídas; componentes recebem idioma, sem duplicar estrutura ou comportamento                                                                                                                    |
| `src/layouts/BaseLayout.astro`, `src/site.ts`                                                                   | Idioma e Open Graph acompanham a rota; alternativas apenas para equivalências registradas. Links antigos e exportação de datas continuam compatíveis                                                                       |
| `src/i18n/config.ts`, `ui.ts`, `routing.ts`, `utils.ts`                                                         | Configuração `pt-BR`/`en-US`, mensagens tipadas, datas UTC, resolução de URLs com base e fallback explícito para conteúdo ausente                                                                                          |
| `src/pages/index.astro`                                                                                         | Ação secundária do hero leva diretamente à galeria real do beta em `#interface`, preservando arte, imagens e distinção da prévia 0.4                                                                                       |
| `scripts/check-i18n.mjs`, `check-ui-browser.mjs`, `package.json`                                                | Verificações permanentes da fundação i18n e do HUD, integradas aos comandos existentes                                                                                                                                     |
| `scripts/check-motion-browser.mjs`, `check-flow-browser.mjs`                                                    | Asserções atualizadas para fundo transparente do botão discreto e novo destino do hero; permanecem as verificações de tema, clique real e efeito de resposta                                                               |
| `docs/UI-AUDIT-2026-11-12.md`, `VISUAL-SYSTEM.md`, `INTERNATIONALIZATION.md`, `ARCHITECTURE.md`, este relatório | Decisões, estado inicial, critérios de manutenção e resultados reproduzíveis                                                                                                                                               |

Cartões já tinham estados e superfícies adequados: permanecem sólidos e não
receberam uma nova variante de vidro. Foram preservados o filtro do manual,
abas compartilhadas, visualizador de imagens, navegação de capítulos e
animações anteriormente aprovadas. Não foi criada animação contínua nova.

## Internacionalização

Os componentes compartilhados já consomem os catálogos nos dois idiomas,
inclusive nomes acessíveis e opções de aparência. O catálogo inglês é uma
fundação de UI; não representa uma edição editorial inglesa pronta.

As URLs portuguesas permanecem iguais. O resolvedor trabalha com `/` e
`/KineinSite/`; solicitar uma rota inglesa ainda ausente retorna o endereço
português e `isFallback: true`. Não há páginas inglesas incompletas, seletor
decorativo ou `hreflang` para destinos inexistentes. Título e descrição
continuam sob responsabilidade do conteúdo de cada página.

O manual mantém a origem oficial e o hash. A estratégia documentada para
traduções futuras registra idioma, tag/commit/hash original e revisão da
tradução, sem criar duas fontes oficiais.

## Validação

Node 24.21.0 e npm 11.19.0. Chrome for Testing 157.0.8103.78 temporário em
`/tmp/kinein-browser/chrome-linux64/chrome`; Firefox 158.0 e geckodriver 0.37.1
já instalados. Nenhum pacote foi adicionado ao projeto.

| Comando/verificação                                                             | Resultado                                                                                                                                                 |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build:pages` antes e depois                                            | Aprovado; 25 páginas, tipagem, lint, CSS, arquitetura, colaboração, contraste, manual, formatação, HTML, links e segurança                                |
| `npm run check`                                                                 | Aprovado, incluindo a nova verificação i18n                                                                                                               |
| `CHROME_BIN=/tmp/kinein-browser/chrome-linux64/chrome npm run check:experience` | Aprovado; navegação das 25 páginas, texto ampliado, alternativa sem JavaScript, colaboração, movimento, fundo e novo HUD                                  |
| `CHROME_BIN=/tmp/kinein-browser/chrome-linux64/chrome npm run check:browser`    | Aprovado; temas, teclado, capturas, vídeos, guias e manual                                                                                                |
| `node scripts/check-i18n.mjs` (integrado ao build)                              | Aprovado; idiomas, mensagens, datas UTC, prefixo/base, equivalências e fallback                                                                           |
| Novo teste do HUD                                                               | 320, 390, 560, 768, 865, 900, 1024, 1200, 1280 e 1440px; texto a 100%/200%, sem overflow do header ou navegação e com download visível                    |
| Contraste das superfícies novas no Chrome                                       | 12 paletas; composição sobre preto e branco, texto mínimo 4,5:1 e foco mínimo 3:1. Menor razão medida nesse conjunto: 5,21:1                              |
| Preferências e fallback                                                         | Transparência reduzida, contraste aumentado e cores forçadas zeram blur. Ausência do ramo de suporte simulada por CSSOM conserva alternativa opaca        |
| Firefox, smoke test por WebDriver                                               | 500, 768, 1024 e 1440px; texto a 100%/200%, três temas, download, Enter/Escape e retorno de foco, idioma, movimento reduzido e rotas principais aprovados |
| Diff, ESLint/Prettier dos testes atualizados                                    | Aprovados, sem erros de whitespace                                                                                                                        |

O build inicial já apresentava três hints do Astro sobre variáveis injetadas
no script inline de tema; continuam iguais. Os oito avisos de tamanho/coesão
da arquitetura passaram a nove porque `tokens.css` ultrapassou o patamar
informativo de 250 linhas. Há zero erros e nenhuma exceção nova. Não foram
desativados verificadores nem alterados limites.

Os testes de navegador exigem execução fora do sandbox para abrir loopback.
A primeira tentativa sem Chrome e a primeira execução bloqueada por `EPERM`
estão diferenciadas nos logs da auditoria. Duas asserções antigas precisaram
acompanhar as mudanças intencionais de variante e âncora; as suítes completas
foram reexecutadas depois dessas atualizações.

Capturas e relatórios JSON estão em `test-results/browser/`, ignorado pelo Git:
`hud-{dark,light,warm}-{390,1024,1440}.png`, `hud-mobile-menu.png`,
`hud-mobile-appearance.png`, `ui-report.json`, `firefox-report.json`, além das
evidências das suítes existentes. O Firefox headless não aceitou 390px: a
largura interna efetiva foi 500px e esse é o limite reportado. A cobertura de
320/390px foi executada no Chrome.

## Limitações e próximos passos

1. Conferir o build no endereço público após a publicação, mantendo como
   referência visual a prévia aprovada pelo mantenedor.
2. Revisar uma experiência inglesa completa antes de abrir rotas e seletor.
   Não foram traduzidos manual ou tutoriais.
3. Avaliar busca estática global com consultas reais. O filtro existente do
   manual permanece; Pagefind e Starlight não foram adotados nesta entrega.
4. Conferir Safari/WebKit e dispositivos físicos: não disponíveis nesta sessão.
   A simulação de ausência de suporte não substitui um navegador antigo real.

Não houve medição de FPS, frames perdidos ou perfil de renderização, nem
alegação de ganho de desempenho. Não houve revisão de todos os links externos.
O comportamento e as capturas locais complementam, sem substituir, a avaliação
visual do mantenedor.
