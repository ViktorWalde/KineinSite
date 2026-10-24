# Direção internacional a partir da 0.5

Decisão do mantenedor em 2026-10-24: a partir da linha 0.5, o projeto buscará ampliar o apoio e a colaboração internacional. Inglês será o idioma principal do projeto, do site e da IDE; português permanece como possibilidade de tradução. Esta decisão não traduz automaticamente a edição atual nem anuncia uma versão bilíngue pronta.

## Nesta revisão local

- A prévia permanece em português, como solicitado durante a construção do site.
- Os convites acolhem pessoas de qualquer lugar. A apresentação destaca a proposta da IDE e as formas de participar, sem enfatizar o país de origem.
- Regras de independência, escopo e revisão permanecem as mesmas para todas as pessoas.
- Os identificadores de navegação, estados e integração permanecem estáveis. Labels públicas `help wanted`, `good first issue` e `in progress` já são compatíveis com a colaboração internacional.
- Rótulos e mensagens do novo componente de cópia são fornecidos pelo HTML/componente, separados do comportamento, para receber traduções sem duplicar a interação.
- Não existe seletor de idioma decorativo ou link para uma tradução incompleta.

## Prioridade de conteúdo

1. Publicar primeiro uma experiência completa em inglês: apresentação da IDE, instalação, caminhos de início, Colabore, regras, modelo de entrega, canais de conversa e agradecimentos.
2. Alinhar README, CONTRIBUTING, templates de issues/PRs e instruções técnicas do repositório da IDE com o mantenedor. A abertura internacional deve apresentar um caminho compreensível do começo à revisão.
3. Manter português como tradução que pode ser feita e atualizada em tarefas pequenas e independentes. A continuidade da trilha principal e a entrega em inglês não dependem de um tradutor disponível.
4. Identificar o idioma e a versão de cada guia. Tradução preserva requisitos, limites e critérios de prova; não transforma funcionalidade planejada em disponível.

## Preparação técnica para a troca

- Definir as rotas por idioma e os redirecionamentos, preservando links atuais e a base `/KineinSite/`. Links devem continuar sendo gerados por uma função comum, sem duplicar caminhos manualmente em cada componente.
- Separar mensagens da interface por contexto. Navegação, formulários de busca, contagens, plurais, estados vazios, erros, botões, legendas e mensagens para leitores de tela também precisam de tradução.
- Atualizar `lang`, títulos, descrição, Open Graph, canônicos e `hreflang` somente para traduções que realmente existem. O idioma principal passa a inglês quando a edição completa estiver pronta.
- Definir uma política explícita para tradução ausente: oferecer o conteúdo em inglês com identificação visível, em vez de prometer uma página em português inexistente.
- O conteúdo original de uma issue, PR ou perfil vem do GitHub. A interface pode estar em outro idioma, mas títulos, requisitos, autoria e decisões não são traduzidos automaticamente nem reescritos pelo site.
- O manual da IDE continua com origem e versão verificáveis. Uma tradução precisa ter fonte oficial e rastreabilidade próprias; não se altera a cópia protegida por hash para contornar a sincronização.
- Na IDE, preservar o mecanismo de tradução do Qt e alinhar com o mantenedor a passagem do idioma principal para inglês. Catálogos de português e sua revisão ficam em contribuições delimitadas; o site não altera o código da IDE nesta etapa.

## Condição para considerar a edição internacional pronta

- Uma pessoa que lê inglês consegue conhecer a IDE, instalar a versão pública, escolher uma tarefa e entender a entrega sem precisar adivinhar instruções em português.
- As tarefas abertas para colaboração têm briefing, escopo independente, requisitos, critérios de aceite e comandos em inglês, revisados pelo mantenedor.
- A interface é conferida com rótulos longos, plurais, teclado, celular, temas e movimento reduzido.
- Links antigos e novos funcionam; cada idioma tem metadados corretos e os seletores só oferecem conteúdo disponível.
- Templates de proposta e PR usam o idioma esperado pela revisão. O GitHub continua sendo a fonte da atribuição e da aceitação.
- Os agradecimentos preservam perfis e evidências públicas. Nenhuma tradução altera a autoria ou a política de dados pessoais.

## Referências usadas no polimento

[Reconhecimento em vez de memorização, NN/g](https://www.nngroup.com/articles/recognition-and-recall/): os caminhos “conhecer”, “começar” e “colaborar” explicitam o objetivo antes da navegação.

[Detalhamento progressivo, NN/g](https://www.nngroup.com/articles/progressive-disclosure/): o convite apresenta formas concretas de ajudar, enquanto regras completas, descrição da issue e detalhes técnicos continuam acessíveis quando necessários.

[Navegação por disclosure, W3C WAI](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/): navegação comum usa links e expansão sem adotar o papel ARIA de menu de aplicativo. O menu móvel utiliza `details`/`summary` nativos, com Escape e foco de retorno na melhoria por JavaScript.
