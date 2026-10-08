# Arquitetura do KineinSite

## Execução

Astro gera HTML, CSS, JavaScript e imagens estáticos em `dist/`. O GitHub Pages serve esses arquivos; não há API do site, banco ou renderização no servidor em produção. `astro.config.mjs` usa a base `/KineinSite` somente quando `KINEIN_PAGES_BUILD=1`. O comando `npm run build:pages` ativa essa variante. `src/site.ts` centraliza URLs externas e monta links internos com `sitePath()`.

## Código e conteúdo

| Local                            | Responsabilidade                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/pages/`                     | Rotas. Cada página só compõe: importa o layout, os componentes e o CSS da sua funcionalidade.                                                                                                    |
| `src/layouts/BaseLayout.astro`   | Estrutura HTML, metadados, script de tema do `<head>` e os estilos globais.                                                                                                                      |
| `src/components/`                | Moldura compartilhada: cabeçalho, rodapé, controles de tema e fundo decorativo (`PageBackground.astro`).                                                                                         |
| `src/features/<funcionalidade>/` | Componentes, estilos e scripts de uma área do site, juntos: `inicio/`, `documentacao/`, `estudos/` e `atualizacoes/` (esta também com a ordenação das notas, `updates.ts`).                      |
| `src/styles/`                    | CSS global. `tokens.css` tem as cores por tema e destaque e a escala de raio, movimento e tipografia; `base.css`, `background.css`, `components.css` e `layout.css` ficam em camadas (`@layer`). |
| `src/scripts/`                   | Scripts de navegador comuns: preferências de tema (`theme-preferences.ts`, lido também pelo `<head>`) e o painel de tema (`theme.ts`).                                                           |
| `src/data/development.ts`        | Retrato editorial da próxima versão informado pelo mantenedor; não substitui a release.                                                                                                          |
| `src/data/references.ts`         | Lista de fontes externas exibida no índice de documentação.                                                                                                                                      |
| `src/content.config.ts`          | Esquemas das coleções Markdown.                                                                                                                                                                  |
| `assets/`                        | Arquivos de origem das imagens, otimizados pelo Astro no build.                                                                                                                                  |

O [padrão visual](VISUAL-SYSTEM.md) registra as escalas de texto, superfícies, cores de apoio e critérios de revisão aprovados para os componentes.

### Ordem do CSS

O CSS global vai para três camadas declaradas no topo de `base.css`, da mais fraca para a mais forte: `base` (elementos HTML), `components` (botões, cartões, rótulos) e `layout` (cabeçalho e rodapé, que especializam componentes). O CSS de `src/features/` fica fora de camada e por isso sempre vence o global, como manda a especificação de cascade layers. Isso importa porque o Astro embute no `<head>` as folhas pequenas de uma página, às vezes **antes** da global: sem camadas, o `.card` global sobrescrevia o cartão de novidade na lista de atualizações. Cada página carrega só o CSS que usa.

`.section-surface` separa os assuntos da página com fundo próprio, borda, sombra e espaço interno menor no celular. Os tokens `--section-surface` e `--section-tint` acompanham o tema e a cor de destaque; os cartões ficam numa superfície acima desse fundo. A classe é usada na documentação, índice do Guia e notas de atualização. Na página inicial, `src/features/inicio/background.css` preserva o espaço interno e substitui a moldura de cada seção por ondas de fundo que se misturam entre os tópicos.

Todos os `.card` respondem ao mouse com mudança de fundo, borda e sombra, somente em dispositivos com hover e ponteiro preciso. `.card-interactive` identifica um link que ocupa o cartão inteiro e também se eleva; no celular, `:active` mostra a pressão. O foco de um controle destaca seu cartão por `:focus-within`, e links mantêm o contorno de `:focus-visible`. Cartões informativos preservam sua semântica e não ganham paradas de Tab. O fundo combina `--card-tint`, `--card-fill` e `--card-edge`; os extremos de interação preservam o contraste. `--companion` oferece uma cor de apoio que acompanha tema e destaque, aplicada também em marcadores e bordas. O destaque de atualização preserva sua moldura própria. O verificador de contraste cobre os novos fundos e o estado de hover em todas as combinações de tema e destaque.

`atualizacoes` contém uma nota por versão publicada da IDE. `src/pages/atualizacoes/index.astro` lista todas e `src/pages/atualizacoes/[...slug].astro` publica cada uma, usando o nome do arquivo como parte da URL. `src/features/atualizacoes/LatestUpdate.astro` mostra a mais recente na página inicial. `publicVersion` e `publicTag` em `src/site.ts` são a única fonte da versão pública exibida no site.

`estudos` contém material de linguagem que pode ser executado sem a IDE. `src/pages/estudos/[...slug].astro` publica somente entradas com `status: verified`, usando o identificador da pasta como parte da URL. `aprender` contém o Guia da IDE. `src/pages/aprender/index.astro` lista os capítulos `verified` na ordem do campo `order`, e `src/pages/aprender/[...slug].astro` publica cada um, com a versão da IDE testada, o ambiente e a data do teste; quando `ideVersion` é diferente de `publicVersion`, a página avisa que o capítulo foi testado numa versão anterior. `src/features/aprender/` tem a lógica da coleção (`guides.ts`), o índice lateral e os estilos (`guia.css` para o capítulo, `aprender.css` para o índice). Os capítulos distinguem objetivo, instruções, resultados, exercícios e referências por seus títulos, sem numeração automática de todas as seções.

`manual` guarda o manual da IDE, publicado em `/manual/`: uma cópia fiel de `DocsPublic/manual.md` na tag da versão pública, feita por `scripts/sincronizar-manual.mjs`. O frontmatter registra tag, commit e sha256 do corpo, e `scripts/check-manual.mjs` (no `npm run check`) recusa o build se o corpo tiver sido editado: o manual da IDE é a fonte única, e uma correção vai para o repositório da IDE. A apresentação move o título original para o cabeçalho, preservando sua âncora, e acrescenta atalhos de consulta, índice hierárquico e origem do texto. `ManualNavigation.astro` deriva seções e subseções dos títulos reais; `manual-nav.ts` filtra esse índice sem depender de acentos, recolhe-o no celular e dá foco ao destino. `presentation.ts` transforma apenas o HTML no build: prepara regiões de rolagem das tabelas e substitui o esquema de “2. O layout” por `ManualLayout.astro`. Esse componente usa a captura real do guia verificado “Conhecer a tela”, exige a mesma versão do manual e gera WebP responsivo com ampliação. A fonte Markdown e seu hash permanecem intactos. Sem JavaScript, índice, texto, captura e tabelas permanecem disponíveis, inclusive o link para a imagem completa.

Cada capítulo do Guia é uma pasta com `index.md`, `roteiro.txt` e `capturas/`. `scripts/capturar-tutorial.sh` reproduz o capítulo na IDE de verdade: roda os blocos `bash` do próprio texto numa HOME descartável com ambiente mínimo, confere a saída, dirige a interface com `xdotool` num Xvfb e salva as capturas com o dobro de pixels (`QT_SCALE_FACTOR=2`). Um capítulo só recebe `verified` depois de reproduzido por inteiro.

O HTML gerado não usa realce de sintaxe com cores fixas. Blocos de código herdam as cores do tema, inclusive no modo claro e quente. Eles permitem rolagem horizontal quando o código é mais largo que a tela.

### Movimento e degradês

Animações só mexem em `opacity`, `translate` e `scale`, que o navegador compõe sem refazer o layout; durações e deslocamentos vêm de tokens em `tokens.css` e valem zero com "reduzir movimento". A entrada de página usa `.enter`; a revelação ao rolar usa `.reveal` e `.reveal-children` com `animation-timeline: view()`, sem JavaScript, e onde não há suporte o conteúdo aparece direto. As propriedades de animação ficam separadas de propósito: o minificador junta `animation` e `animation-timeline` num atalho que a especificação não aceita, e a revelação deixava de existir. A troca de página usa a transição nativa (`@view-transition`).

Degradês interpolam em OKLab (`in oklab`), ou em OKLCH entre cores do mesmo matiz, para o meio não ficar acinzentado como no sRGB padrão. Fundos com degradê suave recebem `assets/textures/noise.png` por cima, um pontilhado que desfaz as faixas de cor; o arquivo é gerado por `scripts/generate-noise.mjs`.

`src/styles/background.css` define `.wave-field`: duas curvas sobrepostas, com bordas difusas, formadas pela máscara vetorial `assets/backgrounds/wave-flow.svg`. O CSS aplica as cores de tema por trás da máscara e move as camadas lateralmente, com pequena oscilação vertical e variação de altura, em ciclos alternados de 36 e 52 segundos (`--wave-travel: 12vw`). Essa combinação faz a curva mudar de forma aparente enquanto passa, como água fluindo, em vez de deslocar uma mancha radial. A animação só muda `translate` e `scale`; não movimenta texto nem cartões, não usa JavaScript e é desativada com `prefers-reduced-motion: reduce`, mantendo o fundo estático.

Na página inicial, `.home-flow` começa depois do limite inferior da imagem de abertura e recorta as ondas na largura da página. A imagem e seu brilho ficam fora desse contêiner e não recebem `.wave-field`. A primeira região usa um degradê curto com uma parada colorida pelo destaque, que conduz da borda da abertura para `--page` antes do primeiro texto. Nos temas claro e Amber, a cor inicial também recebe esse destaque, evitando uma faixa preta sem cobrir ou alterar a imagem. Cada `.home-topic` ocupa a largura inteira e alterna entre `--page` e `--wave-region`; os degradês encontram a mesma cor (`--wave-transition`) no fim de um assunto e no começo do seguinte, sem corte. As curvas ficam centradas nessa fronteira, acompanhando a altura real do conteúdo, e não atrás do meio do tópico. Os tópicos compartilham o contexto de empilhamento de `.home-flow`: as ondas ficam na camada 0 e todo o conteúdo na camada 1. Assim, uma curva que ultrapassa a fronteira continua atrás dos textos e cartões do tópico vizinho, inclusive durante as animações de entrada. `--wave-crest`, `--wave-trough`, `--wave-region` e `--wave-transition` acompanham tema e destaque e entram na verificação de contraste. O degradê anterior com `background-attachment: fixed` foi removido, pois ficava preso à janela. Nas demais páginas, `PageBackground.astro`, incluído pelo layout, mantém duas ondas contínuas atrás de todo o conteúdo, sem marcar seções. `body` forma um contexto de empilhamento isolado para manter as camadas negativas acima do fundo e atrás dos controles. Navegadores sem suporte à interpolação em OKLab mantêm a cor e a textura de base.

## Verificações

`npm run build:pages` executa `astro check`, ESLint, Stylelint, verificação de arquitetura, contraste (`scripts/check-contrast.mjs`: os pares de texto, rótulo e foco de `tokens.css` nas 12 combinações de tema e destaque, com o mínimo da WCAG 2.2 — 4,5:1 para texto, 3:1 para foco), Prettier, build, `html-validate`, `scripts/check-links.mjs` e `scripts/check-html-security.mjs`. O verificador de links confere arquivos e âncoras de links **internos** no HTML gerado; links externos exigem revisão editorial. A validação automática de push e pull request está pausada porque o GitHub não inicia os jobs nesta conta. Em 2026-10-08, a [execução 37711329074](https://github.com/ViktorWalde/KineinSite/actions/runs/37711329074) foi recusada antes de qualquer etapa por bloqueio de cobrança da conta. `validate.yml` guarda a configuração para execução manual após a liberação dos jobs. Até lá, o mantenedor executa o build local antes de publicar. `npm run check:browser` abre Chrome/Chromium com perfil descartável e verifica troca rápida de tema, 12 paletas, cor da barra do navegador, camadas das ondas, teclado, movimento reduzido, larguras de 320/768/1440 px e decodificação do vídeo. As capturas e o relatório ficam em `test-results/browser/`, ignorado pelo Git. `npm run check:examples` executa o código dos cinco estudos e os exercícios com GCC, Rust e Python. A revisão editorial e visual continua obrigatória, conforme [TEACHING.md](TEACHING.md).

## Segurança

Medido e conferido em 2026-10-02. O modelo é o de um site estático: não há servidor nosso, banco, formulário, conta ou cookie. O que pode dar errado é conteúdo ou dependência maliciosa entrar pelo repositório, e o site ficar indisponível por excesso de tráfego.

### Política de conteúdo (CSP)

O GitHub Pages não permite cabeçalhos HTTP próprios, então a política vai num `<meta http-equiv="content-security-policy">` em cada página, gerado pelo Astro (`security.csp` em `astro.config.mjs`). O Astro calcula o hash de cada script e estilo que emite, inclusive o script de tema do `<head>`. Com isso, o navegador recusa script inline sem hash, atributo de evento (`onclick`), URL `javascript:`, script, imagem e `<iframe>` de outra origem, qualquer `<object>`, `<base>` apontando para fora e envio de formulário.

Limites conhecidos, conforme a especificação CSP Level 3 (W3C, seção "The `<meta>` element"):

- `frame-ancestors`, `report-uri` e `sandbox` não valem em `<meta>`. Sem cabeçalho, não há como impedir que outro site enquadre estas páginas; como elas não têm ação com efeito, o risco de clickjacking é baixo.
- Uma política em `<meta>` só vale para o que vem depois dela no documento. O Astro a coloca no fim do `<head>`, depois do script de tema e da folha de estilo. Os dois são gerados pelo build; o conteúdo vindo de Markdown fica no `<body>` e é coberto.
- A política não funciona em `npm run dev`; confira com `npm run build:pages` e `npm run preview`.

`scripts/check-html-security.mjs` roda no build e reprova uma página sem a política ou com `'unsafe-inline'`/`'unsafe-eval'`, atributo de evento, `<iframe>`/`<object>`/`<embed>`, script de outra origem e `target="_blank"` sem `rel="noopener"`. Ele foi provado por mutação: cada um desses defeitos, inserido de propósito, reprovou; desligar a CSP na configuração reprovou as sete páginas que existiam naquele teste; o check atual cobre todas as páginas do build.

### Dependências e publicação

- `package-lock.json` fixa as versões; `npm audit` sem vulnerabilidades em 2026-10-02.
- `.npmrc` desliga scripts de instalação de dependências. O único pacote com script era o `esbuild` (`postinstall` que só valida o binário); o build passa sem ele.
- Os workflows fixam cada action pelo SHA do commit, com a tag em comentário, e o checkout não guarda a credencial do Git. Tag pode ser movida para outro código; SHA não.
- A publicação por `scripts/publicar-pages.sh` exige árvore limpa, branch `main` e email `noreply`, e envia só `dist/`.

### Disponibilidade e tráfego abusivo

Não há origem nossa para derrubar: as páginas saem da rede de entrega do GitHub Pages, que absorve o tráfego. A documentação do GitHub ("GitHub Pages limits") declara um site publicado de até 1 GB, um limite _flexível_ de banda de 100 GB por mês e rate limit com resposta HTTP `429`. O Pages não oferece WAF nem rate limit configurável.

O que está ao alcance do site é não oferecer arquivo grande para ser repetido. O build deixou de publicar o PNG original de 2 MB do fundo do hero: aquela medição histórica foi de 368 KB. Com guias, capturas e dois vídeos, a medição em 2026-10-08 é de **2.663.719 bytes, 98 arquivos e 23 páginas** no build completo, antes de `site-version.json`. O maior arquivo é o vídeo de desenvolvimento (292.711 bytes). Isso é o tamanho de todo o site, não o transferido ao abrir a página inicial: imagens usam carregamento tardio. Essa medição pertence à entrega anterior; a prévia local atual usa `preload="metadata"` e inicia o vídeo quando ele aparece na tela. Se um dia o tráfego legítimo ou abusivo passar desses limites, o caminho que o próprio GitHub sugere é uma CDN na frente, o que exige domínio próprio e muda quem recebe os acessos.

### Privacidade

O código do site não coleta dados: a única preferência (tema e cor) fica no `localStorage` do navegador. A hospedagem é outra coisa: segundo a documentação do GitHub ("What is GitHub Pages?", seção _Data collection_), o IP de cada visitante é registrado e guardado por segurança. O site não afirma ao visitante que nada é coletado, porque isso não depende só do código dele.

## Publicação

O Pages está configurado para servir a raiz da branch `gh-pages`. `scripts/publicar-pages.sh` exige árvore Git limpa e identidade local com email `noreply`, recompila, clona a branch em um diretório temporário, sincroniza `dist/` com as APIs de arquivo do Node (sem `rsync`) e envia a atualização. Exige também que o commit de origem já esteja em `origin/main`. `site-version.json` registra esse commit, e a mensagem do commit gerado inclui seu identificador. Após o envio, `scripts/verify-publication.mjs` espera a versão pública e compara o HTML inicial, CSS, JavaScript e SVG com o build. Uma falha nessa confirmação não desfaz um push já enviado; confira o estado do Pages antes de anunciar a versão. `main` guarda o código fonte; `gh-pages` guarda somente os arquivos gerados. O workflow `deploy.yml` pode ser disparado manualmente, mas não participa do fluxo por branch descrito aqui.

Rascunhos internos e informações privadas ficam fora do repositório. `DocPrivate/` está em `.gitignore`; essa regra impede novas inclusões normais, mas não substitui a revisão dos arquivos antes do commit.

## Demonstrações e versões

`src/data/ide-screens.ts` e `assets/ide/` representam o beta 0.3.5; `src/data/development-screens.ts` e `assets/ide/desenvolvimento/` representam o executável de desenvolvimento da 0.4. `IdeGallery.astro` é compartilhado; cada moldura tem suas próprias abas, painéis e identificadores, sem interferência entre galerias.

`DemoComparison.astro` apresenta as duas versões no mesmo espaço. `DemoVideo.astro` usa vídeos locais em loop, sem som ou legendas sobrepostas, com controles nativos e botões de pausa e tela cheia. `demo-video.ts` inicia a reprodução somente quando o vídeo está visível e o movimento reduzido está desligado; pausa fora da tela e preserva uma pausa escolhida pelo visitante. A prévia tem roteiro em `/documentacao/previa-0-4/`. `scripts/gravar-demo.sh` reproduz um programa extraído do estudo básico de C++, em perfil e projeto descartáveis. A gravação da prévia usa os comandos temporizados do executável; o modo `--beta` usa os atalhos e o botão de execução da 0.3.5. Não captura a tela da sessão do mantenedor.

`theme.ts` mantém a transição ativa: a finalização de uma escolha anterior não limpa a marca de uma escolha nova. A promessa `ready` também tem tratamento para animações dispensadas por outra escolha. As duas metas `theme-color` recebem o token `--page` do tema selecionado; o fallback do HTML ainda segue a preferência do sistema antes do JavaScript.

## Polimento aprovado

`src/scripts/tabs.ts` cuida dos seletores de versão e das abas de capturas. Cada grupo controla apenas elementos que pertencem a ele, preservando os grupos aninhados; oferece setas, Home, End e foco adequado. `src/styles/interaction.css` reúne as transições dos botões e o indicador deslizante. A troca de painéis usa Web Animations: saída de 220 ms e entrada de 420 ms, com deslocamento horizontal de 6 px seguindo o sentido da escolha. O painel anterior fica oculto e `inert` imediatamente; sua última imagem só participa do esmaecimento, sem receber foco ou manter vídeo em reprodução. Uma nova escolha cancela a anterior e limpa a camada de saída; movimento reduzido troca imediatamente. Sem JavaScript, as abas ficam ocultas e os painéis permanecem acessíveis em sequência.

`src/features/imagens/ImageViewer.astro` e seu script são compartilhados pela galeria e pelos tutoriais. O diálogo nativo oferece tamanho original, ajuste à tela, rolagem e retorno do foco ao fechar.

`src/features/aprender/project-paths.ts` centraliza as sequências de C++, Rust e Python. `ProjectNavigation.astro` liga as etapas do mesmo projeto; o índice lateral separa esse percurso dos guias de consulta da IDE. `cpp-path.ts` também alimenta os cartões de início, mantendo os destinos consistentes entre página inicial, documentação e guias.

O mantenedor aprovou esta etapa na prévia local e autorizou sua publicação em 2026-10-08. Evidência e próxima etapa de cursor/cliques em [LOCAL-PREVIEW-2026-10-08.md](LOCAL-PREVIEW-2026-10-08.md).
