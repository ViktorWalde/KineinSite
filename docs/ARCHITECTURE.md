# Arquitetura do KineinSite

## Execução

Astro gera HTML, CSS, JavaScript e imagens estáticos em `dist/`. O GitHub Pages serve esses arquivos; não há API do site, banco ou renderização no servidor em produção. `astro.config.mjs` usa a base `/KineinSite` somente quando `KINEIN_PAGES_BUILD=1`. O comando `npm run build:pages` ativa essa variante. `src/site.ts` centraliza URLs externas e monta links internos com `sitePath()`.

## Código e conteúdo

| Local | Responsabilidade |
| --- | --- |
| `src/pages/` | Rotas. Cada página só compõe: importa o layout, os componentes e o CSS da sua funcionalidade. |
| `src/layouts/BaseLayout.astro` | Estrutura HTML, metadados, script de tema do `<head>` e os estilos globais. |
| `src/components/` | Só o que toda página usa: cabeçalho, rodapé e controles de tema. |
| `src/features/<funcionalidade>/` | Componentes, estilos e scripts de uma área do site, juntos: `inicio/`, `documentacao/`, `estudos/` e `atualizacoes/` (esta também com a ordenação das notas, `updates.ts`). |
| `src/styles/` | CSS global. `tokens.css` tem as cores por tema e destaque e a escala de raio, movimento e tipografia; `base.css`, `components.css` e `layout.css` ficam em camadas (`@layer`). |
| `src/scripts/` | Scripts de navegador comuns: preferências de tema (`theme-preferences.ts`, lido também pelo `<head>`) e o painel de tema (`theme.ts`). |
| `src/data/development.ts` | Retrato editorial da próxima versão informado pelo mantenedor; não substitui a release. |
| `src/data/references.ts` | Lista de fontes externas exibida no índice de documentação. |
| `src/content.config.ts` | Esquemas das coleções Markdown. |
| `assets/` | Arquivos de origem das imagens, otimizados pelo Astro no build. |

### Ordem do CSS

O CSS global vai para três camadas declaradas no topo de `base.css`, da mais fraca para a mais forte: `base` (elementos HTML), `components` (botões, cartões, rótulos) e `layout` (cabeçalho e rodapé, que especializam componentes). O CSS de `src/features/` fica fora de camada e por isso sempre vence o global, como manda a especificação de cascade layers. Isso importa porque o Astro embute no `<head>` as folhas pequenas de uma página, às vezes **antes** da global: sem camadas, o `.card` global sobrescrevia o cartão de novidade na lista de atualizações. Cada página carrega só o CSS que usa.

`atualizacoes` contém uma nota por versão publicada da IDE. `src/pages/atualizacoes/index.astro` lista todas e `src/pages/atualizacoes/[...slug].astro` publica cada uma, usando o nome do arquivo como parte da URL. `src/features/atualizacoes/LatestUpdate.astro` mostra a mais recente na página inicial. `publicVersion` e `publicTag` em `src/site.ts` são a única fonte da versão pública exibida no site.

`estudos` contém material de linguagem que pode ser executado sem a IDE. `src/pages/estudos/[...slug].astro` publica somente entradas com `status: verified`, usando o identificador da pasta como parte da URL. `aprender` contém o Guia da IDE. `src/pages/aprender/index.astro` lista os capítulos `verified` na ordem do campo `order`, e `src/pages/aprender/[...slug].astro` publica cada um, com a versão da IDE testada, o ambiente e a data do teste; quando `ideVersion` é diferente de `publicVersion`, a página avisa que o capítulo foi testado numa versão anterior. `src/features/aprender/` tem a lógica da coleção (`guides.ts`), o índice lateral e os estilos (`guia.css` para o capítulo, `aprender.css` para o índice). Cada `##` de um capítulo é um passo, numerado pelo CSS.

`manual` guarda o manual da IDE, publicado em `/manual/`: uma cópia fiel de `DocsPublic/manual.md` na tag da versão pública, feita por `scripts/sincronizar-manual.mjs`. O frontmatter registra tag, commit e sha256 do corpo, e `scripts/check-manual.mjs` (no `npm run check`) recusa o build se o corpo tiver sido editado: o manual da IDE é a fonte única, e uma correção vai para o repositório da IDE. A página só acrescenta a moldura, o índice lateral e a origem do texto.

Cada capítulo do Guia é uma pasta com `index.md`, `roteiro.txt` e `capturas/`. `scripts/capturar-tutorial.sh` reproduz o capítulo na IDE de verdade: roda os blocos `bash` do próprio texto numa HOME descartável com ambiente mínimo, confere a saída, dirige a interface com `xdotool` num Xvfb e salva as capturas com o dobro de pixels (`QT_SCALE_FACTOR=2`). Um capítulo só recebe `verified` depois de reproduzido por inteiro.

O HTML gerado não usa realce de sintaxe com cores fixas. Blocos de código herdam as cores do tema, inclusive no modo claro e quente. Eles permitem rolagem horizontal quando o código é mais largo que a tela.

### Movimento e degradês

Animações só mexem em `opacity`, `translate` e `scale`, que o navegador compõe sem refazer o layout; durações e deslocamentos vêm de tokens em `tokens.css` e valem zero com "reduzir movimento". A entrada de página usa `.enter`; a revelação ao rolar usa `.reveal` e `.reveal-children` com `animation-timeline: view()`, sem JavaScript, e onde não há suporte o conteúdo aparece direto. As propriedades de animação ficam separadas de propósito: o minificador junta `animation` e `animation-timeline` num atalho que a especificação não aceita, e a revelação deixava de existir. A troca de página usa a transição nativa (`@view-transition`).

