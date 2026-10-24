# Revisão local — 24 de outubro de 2026

Entrega concluída localmente, com polimento e validação automática completos. O mantenedor autorizou push e deploy após a revisão local e pediu o refinamento comercial descrito abaixo antes do envio. Este registro descreve as alterações e validações que antecedem a publicação; as demais seções preservam o histórico das propostas e verificações anteriores.

## Fechamento da etapa e polimento

A direção final usa fluxos discretos de luz no fundo e oito vetores de repulsão no clique; ondas oceânicas e setas por hover foram propostas anteriores, substituídas. A página inicial apresenta primeiro o beta 0.3.5 para Linux x86_64, mantendo a prévia 0.4 identificada como versão em construção. Colabore, suas regras e a preparação editorial para a futura edição internacional integram esta entrega.

O polimento final corrige a transição nativa entre documentos: a regra `@view-transition` passou do CSS externo para o início do `<head>`, antes da primeira pintura. A página de destino agora participa da transição, sem a rejeição `AbortError: Transition was skipped` reproduzida antes da correção. O teste usa clique de mouse no cabeçalho com movimento habilitado, exige a presença da transição no destino e não filtra erros do navegador. A navegação da repulsão também é conferida sem reduzir movimento.

Os rótulos do seletor de vídeo ficaram mais curtos para evitar quebra no meio de uma palavra em 320 px, sem reduzir a fonte. As setas dos atalhos acompanham a direção do destino. Colunas sem tarefas usam a mensagem de seu estado; a sugestão de limpar filtros aparece quando há filtros ativos. Preferências locais de editores e do gerenciador de arquivos ficam preservadas no disco e ignoradas pelo Git.

Validação final em Node.js 24.22.1 e Chromium 151:

- `npm run build:pages`: aprovado, 25 páginas; tipos, lint, CSS, arquitetura, colaboração, contraste, manual, formatação, HTML, links e CSP. Menor contraste medido: 4,69:1 nas 12 combinações. Permanecem três hints de `define:vars` e avisos de tamanho/coerência já existentes, sem erros.
- `npm run check:browser`: aprovado por completo, incluindo decodificação das duas gravações, início ao aparecer, repetição, pausa persistente, troca de versão e pausa fora da tela. A limitação de vídeo das rodadas anteriores foi superada nesta execução.
- `npm run check:experience`: aprovado por completo, incluindo 25 páginas em 320/768/1440 px com texto a 100% e 200%, navegação sem JavaScript, clique com transição nativa, colaboração, foco, abas, modal, fluxo, repulsão e movimento reduzido.

Capturas e relatórios atuais ficam em `test-results/browser/`, ignorado pelo Git. A revisão técnica das capturas incluiu abertura, colaboração, seletor de vídeo no celular e resposta radial. Os testes de interação são executados em navegador descartável; isso não substitui a aprovação visual final do mantenedor nem declara concluída a validação manual da repulsão em sua sessão de desktop. Publicação e criação de oportunidades no GitHub permanecem etapas separadas.

## Página inicial

### Revisão da apresentação comercial

Após a revisão local, o mantenedor pediu uma abertura mais comercial, com convite a experimentar e colaborar, e esclareceu que a Vectis evolui para se especializar em sistemas embarcados. A chamada passou a ser “Dê vida à sua próxima ideia.”, acompanhada por “Uma IDE open source que evolui para se especializar em sistemas embarcados.” Os botões convidam a experimentar e ver a IDE em ação; o primeiro convite à colaboração também aparece na abertura.

A apresentação inicial usa exemplos acessíveis — dispositivos conectados, automação e robótica. Linguagens, bare metal, Linux embarcado e ROS 2 aparecem nas demonstrações, nos percursos e nas seções mais abaixo. Os cartões ligam cada frente ao material correspondente e preservam a distinção entre o beta disponível, o trabalho da 0.4 e a direção futura de ROS 2.

O polimento final preservou a chamada aprovada e retirou referências ao país de origem da apresentação, dos metadados, do convite à colaboração e do rodapé. Textos de documentação, guias, atualizações e colaboração receberam ajustes pontuais de clareza e coerência. A direção de apoio internacional a partir da 0.5 está alinhada em `INTERNATIONALIZATION.md`; esta revisão permanece em português e não altera os guias técnicos ou o manual da IDE.

A apresentação passou a destacar o uso da IDE: proposta de valor, download gratuito para Linux, demonstração real, espaço de trabalho, início guiado e convite à colaboração. Detalhes de ferramentas, roadmaps e procedimentos completos continuam acessíveis nos guias, manual e documentação.

