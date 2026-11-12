# Internacionalização: fundação e direção editorial

## Orientação vigente — 12 de novembro de 2026

O [plano de engenharia](modernizacao/README.md) consolida a especificação atual:
manter suporte a `pt-BR`, preservar suas URLs e expandir para `en-US` em `/en/`,
com conteúdo revisado e sem duplicar componentes. Ainda não existem páginas
inglesas. O catálogo inglês da UI não constitui uma edição bilíngue completa.

O histórico abaixo explica a origem da direção internacional. Onde descreve
português como tradução apenas possível ou condiciona a expansão à versão 0.5,
vale a especificação atual de suporte aos dois idiomas e seus critérios de
aceite. Não se altera o idioma da raiz nem a política da IDE nesta entrega.

## Histórico editorial — 24 de outubro de 2026

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

### Fundação local — 12 de novembro de 2026

`src/i18n/config.ts` identifica `pt-BR` e `en-US`. Português mantém as URLs
existentes; `/en/` é um prefixo reservado, sem páginas publicadas nesta etapa.
Não há seletor de idioma até existir conteúdo suficiente revisado.

`ui.ts` contém catálogos completos e tipados para a moldura compartilhada:
skip link, header, navegação, aparência e rodapé. Esses componentes recebem
`locale`; os comportamentos de tema e navegação continuam independentes do
texto. As mensagens inglesas são uma fundação de interface, sem afirmar que
o conteúdo editorial ou a documentação já foram traduzidos.

`routing.ts` mantém `publishedRoutes` somente com destinos reais. `resolveRoute`
devolve endereço, idioma efetivo e `isFallback`: uma solicitação de manual em
inglês retorna o manual português, com fallback identificado, sem inventar
`/en/manual/`. Uma interface futura deve comunicar esse idioma ao apresentar
o destino. `equivalentRoutes` só oferece correspondências registradas.
`pathWithBase`, usado também por `sitePath`, funciona na raiz e em `/KineinSite/`.

`BaseLayout` deriva o idioma da URL para o HTML e Open Graph. Título e
descrição continuam sendo conteúdo explícito da página. Canonical mantém a
base do Pages. Alternativas `hreflang` só são emitidas para uma página com
mais de uma equivalência registrada; nesta entrega não há nenhuma em inglês.
`utils.ts` centraliza datas em UTC nos dois idiomas; `site.ts` conserva a
exportação anterior para não exigir mudanças nos consumidores portugueses.

`npm run check:i18n` verifica idioma, catálogo, datas, base, fronteira do prefixo,
destinos equivalentes e fallback. Faz parte do build, sem novas dependências.

Para publicar uma tradução, revisar primeiro o conteúdo completo da rota,
compor a página com os componentes existentes e registrar sua equivalência.
Depois habilitar a alternância de idioma, indicando explicitamente quando o
destino só existe em português. Guias continuam na coleção, não em objetos de UI.

Uma tradução futura do manual deve registrar idioma, tag/commit/hash da fonte,
revisão da tradução e commit da fonte revisada. Comparar esses commits permite
identificar revisão pendente sem alterar o manual original protegido. Não foi
criada uma segunda fonte oficial nem um gerenciador de traduções.

### Continuidade editorial e técnica

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
