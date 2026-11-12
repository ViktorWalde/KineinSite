# H1 — Modelo de navegação da HUD

Registro histórico da entrega documental H1 em 12 de novembro de 2026.
O texto abaixo retrata o fechamento do modelo, anterior à implementação.
A execução posterior e suas evidências são registradas em [H2-HUD.md](H2-HUD.md);
aquele pacote não transforma os testes propostos aqui em resultados presumidos.
A avaliação visual pertence ao mantenedor; publicação exige pedido explícito.

## Escopo e estado conferido

H1 resolve a organização dos destinos e os contratos necessários a H-01–H-04,
com limites de superfície/âncoras de H-05. O problema demonstrado é U-01/U-02
da [baseline](BASELINE.md): destinos planos concorrendo por espaço e altura
excessiva em parte da matriz. A solução mínima é agrupar os acessos existentes
e definir sua composição, sem implementar dropdowns ou polimento visual.

- HEAD confirmado: `1be6137003dbe6f66729cca798996a61842956c9`.
- A entrada contém 17 arquivos rastreados modificados e seis entradas não
  rastreadas no `git status --short`, incluindo a pasta deste planejamento.
  As mudanças anteriores de início, índices, scripts e documentação foram
  preservadas; nenhum reset, descarte ou commit foi executado.
- Os 225 arquivos de execução/verificação coincidem individualmente com o
  manifesto da baseline. Agregados na ordem daquele manifesto, mantêm o
  fingerprint `2f62aa9d0a1bca549110a7be6000d50b4c6bb97900b6f0f7354d2ab4e8ccd8f7`.
- O build Pages desta rodada gerou 25 páginas. Só há conteúdo `pt-BR`;
  `en-US` tem catálogo de UI e prefixo reservado, sem páginas equivalentes.
- Download aponta à release **configurada** `v0.3.5`, sem página própria ou
  seleção de plataforma. Disponibilidade externa e release mais recente
  permanecem sujeitos à conferência de D; H1 não fez consulta à IDE remota.

Evidências locais ficam em `test-results/h1-2026-11-12/`, ignorado pelo Git:
estado inicial, cópia dos documentos antes da edição, hashes, inventário de
rotas, auditoria de destinos, logs e comparação final. A baseline histórica
em `test-results/engineering-2026-11-12/` foi preservada.

## Implementação atual inspecionada

| Fonte                                                                                                                                                                    | Comportamento real e consumidor                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SiteHeader.astro](../../src/components/SiteHeader.astro)                                                                                                                | Marca → navegação desktop → ferramentas (aparência e download) → `details` móvel. Renderiza `SiteNavigation` duas vezes.                                                                                                                                |
| [SiteNavigation.astro](../../src/components/SiteNavigation.astro)                                                                                                        | Lista fixa `collaborate`, `guide`, `manual`, `docs`, `updates`, seguida de Discord. `current` atribui `aria-current="page"` por seção, inclusive em páginas filhas.                                                                                     |
| [navigation.ts](../../src/scripts/navigation.ts)                                                                                                                         | Controla somente o disclosure móvel: Escape com retorno, clique fora/seleção, saída de foco e mudança em `54rem`. Não coordena grupos ou aparência.                                                                                                     |
| [ThemeControls.astro](../../src/components/ThemeControls.astro), [theme.ts](../../src/scripts/theme.ts) e [theme-preferences.ts](../../src/scripts/theme-preferences.ts) | Uma instância de aparência; rádios nativos; sistema/claro/escuro/warm e três destaques; persistência local, boot antes da pintura e View Transitions. O próprio `theme.ts` trata Escape e clique fora da aparência.                                     |
| [layout.css](../../src/styles/layout.css), [theme-panel.css](../../src/styles/theme-panel.css), [interaction.css](../../src/styles/interaction.css)                      | Header sticky com superfície de tokens; links em linha própria até `75rem`; desktop oculto e móvel disponível até `54rem`; ferramentas quebram até `35rem`. Aparência só aparece com `data-enhanced`; painéis opacos e redução de movimento existentes. |
| [BaseLayout.astro](../../src/layouts/BaseLayout.astro), [base.css](../../src/styles/base.css)                                                                            | `current` vem da página; skip link para `#conteudo`; idioma, canonical e equivalências vêm do roteamento. Scroll padding, transição do header e offsets dos índices dependem da geometria.                                                              |
| [site.ts](../../src/site.ts), [routing.ts](../../src/i18n/routing.ts), [ui.ts](../../src/i18n/ui.ts)                                                                     | URLs externas centralizadas, base compartilhada, sete identidades de rota, fallback explícito no resolver e mensagens tipadas `pt-BR`/`en-US`. Ainda não existe catálogo agrupado da HUD.                                                               |
| [SiteFooter.astro](../../src/components/SiteFooter.astro), índices de documentação/manual e navegação dos percursos                                                      | Mantêm acessos complementares. Índices identificam seção local com `aria-current="true"`; essa leitura por scroll é independente da HUD.                                                                                                                |

O CSS atual oculta a instância que não pertence ao tamanho de tela. Os
disclosures móveis continuam utilizáveis sem JS; a aparência é ocultada nesse
caso, pois depende de script. Os contratos de exclusão entre novos grupos,
Escape aninhado e rota exata ainda precisam ser implementados e testados.

## Inventário dos destinos reais

As URLs internas abaixo estão sem base para facilitar a leitura. No build
Pages, `/manual/` significa `/KineinSite/manual/`, e `/#interface` significa
`/KineinSite/#interface`. Query strings e fragmentos não alteram a identidade
da página. Nenhum slug deve ser traduzido ou receber `/en/` por concatenação.

