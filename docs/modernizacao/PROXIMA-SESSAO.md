# Prompt para a próxima sessão

O checkpoint consolida o estado local já validado. O commit desta rodada não
representa aprovação visual, autorização de push ou publicação do site.
Use o texto abaixo para retomar a execução.

```text
Continue o trabalho em /home/hugh/WebstormProjects/KineinSite.

Leia primeiro:
- AGENTS.md
- docs/modernizacao/README.md
- docs/modernizacao/BASELINE.md
- docs/modernizacao/ARQUITETURA.md
- docs/modernizacao/H1-NAVEGACAO.md
- docs/modernizacao/H2-HUD.md
- docs/modernizacao/A-PRODUTO.md
- docs/modernizacao/REQUISITOS-E-ACEITE.md
- docs/modernizacao/VALIDACAO.md
- docs/modernizacao/RELATORIO-ENGENHARIA.md

Confirme HEAD, branch e estado real da árvore; preserve quaisquer alterações
locais posteriores ao checkpoint. Não descarte arquivos ou refaça entregas
concluídas. O pedido atual é implementação funcional incremental, não outra
rodada geral de planejamento, mesmo que registros históricos descrevam a
etapa anterior como engenharia documental.

Estado de entrada:
- H1 foi uma entrega documental.
- H2 está implementada e tecnicamente validada: catálogo único de 16 links em
  quatro grupos, duas composições nativas com uma exposta por faixa, aparência
  e download únicos, estados distintos, foco, Escape, resize e fallback sem JS.
- A está implementada e tecnicamente validada: hero com captura real do beta,
  origem identificada, Astro Assets e visualizador existente. Galeria, vídeos
  e percursos anteriores foram preservados.
- H2 e A ainda precisam de avaliação e polimento visual pelo mantenedor.
  O checkpoint e os testes não constituem aprovação visual.
- Os índices móveis de documentação/manual, o helper de outline e as melhorias
  anteriores da página inicial já existem. Não os implemente novamente.
- B não foi iniciado como pacote; C0/C1, D, E, F0/F1 e G continuam pendentes.
- Busca global e páginas inglesas ainda não existem. O filtro do manual e o
  catálogo inglês de UI não equivalem a essas funcionalidades.

Comece pelo pacote B — Documentação. Confronte os requisitos B-01–B-04 com
os componentes reais e implemente as lacunas demonstradas, especialmente o
índice contextual dos artigos e a cobertura de i18n da cópia de código.
Preserve os breadcrumbs, percursos editoriais, anteriores/próximos e índices
já funcionais. Gere âncoras de headings reais; reutilize os helpers existentes.
Mantenha o manual oficial íntegro e rastreável por tag/commit/hash.
Não acrescente outro índice ou filtro mantido à mão, nem refatore por estética
sem um benefício concreto. Registre pendências de polimento fora do pacote.

Trabalhe um pacote por vez. Feche B tecnicamente e entregue prévia local.
Depois avance na ordem e nas dependências do plano. C0 deve produzir prova
com o HTML real, consultas, tamanho, base, idioma e CSP antes da adoção de
um indexador ou da implementação de C1. Não exponha controles de busca,
atalhos ou idioma antes de funcionarem de verdade.

Reutilize os sistemas existentes de tema, movimento, roteamento, i18n e testes.
Não instale dependências sem necessidade demonstrada. Não altere conteúdo
técnico ou versões sem conferir suas fontes. Não modifique releases ou
código da IDE, não enfraqueça a CSP e não reduza a cobertura dos testes.

Execute as verificações pertinentes; build:pages inclui os checks estáticos.
Preserve check:browser e check:experience e acrescente casos úteis para B.
Confira as seis larguras (320, 375, 768, 1024, 1366 e 1920px), texto ampliado,
teclado, foco, temas, âncoras, ausência de JS e consumidores afetados.
Os registros anteriores têm três hints do boot de tema e oito avisos
informativos de arquitetura: confirme o estado atual e separe regressões.
Não repita ou atribua testes antigos a uma árvore diferente sem evidência.

As evidências locais anteriores estão em test-results/h2-2026-11-12/ e
test-results/a-2026-11-12/, ignoradas pelo Git. Elas podem não existir em um
clone novo. A localização temporária do Chrome também precisa ser conferida.
Reutilize scripts/lib/browser.mjs; não instale outra suíte sem demonstrar
uma lacuna. Reutilize a prévia em http://127.0.0.1:4321/KineinSite/ se estiver
ativa, ou prepare uma nova prévia local do build correspondente.

Prossiga autonomamente nas ações locais autorizadas. Resolva escolhas
rotineiras pelos contratos existentes; só peça esclarecimento se faltar
uma decisão indispensável. Mantenha índice, requisitos e relatório fiéis à
implementação e às verificações efetivas.

Não faça commit, push, deploy ou publicação nesta próxima rodada sem novo
pedido explícito. O commit de checkpoint já autorizado não estende essa
permissão a novos envios ou publicações.

Ao encerrar, informe o que foi implementado, arquivos, decisões, comandos e
resultados, prévia local, limitações, pendências e próxima unidade. Diferencie
implementação, validação técnica e aprovação visual. A avaliação visual e a
autorização de publicação pertencem ao mantenedor.
```
