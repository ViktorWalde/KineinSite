---
title: "Rust básico: do número ao resultado"
summary: "Continue no ola-rust: guarde duas temperaturas, calcule a média e execute pelo Cargo."
language: "Rust"
standard: "Rust 2024"
platform: "Arch Linux x86_64"
toolchain: "rustc 1.99.0"
lastTested: 2026-10-08
status: verified
---

## Seu objetivo

O `ola-rust` já imprime uma mensagem. Agora ele vai calcular a média de 21 e 23 °C. Os valores são inventados para o exercício; você pode fazer tudo no computador, sem um sensor.

Continue com o projeto aberto na Vectis. Se ainda não o criou, siga o [primeiro projeto em Rust](../../../aprender/ide/primeiro-projeto-rust/). Também é possível acompanhar só com um terminal e o Rust instalado.

## Pense antes de executar

Quanto deve ser a média de 21 e 23? Faça a conta sem olhar a saída: some os dois valores e divida por dois. Essa previsão ajuda a conferir se o programa faz o que você pretendia.

## 1. Escreva um programa pequeno

No mesmo projeto `ola-rust`, abra `src/main.rs`, substitua o conteúdo pelo programa abaixo e salve. Você não precisa mudar o `Cargo.toml`.

Se estiver acompanhando sem a IDE, crie um `main.rs` numa pasta de exercícios.

```rust
fn main() {
    let primeira: f64 = 21.0;
    let segunda: f64 = 23.0;
    let media = (primeira + segunda) / 2.0;

    println!("media: {media:.2} C");
}
```

## 2. Execute e confira

**Na Vectis 0.3.5:** salve com <kbd>Ctrl</kbd>+<kbd>S</kbd>, mantenha um terminal aberto (<kbd>Alt</kbd>+<kbd>F12</kbd>) e clique em **▶**. O Cargo recompila o que mudou antes de executar.

**No terminal do projeto:**

```sh
cargo run
```

**Se criou um arquivo avulso:** entre na pasta de `main.rs` e rode:

```sh
rustc --edition=2024 -D warnings main.rs -o media
./media
```

A saída deve ser exatamente:

```text
media: 22.00 C
```

No caminho com `rustc`, a primeira linha gera o executável `media` e a segunda o executa. No projeto `ola-rust`, `cargo run` cuida das duas etapas. Quando mudar o código, salve e execute novamente pelo caminho escolhido.

## 3. Entenda o que acabou de fazer

`fn main()` é a função de entrada. `let` cria uma variável que, por padrão, não pode receber outro valor depois. `f64` explicita um número de ponto flutuante de 64 bits. O Rust deduz o tipo de `media` a partir do cálculo. `println!` escreve uma linha; `{media:.2}` insere a média com duas casas decimais.

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

A soma precisa acontecer antes da divisão. Com 21 e 25, a média é 23, exibida como `media: 23.00 C`. Salve e repita `cargo run`, ou recompile com `rustc` antes de executar o arquivo avulso.

</details>

## Se algo der errado

- **Comando não encontrado:** confira se o compilador está instalado e acessível no terminal.
- **Arquivo não encontrado:** confira o nome e o diretório do arquivo.
- **Resultado diferente:** confira se salvou e recompilou o código e se alterou somente o valor indicado.

## Continue praticando

Antes de rodar, escolha outros dois valores e calcule a média no papel. Depois confira o resultado no `ola-rust`. Se quiser voltar aos comandos da IDE, o [tutorial do projeto](../../../aprender/ide/primeiro-projeto-rust/) explica o Cargo e os painéis da 0.3.5.

## Para aprofundar

O [livro oficial de Rust, no capítulo de tipos de dados](https://doc.rust-lang.org/book/ch03-02-data-types.html), explica os tipos numéricos usados aqui. Depois deste exercício, explore decisões e repetições para fazer o programa trabalhar com mais valores.