### Acessos da moldura atual

| Acesso e rótulo atual                                                 | Destino                                                           | Identificação atual                                            |
| --------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| Marca “Kinein Vectis”, nome acessível “Kinein Vectis, página inicial” | `/`                                                               | `current="home"` na página; a marca não recebe `aria-current`. |
| Colabore                                                              | `/colabore/`                                                      | `collaborate`, inclusive `/colabore/regras/`.                  |
| Começar                                                               | `/aprender/`                                                      | `guide`, inclusive todos os oito capítulos publicados.         |
| Manual                                                                | `/manual/`                                                        | `manual`, inclusive seus fragmentos.                           |
| Documentação                                                          | `/documentacao/`                                                  | `docs`, inclusive prévia, sobre o site e estudos.              |
| Atualizações                                                          | `/atualizacoes/`                                                  | `updates`, inclusive as duas notas.                            |
| Discord                                                               | `https://discord.gg/cWRkUGUmQU`                                   | Externo; sem estado de página atual.                           |
| Baixar 0.3.5                                                          | `https://github.com/ViktorWalde/KineinVectis/releases/tag/v0.3.5` | Link externo com aparência de ação principal.                  |
| Rodapé: Quem contribui                                                | `/colabore/#colaboradores`                                        | Âncora complementar; sem estado ativo na HUD.                  |
| Rodapé: Sobre este site                                               | `/documentacao/site/`                                             | Página real do contexto `docs`.                                |
| Rodapé: Código da IDE / Código do site                                | Repositórios da tabela externa abaixo                             | Externos, sem estado ativo.                                    |

### Páginas geradas e contexto

O inventário cobre as 25 páginas do build. Capítulos e estudos continuam nos
índices existentes, sem transformar cada página em item da HUD.

| URLs sem base                                                   | Títulos ou identificação editorial            | `current` atual → grupo proposto |
| --------------------------------------------------------------- | --------------------------------------------- | -------------------------------- |
| `/`                                                             | Dê vida à sua próxima ideia.                  | `home` → Produto                 |
| `/aprender/`                                                    | Seu primeiro projeto começa aqui.             | `guide` → Documentação           |
| `/aprender/ide/instalar/`                                       | Instalar e abrir a Kinein Vectis              | `guide` → Documentação           |
| `/aprender/ide/conhecer-a-tela/`                                | Conhecer a tela                               | `guide` → Documentação           |
| `/aprender/ide/primeiro-projeto-cpp/`                           | Primeiro projeto em C++                       | `guide` → Documentação           |
| `/aprender/ide/primeiro-projeto-rust/`                          | Primeiro projeto em Rust                      | `guide` → Documentação           |
| `/aprender/ide/primeiro-projeto-python/`                        | Primeiro projeto em Python                    | `guide` → Documentação           |
| `/aprender/ide/busca-e-atalhos/`                                | Busca e atalhos (da IDE)                      | `guide` → Documentação           |
| `/aprender/ide/git/`                                            | Git                                           | `guide` → Documentação           |
| `/aprender/ide/quando-algo-da-errado/`                          | Quando algo dá errado                         | `guide` → Documentação           |
| `/manual/`                                                      | Manual do Kinein Vectis                       | `manual` → Documentação          |
| `/documentacao/`                                                | Documentação da Kinein Vectis                 | `docs` → Documentação            |
| `/documentacao/previa-0-4/`                                     | A próxima Vectis, por dentro.                 | `docs` → Documentação            |
| `/documentacao/site/`                                           | O site também é um projeto.                   | `docs` → Documentação            |
| `/estudos/c/primeiros-passos/`                                  | C básico: do número ao resultado              | `docs` → Documentação            |
| `/estudos/cpp/primeiros-passos/`                                | C++ básico: do número ao resultado            | `docs` → Documentação            |
| `/estudos/cpp/telemetria-local/`                                | C++20: processe telemetria local              | `docs` → Documentação            |
| `/estudos/rust/primeiros-passos/`                               | Rust básico: do número ao resultado           | `docs` → Documentação            |
| `/estudos/python/primeiros-passos/`                             | Python básico: do número ao resultado         | `docs` → Documentação            |
| `/colabore/`                                                    | Um pouco do seu tempo. Um projeto mais forte. | `collaborate` → Comunidade       |
| `/colabore/regras/`                                             | Como preparar e enviar sua contribuição.      | `collaborate` → Comunidade       |
| `/atualizacoes/`                                                | Atualizações da Kinein Vectis                 | `updates` → Atualizações         |
| `/atualizacoes/0-3-5/`                                          | Kinein Vectis 0.3.5                           | `updates` → Atualizações         |
| `/atualizacoes/0-2-0/`                                          | Kinein Vectis 0.2.0                           | `updates` → Atualizações         |
| `/404.html` e qualquer caminho inexistente que receba esse HTML | Não encontramos esta página.                  | Ausente → nenhum grupo           |

### Âncoras de organização

