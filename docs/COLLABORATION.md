# Área Colabore

Implementação local de 2026-10-24, aguardando revisão visual do mantenedor. Esta etapa não publica o site, cria issues ou altera a configuração dos repositórios no GitHub.

## Propósito e limites

`/colabore/` apresenta oportunidades independentes que complementam a trilha principal da IDE. A execução, as dúvidas, a atribuição, a revisão e a aceitação continuam nas issues e nos pull requests. Uma colaboração pode ser adiada ou recusada sem bloquear a próxima etapa do mantenedor.

As frentes apresentadas são documentação, testes em outros ambientes, exemplos autorais e acessibilidade do site. Uma pendência de roadmap não entra automaticamente como tarefa. Mudanças centrais de arquitetura, protocolo, dependências e release exigem escopo previamente combinado.

`/colabore/regras/` detalha alinhamento, ambiente, implementação, validação, evidências, documentação, envio, revisão e créditos. Inclui um modelo copiável para a descrição do PR e checklist de entrega. As convenções técnicas continuam nos documentos oficiais dos respectivos repositórios.

## Como alimentar o quadro

Os projetos consultados estão em `src/features/colabore/repositories.ts`: `ViktorWalde/KineinVectis` e `ViktorWalde/KineinSite`.

1. Prepare uma issue com problema, resultado esperado, escopo e exclusões, ponto de entrada, ferramentas, dificuldade justificada, critérios de aceite, comandos e evidências exigidos. Confirme que ela não depende de trabalho central ainda pendente.
2. Depois da revisão, aplique `help wanted`, `good first issue` ou `colabore`. O quadro inclui a união dessas labels. Use `good first issue` somente para tarefas realmente adequadas à primeira contribuição. Labels de área e tecnologia aparecem nos cartões e entram na busca.
3. Para excluir uma issue da vitrine, remova os marcadores de convite ou acrescente `trilha-principal`, `maintainer-only`, `blocked` ou `bloqueada`. A exclusão tem prioridade sobre o convite, inclusive em tarefas encerradas. Espaços, hífens, sublinhados, caixa e acentos são normalizados.
4. Atribua a pessoa após confirmar o escopo. A issue sai de **Abertas** e entra em **Em andamento** quando tiver responsável ou uma destas labels: `in progress`, `in-progress`, `em andamento`, `em progresso`, `doing`.
5. Revise a entrega e integre o PR quando necessário. Só depois encerre a issue como **completed** para aparecer em **Realizadas**. `not_planned`, duplicidades e fechamento sem motivo conhecido não contam como entrega. Reabrir recalcula o estado a partir dos responsáveis e labels atuais.

O frontend não consegue comprovar a revisão ou exigir que um PR tenha sido integrado: o mantenedor controla o fechamento como `completed`. Pull requests retornados pelo endpoint de issues não viram tarefas.

Em 2026-10-24, os endpoints públicos consultados retornaram apenas PRs, sem issues de colaboração. Por isso o estado vazio inicial é esperado. Criar a fila é uma ação editorial separada; não se inventam oportunidades ou contagens para preencher o layout.

## Sincronização

- Leitura REST pública, sem token no navegador e sem backend. Não depende de CI, de workflow ou de nova publicação.
- Primeira leitura ao abrir a página e atualização a cada cinco minutos enquanto ela estiver visível. Voltar à aba também verifica a necessidade de atualização.
- Cache de cinco minutos por projeto/endpoint, em memória e `sessionStorage`. Uma nova tentativa manual ignora o prazo do cache, com intervalo mínimo de um minuto entre tentativas.
- Paginação pelo cabeçalho `Link`, restrita ao mesmo endpoint público; máximo de dez páginas de cem registros por projeto/endpoint. Ao atingir o limite, a interface avisa que os números são do recorte carregado.
- Timeout de doze segundos por requisição. Em 403/429, aguarda pelo menos cinco minutos e respeita `Retry-After`/`X-RateLimit-Reset` quando disponíveis.
- Se a consulta falhar, preserva a última leitura válida disponível nesta aba por até sete dias, informa a data e mantém links diretos ao GitHub. Sem leitura válida, mostra indisponibilidade e contagens desconhecidas, nunca zeros fictícios.
- Cada lista só é substituída depois de carregar ambos os projetos; não se anunciam totais completos com um projeto ausente.

A API pública sem autenticação limita consultas por IP. Outros usos do GitHub na mesma rede compartilham esse limite. A implementação não promete atualização instantânea. Para volume maior ou listas extensas, o próximo passo é servir um snapshot estático compartilhado e atualizado por rotina de geração, mantendo a data e os estados de falha. Um token, se usado nessa rotina, deve ficar no ambiente do gerador.

## Assinaturas e agradecimento

A seção de créditos consulta os contributors das branches principais dos dois projetos, agrega os commits por login e ordena os perfis alfabeticamente. Mostra identificador público, projetos e commits; não representa horas, tarefas concluídas ou uma classificação. O mantenedor recebe identificação própria. Não se inventam nome civil, cidade ou biografia.

Perfis `Bot` e contas automatizadas conhecidas são excluídos. A lista de exceções está em `model.ts`, pois alguns autores automatizados aparecem como `User`. Os avatares são monogramas locais: não há requisição externa de imagem.

O crédito depende do reconhecimento de autoria e do cache do GitHub, portanto pode demorar após o merge. Relatos, revisões, testes e outras ajudas sem commit podem receber um agradecimento editorial em `src/data/collaborator-acknowledgements.ts`: o mantenedor registra o login público, uma descrição da ajuda e o link público da issue/PR que comprova a contribuição. A lista começa vazia e é renderizada no HTML estático quando houver registros. Não se inferem créditos de quem abriu ou recebeu uma issue, e não se incluem dados pessoais privados.

## Segurança, privacidade e manutenção

Somente `https://api.github.com` foi acrescentado ao `connect-src` da CSP. Scripts, estilos e imagens continuam locais. Não há autenticação, formulário de envio ou credencial no código cliente. Títulos, descrições e labels externos entram no DOM com `textContent`; links de tarefa e perfil são construídos a partir de identificadores validados, nunca de HTML recebido.

Ao abrir Colabore, o navegador faz requisições diretas à API do GitHub, que recebe os dados normais de conexão. Os dados públicos lidos ficam temporariamente no `sessionStorage` desta aba. Não há telemetria própria do site.

Verificações: `npm run build:pages` inclui `check:collaboration` para seleção e estados; `npm run check:browser` cobre as novas rotas e o comportamento da integração com respostas controladas, sem criar ou alterar tarefas no GitHub. Os testes simulados não substituem a consulta real de conectividade.

Fontes oficiais: [API de issues](https://docs.github.com/en/rest/issues/issues), [limites REST](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api), [contributors](https://docs.github.com/en/rest/repos/repos#list-repository-contributors).
