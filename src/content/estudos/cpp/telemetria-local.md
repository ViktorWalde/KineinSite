---
title: "C++20: processe telemetria local"
summary: "Comece com dados simulados de sensores e calcule uma média sem depender de hardware, rede ou bibliotecas externas."
language: "C++"
standard: "C++20"
platform: "Linux x86_64"
toolchain: "GCC 15.2.0"
lastTested: 2026-09-26
status: verified
---

## O que você vai construir

Um programa de linha de comando que recebe leituras simuladas de temperatura de dois sensores e mostra a média de um deles. Esse é um primeiro exercício da **camada de software de um sistema IoT**: organizar amostras, selecionar um dispositivo e lidar com a ausência de dados.

O exemplo roda no Linux com um compilador C++20. Ele não lê sensores físicos, não se conecta a um broker e não depende de recursos da Kinein Vectis. Os guias de projeto na IDE serão escritos após testar o fluxo na versão pública correspondente.

Você precisa de um terminal e do `g++` com suporte a C++20. Confira com `g++ --version`.

## Passo 1: escreva o programa

Crie um arquivo chamado `main.cpp` com o código abaixo:

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

No diretório onde salvou `main.cpp`, execute:

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

O próximo passo é validar entradas que chegam de fora do programa e separar o cálculo em uma função testada com CTest. Só depois faz sentido acrescentar rede, MQTT e integração com a IDE. Este exemplo ainda não trata leituras inválidas, tempo das amostras, perda de mensagens ou armazenamento contínuo.

Para aprofundar, consulte também a [documentação do GCC sobre padrões de linguagem](https://gcc.gnu.org/onlinedocs/gcc/Standards.html) e o [tutorial oficial de testes com CMake e CTest](https://cmake.org/cmake/help/latest/guide/tutorial/Testing%20and%20CTest.html).