| Página           | IDs reais e rótulos atuais                                                                                                                                                                                                  | Uso no modelo                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `/`              | `#interface` — “Seu código, dentro da Vectis.”; `#estado` — “De pequenos dispositivos a grandes projetos.”; `#desenvolvimento` — “Veja como é criar com a Vectis.”                                                          | Três acessos de Produto; “Demonstrações” distingue o conteúdo de `#desenvolvimento` de um roadmap.                          |
| `/`              | `#foco` — “Um universo de projetos embarcados.”; `#experiencia` — “Comece pequeno. Descubra a Vectis no seu ritmo.”; `#novidades` — bloco de atualizações                                                                   | Continuam acessíveis no conteúdo; não entram na HUD. `#novidades` não muda o grupo da página inicial.                       |
| `/documentacao/` | `#comece` — Comece por aqui; `#guias` — Aprender na Vectis; `#linguagens` — Escolher a linguagem; `#referencias` — Para aprofundar; `#trilhas` — Depois do básico; `#ajuda` — Comunidade e ajuda; `#site` — Sobre este site | Só `#referencias` entra na HUD; demais acessos permanecem no índice local. Não há rota autônoma de referência de API/CMake. |
| `/colabore/`     | `#tarefas` — tarefas; `#como-ajudar` — formas de participar; `#regras` — orientação resumida; `#colaboradores` — quem contribui                                                                                             | Permanecem na página e no rodapé; Regras da HUD leva à página completa `/colabore/regras/`.                                 |
| Todas            | `#conteudo`                                                                                                                                                                                                                 | Destino do skip link, preservado.                                                                                           |
| `/manual/`       | IDs derivados dos headings da fonte versionada, por exemplo `#3-editor`                                                                                                                                                     | Mantidos pelo renderizador e índice atuais; H2 testa fragmento real sem criar ou renomear headings.                         |

### Fontes externas existentes

Os valores são os de [site.ts](../../src/site.ts). A auditoria confirma sua
origem no código, não a disponibilidade atual de cada serviço externo.

| Chave                                        | URL atual                                                                                               | Destinação proposta                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `releaseUrl`, por `releaseUrlFor(publicTag)` | `https://github.com/ViktorWalde/KineinVectis/releases/tag/v0.3.5`                                       | CTA único da HUD.                                                        |
| `repositoryUrl`                              | `https://github.com/ViktorWalde/KineinVectis`                                                           | Comunidade: Código da IDE.                                               |
| `siteRepositoryUrl`                          | `https://github.com/ViktorWalde/KineinSite`                                                             | Comunidade: Código do site.                                              |
| `discordUrl`                                 | `https://discord.gg/cWRkUGUmQU`                                                                         | Comunidade: Discord.                                                     |
| `changelogUrl`                               | `https://github.com/ViktorWalde/KineinVectis/blob/main/CHANGELOG.md`                                    | Continua nos consumidores atuais; Atualizações prioriza as notas locais. |
| `ideContributionUrl`                         | `https://github.com/ViktorWalde/KineinVectis/blob/main/CONTRIBUTING.md`                                 | Continua no fluxo de contribuição.                                       |
| `ideRoadmapUrl`                              | `https://github.com/ViktorWalde/KineinVectis/blob/main/DocsPublic/roadmaps/40-estado-e-continuidade.md` | Continua no fluxo de planejamento/contribuição.                          |

## Catálogo proposto

Ordem fixa dos grupos: **Produto → Documentação → Comunidade → Atualizações**.
Cada título abre um disclosure e não acumula a função de link. O primeiro
item leva à página de entrada. Download fica fora dos grupos e sempre
visível na barra, associado ao produto pelo seu significado.

Esta tabela é o catálogo normativo do H1. As chaves `hud.*` são propostas
para o catálogo tipado existente; **ainda não existem em `ui.ts`**. Rótulos
atuais reutilizados mantêm suas chaves. IDs são estáveis e independem do texto.

| Grupo          | ID                    | Rótulo `pt-BR` / chave de mensagem              | Tipo e destino sem base                          | Fonte para H2                                               |
| -------------- | --------------------- | ----------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| Produto        | `product-overview`    | Visão geral / `hud.overview`                    | Interno: `/`                                     | `resolveRoute("home")`                                      |
| Produto        | `product-interface`   | Interface / `hud.interface`                     | Interno com âncora: `/#interface`                | Rota `home` + fragmento verificado                          |
| Produto        | `product-status`      | Beta disponível / `hud.availableBeta`           | Interno com âncora: `/#estado`                   | Rota `home` + fragmento verificado                          |
| Produto        | `product-demos`       | Demonstrações / `hud.demos`                     | Interno com âncora: `/#desenvolvimento`          | Rota `home` + fragmento verificado                          |
| Documentação   | `docs-overview`       | Documentação / `nav.docs`                       | Interno: `/documentacao/`                        | Rota `docs`                                                 |
| Documentação   | `docs-start`          | Começar / `nav.guide`                           | Interno: `/aprender/`                            | Rota `guide`                                                |
| Documentação   | `docs-install`        | Instalar a IDE / `hud.install`                  | Interno de coleção: `/aprender/ide/instalar/`    | Entrada `aprender:ide/instalar`, somente `verified`         |
| Documentação   | `docs-manual`         | Manual / `nav.manual`                           | Interno: `/manual/`                              | Rota `manual`                                               |
| Documentação   | `docs-references`     | Referências / `hud.references`                  | Interno com âncora: `/documentacao/#referencias` | Rota `docs` + fragmento verificado                          |
| Comunidade     | `community-overview`  | Colabore / `nav.collaborate`                    | Interno: `/colabore/`                            | Rota `collaborate`                                          |
| Comunidade     | `community-rules`     | Regras de contribuição / `hud.rules`            | Interno: `/colabore/regras/`                     | Acrescentar identidade `rules` ao registro existente        |
| Comunidade     | `community-ide-code`  | Código da IDE / `footer.ideCode`                | Externo: `repositoryUrl`                         | `site.ts`                                                   |
| Comunidade     | `community-site-code` | Código do site / `footer.siteCode`              | Externo: `siteRepositoryUrl`                     | `site.ts`                                                   |
| Comunidade     | `community-discord`   | Discord / `hud.discord`                         | Externo: `discordUrl`                            | `site.ts`; nome próprio igual nos catálogos                 |
| Atualizações   | `updates-overview`    | Histórico de versões / `hud.versionHistory`     | Interno: `/atualizacoes/`                        | Rota `updates`                                              |
| Atualizações   | `updates-public-note` | Notas da {version} / `hud.versionNotes`         | Interno de coleção: `/atualizacoes/0-3-5/` hoje  | Entrada cuja `data.tag === publicTag`; versão vem dos dados |
| Ação principal | `download`            | Baixar {version} / `download` + `publicVersion` | Externo, CTA: `releaseUrl`                       | `site.ts`; mantém nova aba e `rel="noopener noreferrer"`    |

