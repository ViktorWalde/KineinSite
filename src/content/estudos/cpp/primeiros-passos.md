---
title: "C++ básico: do número ao resultado"
summary: "Continue no projeto ola-kinein: troque a mensagem por um cálculo de temperaturas, execute e confira como o resultado muda."
language: "C++"
standard: "C++20"
platform: "Arch Linux x86_64"
toolchain: "GCC 16.2.1"
lastTested: 2026-10-08
status: verified
---

## Seu objetivo

Seu `ola-kinein` já mostra uma mensagem no terminal. Agora ele vai calcular a média de duas temperaturas: 21 e 23 °C. Os valores são inventados para o exercício; você pode fazer tudo no computador, sem um sensor.

Continue com o projeto aberto na Vectis. Se ainda não o criou, siga o [primeiro projeto em C++](../../../aprender/ide/primeiro-projeto-cpp/). Também é possível fazer este exercício só com um terminal e um compilador C++.

## Pense antes de executar

Quanto deve ser a média de 21 e 23? Faça a conta sem olhar a saída: some os dois valores e divida por dois. Essa previsão ajuda a conferir se o programa faz o que você pretendia.

## 1. Escreva um programa pequeno

No mesmo projeto `ola-kinein`, abra `src/main.cpp`. Substitua o conteúdo pelo programa abaixo e salve. O `CMakeLists.txt` do primeiro tutorial continua servindo; você só vai mudar o código C++.

Se estiver acompanhando pelo terminal, crie um `main.cpp` numa pasta de exercícios.

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

**Na Vectis 0.3.5:**

1. Salve `src/main.cpp` com <kbd>Ctrl</kbd>+<kbd>S</kbd>.
2. Compile com <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> e espere o painel **Build** informar sucesso.
3. Mantenha um terminal aberto com <kbd>Alt</kbd>+<kbd>F12</kbd> e clique em **▶**. A saída aparece na aba de execução de `ola-kinein`.

**Pelo terminal:** entre na pasta que contém `main.cpp` (`src/`, se estiver usando o projeto do tutorial) e rode:

```sh
g++ -std=c++20 -Wall -Wextra -Wpedantic -Werror main.cpp -o media
./media
```

A saída deve ser exatamente:

```text
media: 22.00 C
```

No comando de terminal, a primeira linha gera um executável chamado `media` e a segunda o executa. Na IDE, o projeto continua se chamando `ola-kinein`. Nos dois caminhos, salve e compile de novo quando mudar o código.

## 3. Entenda o que acabou de fazer

A execução começa em `main`. `double` guarda números com parte fracionária; `const` impede alterar essas variáveis depois de inicializadas. Os parênteses somam as leituras antes da divisão. `std::cout` escreve a saída. `std::fixed` com `std::setprecision(2)` exibe duas casas decimais; `\n` encerra a linha. As duas casas alteram a apresentação, não a precisão do cálculo.

O resultado acompanha sua previsão? Se não, confira os parênteses e os números. A unidade `C` é apenas texto de saída; o programa não faz conversão de unidade.

## 4. Mude uma coisa e teste

Troque somente `23.0` por `24.0`. Antes de rodar, calcule o novo resultado. Salve, compile e execute: a saída deve mudar para `media: 22.50 C`.

Agora troque esse segundo valor por `20.0`. Você deve obter `media: 20.50 C`. Mudar uma entrada por vez facilita entender o efeito. Na IDE, continue usando o mesmo ciclo: salvar, compilar e executar.

## Confira sem copiar

1. Por que a soma está entre parênteses?
2. O que muda se você alterar o segundo valor para `25.0`?
3. Como saber se está executando o arquivo que acabou de salvar?

<details>
<summary>Conferir seu raciocínio</summary>

A soma precisa acontecer antes da divisão. Com 21 e 25, a média é 23, exibida como `media: 23.00 C`. Salve, espere a compilação terminar sem erros e execute de novo. Pelo terminal, rode o arquivo `media` que acabou de gerar; na IDE, use o ▶ do projeto `ola-kinein`.

</details>

## Se algo der errado

- **Comando não encontrado:** confira se o compilador está instalado e acessível no terminal.
- **Arquivo não encontrado:** confira o nome e o diretório do arquivo.
- **Resultado diferente:** confira se salvou e recompilou o código e se alterou somente o valor indicado.

## Continue com mais temperaturas

Você já fez o programa calcular dois valores. Na [próxima etapa](../telemetria-local/), o mesmo `src/main.cpp` passa a trabalhar com uma lista de leituras e com um sensor que ainda não tem dados. O projeto e os comandos de compilação da IDE continuam os mesmos.

## Para aprofundar

Os recursos usados aqui estão no [rascunho público do C++20 do WG21, em [basic.start.main], [expr.mul] e [std.manip]](https://open-std.org/JTC1/SC22/WG21/docs/papers/2020/n4861.pdf). O projeto criado pela Vectis usa C++23, que também aceita este exemplo.
