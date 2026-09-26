# Roadmap do KineinSite

Este documento descreve **o site**, não o cronograma de recursos da Kinein Vectis. Estado conferido em 2026-09-26. A ordem abaixo indica dependências editoriais e técnicas, sem prometer datas ou funcionalidades da IDE que ainda não foram validadas.

## Entregue

- Site estático no GitHub Pages com página inicial, índice de documentação e um estudo de C++20.
- Distinção visual entre beta público 0.2.0, desenvolvimento da 0.3.0 e direção futura da IDE.
- Temas claro, escuro e quente com três cores de destaque, sem exigir conta.
- Validação de tipos, estilos, formatação, HTML e links internos no build; publicação por `gh-pages`.
- Documentação técnica para colaboração e validação automática de pull requests.

## Próximas entregas do site

| Prioridade | Trabalho | Condição para concluir |
| --- | --- | --- |
| 1 | Revisar responsividade, contraste e navegação por teclado nas páginas existentes. | Conferir 320–390 px, 768 px e largura larga; painel de tema, foco e blocos de código sem conteúdo inacessível. Registrar defeitos reproduzíveis e corrigir os encontrados. |
| 2 | Melhorar a navegação entre estudos e documentação quando houver mais conteúdo verificado. | Cada cartão aponta para uma página distinta e útil; nenhum link leva a um capítulo vazio. |
| 3 | Publicar o Guia básico da IDE. | Implementar a rota da coleção `aprender` e reproduzir instalação, interface e primeiro projeto na versão pública indicada, com comandos e resultados. |
| 4 | Continuar os estudos de C++ para software de IoT: entrada validada, módulos e CMake/CTest. | Compilar e executar os exemplos, testar casos de erro e registrar ferramenta, plataforma e data no guia. |
| 5 | Reduzir os avisos de coesão de CSS e revisar links externos. | Separar responsabilidades sem mudar o comportamento visual; build sem erros e links externos essenciais conferidos. |

Um estudo de MQTT local só será colocado como guia publicado depois de escolher e testar cliente, broker e versões. Guias de ROS 2, emulação ou fluxos novos da Vectis dependem de recursos reais da IDE; não entram no roadmap de entrega do site antes dessa validação.

Novas propostas podem entrar pelo [repositório do site](https://github.com/ViktorWalde/KineinSite/issues). Mudanças no estado da IDE devem ser apoiadas pela release, documentação oficial do projeto ou confirmação do mantenedor.