São 16 links nos grupos e um CTA. Marca continua levando a `/`; aparência é
controle, sem destino navegável. As chaves dos títulos serão
`hud.groups.product`, `.docs`, `.community`, `.updates` no mesmo `ui.ts`.
Novos nomes/estados acessíveis também entram nesse catálogo com paridade
tipada. H2 não publica conteúdo inglês, seletor ou rótulos fora do i18n.

### Forma dos dados e responsabilidades

H2 poderá adicionar `src/data/navigation.ts` como fonte única da HUD. Essa
localização é uma proposta de implementação, não um arquivo entregue por H1.
O registro conterá `id`, `group`, `labelKey` e um destino discriminado:

- `route`: `RouteId` existente e fragmento opcional; resolver por
  `resolveRoute`, com idioma e base reais.
- `entry`: coleção/ID real e fragmento opcional; resolver a partir das
  entradas publicadas e aplicar `sitePath`/`pathWithBase`. Não adicionar
  capítulos inteiros ao registro estático nem criar equivalências inglesas.
- `external`: chave exportada de `site.ts`; nunca manter outra cópia da URL.
- CTA: referência externa com apresentação `primary` e versão de `site.ts`;
  não é um botão de submit, um novo endpoint ou um item duplicado em Produto.

A nota pública é encontrada por tag na coleção, sem assumir que o primeiro
resultado de `getLatestUpdate()` corresponde ao download. Se não houver nota
da tag configurada, omitir esse atalho e manter Histórico; nunca gerar link
quebrado. Ausência de instalação publicada ou de uma rota obrigatória é falha
de validação de H2, sem substituição silenciosa por outro destino.

O catálogo define ordem e identidade; o adaptador de build resolve URLs e
mensagens; o componente compartilhado gera HTML; CSS escolhe a apresentação;
o script coordena disclosures. O rodapé e os índices contextuais preservam
seus consumidores atuais. E poderá avaliar seu alinhamento, sem ampliar H2
para uma migração de todas as listas de links do site.

Pontos concretos de integração para H2: `navigation.ts` hoje fecha em qualquer
clique de link e precisará respeitar acionamentos modificados; `theme.ts`
precisará ceder somente a coordenação do painel. No CSS, a regra
`.mobile-navigation[open] svg` alcançaria também as setas de grupos aninhados,
e o `order: 3` atual conflita com a sequência intermediária proposta. Ajustar
esses escopos e os estilos de `aria-current` na implementação, preservando
as verificações dos consumidores e sem atribuir esses riscos ao código atual.

### Estado ativo e tradução ausente

1. **Grupo atual:** mapear `home → product`, `guide/manual/docs → docs`,
   `collaborate → community`, `updates → updates`. Reutilizar o contexto do
   layout; ausência de `current` na 404 produz nenhum grupo. Não classificar
   uma URL desconhecida pelo seu prefixo, como `/documentacao/inexistente/`.
2. **Página exata:** comparar o pathname da página reconhecida ao pathname
   resolvido de cada link sem fragmento, usando as mesmas convenções de base
   e barra final do build. Ignorar query/hash nessa comparação. Só o destino
   exato recebe `aria-current="page"` na navegação exposta. `/aprender/ide/git/`
   não marca `/aprender/` como página atual. Não usar `startsWith` nem remover
   a base de caminhos parecidos, como `/KineinSiteExtra/`.
3. **Localização:** links com fragmento recebem `aria-current="location"`
   apenas quando página e hash coincidem e o ID existe. Atualizar no primeiro
   carregamento e em `hashchange`, inclusive voltar/avançar. Em
   `/#interface`, Visão geral é a página atual e Interface é a localização.
   Scroll sem mudança de hash não cria outro observador de seção na HUD.
4. **Expansão:** `open` nativo é independente do contexto e de `aria-current`.
   O grupo atual não abre sozinho. Indicar grupo atual por forma/peso e texto
   acessível “seção atual”; não atribuir `aria-current="page"` ao summary.
   Estado de página/localização também precisa de sinal além da cor.
5. **Fallback:** usar `resolveRoute().locale/isFallback` e equivalências reais.
   Para entradas sem tradução, resolver o conteúdo português publicado com
   a mesma informação explícita de fallback. Se futuramente solicitado outro
   idioma, identificar no link “em português” na língua da UI e informar
   `hreflang="pt-BR"`; não fabricar `/en/...` ou apresentar equivalência
   inexistente. `lang` da página segue o conteúdo, não só a UI. Hoje a HUD
   publicada continua portuguesa, sem seletor.

Na ausência de JS, a marcação de página e grupo vem do build. O hash não chega
ao SSG: o estado de localização pode ficar ausente, mas a âncora deve navegar
nativamente. O índice local continua responsável pela seção em leitura.

## Composição responsiva

