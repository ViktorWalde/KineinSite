# Roadmap do KineinSite

Este documento descreve **o site**, não o cronograma de recursos da Kinein Vectis. O registro editorial original foi conferido em 2026-10-24. A continuidade da modernização foi reorganizada em 2026-11-12, sem prometer datas ou funcionalidades da IDE que ainda não foram validadas.

## Plano vigente de engenharia — 12 de novembro de 2026

O índice de execução é [modernizacao/README.md](modernizacao/README.md).
Ele reúne baseline, requisitos rastreáveis, decisões, dependências e critérios
de teste para HUD, início, documentação, busca, downloads, comunidade e i18n.
H1 foi documental; H2, A, B e C1 estão implementados, com prova de busca em C0.
A próxima unidade é D, download e instalação, após o gate de C1.
O backlog editorial abaixo continua como referência, sem substituir essa sequência.

## Entregue

### Busca global — 13 de novembro de 2026

C1 adota Pagefind 1.6.0 após a prova C0: índice do HTML público, consulta local
com worker da mesma origem, diálogo na HUD, estados reais e teclado/foco.
Registros e limites em [C1-BUSCA.md](modernizacao/C1-BUSCA.md). O mantenedor
autorizou publicar esta entrega ao finalizar o escopo; isso não constitui
aprovação visual de todos os pacotes nem autorização para os próximos.

### Rodada de UI em avaliação local — 12 de novembro de 2026

O mantenedor selecionou página inicial e documentação como próximo escopo.
A galeria foi antecipada, o beta passou a aparecer antes da prévia inclusive
sem JavaScript e o índice móvel da documentação tornou-se recolhível. A
grade do percurso C++ passou a usar o container responsivo já definido no CSS.
Evidências e testes em [LOCAL-PHASE-C-2026-11-12.md](LOCAL-PHASE-C-2026-11-12.md).

Esta rodada permanece local. A organização e o fluxo da HUD, a busca global
e a edição inglesa continuam como escopos seguintes; transparência é um recurso
seletivo, subordinado à usabilidade. Continuar o trabalho não autoriza
publicação; o fluxo está registrado em [AGENTS.md](../AGENTS.md).

### Entregas anteriores

- Site estático no GitHub Pages com página inicial, índice de documentação e um estudo de C++20.
- Distinção visual entre beta público, próxima versão em desenvolvimento e direção futura da IDE.
- Área de Atualizações com uma nota por versão publicada e a mais recente em destaque na página inicial.
- Temas claro, escuro e quente com três cores de destaque, sem exigir conta.
- Ondas de fundo discretas (2026-10-08): degradês que acompanham os tópicos da página inicial e campo contínuo nas demais páginas, com movimento lateral lento, cores ligadas ao tema e versão estática para movimento reduzido.
- Validação de tipos, estilos, formatação, HTML e links internos no build; publicação por `gh-pages`.
- Documentação técnica para colaboração e build local obrigatório antes da publicação.
- Revisão visual (2026-10-02): tokens de raio, movimento e elevação; cartões e rótulos unificados; cabeçalho fixo no desktop e compacto no celular; índice da documentação com a seção em leitura; transição nativa entre páginas; tema aplicado antes da primeira pintura; sem rolagem horizontal a 320 px.
- Dimensionamento fluido, camadas de CSS, animações sem JavaScript, degradês em OKLab, capturas reais da IDE, página 404, botão de copiar código e verificação de contraste WCAG no build (2026-10-02). As telas de 320 px, o contraste dos temas e o movimento reduzido, antes prioridade 1, foram conferidos.
- Guia da IDE em `/aprender/` (2026-10-02): oito capítulos, da instalação ao Git e aos erros, cada um reproduzido no AppImage 0.3.5 por um roteiro que roda os comandos do texto e gera as capturas.
- Segurança (2026-10-02): política de conteúdo (CSP) em todas as páginas, verificada no build e provada por mutação; dependências sem scripts de instalação; actions fixadas por SHA; deploy sem o PNG original de 2 MB. Detalhes e limites em [ARCHITECTURE.md](ARCHITECTURE.md#segurança).

- Apresentação do beta 0.3.5 e prévia real da 0.4 com capturas separadas, vídeo legendado e roteiro verificável.
- Estudos básicos de C, C++, Rust e Python, com exemplos e exercícios executados; critérios de ensino e revisão em [TEACHING.md](TEACHING.md).
- Troca rápida de tema corrigida, cor do navegador sincronizada e regressões de navegador reproduzíveis.
- Publicador sem dependência de rsync, com identificação do commit de origem e conferência dos arquivos públicos.

## Backlog editorial e operacional anterior — 24 de outubro de 2026

O direcionamento de 2026-10-24 previa expansão internacional a partir da linha 0.5. A especificação atual preserva as URLs e o suporte em português e prepara inglês americano sem duplicar a aplicação. A fundação e o histórico estão em [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md); os critérios vigentes estão no plano de engenharia. Nenhuma tradução incompleta será publicada para demonstrar suporte.

Implementado e autorizado para publicação após revisão local (2026-10-24): nova apresentação da página inicial, área Colabore com oportunidades independentes, integração com issues e contributors públicos, regras detalhadas de envio e créditos. O polimento inclui navegação móvel, transições coordenadas, fundo em SVG e vetores de repulsão no clique, com respeito à redução de movimento. A abertura comercial apresenta o foco em sistemas embarcados e convida a experimentar e participar. Operação e limites em [COLLABORATION.md](COLLABORATION.md).

| Prioridade | Trabalho                                                                                   | Condição para concluir                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1          | Recapturar o Guia da IDE na 0.4.                                                           | Rodar todos os roteiros no AppImage 0.4, ajustar texto e coordenadas onde a interface mudou, tirar os avisos que a 0.4 corrigir e conferir num desktop real.     |
| 2          | Continuar os estudos de C++ para software de IoT: entrada validada, módulos e CMake/CTest. | Compilar e executar os exemplos, testar casos de erro e registrar ferramenta, plataforma e data no guia.                                                         |
| 3          | Melhorar a navegação entre estudos e documentação quando houver mais conteúdo verificado.  | Cada cartão aponta para uma página distinta e útil; nenhum link leva a um capítulo vazio.                                                                        |
| 4          | Reativar a validação automática de pull requests.                                          | Confirmar que a conta pode iniciar jobs do GitHub Actions e que o workflow passa em um push e em um pull request. Até lá, usar `npm run build:pages` localmente. |
| 5          | Revisar os links externos essenciais.                                                      | Conferir os destinos a cada mudança de conteúdo; o build já confere os internos.                                                                                 |

Um estudo de MQTT local só será colocado como guia publicado depois de escolher e testar cliente, broker e versões. Guias de ROS 2, emulação ou fluxos novos da Vectis dependem de recursos reais da IDE; não entram no roadmap de entrega do site antes dessa validação.

Novas propostas podem entrar pelo [repositório do site](https://github.com/ViktorWalde/KineinSite/issues). Mudanças no estado da IDE devem ser apoiadas pela release, documentação oficial do projeto ou confirmação do mantenedor.
