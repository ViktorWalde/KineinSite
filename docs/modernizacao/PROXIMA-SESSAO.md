# Prompt para a próxima sessão

H2/A entraram em `cb0a6a6`; B foi aprovado e registrado em `dcf9287`; C0 está
em `ef1cba8`; C1 foi implementado e publicado em `50c5641`. O manifesto público
confirmou `50c5641c59dbc306866ab817f630844a55c67fe8` durante D. Depois do gate local, o mantenedor aprovou D/polimento e autorizou a publicação.
Antes do envio pediu mover/reformular o download em Instalar a IDE e aprovou
explicitamente a nova composição. D-DOWNLOAD.md distingue os candidatos e
suas evidências. O commit efetivamente servido deve ser conferido no manifesto
público, sem presumir que ainda seja 50c5641.

```text
Continue em /home/hugh/WebstormProjects/KineinSite.

Leia AGENTS.md e os registros vigentes:
- docs/modernizacao/README.md
- BASELINE.md, ARQUITETURA.md, H1-NAVEGACAO.md, H2-HUD.md, A-PRODUTO.md
- B-DOCUMENTACAO.md, C0-BUSCA.md, C1-BUSCA.md e D-DOWNLOAD.md
- REQUISITOS-E-ACEITE.md, VALIDACAO.md e RELATORIO-ENGENHARIA.md
(todos em docs/modernizacao/).

Confira HEAD, branch e árvore real. Use 50c5641 como referência de entrada de D; identifique o commit atual e
preserve quaisquer alterações locais posteriores. Não use
reset/checkout para limpar a árvore, refaça entregas ou substitua execução
por outra rodada geral de planejamento. Confira o manifesto público antes
de atribuir ao site o estado da prévia local.

Estado preservado:
- H1 foi documental; H2 implementa catálogo único de 16 links, composições,
  aparência/download, foco/teclado/resize e fallback sem JS.
- A tem hero com captura real, origem e Astro Assets; vídeos/galeria/percurso
  preservados. H2/A mantêm avaliação e polimento visual separados do gate.
- B tem índice contextual em 13 artigos, cópia localizada, foco e seção atual
  com texto ampliado. Mantém a aprovação visual concedida pelo mantenedor.
  Clipboard lento usa aria-disabled com guarda de repetição; preservar o teste.
- C0 comprovou Pagefind 1.6.0 com worker de mesma origem, nas duas bases.
  C1 adota a versão no lockfile e no build nativo após HTML, antes dos checks.
  Não reintroduzir Chrome/DOMParser no build nem permitir eval/blob para WASM.
- Busca funcional: carregamento sob demanda, estados/retry, erro sem worker,
  resultados seguros, links/âncoras reais, normalização da base, foco e
  proteção contra respostas antigas e fechamento/reabertura rápida.
- D confere release v0.3.5 e assets reais: Linux x86_64, glibc 2.36+, Wayland/X11.
  src/data/download.ts é snapshot de arquivos/tamanhos/digests. A versão pública
  continua em site.ts; o painel recusa snapshot/guia/nota incompatíveis.
  check:download-release confere a API opt-in, sem rede obrigatória no build.
- O painel foi reformulado para o início de Instalar a IDE, acessível por
  Documentação e pelos CTAs do beta. A home tem acesso ao guia, sem duplicar
  o painel. Conferir o download salta para o heading real da verificação. Há ZIP
  completo, requisitos, instalação/notas e AppImage avulso com seu checksum.
  Não há rota nova, guia duplicado, plataformas fictícias ou JS adicional.
  Os CTAs do beta na HUD, hero, galeria, documentação e rodapé agora apontam
  à âncora do painel no guia, por pedido explícito. Links oficiais dos assets
  e da release ficam no painel; notas históricas mantêm seus próprios downloads.
- Durante D o mantenedor pediu polimento da busca. O CSS agora separa ajuda e
  campo, compacta resultados, limita visualmente trechos a três linhas,
  destaca foco e estados e mantém alvos. Motor/controlador/renderer intactos.
- O gate reproduziu em C1 um favicon implícito de documento de imagem sem JS.
  A fixture HTTP responde 204 somente a esse pedido com referer de imagem
  da própria origem/base. Ícones de páginas e assets ausentes continuam 404.
  A também aguarda a decodificação da imagem nativa; não enfraquecer o teste.
- check:experience conserva todas as suítes e acrescenta check:download.
  C1 mantém sua suíte de índice real, concorrência, falhas e foco.
  Não há páginas inglesas ou seletor de idioma; catálogo de UI não é tradução.

Próxima unidade: E — Comunidade e rodapé. Confronte E-01–E-03 com os fluxos
públicos reais antes de alterar. Preserve paginação, filtros, cache, timestamp,
stale, vazio, erro, rate limit e saída para GitHub. Identifique lacunas de
compreensão da contribuição e navegação complementar. Não criar categorias,
licenças, tarefas no GitHub ou chamadas extras à API sem necessidade demonstrada.
Não reformar integrações funcionais ou enviar mensagens à comunidade.

Trabalhe um pacote por vez e apresente prévia concreta. Reutilize tema,
movimento, roteamento, i18n, browser harness e verificações. Preserve conteúdo,
manual oficial por SHA-256, CSP e versões. Não alterar releases/código da IDE
ou datas/ambientes dos guias sem a reprodução correspondente. F0/F1 e G ficam
pendentes; idioma depende de conteúdo real e revisado.

Evidências ignoradas de D: test-results/d-2026-11-13/, com manifesto de entrada,
fonte oficial, logs, 72 cenários por base, imagens e resultados de busca.
previous-evidence/ e gate-evidence/ separam árvores; não atribuir um resultado
histórico a código posterior. Evidências podem faltar em outro clone. Consulte
D-DOWNLOAD.md para comandos, fingerprints e limites reais. A prévia quando
ativa é http://127.0.0.1:4321/KineinSite/aprender/ide/instalar/#baixar-beta; busca via HUD ou Ctrl/Cmd+K.
Conferir Chrome/Firefox/geckodriver disponíveis; não instalar outra suíte.

D, o polimento da busca e a reformulação do painel foram aprovados
explicitamente, com autorização de publicação desta entrega. Prossiga nas ações locais autorizadas. "Pode prosseguir" não
renova autorização de commit, push ou publicação; a autorização mais recente é específica de D/polimento/reformulação. Só publique uma nova entrega mediante novo pedido.
Ao encerrar informe implementação, evidências, prévia, limites e próxima unidade,
mantendo índice, requisitos, validação e relatório sincronizados.
```
