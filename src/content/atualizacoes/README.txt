Notas de atualização publicadas no site

- Um arquivo Markdown por versão publicada. O nome do arquivo vira a URL:
  0-3-5.md -> /atualizacoes/0-3-5/. Use a versão com hífens.
- O frontmatter é validado pelo schema em src/content.config.ts: version, tag,
  title, date, channel (beta | estável), summary, highlights (1 a 6) e limits.
- A nota com a data mais recente aparece automaticamente em destaque na página
  inicial e no topo de /atualizacoes/.
- Só publicar a nota depois de a release existir no GitHub: os botões apontam
  para a tag informada.
- Ao lançar, troque também publicVersion e publicTag em src/site.ts.
- Escreva para quem usa a IDE: o que mudou, como instalar e os limites
  conhecidos. O detalhe técnico fica no CHANGELOG do projeto.
