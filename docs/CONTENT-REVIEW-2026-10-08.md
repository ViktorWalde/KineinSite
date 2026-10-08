# Curadoria de conteúdo e tipografia

Revisão local de 8 de outubro de 2026, sobre o site após `4fd8c77`. O mantenedor aprovou o resultado local e autorizou sua publicação. O beta público continua sendo a **0.3.5 para Linux x86_64**; a **0.4 está em desenvolvimento**, com interface e embarcados no mesmo lançamento, conforme o mantenedor.

## Critério de revisão

A página inicial, a documentação, os oito guias autorais, os cinco estudos e as duas notas de versão foram lidos para conferir promessa, instrução, exemplo e resultado. As afirmações sobre o beta foram comparadas à tag `v0.3.5`, sem usar mudanças não publicadas da IDE como evidência do beta. O repositório da IDE foi apenas consultado.

O manual mantém o corpo original da release e o SHA-256 registrado. A edição do site cuida de sua apresentação, índice e leitura; não transforma todas as integrações descritas no manual em fluxos reproduzidos nesta máquina.

A seção “O layout” usa a captura real de `aprender/ide/conhecer-a-tela`, conferida visualmente: janela do beta 0.3.5 com menus, trilho, árvore de arquivos, editor, terminal e barra de status. A data original da captura permanece visível. Essa substituição ocorre somente na apresentação, preserva os textos e não utiliza a interface em desenvolvimento da 0.4 para representar o beta.

## Correções de informação

| Assunto                  | Ajuste                                                                                                                                  | Evidência                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Beta e prévia            | Download, rodapé e metadados distinguem a versão disponível da 0.4 em preparação.                                                       | Release `v0.3.5`, capturas e gravações identificadas por versão; escopo da 0.4 informado pelo mantenedor.    |
| IoT                      | “Parcial no beta” passa a indicar o exercício realmente disponível: leituras simuladas, média e ausência de dados.                      | Programa e exercícios de `telemetria-local.md`; sem hardware, rede ou validação de leituras inválidas.       |
| Remote SSH               | Explica perfil preenchido a partir da linha SSH, autenticação por chave e espelho local por rsync.                                      | Manual da tag, seção “Alvo remoto (SSH)”; interpretar uma linha preenche campos, não elimina a configuração. |
| Bancos e Grafana         | Descreve consultas e serviços externos, com configuração no ambiente. Dashboards abrem no navegador.                                    | Manual da tag, seções Banco e Observabilidade; clientes de dados no código da versão.                        |
| C++                      | Substitui “avisos no máximo” por avisos rigorosos e `-Werror`. Preserva salvar → compilar → executar.                                   | Template em `crates/kinein-core/src/workspace/create.rs` e fluxo já reproduzido na 0.3.5.                    |
| CMake                    | Informa 3.25 ou mais novo para usar os presets incluídos. O mínimo declarado pelo `CMakeLists.txt` continua sendo 3.24.                 | Template da tag usa formato de presets 6; a documentação de CMake registra esse formato a partir da 3.25.    |
| Rust                     | Distingue ferramentas em `.rustup`, cache em `.cargo`, arquivos principais e saída de compilação em `target`.                           | Documentação oficial de Cargo e rustup; criação de projeto Cargo na IDE.                                     |
| Python                   | Explica o suporte de `python3-venv` e o comando que cria o ambiente. O estudo calcula a média de temperaturas.                          | Documentação oficial de `venv` e código do estudo.                                                           |
| Git, busca e diagnóstico | Números de linha, quantidade de resultados e contagem do botão Commit são exemplos da captura. O leitor pode continuar com seu cálculo. | Capturas dos guias e código atual dos percursos; a alteração do texto da saída preserva o cálculo.           |
| Compatibilidade com 0.2  | Troca a garantia geral “sem perda” pelo resultado registrado para um workspace.                                                         | Changelog da tag `v0.3.5`, registro de compatibilidade.                                                      |
| Instalação               | Informa escrita na pasta pessoal, sem sudo, em vez de prometer nenhuma alteração no sistema.                                            | Instalador e reprodução original do pacote da release.                                                       |

## Leitura e apresentação

- Títulos têm escala e largura mais equilibradas; parágrafos e cartões usam textos curtos, com benefícios concretos.
- Rótulos partem de 12 px e textos auxiliares de 15 px com a configuração padrão do navegador. A escala usa `rem` para acompanhar a preferência de tamanho de texto.
- Os guias destacam objetivo e previsão antes das instruções. Exercícios e referências têm títulos próprios; o CSS não numera cada seção como se fosse uma etapa.
- No celular, o índice do guia separa o percurso do projeto das consultas, em duas listas horizontais. O texto principal aparece sem atravessar uma lista alta de capítulos.
- A prévia 0.4 recebe largura de leitura, espaçamento de artigo e roteiro organizado. Guias, estudos, notas e manual mantêm hierarquia consistente entre título, resumo e metadados.
- As tabelas dos guias preservam o tamanho de texto no celular. Blocos de código e tabelas do manual continuam com rolagem própria quando necessário.

## Fontes consultadas

- [Release pública 0.3.5](https://github.com/ViktorWalde/KineinVectis/releases/tag/v0.3.5), conferida também pela API pública do GitHub em 8 de outubro.
- [Manual na tag 0.3.5](https://github.com/ViktorWalde/KineinVectis/blob/v0.3.5/DocsPublic/manual.md), [changelog da tag](https://github.com/ViktorWalde/KineinVectis/blob/v0.3.5/CHANGELOG.md) e código local da mesma tag. O cabeçalho do changelog ainda descreve uma candidata não lançada; a disponibilidade pública foi conferida na release.
- [Cargo Home](https://doc.rust-lang.org/cargo/guide/cargo-home.html), [cargo new](https://doc.rust-lang.org/cargo/commands/cargo-new.html) e [perfis de rustup](https://rust-lang.github.io/rustup/concepts/profiles.html).
- [Ambientes virtuais de Python](https://docs.python.org/3/library/venv.html) e [avisos do GCC](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html).
- [Versões do formato de CMake Presets](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html#versions).

As versões e datas dos testes originais foram preservadas. A revisão editorial não representa uma nova reprodução integral dos oito guias na interface, nem um teste de placas ou serviços externos. As gravações e fotos serão revistas na etapa de mídias solicitada pelo mantenedor.

## Validação desta revisão

- `npm run build:pages`, com Node.js 24.21.0: 23 páginas, tipos, lint, CSS, arquitetura, contraste, integridade do manual, formatação, HTML, links internos e CSP aprovados. Permanecem os três hints anteriores de `define:vars`.
- `npm run check:examples`: os cinco estudos e suas variações de exercício produziram as saídas esperadas.
- `npm run check:browser`: 23 páginas a 320, 768 e 1440 px; oito páginas com texto ampliado a 200%, nas mesmas larguras. O teste confere também que o texto principal cabe no espaço visível, além do overflow da página.
- Temas, movimento reduzido, seletores, teclado, galeria, manual e reprodução dos vídeos passaram na mesma suíte.
- Revisão visual por capturas em celular e notebook, nos temas claro e escuro. Servidor local conferido na página inicial, no manual e no guia de Git, sem erro de console ou overlay do Astro.

As capturas e o relatório de navegador ficam em `test-results/browser/`, fora do Git. Durante a revisão local, não houve commit, push ou deploy. A publicação foi autorizada pelo mantenedor após a aprovação do resultado.