Degradês interpolam em OKLab (`in oklab`), ou em OKLCH entre cores do mesmo matiz, para o meio não ficar acinzentado como no sRGB padrão. Fundos com degradê suave recebem `assets/textures/noise.png` por cima, um pontilhado que desfaz as faixas de cor; o arquivo é gerado por `scripts/generate-noise.mjs`.

## Verificações

`npm run build:pages` executa `astro check`, ESLint, Stylelint, verificação de arquitetura, contraste (`scripts/check-contrast.mjs`: os pares de texto, rótulo e foco de `tokens.css` nas 12 combinações de tema e destaque, com o mínimo da WCAG 2.2 — 4,5:1 para texto, 3:1 para foco), Prettier, build, `html-validate`, `scripts/check-links.mjs` e `scripts/check-html-security.mjs`. O último confere arquivos e âncoras de links **internos** no HTML gerado; links externos exigem revisão editorial. A validação automática de push e pull request está pausada porque os jobs do GitHub Actions não estão iniciando nesta conta. `validate.yml` guarda a configuração para execução manual após a liberação dos jobs. Até lá, o mantenedor executa o build local antes de publicar. Nenhum desses checks substitui a revisão visual e de teclado no navegador.

## Segurança

Medido e conferido em 2026-10-02. O modelo é o de um site estático: não há servidor nosso, banco, formulário, conta ou cookie. O que pode dar errado é conteúdo ou dependência maliciosa entrar pelo repositório, e o site ficar indisponível por excesso de tráfego.

### Política de conteúdo (CSP)

O GitHub Pages não permite cabeçalhos HTTP próprios, então a política vai num `<meta http-equiv="content-security-policy">` em cada página, gerado pelo Astro (`security.csp` em `astro.config.mjs`). O Astro calcula o hash de cada script e estilo que emite, inclusive o script de tema do `<head>`. Com isso, o navegador recusa script inline sem hash, atributo de evento (`onclick`), URL `javascript:`, script, imagem e `<iframe>` de outra origem, qualquer `<object>`, `<base>` apontando para fora e envio de formulário.

Limites conhecidos, conforme a especificação CSP Level 3 (W3C, seção "The `<meta>` element"):

- `frame-ancestors`, `report-uri` e `sandbox` não valem em `<meta>`. Sem cabeçalho, não há como impedir que outro site enquadre estas páginas; como elas não têm ação com efeito, o risco de clickjacking é baixo.
- Uma política em `<meta>` só vale para o que vem depois dela no documento. O Astro a coloca no fim do `<head>`, depois do script de tema e da folha de estilo. Os dois são gerados pelo build; o conteúdo vindo de Markdown fica no `<body>` e é coberto.
- A política não funciona em `npm run dev`; confira com `npm run build:pages` e `npm run preview`.

`scripts/check-html-security.mjs` roda no build e reprova uma página sem a política ou com `'unsafe-inline'`/`'unsafe-eval'`, atributo de evento, `<iframe>`/`<object>`/`<embed>`, script de outra origem e `target="_blank"` sem `rel="noopener"`. Ele foi provado por mutação: cada um desses defeitos, inserido de propósito, reprovou; desligar a CSP na configuração reprovou as sete páginas.

### Dependências e publicação

- `package-lock.json` fixa as versões; `npm audit` sem vulnerabilidades em 2026-10-02.
- `.npmrc` desliga scripts de instalação de dependências. O único pacote com script era o `esbuild` (`postinstall` que só valida o binário); o build passa sem ele.
- Os workflows fixam cada action pelo SHA do commit, com a tag em comentário, e o checkout não guarda a credencial do Git. Tag pode ser movida para outro código; SHA não.
- A publicação por `scripts/publicar-pages.sh` exige árvore limpa, branch `main` e email `noreply`, e envia só `dist/`.

### Disponibilidade e tráfego abusivo

Não há origem nossa para derrubar: as páginas saem da rede de entrega do GitHub Pages, que absorve o tráfego. A documentação do GitHub ("GitHub Pages limits") declara um site publicado de até 1 GB, um limite *flexível* de banda de 100 GB por mês e rate limit com resposta HTTP `429`. O Pages não oferece WAF nem rate limit configurável.

O que está ao alcance do site é não oferecer arquivo grande para ser repetido. O build deixou de publicar o PNG original de 2 MB do fundo do hero: `dist/` caiu de cerca de 2,4 MB para 368 KB, e o maior arquivo servido tem 73 KB. Se um dia o tráfego legítimo ou abusivo passar desses limites, o caminho que o próprio GitHub sugere é uma CDN na frente, o que exige domínio próprio e muda quem recebe os acessos.

### Privacidade

O código do site não coleta dados: a única preferência (tema e cor) fica no `localStorage` do navegador. A hospedagem é outra coisa: segundo a documentação do GitHub ("What is GitHub Pages?", seção *Data collection*), o IP de cada visitante é registrado e guardado por segurança. O site não afirma ao visitante que nada é coletado, porque isso não depende só do código dele.

## Publicação

O Pages está configurado para servir a raiz da branch `gh-pages`. `scripts/publicar-pages.sh` exige árvore Git limpa e identidade local com email `noreply`, recompila, clona a branch em um diretório temporário, sincroniza `dist/` e envia a atualização. `main` guarda o código fonte; `gh-pages` guarda somente os arquivos gerados. O workflow `deploy.yml` pode ser disparado manualmente, mas não participa do fluxo por branch descrito aqui.

Rascunhos internos e informações privadas ficam fora do repositório. `DocPrivate/` está em `.gitignore`; essa regra impede novas inclusões normais, mas não substitui a revisão dos arquivos antes do commit.
