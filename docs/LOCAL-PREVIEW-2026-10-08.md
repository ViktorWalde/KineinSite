# Polimento aprovado após revisão local

Esta etapa sucede a publicação `4fd8c77`. As mudanças foram mantidas locais para avaliação, conforme solicitação do mantenedor. Após aprovar o resultado, ele autorizou o commit e a publicação em 8 de outubro de 2026.

## Apresentação e interação

- Comparativo de vídeos com a prévia 0.4 aberta primeiro e troca para o beta 0.3.5 no mesmo espaço.
- Aviso de desenvolvimento visível antes da demonstração. A 0.4 continua sendo um plano em construção; o download público permanece 0.3.5.
- Galeria única com seletor de versão e abas próprias para editor e ferramentas. Os grupos aninhados preservam o estado de cada versão.
- Indicador deslizante nos seletores, entrada suave dos painéis e resposta comum aos botões. Movimento reduzido desliga as transições e o autoplay.
- Vídeos em loop, sem áudio ou legendas sobrepostas, com pausa, reprodução e tela cheia. Saem da reprodução quando ficam fora da tela; a pausa escolhida pelo visitante é preservada.
- Mídias com proporção preservada e tamanho ligado à largura e altura da tela. Capturas da página inicial e dos tutoriais podem ser ampliadas, ajustadas à tela e fechadas com Escape.
- Imagem, brilho e movimentos do hero preservados. O texto e sua largura foram polidos na curadoria editorial. As ondas continuam atrás de textos e cartões.
- Refinamento da troca de painéis: esmaecimento de saída e entrada com deslocamento curto, indicador sincronizado e limpeza das animações ao alternar rapidamente. O painel anterior perde a interação e o foco assim que a escolha muda.

## Manual

O manual ganhou consultas frequentes, índice de 12 seções com subseções e busca pelos títulos sem depender de acentos. No celular, o índice fica recolhido e acompanha a leitura no topo; escolher um destino o fecha e leva o foco ao título. As sete tabelas têm rolagem horizontal própria, com atalhos legíveis. A origem fica em um detalhe expansível, e o texto recebe uma superfície de leitura com tipografia e separadores mais claros.

O título original foi movido para o cabeçalho, mantendo sua âncora. O Markdown da release não foi editado e continua passando na verificação de SHA-256. Essa organização não representa uma nova revisão dos fatos técnicos do manual nem muda as capacidades documentadas do beta.

Em “2. O layout”, a apresentação substitui o esquema de texto pela captura real do beta 0.3.5 usada no guia “Conhecer a tela”. A imagem mantém a janela completa, a proporção e a data original de 2 de outubro; tem versões WebP responsivas e ampliação. A versão e o estado verificado do guia são conferidos no build antes de usar a captura. `presentation.ts` transforma apenas o HTML: também prepara as sete regiões de rolagem de tabela durante o build, dispensando a montagem dessas regiões por JavaScript. Captura, texto e tabelas ficam disponíveis sem JavaScript.

## Padrão visual e otimização

O [padrão visual aprovado](VISUAL-SYSTEM.md) reúne as escalas e regras de apresentação existentes. Os cartões ganharam degradês discretos com uma cor de apoio ligada ao tema; etapas, resultados, consultas do manual, avisos e grupos de desenvolvimento recebem detalhes de cor. Os extremos dos degradês e os estados de interação entram na verificação de contraste. A superfície de leitura e as fontes de mídia foram preservadas. Esta etapa não acrescenta dependências nem animações contínuas aos componentes.

No build desta etapa, a captura original de 3200 × 2000 px tem 192.130 bytes. A versão WebP completa mantém essas dimensões e tem 78.582 bytes, cerca de 59% menos. As versões de 720, 1200 e 2000 px têm 10.762, 23.506 e 47.376 bytes. `srcset` e `sizes` permitem ao navegador escolher a resolução; o carregamento é tardio, com dimensões explícitas para reservar espaço. Essa medição se refere à captura, não ao peso total de uma visita.

## Percursos e revisão editorial

O projeto C++ segue instalação → `ola-kinein` → média de duas temperaturas → lista de leituras. Rust e Python têm seus próprios projetos e continuam nos estudos da mesma linguagem. Os guias de uso da IDE ficam separados desses percursos. A documentação apresenta preparação, projetos básicos, linguagens, referências e áreas mais avançadas nessa ordem.

As datas e ambientes dos oito tutoriais originais continuam sendo os da reprodução de 2 de outubro; esta etapa não representa uma nova reprodução integral de todas as interfaces. As instruções de continuação usam os comandos já conferidos na 0.3.5.

O código dos estudos e seus exercícios foi executado novamente com `npm run check:examples`. Além disso:

- Os dois estudos de C++ foram compilados e executados no mesmo projeto temporário, usando o `CMakeLists.txt` extraído da tag `v0.3.5`, sem alterações: C++23, `-Werror`, `-Wconversion`, `-Wsign-conversion` e `-Wshadow`.
- O estudo de Rust foi colocado em `src/main.rs` de um projeto criado por Cargo e executado com `cargo run`.
- O estudo de Python foi executado pelo Python de um `.venv`. A asserção de `saudacao` do template original foi conferida separadamente; não foi uma nova execução de pytest.
- Todos produziram `media: 22.00 C`; o estudo de várias leituras produziu `sala: 21.75 C` e `patio: sem leituras`.

## Validação

`npm run build:pages` aprovado com Node.js 24.21.0: 23 páginas, tipos, lint, CSS, arquitetura, manual, contraste, formatação, HTML, links internos e CSP. Os três hints anteriores de `define:vars` permanecem.

O teste de navegador cobre 23 páginas em três larguras, percursos, abas aninhadas, temas, camadas, teclado, redução de movimento e comportamento dos vídeos. O texto ampliado a 200% foi conferido em oito páginas e nas mesmas três larguras, incluindo o limite visível do texto principal. A revisão do manual inclui filtragem com e sem acentos, subseções, resultado vazio, foco após a navegação e rolagem das tabelas. O índice móvel abre sobre o conteúdo, sem mudar o destino durante a rolagem da âncora. Uma conferência adicional no servidor local verificou Escape e a leitura sem JavaScript. O resultado e as capturas ficam em `test-results/browser/`, fora do Git. A revisão visual local complementa esses checks.

A [curadoria de conteúdo e tipografia](CONTENT-REVIEW-2026-10-08.md) registra as fontes, as correções factuais e os limites desta revisão. A página inicial, o manual e o guia de Git também foram conferidos no servidor local em `127.0.0.1:4322`, sem erro de console ou sobreposição de erro do Astro.

Após a inclusão da captura e das cores de apoio, o build e a suíte de navegador passaram novamente. O manual foi conferido no servidor local, nos temas claro e escuro, com ampliação no celular e retorno do foco por Escape. Uma conferência adicional do build, com JavaScript desativado e largura de 320 px, validou as 12 seções, as sete regiões de tabela nomeadas, a imagem responsiva e o link que abre a captura completa de 3200 px, sem overflow da página. O contraste das 12 paletas passou; a menor razão dos pares conferidos é 4,68:1.

## Próxima etapa: mídias

As gravações e capturas existentes não foram refeitas nesta etapa. A falta de cursor e indicação de clique foi apontada pelo mantenedor. Depois do polimento e da revisão local, as demonstrações deverão mostrar os gestos e os pontos de atenção, conferidos contra a ação e o resultado na IDE.
