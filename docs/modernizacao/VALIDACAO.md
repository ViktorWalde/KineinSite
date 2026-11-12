# Estratégia de validação

## Pronto para começar um pacote

1. Identificar os requisitos do pacote e o problema reproduzido.
2. Ler os componentes atuais e seus consumidores; verificar se o recurso existe.
3. Registrar HEAD, alterações locais e evidência inicial. Preservar o trabalho
   anterior; não usar reset/checkout para obter artificialmente uma árvore limpa.
4. Definir solução mínima, contratos, risco e testes antes de editar.
5. Para conteúdo técnico, identificar fonte, versão e ambiente da prova.

Uma preferência visual pode orientar um candidato local, mas deve continuar
identificada como preferência e sujeita à avaliação do mantenedor.

## Comandos existentes

Executar na raiz. Confirmar `package.json` na revisão em uso; não copiar uma
lista antiga se os scripts mudarem legitimamente.

```bash
npm run check
npm run build:pages
CHROME_BIN=/caminho/do/chrome npm run check:browser
CHROME_BIN=/caminho/do/chrome npm run check:experience
```

`build:pages` já executa `check`; não é necessário repetir ambos sem mudança
de entrada. `check:examples` requer GCC/G++, Rust e Python e deve ser executado
quando exemplos/conteúdo técnico mudarem ou quando o publicador exigir.
Não modificar exemplos para compensar ferramenta ausente.

O ambiente atual usa `CHROME_BIN=/tmp/kinein-browser/chrome-linux64/chrome`.
É uma localização temporária, não uma dependência a fixar nos scripts.

| Mudança                     | Verificação direcionada                                            | Gate mais amplo                                                   |
| --------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Modelo documental H1        | Links locais, catálogo/âncoras no HTML, consistência e fingerprint | Build Pages para conferir o inventário; casos novos ficam para H2 |
| HUD, menus e tema           | Navegação, aparência, exclusão de peers, foco, resize e âncoras    | Build Pages, browser e experience nas páginas dependentes         |
| Home, imagem e demonstração | Versão, proporção, dimensões, lazy/prioridade, vídeo e teclado     | Build e suítes de mídia/conteúdo                                  |
| Documentação e manual       | Índices, consulta, texto, código, foco e hash                      | Build e suítes de manual/conteúdo/navegação                       |
| Busca                       | Índice real, consultas, URL/âncora, estados e CSP                  | Build com índice e browser da busca; não apenas mocks             |
| Download/instalação         | Release/assets, requisitos, integridade e percursos                | Links, conteúdo reproduzido e exemplos quando aplicável           |
| Comunidade/rodapé           | Fixtures de sucesso, vazio, cache, stale, erro e rate limit        | `check:collaboration`, navegador e links                          |
| i18n/SEO                    | Mensagens, equivalências, fallback, rotas diretas e metadados      | `check:i18n`, build, links e busca por idioma                     |
| CSS compartilhado           | Estados, temas, texto ampliado e consumidores                      | Contraste, CSS, arquitetura e amostra representativa              |

Quando um teste falhar, primeiro identificar causa e se o defeito já existia.
Só atualizar uma asserção quando o comportamento esperado mudar de propósito,
registrando o novo contrato. Não excluir o caso nem ampliar tolerâncias por conveniência.

## Matriz visual e responsiva

Larguras: **320, 375, 768, 1024, 1366 e 1920px**. Usar a área útil real,
altura declarada e fontes carregadas. Acrescentar altura baixa/paisagem quando
painéis ou mídia dependerem dela. Texto a 100%/200% e zoom do navegador são
verificações distintas; não substituir um pelo outro no relatório.

Páginas representativas: início, documentação, manual, instalação/primeiro
percurso, comunidade, atualizações e 404. Se existir download próprio ou
página inglesa válida, incluí-los. Todos os links internos continuam cobertos
pelo build, mesmo com uma amostra visual menor.

Temas: claro, escuro e warm; três destaques nos componentes de paleta.
Verificar superfícies sobre fundos reais, fallback opaco, contraste aumentado,
movimento reduzido e ausência de suporte quando houver ambiente apropriado.
Uma simulação de ramo CSS não equivale a testar um navegador antigo real.

### Capturas e comparação

- Reutilizar `scripts/lib/browser.mjs` e a infraestrutura existente; não
  instalar outra suíte só para produzir screenshots equivalentes.
- Fixar navegador, altura, escala, tema, tamanho de texto e fixtures.
- Aguardar fontes, imagem/vídeo relevante e estado esperado; não inserir
  sleeps longos para esconder ausência de sincronização.
- Reduzir movimento em comparações estáticas; testar movimento separadamente.
- Salvar candidatos fora das referências aprovadas. Screenshots atuais da
  baseline são evidência técnica, **não golden snapshots aprovados**.
- Comparar por componente/fluxo; distinguir mudança pretendida, ambiente,
  diferença de renderização e regressão. Definir tolerância somente após
  repetição estável no mesmo ambiente, com justificativa registrada.
- Atualizar referência apenas após revisão explícita do resultado concreto.

Playwright ou biblioteca de diff só entram se uma lacuna da infraestrutura
atual e o custo de manutenção forem demonstrados. Nenhuma nova ferramenta foi
instalada para este planejamento.

## Casos funcionais mínimos

### HUD

