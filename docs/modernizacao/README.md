# Plano de engenharia da modernização

Este é o índice do planejamento do KineinSite. Consolida as especificações
de HUD 2.0 e Product Experience Modernization desta conversa, confrontadas
com a implementação real em 12 de novembro de 2026.

**Etapa atual: implementação incremental.** H1 foi concluído como engenharia
documental. H2, A e B têm implementação funcional local, conforme seus
registros. As alterações anteriores permanecem preservadas. Validação técnica
e avaliação visual são estados separados. B foi aprovado pelo mantenedor em
13 de novembro de 2026, com autorização de commit local; H2/A permanecem
pendentes de avaliação e polimento próprios.
C0 agora tem prova executável nas duas bases: Pagefind 1.6.0 viável com worker
de mesma origem, sem alteração da CSP. Adoção no produto e UI ficam em C1.

## Como ler

| Documento                                          | Pergunta respondida                                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| [BASELINE.md](BASELINE.md)                         | O que existe, como foi verificado e quais são os limites conhecidos?       |
| [ARQUITETURA.md](ARQUITETURA.md)                   | Quais decisões e contratos orientam a implementação?                       |
| [REQUISITOS-E-ACEITE.md](REQUISITOS-E-ACEITE.md)   | Como cada requisito se relaciona ao código e à sua evidência de conclusão? |
| [VALIDACAO.md](VALIDACAO.md)                       | Como executar verificações, comparar resultados e revisar cada entrega?    |
| [RELATORIO-ENGENHARIA.md](RELATORIO-ENGENHARIA.md) | O que foi concluído nesta etapa e o que permanece pendente?                |
| [H1-NAVEGACAO.md](H1-NAVEGACAO.md)                 | Qual foi o contrato documental de entrada da HUD?                          |
| [H2-HUD.md](H2-HUD.md)                             | Como a HUD foi implementada e validada localmente?                         |
| [A-PRODUTO.md](A-PRODUTO.md)                       | Qual foi a entrega do hero com captura real e sua evidência?               |
| [B-DOCUMENTACAO.md](B-DOCUMENTACAO.md)             | Quais lacunas de documentação foram implementadas e como foram verificadas? |
| [C0-BUSCA.md](C0-BUSCA.md)                         | Qual candidato passou na prova real de busca, com quais bytes e limites? |

Os registros [da fundação](../LOCAL-PREVIEW-2026-11-12.md) e
[da fase C local](../LOCAL-PHASE-C-2026-11-12.md) são históricos da execução.
Este plano organiza a continuidade; não os substitui nem considera todas
as suas alterações visualmente aprovadas.

## Situação real

| Área                      | Estado                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Design system e movimento | Implementados; reutilizar tokens, temas e redução de movimento                                                                             |
| HUD 2.0                   | H2 implementada localmente; gate técnico aprovado, aprovação visual pendente                                                               |
| Página inicial            | Galeria antecipada e beta primeiro, em avaliação local; hero com captura real em A, validação técnica aprovada e aprovação visual pendente |
| Documentação              | B implementado, validado e aprovado pelo mantenedor; índice contextual, cópia localizada e seção atual com texto ampliado; manual e percursos preservados |
| Busca global              | C0 comprovou Pagefind 1.6.0 com worker e CSP atual; índice de prova isolado, adoção e interface do produto pendentes em C1 |
| Download                  | Links para a release configurada e guia de instalação; sem página própria                                                                  |
| Comunidade e rodapé       | Integração pública do GitHub funcional e rodapé localizado; refinamento a avaliar                                                          |
| Internacionalização       | Catálogo tipado de UI e utilitários prontos; sem conteúdo inglês ou seletor publicado                                                      |
| Qualidade visual          | Capturas e testes funcionais existem; comparação com snapshots aprovados ainda não existe                                                  |

## Ordem de execução

Cada linha é uma entrega independente. O critério técnico deve passar antes
da próxima alteração dependente. Não se muda todo o site de uma vez.

