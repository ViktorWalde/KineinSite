---
title: "Python básico: do número ao resultado"
summary: "Calcule uma média de duas temperaturas, confira a saída e faça uma pequena mudança. Um primeiro exercício sem hardware ou bibliotecas externas."
language: "Python"
standard: "Python 3"
platform: "Arch Linux x86_64"
toolchain: "Python 3.14.7"
lastTested: 2026-10-08
status: verified
---

## Seu objetivo

Ao terminar, você conseguirá guardar dois números, calcular uma média e mostrar o resultado. As temperaturas são dados inventados para aprender: 21 e 23 °C. Este programa não lê sensores físicos.

Você precisa de um terminal e de Python 3 instalado. Não é necessário instalar bibliotecas. Se estiver começando do zero, leia cada etapa e execute antes de seguir.

## Pense antes de executar

Quanto deve ser a média de 21 e 23? Faça a conta sem olhar a saída: some os dois valores e divida por dois. Essa previsão ajuda a conferir se o programa faz o que você pretendia.

## 1. Escreva um programa pequeno

Crie `main.py` e copie:

```python
primeira = 21.0
segunda = 23.0
media = (primeira + segunda) / 2.0

print(f"media: {media:.2f} C")
```

## 2. Execute e confira

No terminal, dentro da pasta do arquivo:

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

A soma precisa acontecer antes da divisão. Com 21 e 25, a média é 23, exibida como `media: 23.00 C`. Salve e execute `python3 main.py` na pasta desse arquivo.

</details>

## Se algo der errado

- **Comando não encontrado:** confira se `python3` está instalado.
- **Arquivo não encontrado:** confira o nome e o diretório do arquivo.
- **Resultado diferente:** confira se salvou o código e se alterou somente o valor indicado.

## Leve para a Vectis

O [primeiro projeto em Python](../../../aprender/ide/primeiro-projeto-python/) mostra como criar o projeto, abrir o código e executar na **Kinein Vectis 0.3.5**. Use este estudo para entender a linguagem; o tutorial da IDE ensina os botões e os limites daquela versão.

## Para aprofundar

Este é um texto autoral. A referência técnica é o [tutorial oficial de Python, números e textos](https://docs.python.org/3/tutorial/introduction.html). O próximo passo é entender decisões e repetições; deixe integração com dispositivos para depois de dominar o ciclo de escrever, executar e conferir.