O beta público permanece 0.3.5 para Linux x86_64; a prévia 0.4 continua identificada como versão em desenvolvimento. As capturas e gravações reais foram preservadas, sem atribuir à versão pública os recursos da prévia. Perguntas frequentes explicam gratuidade, sistema disponível e necessidade das ferramentas da linguagem.

## Colaboração

- `/colabore/`: oportunidades selecionadas da IDE e do site, estados abertas/em andamento/realizadas, busca sem depender de acentos, filtro de projeto e primeira contribuição, descrição e acesso à issue original.
- Somente tarefas complementares e independentes; trilha principal, tarefas bloqueadas e assuntos reservados ao mantenedor ficam fora da vitrine.
- Consulta REST pública a cada cinco minutos, sem depender de CI ou de republicação; cache, paginação, data da leitura e tratamento de falha/limite de API.
- Assinaturas dos perfis com commits reconhecidos pelo GitHub; suporte a agradecimentos editoriais para testes, relatos e revisões com evidência pública.
- `/colabore/regras/`: 11 seções de regras, critérios de entrega, evidências, modelo de PR e checklist. O template de PR e o CONTRIBUTING do site foram alinhados ao guia.

As consultas feitas durante a implementação retornaram apenas PRs no histórico dos repositórios, sem issues de colaboração. O estado vazio é esperado até o mantenedor preparar e sinalizar as oportunidades. As tarefas e pessoas usadas nos testes são respostas simuladas exclusivas do navegador descartável e não entram no site.

Operação e manutenção em [COLLABORATION.md](COLLABORATION.md).

## Verificações

`npm run build:pages` aprovado com Node.js 24.22.1: 25 páginas, tipos, lint, CSS, arquitetura, classificação de colaboração, contraste, manual, formatação, HTML, links internos e CSP. Permanecem três hints anteriores de `define:vars` e avisos de tamanho/coerência dos módulos, sem erros de build.

`scripts/check-collaboration-browser.mjs` aprovado no Chromium 151: paginação, filtros, busca, conteúdo externo como texto, créditos sem bots, reabertura, cache em falha, resposta inválida, limite de API e regras de envio. Inclui três larguras, temas, texto ampliado a 200% e capturas da nova abertura. Nenhuma operação de escrita no GitHub é usada pelos testes.

A suíte geral `npm run check:browser` foi executada e **não está aprovada**: o Chromium 151 excedeu o tempo de resposta em operações de rolagem/reprodução automática de vídeo. Foram conferidas as novas rotas e o texto ampliado antes dessa etapa, mas isso não substitui uma execução completa. O helper agora limita operações a vinte segundos para que uma falha não deixe o teste esperando indefinidamente. Os arquivos de vídeo e o código de reprodução da aplicação não foram alterados nesta entrega.

Capturas e relatórios ficam em `test-results/browser/`, ignorado pelo Git. A revisão visual da abertura incluiu 320 e 1440 px. A prévia serve o build com a base real do GitHub Pages em `http://127.0.0.1:4321/KineinSite/`.

## Rodadas adicionais de polimento

A abertura agora apresenta primeiro o beta disponível; a prévia 0.4 continua explícita como desenvolvimento nas abas. Três atalhos levam a conhecer, começar e colaborar. O menu móvel oferece todos os caminhos em um painel nativo, com fechamento por Escape e retorno do foco. Os convites de colaboração usam linguagem mais próxima, mostram formas de ajudar mesmo sem tarefas disponíveis e preparam rascunhos de proposta no GitHub para revisão e envio pela própria pessoa.

Cartões têm transição gradual de superfície; campos, botões, indicadores de consulta, abas, detalhes e o visualizador de imagens receberam durações coordenadas e desaceleração suave. Atualizações idênticas no quadro preservam os nós, os detalhes abertos e o foco. Resultados novos entram com movimento curto e limitado aos cartões visíveis.

O fundo oceânico deforma a geometria: a onda se forma, a crista avança e se curva, quebra e se desfaz. Espuma e linhas internas acompanham a curva, com nascimento e dissipação graduais. Duas camadas usam fases e períodos diferentes. Há pausa fora da tela e com a página oculta, teto de resolução, respeito a movimento reduzido e fundo estático sem JavaScript. A imagem de abertura foi preservada.

