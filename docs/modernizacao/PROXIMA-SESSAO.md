# Prompt para a próxima sessão

O checkpoint `cb0a6a6` foi a entrada do pacote B, implementado localmente em
13 de novembro de 2026 e aprovado pelo mantenedor, com autorização de commit
local. O estado atual e as evidências estão em B-DOCUMENTACAO.md. Push e
publicação continuam exigindo pedido explícito.
Depois desse commit de B (`dcf9287`), C0 teve execução local e prova técnica
nas duas bases, conforme C0-BUSCA.md. O mantenedor solicitou seu commit local
e a versão local para análise em 13 de novembro de 2026. Use o texto abaixo
para retomar por C1, preservando os registros e o trabalho local.

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
- docs/modernizacao/C0-BUSCA.md
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
- O gate posterior de C0 corrigiu perda de foco com Clipboard lento usando
  aria-disabled e guarda de repetição; o teste de B foi ampliado. Preservar
  essa correção local posterior ao commit aprovado, sem enfraquecer o teste.
- C0 comprovou Pagefind 1.6.0 com worker servido pela mesma origem, sem mudar
  a CSP, nas bases /KineinSite/ e /. O modo sem worker falha ao compilar WASM;
  não acrescentar permissões para esse fallback. A prova inclui corpus real,
  consultas, URLs/âncoras, bytes, rede do worker, idioma/filtros e falhas.
- O pacote está instalado somente em /tmp para a prova; não há dependência
  Pagefind ou índice no build público. Atributos existem só nas cópias de teste.
- C1, D, E, F0/F1 e G continuam pendentes.
- Busca global e páginas inglesas ainda não existem. O filtro do manual e o
  catálogo inglês de UI não equivalem a essas funcionalidades.

Comece por C1 — Busca global funcional. Confronte C-01–C-03 com a prova C0.
Adote a versão comprovada e os atributos de corpus nos layouts/dados reais,
sem fazer Chrome/DOMParser uma dependência do build publicado. Integre o índice
depois do HTML e antes da validação final. Preserve as exclusões, metadados,
versão/estado da prévia, idioma e origem do manual que a prova conferiu.
Use o worker do próprio site. Sem worker utilizável, apresente erro explícito
e mantenha os links nativos; não relaxe a CSP. Confira Firefox/Safari conforme
o ambiente disponível, sem atribuir a eles a prova feita somente em Chrome.
Implemente interface e estados reais, carregamento sob demanda, vazio, erro,
teclado/foco, retorno ao controle e proteção contra respostas antigas.
Renderize resultados com APIs seguras. Não crie uma fonte editorial paralela.
Preserve índices, breadcrumbs, percursos e cópia de B; registre polimento fora
do pacote. Não exponha seletor de idioma sem páginas equivalentes reais.

Trabalhe um pacote por vez. C0 já tem prova e decisão; preserve seus resultados
na adoção de C1. Não exponha controles de busca ou atalhos antes de funcionarem
de verdade. Depois siga a ordem e as dependências do plano, com prévia concreta.

Reutilize os sistemas existentes de tema, movimento, roteamento, i18n e testes.
Não instale dependências sem necessidade demonstrada. Não altere conteúdo
técnico ou versões sem conferir suas fontes. Não modifique releases ou
código da IDE, não enfraqueça a CSP e não reduza a cobertura dos testes.

Execute as verificações pertinentes; build:pages inclui os checks estáticos.
Preserve check:browser, check:experience e a prova opt-in check:search-proof.
Acrescente casos úteis para C1, sem reduzir a cobertura anterior.
Confira as seis larguras (320, 375, 768, 1024, 1366 e 1920px), texto ampliado,
teclado, foco, temas, âncoras, ausência de JS e consumidores afetados.
Os registros anteriores têm três hints do boot de tema e oito avisos
informativos de arquitetura: confirme o estado atual e separe regressões.
Não repita ou atribua testes antigos a uma árvore diferente sem evidência.

As evidências locais estão em test-results/h2-2026-11-12/,
test-results/a-2026-11-12/, test-results/b-2026-11-13/ e
test-results/c0-2026-11-13/, ignoradas pelo Git.
Elas podem não existir em um clone novo. B tem manifesto e capturas próprios
nas bases /KineinSite/ e /; não atribua a outra árvore os resultados antigos.
A localização temporária do Chrome também precisa ser conferida.
Reutilize scripts/lib/browser.mjs; não instale outra suíte sem demonstrar
uma lacuna. Reutilize a prévia em http://127.0.0.1:4321/KineinSite/ se estiver
ativa, ou prepare uma nova prévia local do build correspondente.
O relatório legível de C0 está em http://127.0.0.1:4322/ quando o servidor
local estiver ativo; ele mostra resultados medidos e não é a UI final de busca.

Prossiga autonomamente nas ações locais autorizadas. Resolva escolhas
rotineiras pelos contratos existentes; só peça esclarecimento se faltar
uma decisão indispensável. Mantenha índice, requisitos e relatório fiéis à
implementação e às verificações efetivas.

Não faça commit, push, deploy ou publicação sem novo pedido explícito.
O commit de checkpoint já autorizado não estende essa permissão a novos
commits, envios ou publicações. O commit local de B foi autorizado
especificamente pelo mantenedor após sua aprovação; não estender essa
autorização aos próximos pacotes.
O commit local de C0 também foi solicitado especificamente pelo mantenedor;
essa autorização não se estende a commits de C1, push ou publicação.

Ao encerrar, informe o que foi implementado, arquivos, decisões, comandos e
resultados, prévia local, limitações, pendências e próxima unidade. Diferencie
implementação, validação técnica e aprovação visual. A avaliação visual e a
autorização de publicação pertencem ao mantenedor.
```
