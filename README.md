# KineinSite

Site público da [Kinein Vectis](https://github.com/ViktorWalde/KineinVectis): <https://viktorwalde.github.io/KineinSite/>.

A página inicial apresenta a versão pública 0.2.0, o desenvolvimento da 0.3.0 e a direção futura da IDE. O índice de documentação reúne os caminhos oficiais existentes e mostra o estado dos guias próprios. Os tutoriais ainda serão escritos e verificados antes de serem publicados.

## Executar localmente

Requer Node.js 24 e npm. As versões das dependências estão fixadas em `package-lock.json`.

```bash
npm ci
npm run build
npx astro preview
```

Para editar com atualização automática, use `npx astro dev`. O build gera um site estático em `dist/`.

## Publicar no GitHub Pages

Depois de revisar o conteúdo e fazer commit na branch `main`:

Configure antes seu [endereço `noreply` do GitHub](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address) em `git config --local user.email`, para que os commits não revelem um endereço pessoal. O script de publicação exige essa configuração e um `user.name` local.

```bash
git push origin main
bash scripts/publicar-pages.sh
```

O script executa as validações, gera a variante com base `/KineinSite/` e envia somente `dist/` para a branch `gh-pages`. Requer `git`, `rsync` e acesso ao repositório. A configuração do Pages usa a raiz de `gh-pages` como fonte. [Instruções do GitHub para publicação por branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Organização

| Local | Conteúdo |
| --- | --- |
| `src/pages/` | Página inicial e índice de documentação. |
| `src/components/`, `src/layouts/`, `src/styles/` | Interface do site. |
| `src/content/aprender/` | Área reservada para capítulos verificados do Guia da IDE e projetos guiados. |
| `assets/` | Originais das imagens usadas pelo site. |
| `scripts/` | Verificações e publicação. |

`npm run build:pages` verifica tipos, lint, CSS, arquitetura, formatação, HTML e links locais antes de gerar os arquivos para o Pages. A implementação do site é separada do código da IDE.