**Decisão H1-D01: duas instâncias da mesma composição, com catálogo único.**
Desktop e mobile recebem os mesmos grupos/links na mesma ordem. Somente uma
instância é exposta por vez, usando `display: none` na outra; nenhum controle
oculto participa da árvore de acessibilidade ou do Tab. IDs e relações
acessíveis usam prefixos distintos (`desktop`/`mobile`) e o ID estável do item.

Cada instância tem um `nav` nomeado e quatro disclosures `details/summary`,
com listas de links convencionais. O móvel fica dentro do disclosure
“Explorar o site”. Uma única instância de `ThemeControls` e do CTA permanece
fora desse contêiner. Isso preserva o acesso ao download quando o menu fecha
e evita rádios, preferências ou handlers de tema duplicados.

| Faixa inicial para H2                                         | Composição proposta                                                                                                | Comportamento e razão                                                                                                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop, acima de `75rem` (amostra: 1366/1920px)              | Marca, quatro grupos, aparência e download; procurar uma linha com texto a 100%.                                   | Grupos abrem painéis ancorados ao controle. Conteúdo cabe na janela, sem mega menu ou abertura por hover obrigatório.                                                                             |
| Intermediária, acima de `54rem` até `75rem` (amostra: 1024px) | Marca e quatro grupos na primeira linha; ferramentas na segunda, seguindo a ordem do DOM; mesma instância desktop. | Preserva nomes e alvos, com quebra do bloco de ferramentas inteiro. Se os grupos não couberem com leitura/foco claros, antecipar o modo móvel para essa faixa antes de reduzir texto.             |
| Mobile, até `54rem` (amostras: 320/375/768px)                 | Marca, ferramentas e summary móvel; grupos em coluna dentro do painel em fluxo.                                    | Ordem de foco exposta: marca → aparência → download → Explorar → grupos/links abertos → conteúdo. Pode quebrar em linhas para manter rótulos e alvos. Header permanece fora do sticky, como hoje. |

As faixas são parâmetros iniciais reaproveitados, não medidas aprovadas da
nova HUD. Em H2, testar limites ±1px, altura baixa/paisagem, seis larguras,
texto 200% e zoom real. Se 1024px ou texto ampliado não comportarem a composição,
preferir antecipar a faixa móvel por CSS e sincronizar a mesma media query
no script; não mover nós por JS ou esconder destinos para obter uma linha.

A navegação intermediária usa duas linhas, com sequência visual igual à do
DOM; a regra atual de `order: 3` na navegação deverá ser adaptada em H2. No desktop,
o DOM é marca → navegação desktop → ferramentas → disclosure móvel oculto;
no mobile a navegação desktop desaparece, preservando a ordem natural acima.
Somente os links de grupos abertos entram no Tab, no ponto de seu summary.

Alvos pretendidos de pelo menos 44px, foco visível, texto legível e ausência
de scroll horizontal têm prioridade sobre uma barra de 64px. Painéis com
altura limitada devem permitir rolagem vertical e acesso ao último link.
Sticky e offsets de conteúdo/índices só mudam após conferir âncoras com os
consumidores reais. Preferir painéis opacos nos tokens atuais; transparência
é opcional e não justifica outro tema, animação de blur ou listener de scroll.

### Alternativas avaliadas

| Alternativa                                                                  | Decisão e justificativa                                                                                                                                                                             |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Um único `nav` dentro de `details` móvel, forçado visível no desktop por CSS | Descartada: esconder o summary enquanto `open` está falso exige contornar a semântica nativa; sincronizar só por JS enfraquece o fallback.                                                          |
| Um único `nav` com botão móvel progressivo e lista expandida sem JS          | Viável, descartada para H2: requer outro contrato de ocultação/inicialização e deixa a lista longa expandida no fallback. A composição nativa compartilhada já existe e reduz a mudança necessária. |
| Duas listas mantidas à mão                                                   | Descartada: divergência de destinos, mensagens e estados. As duas instâncias escolhidas derivam do mesmo catálogo/componente.                                                                       |
| Duplicar aparência ou mover ferramentas via JS                               | Descartada: conflito entre rádios e donos de estado; desnecessária para manter o CTA disponível.                                                                                                    |
| Mega menu, abertura só por hover, `role="menu"`/setas de aplicativo          | Descartada: maior custo de teclado e toque para poucos links. Usar navegação, listas, summaries e Tab nativos.                                                                                      |
| Reduzir texto, criar carrossel de links ou fixar 64px em todas as telas      | Descartada: prejudica leitura e descoberta para atender uma preferência geométrica.                                                                                                                 |

## Contratos de interação para H2

Nomes: `G` é um grupo da instância exposta, `M` é o disclosure móvel e `A` é
aparência. São painéis não modais: sem focus trap, bloqueio de scroll do
documento ou mudança automática de foco ao primeiro link.

### Abertura e exclusão

| Evento                                          | Efeito obrigatório                                        | Foco                                                              |
| ----------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| Clique/toque, Enter ou Space em summary fechado | Abre o disclosure. Hover sozinho não abre.                | Permanece no summary; Tab entra no primeiro link/opção.           |
| Mesmo acionamento em summary aberto             | Fecha o próprio painel; ao fechar `M`, limpa seus `G`.    | Permanece no controle acionado.                                   |
| Desktop: abrir `G`                              | Fecha outro `G` e `A`.                                    | Summary do novo grupo; nunca voltar ao grupo anterior.            |
| Desktop: abrir `A`                              | Fecha `G` aberto.                                         | Summary de aparência.                                             |
| Mobile: abrir `M`                               | Fecha `A`; começa sem `G` aberto.                         | Summary móvel.                                                    |
| Mobile: abrir `G` dentro de `M`                 | Fecha somente outro `G`; mantém `M`.                      | Summary do novo grupo.                                            |
| Mobile: abrir `A`                               | Fecha os `G` e `M`, que conflitam com aparência.          | Summary de aparência; o foco não pode ficar nos links escondidos. |
| Escolher tema/destaque                          | Aplica e persiste com o sistema atual; mantém `A` aberto. | Rádio escolhido; setas seguem o comportamento nativo.             |

