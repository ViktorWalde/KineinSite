# Contribuir com o KineinSite

Obrigado por ajudar a tornar o site mais claro e útil. Mudanças pequenas e verificáveis são as mais fáceis de revisar. Para defeitos ou propostas maiores, descreva primeiro o problema e o resultado esperado em uma issue do [repositório do site](https://github.com/ViktorWalde/KineinSite/issues).

## Preparar o ambiente

Use Node.js 24 e npm. Execute `npm ci` e `npm run dev`; a página local abre em <http://127.0.0.1:4321/>. Antes de abrir um pull request, execute `npm run build:pages` e informe o resultado. A validação automática de pull requests está pausada; o mantenedor também executa esse build antes da publicação. Consulte [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para localizar rotas, componentes e estilos.

## Escopo de uma mudança

- Explique qual problema de navegação, conteúdo ou apresentação a mudança resolve.
- Preserve os rótulos de estado: **disponível agora**, **em desenvolvimento** e **direção futura** não são intercambiáveis. Atualizações sobre recursos da IDE precisam de fonte na release, no manual ou de confirmação do mantenedor.
- Use `sitePath()` para links internos e confira a variante com base `/KineinSite/`.
- Mantenha os textos legíveis nos temas claro, escuro e quente, com as três cores de destaque. Use os tokens de `src/styles/tokens.css` em vez de fixar branco puro para texto de leitura.
- Garanta que controles funcionem com teclado e que movimento não seja necessário para compreender a interface. Respeite `prefers-reduced-motion`.
- Não inclua credenciais, dados pessoais ou conteúdo da pasta `DocPrivate/` em código, screenshots ou logs.

## Estudos e guias

Estudos de linguagem ficam em `src/content/estudos/<linguagem>/`. O texto e o exemplo devem ser autorais, em português, com links para fontes primárias. O frontmatter informa linguagem, padrão, plataforma, ferramenta, data do último teste e `status`. A rota pública gera apenas entradas `verified`.

Um estudo só deve receber `verified` quando todos os comandos forem executados e o resultado esperado for conferido no ambiente declarado. Indique pré-requisitos, unidades, limitações e como reconhecer erros comuns. Evite copiar documentação ou exemplos de terceiros; cite a fonte consultada e redija a explicação com suas palavras.

O manual em `src/content/manual/` é uma cópia fiel do manual da IDE e não se edita aqui: o build recusa uma cópia alterada. Correções vão para o repositório da IDE e voltam por `scripts/sincronizar-manual.mjs`.

Os capítulos que ensinam tarefas **na Vectis** pertencem à coleção `src/content/aprender/` e aparecem em `/aprender/`. Cada capítulo tem um `roteiro.txt` que `scripts/capturar-tutorial.sh` executa na IDE de verdade (formato no cabeçalho do script). Um capítulo só recebe `status: verified` depois de reproduzido por inteiro na versão de `ideVersion`, no ambiente de `platform`, com as capturas geradas pelo roteiro. Descreva a versão pública como ela é, inclusive o que não funciona como deveria; não apresente recursos da versão em desenvolvimento como disponíveis na release pública.

## Revisão de interface

Para alterações visuais, confira pelo menos uma largura estreita (320 a 390 px), uma intermediária (por volta de 768 px) e uma larga (a partir de 1200 px). Abra o painel de tema, navegue com Tab e teste a preferência de movimento reduzido. Informe no pull request o que foi verificado e anexe capturas se elas ajudarem a avaliar o resultado. Essas verificações manuais complementam o build e `npm run check:browser`, que cobre temas, teclado, mídias, larguras de tela e movimento reduzido.

## Pull request

Descreva o comportamento anterior, a mudança, as páginas afetadas e o resultado de `npm run build:pages`. Para conteúdo técnico, inclua fontes e ambiente de teste. O pull request deve alterar apenas arquivos públicos necessários à proposta. A publicação é feita por um mantenedor após revisão.

Os arquivos de `assets/` têm termos próprios de uso descritos nos READMEs da pasta. A publicação no GitHub não concede permissão de reutilizá-los fora do site.
