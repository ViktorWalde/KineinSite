---
title: "C++ básico: do número ao resultado"
summary: "Calcule uma média de duas temperaturas, confira a saída e faça uma pequena mudança. Um primeiro exercício sem hardware ou bibliotecas externas."
language: "C++"
standard: "C++20"
platform: "Arch Linux x86_64"
toolchain: "GCC 16.2.1"
lastTested: 2026-10-08
status: verified
---

## Seu objetivo

Ao terminar, você conseguirá guardar dois números, calcular uma média e mostrar o resultado. As temperaturas são dados inventados para aprender: 21 e 23 °C. Este programa não lê sensores físicos.

Você precisa de um terminal e de um compilador de C++ instalado. Não é necessário instalar bibliotecas. Se estiver começando do zero, leia cada etapa e execute antes de seguir.

## Pense antes de executar

Quanto deve ser a média de 21 e 23? Faça a conta sem olhar a saída: some os dois valores e divida por dois. Essa previsão ajuda a conferir se o programa faz o que você pretendia.

## 1. Escreva um programa pequeno

Crie `main.cpp` e copie:

```cpp
#include <iomanip>
#include <iostream>

int main() {
    const double primeira = 21.0;
    const double segunda = 23.0;
    const double media = (primeira + segunda) / 2.0;

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "media: " << media << " C\n";
}
```

## 2. Execute e confira

No terminal, dentro da pasta do arquivo:

```sh
g++ -std=c++20 -Wall -Wextra -Wpedantic -Werror main.cpp -o media
./media
```

A saída deve ser exatamente:

```text
media: 22.00 C
```

A primeira linha compila o código e gera o executável `media`. A segunda roda esse arquivo. Quando mudar o código, compile de novo antes de executar.

## 3. Entenda o que acabou de fazer

A execução começa em `main`. `double` guarda números com parte fracionária; `const` impede alterar essas variáveis depois de inicializadas. Os parênteses somam as leituras antes da divisão. `std::cout` escreve a saída. `std::fixed` com `std::setprecision(2)` exibe duas casas decimais; `\n` encerra a linha. As duas casas alteram a apresentação, não a precisão do cálculo.

O resultado acompanha sua previsão? Se não, confira os parênteses e os números. A unidade `C` é apenas texto de saída; o programa não faz conversão de unidade.

## 4. Mude uma coisa e teste

Troque somente `23.0` por `24.0`. Antes de rodar, calcule o novo resultado. Salve, compile e execute: a saída deve mudar para `media: 22.50 C`.

Agora troque esse segundo valor por `20.0`. Você deve obter `media: 20.50 C`. Mudar uma entrada por vez facilita entender o efeito.

## Confira sem copiar

1. Por que a soma está entre parênteses?
2. O que muda se você alterar o segundo valor para `25.0`?
3. Como saber se está executando o arquivo que acabou de salvar?

<details>
<summary>Conferir seu raciocínio</summary>

A soma precisa acontecer antes da divisão. Com 21 e 25, a média é 23, exibida como `media: 23.00 C`. Salve, compile novamente sem erros e execute o arquivo `media` gerado na mesma pasta.

</details>

## Se algo der errado

- **Comando não encontrado:** confira se o compilador está instalado e acessível no terminal.
- **Arquivo não encontrado:** confira o nome e o diretório do arquivo.
- **Resultado diferente:** confira se salvou e recompilou o código e se alterou somente o valor indicado.

## Leve para a Vectis

O [primeiro projeto em C++](../../../aprender/ide/primeiro-projeto-cpp/) mostra como criar o projeto, abrir o código e executar na **Kinein Vectis 0.3.5**. Use este estudo para entender a linguagem; o tutorial da IDE ensina os botões e os limites daquela versão.

## Para aprofundar

Este é um texto autoral. A referência técnica é o [rascunho público do C++20 do WG21, em [basic.start.main], [expr.mul] e [std.manip]](https://open-std.org/JTC1/SC22/WG21/docs/papers/2020/n4861.pdf). O próximo passo é entender decisões e repetições; deixe integração com dispositivos para depois de dominar o ciclo de escrever, executar e conferir.