A coordenação deve ter **um dono** em `navigation.ts`, limitado aos painéis
da HUD. Em H2, adaptar os listeners de fechamento hoje presentes em `theme.ts`
para evitar duplo tratamento; preferências, boot e transições continuam nos
módulos existentes. Não fechar `details` dos índices, manual ou conteúdo por
um seletor global. Aberturas rápidas não podem reabrir um peer por um evento
`toggle` atrasado: ler o estado atual e manter a exclusão idempotente.

### Escape em camadas

- Evento já tratado (`defaultPrevented`) não sobe novamente. O dono que
  realmente fechar uma camada chama `preventDefault` e interrompe a
  propagação apropriada; o evento seguinte é uma nova ação do usuário.
- Dentro de um `G` aberto, Escape fecha esse grupo e retorna ao seu summary.
  No mobile, `M` permanece aberto. Um segundo Escape nesse summary, agora com
  `G` fechado, fecha `M` e retorna a “Explorar o site”.
- Dentro de `M` sem grupo aberto, Escape fecha `M`. No próprio summary de
  `M`, Escape fecha `M` e limpa seus filhos, sem passar por um grupo cujo
  conteúdo não possui o foco.
- Em `A`, Escape fecha somente `A` e retorna ao seu summary. Um segundo
  Escape não fecha conteúdo da página ou outra funcionalidade.
- Fora da HUD, não capturar Escape para fechar menus por um listener global.
  Diálogo de imagem, filtro do manual e outros componentes conservam sua
  prioridade e seus contratos.

### Clique fora, seleção e saída de foco

- Clique dentro de `M`, mas fora de seu `G` aberto, fecha o grupo e mantém
  o contêiner. Clique fora de `M` fecha ambos. Fora de `A`/grupo desktop fecha
  esse painel. Clicar em outro summary segue a tabela de exclusão.
- O alvo do clique que recebe foco conserva esse foco. Se o fechamento
  esconder o elemento ainda focado e o alvo externo não for focável, retornar
  ao summary visível da camada fechada, sem cancelar o clique externo.
- Seleção normal de link fecha o grupo; no móvel, fecha também `M`. Links
  para outra página preservam a navegação nativa; não focar o controle da
  página de origem antes de sair. Na página de destino, preservar o fluxo
  nativo, o título, o skip link e as View Transitions existentes.
- Em âncora na mesma página, fechar os painéis antes do salto, focar o alvo
  real com `tabindex="-1"`/`preventScroll` quando necessário e deixar URL e
  rolagem nativas concluírem o salto. Nunca devolver foco ao menu após isso.
  Validar também seleção repetida do mesmo hash.
- Para um link externo em nova aba, fechar o painel de origem e manter foco
  em seu controle visível de retorno (`M` no mobile; summary do grupo no
  desktop), para que voltar à aba não deixe foco oculto. O CTA fica focado
  quando ele próprio é acionado. Descrever abertura em nova aba por mensagem
  acessível no catálogo existente; manter os atributos de segurança.
- Ctrl/Cmd/Shift/Alt+clique e botão do meio preservam a operação nativa,
  mantendo o painel e o foco na origem. Não interceptar URL ou histórico.
- Tab/Shift+Tab seguem o DOM, sem roving tabindex ou atalhos novos. Sair de
  um grupo fecha esse grupo; mover para outro elemento de `M` mantém `M`.
  Sair de `M` ou de `A` fecha o respectivo painel, preservando o próximo foco.
  Perda de foco da janela ou `relatedTarget` nulo não autoriza roubar foco;
  confirmar a saída real antes de fechar.

### Resize e retorno de foco

Ao cruzar a faixa que troca a instância exposta, fechar `G`, `M` e `A` de
forma coordenada. Se o foco for ocultado, mapear pela identidade estável:

| Origem do foco                                           | Destino após trocar composição               |
| -------------------------------------------------------- | -------------------------------------------- |
| Summary/link de grupo desktop → mobile                   | Summary “Explorar o site”, com menu fechado. |
| Link/summary interno móvel → desktop                     | Summary do mesmo grupo desktop, fechado.     |
| Summary externo móvel → desktop                          | Summary do grupo atual; se nenhum, Produto.  |
| Rádio de aparência fechado pelo resize                   | Summary da única aparência.                  |
| Marca, CTA, summary de aparência ou conteúdo fora da HUD | Preservar o foco, pois permanece visível.    |

Na passagem desktop ↔ intermediária, a instância é a mesma: manter os grupos,
desde que foco e painel permaneçam visíveis e sem corte. Ajustar posição por
CSS; não usar resize contínuo para recolocar foco. Se H2 mudar o breakpoint,
CSS e script precisam compartilhar o mesmo limite e os testes de fronteira.

### Funcionamento sem JavaScript

As duas composições já vêm do HTML, e a media query expõe a adequada. Os
grupos e o contêiner móvel abrem por `details/summary`, e todos os links,
CTA e âncoras funcionam. O caso sem JS admite mais de um grupo aberto e
fechamento manual; Escape, foco assistido e exclusão coordenada são melhorias
com JS. Não prometer a mesma coordenação no fallback.

