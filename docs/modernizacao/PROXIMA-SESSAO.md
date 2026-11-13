# Prompt para a próxima sessão

O checkpoint `cb0a6a6` foi a entrada do pacote B, implementado localmente em
13 de novembro de 2026 e aprovado pelo mantenedor, com autorização de commit
local. O estado atual e as evidências estão em B-DOCUMENTACAO.md. Push e
publicação continuam exigindo pedido explícito.
Use o texto abaixo para retomar a execução depois de B.

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
- docs/modernizacao/B-DOCUMENTACAO.md
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
- B implementa índice contextual nos 13 artigos, gerado dos headings reais,
  cópia localizada e foco no código rolável. O marcador compartilhado considera
  o scroll padding da HUD com texto ampliado; índices, breadcrumbs e percursos
  anteriores foram preservados. Conferir o gate e os limites no registro de B.
- B foi aprovado visualmente pelo mantenedor em 13 de novembro de 2026,
  junto da autorização de seu commit local. Não refazer as entregas
  implementadas; eventual polimento deve partir da prévia concreta.
- C0/C1, D, E, F0/F1 e G continuam pendentes.
- Busca global e páginas inglesas ainda não existem. O filtro do manual e o
  catálogo inglês de UI não equivalem a essas funcionalidades.

Comece por C0 — Prova técnica de busca. Confronte os requisitos C-01–C-03 e
o contrato de busca com o HTML real. Pagefind é candidato, não solução adotada.
Registre pacote/versão e justificativa, corpus e exclusões, consultas reais,
URLs/âncoras, bytes do índice/runtime, base, idioma, carregamento e CSP.
Não crie uma fonte editorial paralela nem relaxe a política de segurança.
Preserve os índices, breadcrumbs, percursos e a cópia implementados em B,
bem como o manual oficial íntegro e rastreável por tag/commit/hash.
Registre pendências de polimento fora do pacote.

Trabalhe um pacote por vez. Feche C0 com decisão apoiada em resultados reais
antes de adotar um indexador ou implementar C1. Não exponha controles de
busca, atalhos ou idioma antes de funcionarem de verdade. Depois siga a ordem
e as dependências do plano, com prévia local concreta a cada entrega.

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

As evidências locais estão em test-results/h2-2026-11-12/,
test-results/a-2026-11-12/ e test-results/b-2026-11-13/, ignoradas pelo Git.
Elas podem não existir em um clone novo. B tem manifesto e capturas próprios
nas bases /KineinSite/ e /; não atribua a outra árvore os resultados antigos.
A localização temporária do Chrome também precisa ser conferida.
Reutilize scripts/lib/browser.mjs; não instale outra suíte sem demonstrar
uma lacuna. Reutilize a prévia em http://127.0.0.1:4321/KineinSite/ se estiver
ativa, ou prepare uma nova prévia local do build correspondente.

Prossiga autonomamente nas ações locais autorizadas. Resolva escolhas
rotineiras pelos contratos existentes; só peça esclarecimento se faltar
uma decisão indispensável. Mantenha índice, requisitos e relatório fiéis à
implementação e às verificações efetivas.

Não faça commit, push, deploy ou publicação sem novo pedido explícito.
O commit de checkpoint já autorizado não estende essa permissão a novos
commits, envios ou publicações. O commit local de B foi autorizado
especificamente pelo mantenedor após sua aprovação; não estender essa
autorização aos próximos pacotes.

Ao encerrar, informe o que foi implementado, arquivos, decisões, comandos e
resultados, prévia local, limitações, pendências e próxima unidade. Diferencie
implementação, validação técnica e aprovação visual. A avaliação visual e a
autorização de publicação pertencem ao mantenedor.
```
