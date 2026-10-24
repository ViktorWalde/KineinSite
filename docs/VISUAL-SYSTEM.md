# Padrão visual

O estilo aprovado pelo mantenedor em 8 de outubro de 2026 é a referência para os próximos componentes. A implementação central fica em `src/styles/tokens.css`, `base.css`, `components.css` e `interaction.css`; os estilos de cada área só acrescentam o necessário para seu conteúdo.

## Texto e espaço

Use a escala existente em `rem`, que acompanha o tamanho de texto escolhido no navegador. Com a configuração padrão, textos auxiliares variam de 15 a 16 px, o corpo de 16 a 18 px e os rótulos de 12 a 13 px. Reserve rótulos pequenos para versão, estado e categoria; instruções e resultados usam texto auxiliar ou corpo.

Os títulos de páginas internas usam `--text-4xl`, até 52 px; títulos de seção usam `--text-3xl`, até 44 px. O destaque de abertura tem sua escala própria. Preserve a hierarquia dos títulos no HTML e use as classes para o tamanho visual. Títulos equilibrados, parágrafos curtos e uma largura de leitura limitada deixam a informação mais fácil de percorrer. Não reduza a fonte para fazer um cartão caber.

Use os tokens `--space-*` e `--radius-*` para espaçamento e cantos. Grades precisam de colunas que possam encolher, e seus filhos de `min-width: 0`. Em telas estreitas, empilhe conteúdo ou ofereça rolagem explícita para código e tabelas. O texto a 200% deve continuar inteiro e legível.

## Cor e superfícies

`--accent` continua sendo o destaque principal. `--companion` acrescenta uma cor de apoio que varia com o tema e com o destaque escolhido: por exemplo, azul discreto junto do âmbar. Ela aparece em alguns marcadores, setas, resultados e bordas, sem atribuir um significado técnico à cor sozinha.

Cartões usam uma mistura suave entre `--card-tint`, `--card` e `--card-edge`. O estado de interação tem extremos próprios, com menos cor adicionada para preservar o contraste. Use esses tokens em novos componentes; não copie cores hexadecimais para os estilos de uma funcionalidade. `scripts/check-contrast.mjs` confere texto, texto auxiliar, destaques e foco sobre esses fundos nas 12 combinações de tema e cor, incluindo a preferência clara do sistema.

A superfície de leitura de artigos permanece estável. Reserve bordas coloridas, caixas de resultado e pequenos marcadores para orientar o olhar. Textos, ícones e nomes devem explicar a informação mesmo sem distinguir as cores.

No tema claro, use fundos suaves e de brilho contido: papel com âmbar, cinza levemente azulado com azul e cinza levemente esverdeado com verde. As superfícies de leitura ficam um pouco mais claras que a página, sem branco puro. Texto em cinza escuro, bordas discretas e sombras suaves distinguem as camadas. Azul e verde usam destaques menos vivos; o mesmo tratamento vale para a escolha explícita e para a preferência clara do sistema. Preserve contraste e legibilidade ao suavizar as cores, sem reduzir a opacidade dos textos ou filtrar as capturas.

No tema Amber, mantenha a base em tons de carvão, marrom e oliva, mesmo ao escolher azul ou verde-azulado. O destaque dourado usa o âmbar da identidade visual da IDE; os demais permanecem claros o bastante para rótulos e foco. As cores de apoio, bordas e sombras acompanham cada escolha sem formar blocos de uma cor só. O seletor indica a opção ativa com aro e marca de seleção. O valor interno `warm` continua sendo salvo para preservar as preferências existentes.

## Interação e mídia

Use `.button`, `.card` e `.card-interactive` para manter a resposta de foco, mouse e toque. Cartões informativos não ganham comportamento de botão. Os seletores compartilham `src/scripts/tabs.ts`, inclusive teclado e transições. Respeite `prefers-reduced-motion` e não acrescente animações contínuas aos cartões.

Os fluxos vetoriais ficam no fundo, atrás do conteúdo. A imagem de abertura mantém seu tratamento existente. A primeira região de fundo usa um brilho curto na cor de destaque para unir a borda da abertura à cor do tema antes do primeiro texto; esse efeito vale para todas as paletas e não muda a imagem. Capturas da IDE mostram a interface real: não aplique filtros de cor, recortes que ocultem áreas importantes ou desenhos que substituam a interface. Identifique a versão e preserve a proporção. Ofereça ampliação com o visualizador compartilhado e um link para a imagem quando JavaScript estiver desativado.

Imagens do conteúdo usam otimização do Astro, larguras responsivas, dimensões explícitas e carregamento tardio quando ficam abaixo da primeira tela. Compartilhe as mesmas fontes de mídia e os componentes existentes. Evite novas dependências, fontes remotas e scripts para efeitos que o CSS já resolve.

## Revisão

Confira celular e notebook, temas claro e escuro, foco por teclado, texto ampliado e redução de movimento. O build e o teste de navegador complementam a leitura visual. A fidelidade de capturas, afirmações sobre a IDE e instruções continua sujeita à [curadoria de conteúdo](CONTENT-REVIEW-2026-10-08.md).

## Polimento de movimento — 24 de outubro de 2026

A revisão solicitada pelo mantenedor acrescenta transições graduais: cartões cruzam duas superfícies por opacidade, campos recebem borda e halo suaves, abas coordenam saída e entrada e o visualizador de imagens interpola abertura, fechamento e fundo. Detalhes e menu móvel continuam nativos e interpolam a altura onde o navegador permite. Resultados novos do quadro entram com deslocamento curto; uma atualização idêntica mantém o cartão, o foco e os detalhes já abertos.

A escala usa 160 ms para resposta curta, 240 ms para controles, 320 ms para painéis e 480 ms para transições mais amplas. Curvas com desaceleração suave evitam paradas bruscas. Mudanças rápidas cancelam transições anteriores e conservam o estado mais recente. A preferência de movimento reduzido também cancela animações já iniciadas.

O fundo usa poucas linhas que se conectam e seguem adiante, com pequenos trechos de luz em movimento lento. Os sinais ocupam as bordas e os intervalos entre assuntos, em cores próximas da superfície, preservando a prioridade do texto.

O clique produz uma repulsão local: oito pequenas setas apontam para fora do ponto clicado, avançam e desaparecem gradualmente em 640 ms. No teclado, a origem é o centro do controle ativado. O deslocamento fica entre 10 e 48 px, com um único impulso ativo por vez. O hover mantém somente a resposta comum de cor, borda e sombra. Não há setas permanentes dentro dos botões ou no fundo.

O efeito não altera a ação, o foco nem o layout. Respeite movimento reduzido e pause o fundo fora da tela ou com a página oculta. Sem JavaScript, os trajetos são estáticos e não há repulsão. O CSS mantém as cores acompanhando todas as paletas. Os limites de cor do fundo entram na checagem de contraste.

Referências de implementação: [MDN — Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) e [MDN — Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API). O comportamento final é descrito em [ARCHITECTURE.md](ARCHITECTURE.md).
