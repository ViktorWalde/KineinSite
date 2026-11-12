# A — Apresentação do produto

Implementação local iniciada após o gate técnico da H2, em 12 de novembro de 2026. **Gate técnico aprovado**; aprovação visual pendente.

Problema demonstrado: o hero tinha arte da marca e texto, sem mostrar a IDE.
A galeria antecipada e o beta como padrão já existiam e são preservados. A
solução mínima insere uma captura real no hero e conserva os dois destinos
principais, a galeria completa, demonstrações, instalação e percursos existentes.

A fonte é `src/data/ide-screens.ts`: beta 0.3.5, captura de 2 de outubro de
2026, Linux x86_64 com X11, editor e build CMake. A imagem é a mesma publicada
na galeria, obtida pelo script de captura documentado; não houve alteração da
imagem nem alegação nova sobre a IDE. O build rejeita divergência entre versão
da captura do hero e a versão pública configurada.

`HeroCapture.astro` reutiliza Astro Assets e ImageViewer, com imagem responsiva,
origem/data/versão, link nativo e ampliação por diálogo existente. A captura
recebe prioridade alta; a arte decorativa passa a prioridade baixa. Não há
simulação de interface, novo visualizador, vídeo ou biblioteca de animação.
A ordem do DOM e da apresentação é texto/ações → captura. A composição vira
uma coluna no mobile; a galeria e demais seções continuam na ordem anterior.

Arquivos: `pages/index.astro`, `features/inicio/HeroCapture.astro`,
`features/inicio/hero-product.css`, `scripts/check-product-browser.mjs` e a
inclusão desse caso em `check:experience`. O teste verifica seis larguras,
três temas, texto 100%/200%, proporção, prioridade, origem, teclado, foco,
ampliação e alternativa nativa sem JavaScript. Mídia/galeria/índices anteriores
continuam nas suítes existentes. Não houve mudança de release ou dependência.

Evidências: `test-results/a-2026-11-12/`. As capturas são candidatas locais;
a aparência ainda precisa da avaliação do mantenedor. Não se declara ganho
em LCP/CLS/INP só pela prioridade da imagem. No mobile a captura segue o texto
e as ações, podendo ficar abaixo da primeira janela.

## Validação e encerramento

`npm run build:pages` passou, com 25 páginas e checks de tipos, lint, CSS,
arquitetura, i18n/catálogo, contraste, manual, formatação, HTML, links e segurança.
`check:browser`, `check-content-browser.mjs` e `check-product-browser.mjs`
passaram na árvore final de A. São 36 cenários do hero (seis larguras × três
temas × dois tamanhos de texto), captura decodificada, proporção preservada,
ampliação por Enter, Escape com retorno ao link e acesso ao arquivo sem JS.
As suítes anteriores de galeria, vídeo, manual, cópia, percursos e colaboração
continuam passando. Não se repetiu a matriz H1 completa após A: ela havia
passado no fechamento de H2, e o código da HUD não mudou neste pacote.

Mantidos três hints do boot de tema e oito avisos informativos de arquitetura
já presentes. Nenhum erro final ou dependência instalada. Nenhum exemplo,
conteúdo técnico, versão, manual oficial ou integração da IDE foi alterado.

Prévia: `http://127.0.0.1:4321/KineinSite/`. Logs, relatório e capturas do hero
ficam em `test-results/a-2026-11-12/`; o manifesto final identifica o código.
A rodada foi encerrada a pedido do mantenedor, sem iniciar B. Avaliação visual,
leitor de tela, toque físico e métricas LCP/CLS/INP permanecem pendentes.