Aparência continua oculta sem sua inicialização real; não mostrar controles
ineficazes. Falha do script de navegação não pode ocultar os destinos. Busca,
atalho de busca e seletor de idioma só entram após C1/F1 funcionais.

## Casos de teste definidos

Estes são **oráculos de H2**, não testes aprovados de uma HUD já implementada.
Reutilizar `scripts/lib/browser.mjs`, as suítes de navegação/experiência e
`check:i18n`; acrescentar casos nessas ferramentas conforme a implementação.

### Rotas, fragmentos e i18n

Executar os casos aplicáveis em base `/` e `/KineinSite/`. Para todos os
destinos do catálogo, conferir href, texto/nome acessível, tipo e existência
do HTML/ID. Verificar também query string, barras da base e links externos.

| Caso   | Entrada                                                                                                     | Resultado esperado na instância exposta                                                                                                                                                                        |
| ------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H1-T01 | `/`, `/documentacao/`, `/aprender/`, `/manual/`, `/colabore/`, `/atualizacoes/`                             | Grupo correto; só o link exato sem fragmento recebe `aria-current="page"`. Painéis inicialmente fechados.                                                                                                      |
| H1-T02 | `/aprender/ide/git/`, `/documentacao/previa-0-4/`, `/documentacao/site/`, cada `/estudos/.../` inventariado | Documentação atual; nenhum link de página pai recebe `page`. Instalar recebe `page` somente em `/aprender/ide/instalar/`.                                                                                      |
| H1-T03 | `/colabore/regras/`, `/atualizacoes/0-3-5/`, `/atualizacoes/0-2-0/`                                         | Comunidade/Regras exatos; Atualizações/nota pública exatos; nota antiga mantém só grupo, sem marcar Histórico como página.                                                                                     |
| H1-T04 | `/#interface`, `/#estado`, `/#desenvolvimento`, `/documentacao/#referencias`                                | Página de entrada com `page`, link de fragmento com `location`; grupo fechado não abre. Alvo visível e foco correto após seleção local e navegação de outra página.                                            |
| H1-T05 | Hash repetido, `hashchange`, voltar/avançar; `/#novidades`; `/manual/#3-editor`; hash inexistente           | Atualização de `location` só para destino real do catálogo. Home continua Produto; Manual mantém página/grupo. Hash ausente não cria link ativo ou erro. Índices locais preservados.                           |
| H1-T06 | `/404.html` e 404 servido sob `/documentacao/inexistente/` e `/KineinSite/documentacao/inexistente/`        | Nenhum grupo/página/localização atual; links absolutos com base corretos; sem canonical/alternates. Usar fixture que entregue o HTML 404 no caminho pedido, sem inferir classificação pelo prefixo.            |
| H1-T07 | Resolver cada rota/entrada em `en-US`, sem tradução publicada; idioma não suportado; URL com base parecida  | Fallback explícito `pt-BR`, href português real e indicação de idioma quando renderizado em UI estrangeira; nenhuma rota inglesa inventada ou seletor. `uiFor` usa fallback existente; base parecida não casa. |
| H1-T08 | Todos os grupos, CTA e as duas composições                                                                  | Catálogo/ordem/labels iguais; IDs únicos; apenas um nav exposto. Externos sem `aria-current`, atributos seguros e nome de nova aba; download vem de `publicTag`/`publicVersion`.                               |
| H1-T09 | Coleção sem nota de `publicTag`, nota mais recente com outra tag, entrada obrigatória não publicada         | Omitir só o atalho opcional da nota ausente; Histórico permanece. Selecionar nota por tag, não por ordem. Destino obrigatório ausente falha na validação.                                                      |

### Interação, acessibilidade e composição

| Caso   | Procedimento                                                                                                    | Resultado esperado                                                                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H1-T10 | Abrir/fechar cada grupo com mouse, toque, Enter e Space nas duas composições; alternar rapidamente              | Estado nativo, conteúdo correto, foco no summary e exclusão idempotente. Hover não necessário.                                                                         |
| H1-T11 | Abrir G→G, G→A, A→G; no móvel A→M, M/G→A e G→G                                                                  | Exatamente os peers da tabela fecham; abrir grupo móvel conserva M; aparência não duplica rádios.                                                                      |
| H1-T12 | Escape no link/summary de G; repetir; Escape em A, summary M e fora da HUD                                      | Uma camada por evento conforme o dono do foco; retorno correto; índices, filtro e diálogos sem interferência.                                                          |
| H1-T13 | Clique dentro do pai, fora, em outro controle e em área não focável; Tab/Shift+Tab saindo                       | Fechamentos e foco conforme o contrato; sem foco oculto, armadilha ou salto para o controle anterior.                                                                  |
| H1-T14 | Selecionar página, âncora local/remota, CTA/externo, Ctrl/Cmd/Shift+clique e botão do meio                      | Navegação nativa e base preservadas; foco no alvo local ou controle de retorno; operação modificada não fecha a origem.                                                |
| H1-T15 | Cruzar breakpoint nos dois sentidos com foco em link, summary móvel, rádio e conteúdo; repetir com M/G fechados | Fecha camadas na troca de instância e aplica o mapa de foco; nav desktop não depende de M estar aberto. Desktop/intermediário preserva foco.                           |
| H1-T16 | JS desabilitado desde o carregamento, desktop e mobile                                                          | Grupos, menu móvel, âncoras e download alcançáveis; aparência/busca/idioma inoperantes não expostos. Repetir com somente script de navegação indisponível.             |
| H1-T17 | Matriz 320/375/768/1024/1366/1920px, 100%/200% de texto, zoom real, fronteiras ±1px e altura baixa              | Sem scroll lateral ou link inacessível; último item alcançável; alvos/foco legíveis; ordem visual e de leitura compreensível, especialmente na faixa intermediária.    |
| H1-T18 | Claro/escuro/warm, destaques, movimento reduzido, View Transitions, âncoras e índices sticky                    | Preferência mantida ao navegar, contraste/superfície/offsets corretos; nenhum segundo sistema de tema/movimento. Capturas são candidatas para avaliação do mantenedor. |

