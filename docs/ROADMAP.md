# Roadmap do KineinSite

Este documento descreve **o site**, não o cronograma de recursos da Kinein Vectis. Estado conferido em 2026-10-02. A ordem abaixo indica dependências editoriais e técnicas, sem prometer datas ou funcionalidades da IDE que ainda não foram validadas.

## Entregue

- Site estático no GitHub Pages com página inicial, índice de documentação e um estudo de C++20.
- Distinção visual entre beta público, próxima versão em desenvolvimento e direção futura da IDE.
- Área de Atualizações com uma nota por versão publicada e a mais recente em destaque na página inicial.
- Temas claro, escuro e quente com três cores de destaque, sem exigir conta.
- Validação de tipos, estilos, formatação, HTML e links internos no build; publicação por `gh-pages`.
- Documentação técnica para colaboração e build local obrigatório antes da publicação.
- Revisão visual (2026-10-02): tokens de raio, movimento e elevação; cartões e rótulos unificados; cabeçalho fixo no desktop e compacto no celular; índice da documentação com a seção em leitura; transição nativa entre páginas; tema aplicado antes da primeira pintura; sem rolagem horizontal a 320 px.
- Dimensionamento fluido, camadas de CSS, animações sem JavaScript, degradês em OKLab, capturas reais da IDE, página 404, botão de copiar código e verificação de contraste WCAG no build (2026-10-02). As telas de 320 px, o contraste dos temas e o movimento reduzido, antes prioridade 1, foram conferidos.
- Segurança (2026-10-02): política de conteúdo (CSP) em todas as páginas, verificada no build e provada por mutação; dependências sem scripts de instalação; actions fixadas por SHA; deploy sem o PNG original de 2 MB. Detalhes e limites em [ARCHITECTURE.md](ARCHITECTURE.md#segurança).

## Próximas entregas do site

| Prioridade | Trabalho | Condição para concluir |
| --- | --- | --- |
| 1 | Publicar o Guia básico da IDE. | Implementar a rota da coleção `aprender` e reproduzir instalação, interface e primeiro projeto na versão pública indicada, com comandos e resultados. |
| 2 | Continuar os estudos de C++ para software de IoT: entrada validada, módulos e CMake/CTest. | Compilar e executar os exemplos, testar casos de erro e registrar ferramenta, plataforma e data no guia. |
| 3 | Melhorar a navegação entre estudos e documentação quando houver mais conteúdo verificado. | Cada cartão aponta para uma página distinta e útil; nenhum link leva a um capítulo vazio. |
| 4 | Reativar a validação automática de pull requests. | Confirmar que a conta pode iniciar jobs do GitHub Actions e que o workflow passa em um push e em um pull request. Até lá, usar `npm run build:pages` localmente. |
| 5 | Revisar os links externos essenciais. | Conferir os destinos a cada mudança de conteúdo; o build já confere os internos. |

Um estudo de MQTT local só será colocado como guia publicado depois de escolher e testar cliente, broker e versões. Guias de ROS 2, emulação ou fluxos novos da Vectis dependem de recursos reais da IDE; não entram no roadmap de entrega do site antes dessa validação.

Novas propostas podem entrar pelo [repositório do site](https://github.com/ViktorWalde/KineinSite/issues). Mudanças no estado da IDE devem ser apoiadas pela release, documentação oficial do projeto ou confirmação do mantenedor.