Abrir cada grupo com mouse, Enter e Space; conferir links e estado ativo.
Abrir outro e confirmar exclusão de peers. Escape interno deve preservar o
menu móvel; o segundo Escape fecha o móvel e restaura seu controle.
Testar clique fora, seleção, Tab/Shift+Tab, resize, texto ampliado, tema
persistido, âncoras e funcionamento sem JS. Não focar controles ocultos.

Para H2, os oráculos específicos estão em [H1-NAVEGACAO.md](H1-NAVEGACAO.md),
casos T01–T18. Cobrem rota exata separada de grupo/localização, capítulos,
404 servido sob caminho desconhecido, tradução ausente, duas instâncias com
IDs únicos, exclusão entre aparência/menu/grupos, seleção modificada e mapa
de foco no resize. Executar nas bases `/` e `/KineinSite/`, acrescentando
fronteiras ±1px às seis larguras. Preservar cobertura ao adaptar seletores
dos testes existentes; registrar resultados reais sem marcar casos do modelo
como aprovados antes da implementação.

### Busca

Testar consultas existentes no corpus, como CMake, Git, Python e atalhos,
conferindo o índice real antes de definir resultados esperados. Acrescentar
consulta sem correspondência, erro de carregamento, digitação rápida,
resultado antigo, teclado/toque, Escape/retorno de foco e URL com base.
Confirmar que não há requisição de pesquisa para terceiros. Atalho não deve
disparar durante edição ou composição de texto.

### Internacionalização e conteúdo

Conferir catálogo tipado e textos acessíveis, acesso direto às rotas,
equivalências e fallback declarado. Verificar `lang`, títulos, descrições,
canonical, Open Graph, alternates e sitemap somente para destinos reais.
Conferir data em UTC e rastreabilidade de versões/traduções. Idioma da UI não
comprova tradução do conteúdo editorial.

### Conteúdo técnico e integrações

Manter o hash do manual e reproduzir os exemplos alterados. Vídeos precisam
de versão, controles, ausência de áudio automático e alternativa textual.
Download deve ter destino oficial conferido, não só botão clicável.
Comunidade deve preservar timestamp, stale, cache, paginação e mensagens de
limite/erro, sem credenciais ou aumento arbitrário das consultas.

## Acessibilidade

Usar WCAG 2.2 AA como referência aplicável. Verificar HTML, sequência de
headings, nomes/estados acessíveis, contraste, foco, teclado, alvos, texto
ampliado e movimento reduzido. Complementar os testes automáticos com
leitor de tela e toque em ambiente disponível. Ausência de overflow não
comprova descoberta de todos os links nem conformidade integral.

## Performance

Registrar ambiente, build, cache frio/quente, rede/CPU, navegador, cenário e
repetições. Comparar a mesma operação e apresentar a dispersão/limitações.
Não mudar CSS ou dependências com base em uma hipótese de otimização.

| Medição                              | Método/limite                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| Bytes do build                       | Soma dos arquivos por tipo; não chamar de transferência da visita            |
| Transferência                        | Rede do navegador com cenário/cache declarados                               |
| LCP/FCP/CLS                          | Medição de laboratório identificada; verificar imagens e estabilidade        |
| TBT / execução JS / layouts e paints | Perfil do navegador e operação definida                                      |
| INP                                  | Distinguir dados reais de usuários de proxies locais de duração de interação |
| Frames/GPU/blur                      | Captura de performance em hardware descrito; não alegar FPS sem medição      |

LCP ≤2,5s, CLS ≤0,1 e INP ≤200ms são objetivos de experiência, não resultados
da baseline. Não adicionar telemetria para obter dados de campo sem autorização.
Nesta etapa só o tamanho do artefato e a geometria foram medidos.

## Pronto para encerrar um pacote

- Requisitos assumidos atendidos e evidências ligadas aos IDs.
- Checks pertinentes executados; falhas preexistentes e novas separadas.
- Diff revisado, sem dependência, abstração ou alteração incidental sem motivo.
- Segurança, manual, versão, i18n e consumidores preservados.
- Capturas candidatas disponíveis; limites de ambiente explícitos.
- Relatório com resumo, problemas, arquivos, justificativas, testes,
  acessibilidade, performance, i18n, regressões, pendências e próximo pacote.

Encerrar tecnicamente um pacote não o declara visualmente aprovado e não
autoriza commit remoto, push, publicação ou alteração de releases.

## Reprodução da H2

`check:i18n` inclui `check-hud.mjs`; `check:experience` inclui a suíte
`check-hud-browser.mjs`, sem retirar as suítes existentes. O harness aceita
`KINEIN_TEST_BASE=/` para testar um build sem base, e entrega HTML 404 no
caminho desconhecido quando a fixture específica é solicitada. Não executar
navegadores enquanto outro processo estiver substituindo `dist/`.

```bash
npm run build:pages
CHROME_BIN=/caminho/do/chrome npm run check:browser
CHROME_BIN=/caminho/do/chrome npm run check:experience
# Em rodada separada, depois de encerrar os consumidores do build Pages:
npm run build
KINEIN_TEST_BASE=/ CHROME_BIN=/caminho/do/chrome node scripts/check-hud-browser.mjs
# Restaurar a prévia Pages ao terminar:
npm run build:pages
```

O gate detalhado, geometria, capturas candidatas e limites estão em
[H2-HUD.md](H2-HUD.md). Nenhum teste atualiza uma referência visual aprovada.