A decisão sobre inglês como idioma principal após o fim da 0.4 está registrada em [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md). Esta revisão continua em português; futuras traduções para português entram como colaboração complementar, sem bloquear a trilha principal.

### Validação final do polimento

`npm run build:pages` e `npm run check:experience` aprovados no build final. A segunda rotina cobre navegação nas 25 páginas em 320/768/1440 px e texto a 100%/200%, alternativa sem JavaScript, consulta e filtragem de colaboração, controles nas nove escolhas explícitas de tema/destaque, transições, foco, troca rápida de abas e modal. O teste oceânico confere as quatro fases, congelamento com movimento reduzido, pausa fora da tela, retomada, mudança de tema e limite de pixels em 320/768/1440/2560 px com densidade 2. Todos esses relatórios terminaram sem erros de navegador.

Uma tentativa integrada excedeu o tempo de resposta do Chromium durante navegação. Após encerrar um processo antigo e travado da suíte geral, a execução completa acima passou. A limitação anterior da suíte geral de vídeo continua registrada; `check:experience` não substitui sua cobertura de reprodução.

Capturas das quatro fases: `test-results/browser/onda-{forming,crest,breaking,wash}-1440.png`. Relatórios: `navigation-report.json`, `colabore-report.json`, `motion-report.json` e `ocean-report.json`, na mesma pasta. A checagem de contraste inclui agora a espuma e continua aprovada nas 12 combinações, com menor razão de 4,63:1. Nenhuma publicação foi executada.

### Correção de visibilidade das ondas

A revisão seguinte corrige a quebra tardia: a crista desacelera no centro, a curvatura e a espuma começam antes e o avanço retoma com a onda baixa. A trajetória das partículas é proporcional à largura, preservando margem até em 320 px. O impacto ganhou acúmulo de espuma, respingos maiores e faixas que se dissipam por mais tempo. A paleta distingue temas claros e escuros; o contraste segue aprovado nas 12 combinações, com mínimo de 4,58:1.

Na primeira região, a altura da onda e sua origem acompanham o fim dos cartões, deixando a crista e o impacto no intervalo antes do próximo conteúdo, tanto com três colunas quanto com cartões empilhados. O ajuste não acrescenta espaço à página nem altera a imagem de abertura.

Os testes de geometria agora verificam também que a curvatura e a espuma permanecem dentro da tela durante a quebra. O teste de navegador observa os respingos efetivamente desenhados e exige um conjunto visível fora dos cartões em 320/768/1440 px, além das verificações anteriores de pausa, redução de movimento, tema e teto de pixels. Capturas adicionais: `onda-espuma-320.png` e `onda-espuma-768.png`, em `test-results/browser/`.

Validação desta correção: `npm run build:pages` e `node scripts/check-ocean-browser.mjs` aprovados no build atualizado. As capturas de 320, 768 e 1440 px foram revisadas para conferir a crista e o acúmulo de espuma fora dos cartões. A prévia local foi atualizada; nenhum deploy foi feito.

## Direção aprovada: fluxo ambiente e interação

Depois da comparação de propostas, o mantenedor pediu o desenvolvimento do fundo discreto com resposta vetorial aos cliques. Essa direção substitui as ondas descritas nas rodadas anteriores deste registro.

- `FlowField.astro` entrega trajetos que se conectam e seguem adiante, com cores próximas da superfície e trechos de luz em movimento linear, em ciclos de 34/39/43 segundos.
- O fundo usa SVG e animações nativas de CSS. Não há canvas, partículas nem laço JavaScript de desenho. Tema e destaque atualizam pela cascata de estilos.
- Na abertura, os trajetos ficam no espaço existente depois dos atalhos. As demais faixas ocupam os intervalos entre assuntos; as páginas internas têm duas faixas discretas ao fundo. A imagem e o texto da abertura permanecem preservados.
- Os traços de resposta duram 640 ms, acompanham o contorno do controle e desaparecem. Botões, cartões que são links e seletores de abas usam o mesmo clique nativo, inclusive por teclado. Cliques rápidos substituem o efeito anterior.
- Há pausa fora da tela, pausa com a página oculta, respeito à redução de movimento e desenho estático sem JavaScript. Os efeitos de resposta são removidos ao terminar, ao sair da página e ao ativar redução de movimento.

O teste específico passou com três larguras, texto a 200%, nove paletas explícitas, navegação por âncora durante o efeito, teclado, foco, limpeza de cliques rápidos, pausa e retomada. A checagem de contraste cobre as 12 combinações incluindo a preferência clara do sistema; o menor contraste medido é 4,55:1. Capturas: `fluxo-inicio-{320,768,1440}.png`, `fluxo-inicio-claro-1440.png` e `fluxo-resposta-botao-1440.png`; relatório `flow-report.json`, em `test-results/browser/`.

