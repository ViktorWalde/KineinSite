# KineinSite

Site público da [Kinein Vectis](https://github.com/ViktorWalde/KineinVectis), disponível em <https://viktorwalde.github.io/KineinSite/>. Este repositório contém a interface e o conteúdo do site; o código da IDE fica em outro repositório.

O site é estático, feito com Astro 7 e publicado no GitHub Pages. Não há servidor, banco de dados nem coleta de dados do visitante no código deste projeto. A preferência de tema fica no armazenamento local do navegador.

## Estado atual

| Endereço | Conteúdo |
| --- | --- |
| `/` | Nota de atualização mais recente em destaque, versão pública da IDE, estágio de desenvolvimento e direção do produto, com rótulos distintos. |
| `/atualizacoes/` | Lista das notas de atualização, da mais recente para a mais antiga; cada nota tem sua página em `/atualizacoes/<versão>/`. |
| `/documentacao/` | Índice do manual, release, referências e estudos já disponíveis. |
| `/estudos/cpp/telemetria-local/` | Primeiro estudo autoral de C++20, testado no Linux. |
| `/documentacao/site/` | Como o site funciona, como colaborar e próximos passos verificáveis. |

O beta público indicado no site é o 0.3.5 para Linux x86_64, definido em `publicVersion`/`publicTag` de [`src/site.ts`](src/site.ts). A situação da próxima versão vem de [`src/data/development.ts`](src/data/development.ts) e deve ser revista com o mantenedor antes de mudar. O roteiro de evolução **deste site** está em [docs/ROADMAP.md](docs/ROADMAP.md).

## Desenvolvimento local

Requer Node.js 24 e npm. Use a versão em [`.nvmrc`](.nvmrc), se tiver um gerenciador de versões. O `package-lock.json` fixa as dependências.

```bash
npm ci
npm run dev
```

Abra <http://127.0.0.1:4321/>. Para conferir a variante usada no Pages:

```bash
npm run build:pages
npm run preview
```

No preview do build para Pages, abra <http://127.0.0.1:4321/KineinSite/>. O build valida tipos, lint, CSS, arquitetura, formatação, HTML, links internos (incluindo âncoras) e a política de segurança de cada página. Os arquivos gerados ficam em `dist/`.

## Organização e colaboração

- [CONTRIBUTING.md](CONTRIBUTING.md): fluxo de contribuição e critérios para conteúdo.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): rotas, coleções, temas, build, segurança e publicação.
- [SECURITY.md](SECURITY.md): como relatar uma vulnerabilidade do site.
- [docs/ROADMAP.md](docs/ROADMAP.md): trabalho do site com pré-requisitos e critérios de conclusão.
- `src/content/estudos/`: estudos de linguagem independentes da IDE, publicados somente com `status: verified`.
- `src/content/aprender/`: estrutura reservada para o Guia da IDE e projetos guiados; ainda não há rota pública para essa coleção.
- `assets/`: originais de imagem, com termos próprios descritos nos arquivos README da pasta.

Links internos devem passar por `sitePath()` em [`src/site.ts`](src/site.ts), pois a versão publicada usa a base `/KineinSite/`. O conteúdo técnico deve distinguir o que foi testado na versão pública da IDE do que está em desenvolvimento ou planejado.

## Publicar uma nota de atualização

Cada versão publicada da IDE ganha uma nota em `src/content/atualizacoes/`. A nota mais recente aparece sozinha em destaque na página inicial e no topo de `/atualizacoes/`.

1. Publique a release no repositório da IDE. Os botões da nota apontam para a tag.
2. Copie a nota anterior para `src/content/atualizacoes/<versão-com-hífens>.md` (exemplo: `0-3-6.md`) e reescreva o frontmatter e o texto. O schema em `src/content.config.ts` recusa um campo faltando ou mal formado: `version`, `tag`, `title`, `date`, `channel`, `summary`, `highlights` (1 a 6 itens `title`/`text`) e `limits`.
3. Troque `publicVersion` e `publicTag` em `src/site.ts`. Cabeçalho, rodapé, home e documentação passam a mostrar a versão nova.
4. Atualize `src/data/development.ts` com a próxima versão em desenvolvimento.
5. Rode `npm run build:pages`, faça o commit em `main` e publique como descrito abaixo.

Escreva a nota para quem usa a IDE: o que mudou, como instalar e os limites conhecidos. O detalhe técnico fica no `CHANGELOG.md` do projeto.

## Publicação

O caminho de publicação usado hoje é a branch `gh-pages`. Após revisão, validação e commit em `main`, um mantenedor com acesso de escrita executa:

```bash
git push origin main
bash scripts/publicar-pages.sh
```

O script exige `user.name` e um endereço `@users.noreply.github.com` na configuração local do Git, roda `npm run build:pages` e envia apenas `dist/` para `gh-pages`. Contribuidores externos devem abrir um pull request; a publicação fica com os mantenedores. O workflow `deploy.yml` é uma alternativa manual existente, mas não é o fluxo usado para a publicação por branch. A validação automática de pull requests está pausada; o workflow `validate.yml` pode ser executado manualmente quando o GitHub voltar a iniciar seus jobs.

`DocPrivate/` é uma pasta local ignorada pelo Git. Não inclua dados pessoais, credenciais, caminhos privados ou documentos de trabalho nessa contribuição.