| Ordem | Pacote                                        | Entrada                                    | Saída verificável                                                                       |
| ----- | --------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| 0     | Engenharia                                    | Código atual e especificações              | Baseline, requisitos, contratos, riscos e plano de testes documentados                  |
| H1    | Modelo da HUD — definido                      | Contratos H-01–H-04                        | [Catálogo, composição, contratos e casos de teste](H1-NAVEGACAO.md); entrega documental |
| H2    | HUD funcional — entregue localmente           | H1 e seu gate de entrada                   | Composição compartilhada desktop/mobile, grupos e aparência; testes e prévia local      |
| A     | Apresentação do produto — entregue localmente | HUD utilizável e conteúdo verificado       | Hero com captura real validado; galeria e percursos preservados                         |
| B     | Documentação — entregue localmente             | Inventário e alterações locais preservadas | Índice dos headings reais, cópia localizada, marcação corrigida e manual íntegro        |
| C0    | Prova técnica de busca — entregue localmente | H2, B e CSP atual                          | Pagefind com worker comprovado, corpus/consultas/bytes medidos e limites registrados |
| C1    | Busca global                                  | C0 aprovado tecnicamente                   | Índice real, interface funcional, teclado, estados e testes estáticos                   |
| D     | Download e instalação                         | Release oficial conferida                  | Versão/plataforma/requisitos corretos e caminho de primeira execução                    |
| E     | Comunidade e rodapé                           | Fluxos públicos existentes                 | Navegação complementar e contribuição claras; cache e limites preservados               |
| F0    | Contrato de conteúdo localizado               | Infraestrutura i18n existente              | Glossário, equivalências, revisão e detecção de tradução desatualizada                  |
| F1    | Conteúdo essencial bilíngue                   | C1, D, E e revisão técnica                 | Percurso completo nas rotas declaradas; seletor e SEO somente para conteúdo válido      |
| G     | Fechamento de qualidade                       | Evidências de cada pacote                  | Revisão integrada, limitações, diff final e prévia para avaliação                       |

D e E não dependem tecnicamente da busca. A ordem acima é a sequência
preferida para revisão; eles podem avançar separadamente se C0 revelar um
impedimento, sem expor um campo de pesquisa inoperante.

Qualidade e acessibilidade são verificadas em **cada** pacote; G não é a
primeira ocasião para testá-las. Conteúdo inglês não é liberado em lote sem
revisão, e o manual completo não é traduzido automaticamente.

## Controle de escopo

Antes de uma alteração, registrar: problema demonstrado, componente atual,
solução mínima, efeito nos consumidores, teste e limite da entrega. Uma
preferência estética deve ser apresentada como tal, sem inventar um defeito.

Mudança fora do pacote vai para a seção de pendências, com justificativa;
não entra silenciosamente no mesmo diff. Não se aumenta limite de arquitetura,
tolerância visual ou permissões da CSP para esconder uma falha.

As imagens fornecidas pelo mantenedor são referências conceituais, não
capturas reais da IDE nem requisitos funcionais aprovados. Cópias locais
estão em `test-results/engineering-2026-11-12/references/`, fora do build e
ignoradas pelo Git. Textos, plataformas, controles e exemplos ilustrativos
precisam de confirmação no código antes de uso no produto.

## Governança e publicação

O desenvolvimento e a avaliação permanecem locais. “Pode prosseguir”
autoriza continuar o trabalho, não fazer push ou publicar. Validação técnica,
aprovação visual e autorização de publicação são estados distintos.
As regras de [AGENTS.md](../../AGENTS.md) continuam valendo.

Não modificar releases ou código da IDE, criar tarefas no GitHub, enviar
mensagens à comunidade, instalar serviços ou adicionar telemetria como parte
deste plano. Links e textos de orientação podem ser preparados localmente.

## Próxima unidade de engenharia

H1 está documentado em [H1-NAVEGACAO.md](H1-NAVEGACAO.md): 16 links em quatro
grupos, CTA de download separado, composição compartilhada em duas instâncias
nativas, estados ativos distintos e casos T01–T18 para a implementação.
O fechamento documental não declara esses comportamentos implementados.

H2 e A tiveram fechamento técnico local, conforme [H2-HUD.md](H2-HUD.md) e
[A-PRODUTO.md](A-PRODUTO.md). A rodada foi encerrada a pedido do mantenedor,
sem iniciar B. Aprovação visual permanece pendente para ambos.

B foi implementado nesta continuação, conforme [B-DOCUMENTACAO.md](B-DOCUMENTACAO.md),
preservando H2/A e os percursos anteriores. O registro do pacote distingue
as verificações efetivas da aprovação visual concedida pelo mantenedor em
13 de novembro de 2026.

C0 foi executado em [C0-BUSCA.md](C0-BUSCA.md), sem instalar busca no produto.
A próxima unidade é C1: adotar a solução comprovada e implementar a interface
funcional, incluindo erro explícito quando o worker não funcionar. D, E,
F0, F1 e G continuam pendentes; idioma depende de conteúdo real.

## Retomada após o checkpoint

O [prompt da próxima sessão](PROXIMA-SESSAO.md) consolida as entregas B/C0,
a próxima unidade C1 e os limites de continuidade. O mantenedor autorizou um commit
local do estado consolidado; aprovação visual, push e publicação continuam
separados. B foi executado depois desse checkpoint, em 13 de novembro de 2026,
e seu commit local foi autorizado pelo mantenedor após a aprovação da entrega.
Esse commit de B é `dcf9287`. O mantenedor também solicitou o commit local
de C0 e a prévia para análise em 13 de novembro de 2026. Push e publicação
não foram autorizados; C1 continua como próxima unidade.