### Limite da transição entre páginas no Chromium

Durante a nova checagem de navegação, o Chromium 151 registrou `AbortError: Transition was skipped` ao usar a transição nativa entre documentos. O caso também foi reproduzido por clique real em um link comum do cabeçalho, sem o novo efeito. A página de destino abriu normalmente. O teste do novo fluxo cobre a navegação entre documentos com movimento reduzido e a navegação por âncora com a resposta vetorial habilitada; não declara aprovada a transição nativa entre documentos sem redução de movimento. A limitação anterior dos testes de vídeo também permanece registrada acima.

A prévia continua exclusivamente local; nenhum deploy, push, release ou publicação foi executado.

Validação final desta direção: `npm run build:pages` e `npm run check:experience` aprovados no build atualizado. A rotina integrada terminou sem erros nos quatro relatórios: navegação, colaboração, componentes e fluxo. A navegação entre documentos com a transição nativa sem redução de movimento permanece fora dessa aprovação, conforme o limite descrito acima. A prévia em `http://127.0.0.1:4321/KineinSite/` foi conferida com oito campos vetoriais na página inicial e as rotas de colaboração disponíveis. Nenhuma publicação foi feita.

## Vetores geométricos e validação com entrada do sistema

A revisão presencial pela sessão do mantenedor confirmou que os traços anteriores estavam ativos, porém tênues demais e sem comunicar a ideia geométrica de vetor. O mantenedor escolheu pequenas setas orientadas, sem fórmulas no conteúdo, e pediu também a representação nos componentes interativos.

O fundo agora usa setas com haste e ponta, tamanho de 24 px, rotação tangente à trajetória e velocidade constante. A geometria se adapta à largura sem encolher as setas no celular. Cada ciclo esmaece nas extremidades; pausa e retomada continuam sob os observadores de visibilidade e a preferência de movimento reduzido. Não há laço JavaScript por quadro.

Nos controles interativos, a seta aparece dentro da área inferior do botão ou cartão por 480 ms ao passar o mouse e no foco visível. O clique acrescenta a resposta de contorno por 640 ms. Não há desenho sobre textos ou controles vizinhos. Toque e teclado mantêm a ativação nativa.

A verificação manual usou uma janela separada da prévia local na área de trabalho, com permissão “Control input devices” aprovada pelo mantenedor no KDE. Foi usado mouse/teclado do sistema: rolagem, clique na aba da prévia, seta do teclado para a aba do beta e Enter. A seleção, o foco e a presença da resposta animada foram conferidos nessa janela real. Os arquivos de evidência dessa sessão ficam na pasta local ignorada `.codex/real-preview/`.

## Correção de conceito: vetores de repulsão no clique

O mantenedor esclareceu que desejava vetores saindo do clique para fora, como repulsão. Essa revisão substitui as setas internas e o efeito por hover descritos na rodada anterior. O fundo volta a mostrar apenas o fluxo discreto de luz.

Cada clique gera oito setas em direções separadas por 45 graus, originadas no ponto da interação. Elas avançam radialmente de 10 até 48 px, com entrada e saída graduais ao longo de 640 ms. Ativação pelo teclado usa o centro do controle. Uma camada decorativa sem entrada mantém o foco, o tamanho do controle e a ação nativa. Outro clique substitui o impulso anterior; movimento reduzido suprime o efeito. Não há repulsão no hover.

O teste específico confere a origem real do clique, a direção das oito setas por matriz de transformação e o aumento de distância entre quadros. Também verifica teclado, controles desabilitados, limpeza, paletas, responsividade e redução de movimento. Captura de referência: `test-results/browser/repulsao-clique-1440.png`.

Validação da repulsão: `npm run build:pages`, `npm run check:experience`, lint e formatação aprovados. A checagem integrada terminou sem erros de navegador nos quatro relatórios. A direção radial e o aumento de distância foram conferidos pelas matrizes dos oito grupos SVG, e a captura está em `repulsao-clique-1440.png`.

A última tentativa de repetir o clique na sessão real foi interrompida pela mudança de foco para o VS Code; ela não foi considerada uma validação manual bem-sucedida da repulsão. A prévia permaneceu atualizada para conferência do mantenedor. Nenhum deploy foi realizado.
