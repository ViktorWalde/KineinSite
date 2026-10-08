---
title: "Python básico: do número ao resultado"
summary: "Continue no ola-python: calcule a média de duas temperaturas no main.py e confira o resultado no mesmo ambiente virtual."
language: "Python"
standard: "Python 3"
platform: "Arch Linux x86_64"
toolchain: "Python 3.14.7"
lastTested: 2026-10-08
status: verified
---

## Seu objetivo

O `ola-python` já executa um script. Agora ele vai calcular a média de 21 e 23 °C. Os valores são inventados para o exercício; você pode fazer tudo no computador, sem um sensor.

Continue com o projeto aberto na Vectis. Se ainda não o preparou, siga o [primeiro projeto em Python](../../../aprender/ide/primeiro-projeto-python/). Também é possível acompanhar só com um terminal e Python 3.

## Pense antes de executar

Quanto deve ser a média de 21 e 23? Faça a conta sem olhar a saída: some os dois valores e divida por dois. Essa previsão ajuda a conferir se o programa faz o que você pretendia.

## 1. Escreva um programa pequeno

No projeto `ola-python`, substitua somente o conteúdo de `main.py` pelo programa abaixo. Mantenha `ola_python/`, `tests/` e `.venv/`: o teste da função `saudacao` continua separado deste cálculo.

Se estiver acompanhando sem a IDE, crie um `main.py` numa pasta de exercícios.

```python
primeira = 21.0
segunda = 23.0
media = (primeira + segunda) / 2.0

print(f"media: {media:.2f} C")
```

## 2. Execute e confira

**Na Vectis 0.3.5:** salve com <kbd>Ctrl</kbd>+<kbd>S</kbd>, mantenha um terminal aberto (<kbd>Alt</kbd>+<kbd>F12</kbd>) e clique em **▶**. O projeto usa o Python do `.venv` preparado no tutorial.

**No terminal do projeto:**

```sh
.venv/bin/python main.py
```

**Se criou um arquivo avulso:** na pasta de `main.py`, execute:

```sh
python3 main.py
```

A saída deve ser exatamente:

```text
media: 22.00 C
```

O Python lê o arquivo indicado e executa o programa. Quando mudar o código, salve e repita o comando.

## 3. Entenda o que acabou de fazer

As atribuições associam os nomes `primeira`, `segunda` e `media` a valores. Os números com ponto têm tipo `float`. Os parênteses fazem a soma acontecer antes da divisão. `print` escreve uma linha; o prefixo `f` permite incluir expressões dentro do texto. `{media:.2f}` mostra o resultado com duas casas decimais.

O resultado acompanha sua previsão? Se não, confira os parênteses e os números. A unidade `C` é apenas texto de saída; o programa não faz conversão de unidade.

## 4. Mude uma coisa e teste

Troque somente `23.0` por `24.0`. Antes de rodar, calcule o novo resultado. Salve, execute: a saída deve mudar para `media: 22.50 C`.

Agora troque esse segundo valor por `20.0`. Você deve obter `media: 20.50 C`. Mudar uma entrada por vez facilita entender o efeito.

## Confira sem copiar

1. Por que a soma está entre parênteses?
2. O que muda se você alterar o segundo valor para `25.0`?
3. Como saber se está executando o arquivo que acabou de salvar?

<details>
<summary>Conferir seu raciocínio</summary>

A soma precisa acontecer antes da divisão. Com 21 e 25, a média é 23, exibida como `media: 23.00 C`. Salve e execute `main.py` de novo, pelo ▶, pelo Python do `.venv` ou pelo comando do arquivo avulso.

</details>

## Se algo der errado

- **Comando não encontrado:** confira se `python3` está instalado.
- **Arquivo não encontrado:** confira o nome e o diretório do arquivo.
- **Resultado diferente:** confira se salvou o código e se alterou somente o valor indicado.

## Continue praticando

Escolha outros dois valores e confira a conta antes de executar. Você continua no mesmo `main.py`. Os testes criados no primeiro tutorial verificam a função `saudacao`; eles ainda não verificam este cálculo de média.

## Para aprofundar

O [tutorial oficial de Python, na parte de números e textos](https://docs.python.org/3/tutorial/introduction.html), aprofunda as operações usadas aqui. Depois deste exercício, explore decisões e repetições para trabalhar com mais valores.
