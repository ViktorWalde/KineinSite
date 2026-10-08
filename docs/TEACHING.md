# Como escrevemos e revisamos os guias

Este site adapta práticas de aprendizagem ativa ao estudo individual. Não há afiliação, certificação ou endosso universitário. Não existe uma metodologia única demonstrada como a melhor para todos os públicos.

## Estrutura de uma lição

1. **Um resultado concreto:** diga o que a pessoa conseguirá fazer, com pré-requisitos e versão testada.
2. **Uma previsão:** peça para pensar no resultado antes de executar. Adaptado das demonstrações com previsão do [Poorvu Center de Yale](https://poorvucenter.yale.edu/teaching/teaching-resource-library/active-learning).
3. **Um exemplo pequeno:** apresente código completo, comandos executáveis e a saída esperada. Explique as escolhas depois da primeira execução.
4. **Uma mudança por vez:** avance de entender para modificar e conferir. A progressão de tarefas simples a mais complexas aparece nas orientações sobre [problem sets de Stanford](https://teachingcommons.stanford.edu/news/problem-sets).
5. **Recordação e retorno:** termine com perguntas que a pessoa responde sem copiar, seguidas de respostas conferíveis. A prática de recuperar o conteúdo é discutida por [Yale](https://poorvucenter.yale.edu/teaching/teaching-resource-library/active-learning); momentos curtos de reflexão são recomendados pelo [Bok Center de Harvard](https://bokcenter.harvard.edu/interactive-class-activities).

As fontes orientam o desenho editorial. Os exemplos e as explicações são autorais. Para iniciantes, evite hardware, rede e instalação de bibliotecas no primeiro exercício de linguagem. Mostre primeiro o ciclo de escrever, executar e conferir.

## Revisão obrigatória antes de publicar

- Confira fatos técnicos em fontes primárias: documentação oficial, release e código da versão indicada. Fixe links do manual da IDE na tag testada.
- Execute o código que está no Markdown e compare a saída integral. Execute também as mudanças propostas e casos de erro relevantes. `npm run check:examples` faz isso para os estudos atuais, sem executar comandos administrativos.
- Para fluxos de interface, reproduza os passos no executável indicado. Preserve o ambiente e a data da execução anterior quando a revisão não inclui uma nova reprodução completa.
- Confira cada captura ou cena de vídeo contra sua legenda. Informe versão, data e plataforma. Roteiro, título, promessa e resultado precisam concordar.
- Distinga capacidade demonstrada, capacidade documentada e plano futuro. Uma imagem de um painel não comprova uma integração com hardware.
- Confira links, acessibilidade, contraste, leitura a 320 px e movimento reduzido com o build e os testes de navegador.
- Publique apenas após esses checks. Conteúdo sem evidência fica como `draft` ou fora das páginas públicas; a data de teste não representa uma revisão editorial.

O [registro de revisão](REVIEW-2026-10-08.md) documenta a evidência desta entrega. O manual em `src/content/manual/` permanece uma cópia fiel da release, conferida por SHA-256; melhorias didáticas ficam nos guias autorais.