Complementar a automação com leitura da árvore acessível, leitor de tela e
toque em ambiente disponível. Registrar o que não pôde ser verificado, sem
converter ausência de overflow em aprovação de acessibilidade integral.

## Decisões, pendências e entrada da H2

| Decisão | Resultado e rastreabilidade                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| H1-D01  | Composição compartilhada com duas instâncias nativas; aparência e CTA únicos. H-02/H-03; T08/T10–T17.                                    |
| H1-D02  | Quatro grupos e 16 links definidos, mais CTA externo; preservar destinos anteriores e referências contextuais. H-01/H-04; T01–T09.       |
| H1-D03  | Grupo, página, localização e expansão distintos; contexto da 404 explícito. H-01/F-01; T01–T07.                                          |
| H1-D04  | Um dono de fechamento na HUD, Escape por camada e mapa de retorno/resize; reutilizar tema e HTML nativo. H-02/N-02; T10–T16/T18.         |
| H1-D05  | Transparência opcional; geometria por conteúdo; usar base, catálogo i18n, tokens e harness existentes. H-03–H-05/N-01–N-04; T07/T17/T18. |

Questões pendentes para a implementação e avaliação concreta:

- Medir se o breakpoint inicial e a faixa de duas linhas mantêm ordem visual
  e de teclado clara em 1024px/texto ampliado; antecipar o modo móvel se o
  candidato falhar. Altura, espaçamentos e eventual transparência continuam
  decisões visuais de H2, sujeitas ao mantenedor.
- Conferir posicionamento dos painéis em altura baixa, empilhamento e offsets
  nos índices existentes. Uma medição dinâmica de altura só entra se CSS
  e geometria demonstradamente não bastarem.
- Implementar o catálogo, as mensagens novas com paridade tipada, o adaptador
  de entradas e a coordenação de eventos; os contratos ainda não têm evidência
  de execução. Busca e conteúdo bilíngue mantêm dependências C1/F1.
- Conferência externa de release/assets continua em D. O destino configurado
  é preservado; H1 não afirma que seja a última release remota.

**Entrada da H2:** inventário e catálogo deste H1 disponíveis; decisões e
oráculos ligados a H-01–H-05; código local anterior preservado e checks
pertinentes aprovados; limitações acima explícitas. Não há pendência de
destino que exija inventar uma página para iniciar a implementação local.
H2 deve começar pelos dados/semântica e casos de foco, implementar a HUD em
diff próprio e só então produzir o candidato visual e sua prévia local.

O gate de saída da H2 exige build Pages, suítes de navegador/experiência
adaptadas sem remover cobertura e os casos T01–T18 aplicáveis, além de matriz
e capturas candidatas. Aprovação técnica, avaliação visual e autorização de
publicação continuam estados separados.

## Validação desta entrega

O registro abaixo se refere ao H1 documental e à implementação atual, sem
atribuir aprovação aos comportamentos propostos de H2.

- `npm run build:pages`: aprovado, incluindo `check`, 25 páginas, HTML,
  links e segurança sem erros. Mantidos os três hints do boot de tema em
  `BaseLayout.astro` e os nove avisos informativos de arquitetura já
  registrados na baseline; nenhuma regressão nova identificada.
- Auditoria do HTML gerado: páginas e âncoras do catálogo conferidas;
  `python3 test-results/h1-2026-11-12/audit-h1.py` aprovado: 25 páginas
  inventariadas, 13 destinos internos do catálogo nas duas bases, quatro
  destinos externos ligados às constantes, 43 verificações de IDs e sete
  URLs externas de origem conferidas, sem checagem remota. Confirma também
  18 casos de teste definidos, sem executá-los como funcionalidade de H2.
- `./node_modules/.bin/prettier --check docs/modernizacao/H1-NAVEGACAO.md`
  aprovado. A auditoria conferiu os 36 links locais nos seis documentos
  alterados e a ausência de whitespace no fim das linhas. `git diff --check`
  aprovado; a conferência documental inclui os arquivos ainda não rastreados.
- Comparação com a entrada: somente cinco documentos do planejamento
  modificados e `H1-NAVEGACAO.md` acrescentado; demais arquivos anteriores
  preservados. Os 225 hashes e o fingerprint de execução continuam iguais
  aos da baseline; HEAD inalterado.

Resultados e reprodução local: `build.log`, `format.log`, `whitespace.log`,
`audit.log`/`audit.json`, `audit-h1.py` e `h1-docs.diff` na pasta de evidências.
Esses artefatos são ignorados e não acompanham um clone novo; o inventário,
os comandos e os oráculos permanecem neste documento versionável.

Suítes de navegador, exemplos e uma nova rodada visual não são necessárias
para uma alteração apenas documental com fingerprint de execução preservado.
As evidências da baseline continuam identificadas como históricas; os novos
casos definidos aqui deverão ser executados contra a implementação de H2.
Não foram medidos ganhos de performance ou nova geometria da HUD. Nenhuma
dependência, conteúdo técnico, release, código da IDE ou autorização de
publicação foi alterado.
