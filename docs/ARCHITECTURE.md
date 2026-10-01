# Arquitetura do KineinSite

## Execução

Astro gera HTML, CSS, JavaScript e imagens estáticos em `dist/`. O GitHub Pages serve esses arquivos; não há API do site, banco ou renderização no servidor em produção. `astro.config.mjs` usa a base `/KineinSite` somente quando `KINEIN_PAGES_BUILD=1`. O comando `npm run build:pages` ativa essa variante. `src/site.ts` centraliza URLs externas e monta links internos com `sitePath()`.

## Código e conteúdo

| Local | Responsabilidade |
| --- | --- |
| `src/pages/` | Rotas estáticas e geração de páginas de estudo. |
| `src/layouts/BaseLayout.astro` | Estrutura HTML, metadados e imports dos estilos globais. |
| `src/components/` | Cabeçalho, rodapé e seções reutilizadas. |
| `src/styles/tokens.css` | Cores por tema e por destaque; os outros CSS consomem esses tokens. |
| `src/scripts/theme.ts` | Preferências de tema e cor guardadas no navegador. |
| `src/data/development.ts` | Retrato editorial da próxima versão informado pelo mantenedor; não substitui a release. |
| `src/features/atualizacoes/` | Área de Atualizações: ordenação das notas (`updates.ts`), destaque da home (`LatestUpdate.astro`) e estilos (`updates.css`). |
| `src/data/references.ts` | Lista de fontes externas exibida no índice de documentação. |
| `src/content.config.ts` | Esquemas das coleções Markdown. |
| `assets/` | Arquivos de origem das imagens, otimizados pelo Astro no build. |

`atualizacoes` contém uma nota por versão publicada da IDE. `src/pages/atualizacoes/index.astro` lista todas e `src/pages/atualizacoes/[...slug].astro` publica cada uma, usando o nome do arquivo como parte da URL. `src/features/atualizacoes/LatestUpdate.astro` mostra a mais recente na página inicial. `publicVersion` e `publicTag` em `src/site.ts` são a única fonte da versão pública exibida no site.

`estudos` contém material de linguagem que pode ser executado sem a IDE. `src/pages/estudos/[...slug].astro` publica somente entradas com `status: verified`, usando o identificador da pasta como parte da URL. `aprender` é a coleção prevista para Guia da IDE e projetos guiados; ainda não tem rota renderizada. Um arquivo `verified` nessa coleção não aparece automaticamente no site.

O HTML gerado não usa realce de sintaxe com cores fixas. Blocos de código herdam as cores do tema, inclusive no modo claro e quente. Eles permitem rolagem horizontal quando o código é mais largo que a tela.

## Verificações

`npm run build:pages` executa `astro check`, ESLint, Stylelint, verificação de arquitetura, Prettier, build, `html-validate` e `scripts/check-links.mjs`. O último confere arquivos e âncoras de links **internos** no HTML gerado; links externos exigem revisão editorial. A validação automática de push e pull request está pausada porque os jobs do GitHub Actions não estão iniciando nesta conta. `validate.yml` guarda a configuração para execução manual após a liberação dos jobs. Até lá, o mantenedor executa o build local antes de publicar. Nenhum desses checks substitui a revisão visual e de teclado no navegador.

## Publicação

O Pages está configurado para servir a raiz da branch `gh-pages`. `scripts/publicar-pages.sh` exige árvore Git limpa e identidade local com email `noreply`, recompila, clona a branch em um diretório temporário, sincroniza `dist/` e envia a atualização. `main` guarda o código fonte; `gh-pages` guarda somente os arquivos gerados. O workflow `deploy.yml` pode ser disparado manualmente, mas não participa do fluxo por branch descrito aqui.

Rascunhos internos e informações privadas ficam fora do repositório. `DocPrivate/` está em `.gitignore`; essa regra impede novas inclusões normais, mas não substitui a revisão dos arquivos antes do commit.
