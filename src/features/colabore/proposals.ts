// Prepara uma proposta para a pessoa revisar no GitHub. Não envia conteúdo
// nem aplica labels: o mantenedor combina o escopo antes da implementação.
export function proposalUrl(repository: string, subject: string): string {
  const parameters = new URLSearchParams({
    title: `Proposta de colaboração: ${subject}`,
    body: `Olá! Gostaria de contribuir com ${subject.toLowerCase()}.

## O que proponho
[Descreva uma melhoria pequena e o resultado esperado.]

## Limites da contribuição
[Informe o que pretende alterar e o que fica fora. A proposta deve ser independente da trilha principal.]

## Ambiente e disponibilidade
[Versão da IDE, sistema, ferramentas e equipamento, se forem necessários. Não há prazo presumido.]

## Como pretendo verificar o resultado
[Passos, comandos, capturas ou outras evidências que conseguirei apresentar.]

Aguardo o alinhamento do escopo antes de começar a implementação.`,
  });
  return `${repository}/issues/new?${parameters.toString()}`;
}
