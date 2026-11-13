# Prompt para a próxima sessão

Entrada original: `cb0a6a6` (H2/A). B foi aprovado e registrado em `dcf9287`;
C0 foi comprovado e registrado em `ef1cba8`. C1 integra a busca real conforme
C1-BUSCA.md. O mantenedor autorizou explicitamente publicar a versão atual
após concluir C1, em 13 de novembro de 2026. O commit efetivamente servido
é identificado pelo `site-version.json` público e conferido pelo publicador.
Essa autorização não se estende a publicações dos próximos escopos.

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
- docs/modernizacao/C1-BUSCA.md
- docs/modernizacao/REQUISITOS-E-ACEITE.md
- docs/modernizacao/VALIDACAO.md
- docs/modernizacao/RELATORIO-ENGENHARIA.md

Confirme HEAD, branch e árvore real, preservando quaisquer alterações locais
posteriores. Confira o manifesto público antes de atribuir uma versão ao site.
Não descarte arquivos, refaça entregas ou substitua implementação por outro
plano geral. Trabalhe um pacote por vez.

Estado de entrada:
- H1 foi documental. H2 implementa o catálogo de 16 links, composições nativas,
  aparência/download únicos, foco/teclado/resize e fallback sem JS.
- A implementa hero com captura real, origem e Astro Assets; galeria, vídeos
  e percursos anteriores preservados. H2/A têm validação técnica; avaliação
  e polimento visual pelo mantenedor continuam separados.
- B implementa índice contextual em 13 artigos, cópia localizada, foco no
  código e marcador compatível com texto ampliado. Foi aprovado pelo
  mantenedor; não refazer índices, breadcrumbs, percursos ou o manual.
- A correção de Clipboard lento de C0 usa aria-disabled e guarda de repetição.
  Preservar foco, confirmação/falha e o teste de cópia pendente.
- C0 comprovou Pagefind 1.6.0 com worker de mesma origem nas bases
  /KineinSite/ e /. Sem worker, WASM falha sob a CSP atual. Não relaxar a
  política com permissões de eval ou blob para habilitar um fallback.
- C1 adota a versão comprovada na dependência/lockfile, layouts e build.
  Astro HTML -> índice nativo -> validações; browser não participa do build.
  São 24 páginas públicas; manual tem versão/origem/revisão, prévia 0.4
  indica desenvolvimento, 404/navegação/controles ficam fora do corpus.
- A busca real fica na HUD, com carregamento na primeira consulta, estados,
  retry, erro explícito sem worker, navegação por links e renderização segura.
  Preservar normalização de base, proteção contra respostas antigas,
  fechamento/reabertura rápida, foco e convivência com os painéis existentes.
- check:experience inclui a nova busca. check:browser e B agora identificam
  especificamente o anúncio da cópia, sem confundi-lo com o status da busca.
  Não reduzir cobertura. Prova C0 continua opt-in e isolada.
- Não existem páginas inglesas ou seletor de idioma; catálogo de UI não
  equivale a conteúdo bilíngue. Safari, toque físico, leitor de tela e zoom
  real continuam limites de verificação, conforme C1.

Próxima unidade: D — Download e instalação. Confronte D-01–D-03 com os links,
dados de release, guia e notas já existentes. Confira release, assets,
plataforma, arquitetura e requisitos nas fontes oficiais antes de modificar
textos ou versões. Não inferir publicação da IDE a partir de commits. Página
dedicada é opcional e exige benefício demonstrado sobre o fluxo atual; não
copiar o guia. Entregue lacunas reais e uma prévia concreta, preservando C1.
Não modificar releases nem código da IDE. E, F0/F1 e G continuam pendentes.

Reutilize tema, movimento, roteamento, i18n e harness existentes. Preserve
manual oficial por SHA-256 e as verificações do projeto. Execute checks
pertinentes e registre resultados reais, sem atribuir a uma nova árvore os
resultados anteriores. O gate de C1 mantém três hints do boot de tema e oito
avisos informativos de arquitetura; não aumentar limites ou tolerâncias.
Mantenha README do plano, requisitos, validação, relatório e retomada coerentes.

Evidências locais: test-results/h2-2026-11-12/, a-2026-11-12/, b-2026-11-13/,
c0-2026-11-13/ e c1-2026-11-13/, ignoradas pelo Git. Podem não existir num
clone novo. Reutilize scripts/lib/browser.mjs e confira a disponibilidade
real de Chrome, Firefox/geckodriver e compiladores temporários.
A prévia Pages é http://127.0.0.1:4321/KineinSite/ quando ativa. O relatório
C0 em http://127.0.0.1:4322/ é histórico, não a interface de busca do produto.

Continue autonomamente no trabalho local autorizado. "Pode prosseguir" não
autoriza novas publicações. A autorização explícita de envio de C1 pertence
somente àquela entrega; commit, push e deploy posteriores exigem novo pedido.
Não confundir validação técnica, avaliação visual e autorização operacional.
Ao encerrar informe implementação, decisões, verificações, prévia, limites
reais e próxima unidade, sem aprovação visual presumida.
```
