---
title: "C++20: processe telemetria local"
summary: "Evolua o mesmo projeto C++ para uma lista de temperaturas. Calcule a média por sensor e trate a falta de leituras."
language: "C++"
standard: "C++20"
platform: "Linux x86_64"
toolchain: "GCC 15.2.0"
lastTested: 2026-09-26
status: verified
---

## O que você vai construir

Um programa de linha de comando que recebe leituras simuladas de temperatura de dois sensores e mostra a média de um deles. Esse é um primeiro exercício da **camada de software de um sistema IoT**: organizar amostras, selecionar um dispositivo e lidar com a ausência de dados.

Depois da [média de duas temperaturas](../primeiros-passos/), você vai guardar várias leituras e escolher de qual sensor calcular a média. Há três novidades de C++ para explorar: uma coleção, uma função e um resultado que pode não existir.

Continue no projeto `ola-kinein`, na Vectis, com as ferramentas do primeiro tutorial. Também é possível acompanhar pelo terminal com `g++` e suporte a C++20. As amostras continuam inventadas: esta etapa ainda roda inteiramente no computador.

## Passo 1: escreva o programa

Abra o mesmo `src/main.cpp` e substitua o cálculo anterior pelo código abaixo. Salve antes de compilar. Você continua no mesmo projeto e não precisa alterar o `CMakeLists.txt`.

Se estiver usando apenas o terminal, substitua o conteúdo do seu `main.cpp`.

```cpp
#include <array>
#include <cstddef>
#include <iomanip>
#include <iostream>
#include <optional>
#include <span>
#include <string>
#include <string_view>

struct Leitura {
  std::string sensor;
  int milicelsius;
};

std::optional<double> media_celsius(
    std::span<const Leitura> leituras,
    std::string_view sensor) {
  double soma = 0.0;
  std::size_t quantidade = 0;

  for (const Leitura& leitura : leituras) {
    if (leitura.sensor == sensor) {
      soma += static_cast<double>(leitura.milicelsius) / 1000.0;
      ++quantidade;
    }
  }

  if (quantidade == 0) {
    return std::nullopt;
  }

  return soma / static_cast<double>(quantidade);
}

int main() {
  const std::array<Leitura, 4> leituras{{
      {"sala", 21500},
      {"externo", 19100},
      {"sala", 22000},
      {"sala", 21750},
  }};

  std::cout << std::fixed << std::setprecision(2);

  for (std::string_view sensor : {"sala", "patio"}) {
    const auto media = media_celsius(leituras, sensor);
    if (media) {
      std::cout << sensor << ": " << *media << " C\n";
    } else {
      std::cout << sensor << ": sem leituras\n";
    }
  }
}
```

Cada temperatura é armazenada como um inteiro em milésimos de grau Celsius: `21500` representa `21,5 °C`. A conversão para `double` acontece quando calculamos a média.

## Passo 2: compile e confira o resultado

**Na Vectis 0.3.5:** salve com <kbd>Ctrl</kbd>+<kbd>S</kbd>, compile com <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> e espere o sucesso no painel **Build**. Mantenha um terminal aberto (<kbd>Alt</kbd>+<kbd>F12</kbd>) e execute pelo **▶**, como na etapa anterior.

**Pelo terminal:** no diretório onde salvou `main.cpp`, execute:

```sh
g++ -std=c++20 -Wall -Wextra -Wpedantic -Werror main.cpp -o telemetria
./telemetria
```

Resultado esperado:

```text
sala: 21.75 C
patio: sem leituras
```

As três leituras da sala somam `65,25 °C`; divididas por três, produzem `21,75 °C`. O pátio não aparece nas amostras, então o programa informa que não há leituras em vez de dividir por zero.

Se o compilador disser que não conhece `std::span`, confirme se aceita `-std=c++20`. No GCC, essa opção seleciona o padrão C++20.

## Passo 3: entenda as escolhas de C++ moderno

- `std::array` mantém um conjunto pequeno e fixo de amostras neste exercício. Em uma aplicação que acumula amostras dinamicamente, `std::vector` é uma escolha mais adequada.
- `std::string` guarda o nome de cada sensor junto com a leitura. Já `std::string_view` recebe o nome usado na busca sem precisar criar outra string.
- `std::span<const Leitura>` permite percorrer as amostras sem copiá-las. É uma **visão**: o programa que chama a função continua responsável por manter as amostras vivas durante a chamada.
- `std::optional<double>` representa uma média que pode não existir. O código só acessa `*media` depois de verificar se há valor.

Os conceitos de interfaces explícitas, objetos que possuem seus dados e visões sem posse são desenvolvidos nas [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines). O uso de `std::span` passou a fazer parte da biblioteca em C++20, conforme os [documentos do comitê WG21](https://open-std.org/JTC1/SC22/WG21/docs/papers/2020/p2131r0.html). Este texto e o exemplo foram escritos para este guia; não reproduzem a documentação dessas fontes.

## Passo 4: faça três pequenas mudanças

1. Troque `"patio"` por `"externo"` no laço final. A segunda linha deve passar a mostrar `externo: 19.10 C`.
2. Adicione `{"sala", 22500}` ao fim das amostras e altere o tamanho de `std::array<Leitura, 4>` para `std::array<Leitura, 5>`. A média da sala deve passar a `21.94 C` após o arredondamento para duas casas.
3. Remova ou renomeie todas as leituras de `"sala"`. O programa deve mostrar `sala: sem leituras`.

Recompile e execute após cada mudança. Se o resultado for diferente, confira o nome do sensor, a quantidade de elementos do `std::array` e a unidade de cada valor.

## Próximos estudos

Você chegou ao fim deste percurso: seu `ola-kinein` foi de uma mensagem a um cálculo com várias leituras. Antes de acrescentar um dispositivo ou rede, pratique os exercícios e confira a saída. Este exemplo ainda não trata leituras inválidas nem o instante em que cada amostra foi obtida.

Para avançar por conta própria, uma boa tarefa é escrever testes para `media_celsius` com CTest e estudar como validar uma entrada recebida pelo programa.

Para aprofundar, consulte também a [documentação do GCC sobre padrões de linguagem](https://gcc.gnu.org/onlinedocs/gcc/Standards.html) e o [tutorial oficial de testes com CMake e CTest](https://cmake.org/cmake/help/latest/guide/tutorial/Testing%20and%20CTest.html).
