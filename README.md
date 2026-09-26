# KineinSite

Site público da [Kinein Vectis](https://github.com/ViktorWalde/KineinVectis), disponível em <https://viktorwalde.github.io/KineinSite/>. Este repositório contém a interface e o conteúdo do site; o código da IDE fica em outro repositório.

O site é estático, feito com Astro 7 e publicado no GitHub Pages. Não há servidor, banco de dados nem coleta de dados do visitante no código deste projeto. A preferência de tema fica no armazenamento local do navegador.

## Estado atual

| Endereço | Conteúdo |
| --- | --- |
| `/` | Versão pública da IDE, estágio de desenvolvimento e direção do produto, com rótulos distintos. |
| `/documentacao/` | Índice do manual, release, referências e estudos já disponíveis. |
| `/estudos/cpp/telemetria-local/` | Primeiro estudo autoral de C++20, testado no Linux. |
| `/documentacao/site/` | Como o site funciona, como colaborar e próximos passos verificáveis. |

O beta público indicado no site é o 0.2.0 para Linux x86_64. A situação da 0.3.0 vem de [`src/data/development.ts`](src/data/development.ts) e deve ser revista com o mantenedor antes de mudar. O roteiro de evolução **deste site** está em [docs/ROADMAP.md](docs/ROADMAP.md).

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

No preview do build para Pages, abra <http://127.0.0.1:4321/KineinSite/>. O build valida tipos, lint, CSS, arquitetura, formatação, HTML e links internos, incluindo âncoras. Os arquivos gerados ficam em `dist/`.

## Organização e colaboração

- [CONTRIBUTING.md](CONTRIBUTING.md): fluxo de contribuição e critérios para conteúdo.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): rotas, coleções, temas, build e publicação.
- [docs/ROADMAP.md](docs/ROADMAP.md): trabalho do site com pré-requisitos e critérios de conclusão.
- `src/content/estudos/`: estudos de linguagem independentes da IDE, publicados somente com `status: verified`.
- `src/content/aprender/`: estrutura reservada para o Guia da IDE e projetos guiados; ainda não há rota pública para essa coleção.
- `assets/`: originais de imagem, com termos próprios descritos nos arquivos README da pasta.

Links internos devem passar por `sitePath()` em [`src/site.ts`](src/site.ts), pois a versão publicada usa a base `/KineinSite/`. O conteúdo técnico deve distinguir o que foi testado na versão pública da IDE do que está em desenvolvimento ou planejado.

## Publicação

O caminho de publicação usado hoje é a branch `gh-pages`. Após revisão, validação e commit em `main`, um mantenedor com acesso de escrita executa:

```bash
git push origin main
bash scripts/publicar-pages.sh
```

O script exige `user.name` e um endereço `@users.noreply.github.com` na configuração local do Git, roda `npm run build:pages` e envia apenas `dist/` para `gh-pages`. Contribuidores externos devem abrir um pull request; a publicação fica com os mantenedores. O workflow `deploy.yml` é uma alternativa manual existente, mas não é o fluxo usado para a publicação por branch. O workflow de validação de pull requests não publica o site.

`DocPrivate/` é uma pasta local ignorada pelo Git. Não inclua dados pessoais, credenciais, caminhos privados ou documentos de trabalho nessa contribuição.
