---
title: "Git"
summary: "Transforme o projeto num repositório, faça o primeiro commit pela janela do Git, veja o que mudou e consulte o histórico."
order: 7
minutes: 15
ideVersion: "0.3.5"
platform: "Ubuntu 24.04 x86_64, X11 (Xvfb)"
lastTested: 2026-10-02
status: verified
prerequisites:
  - "O projeto ola-kinein do capítulo 2."
  - "Permissão de administrador (sudo) para instalar o Git."
references:
  - "https://github.com/ViktorWalde/KineinVectis/blob/v0.3.5/DocsPublic/manual.md"
  - "https://git-scm.com/book/pt-br/v2"
---

**Seu objetivo:** Guardar duas versões do projeto e explicar a diferença entre elas.

**Pense antes de seguir:** Um commit envia o projeto automaticamente para o GitHub?

O Git guarda versões do projeto: cada **commit** é uma fotografia dos arquivos, com uma mensagem dizendo o que mudou. A Kinein Vectis mostra o estado do Git na árvore, no editor e numa janela própria. Neste capítulo, o `ola-kinein` vira um repositório.

## Instale o Git e diga quem você é

```bash
sudo apt install git
git config --global user.name "Seu Nome"
git config --global user.email "voce@example.com"
git config --global init.defaultBranch main
```

As duas primeiras configurações vão em cada commit seu; use o seu nome e o seu e-mail. A terceira dá o nome `main` à branch principal dos repositórios novos. Confira a instalação:

```bash
git --version
```

## Crie o repositório

No terminal:

```bash
cd ~/projetos/ola-kinein
git init
```

A resposta começa com `Initialized empty Git repository`. Na 0.3.5, a IDE ainda não mostra nada: ela percebe o repositório novo na próxima vez que um arquivo do projeto muda, e é o que vai acontecer no passo seguinte. Para atualizar na hora, use **Git: Atualizar status** no <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd>.

## Diga ao Git o que ignorar

Antes do primeiro commit, decida o que **não** deve entrar no repositório. O `.gitignore` do projeto já ignora pastas de build, mas na 0.3.5 falta a pasta `.kinein`, onde a IDE guarda o build e os dados dela. Sem essa linha, o primeiro commit levaria o executável e centenas de arquivos gerados.

Abra o `.gitignore` na árvore e acrescente, no fim, a linha `/.kinein/`. Salve com <kbd>Ctrl</kbd>+<kbd>S</kbd>:

![O .gitignore aberto no editor com quatro linhas: /build/, /.cache/, /compile_commands.json e a nova /.kinein/](./capturas/gitignore.png)

_A quarta linha é a que você acrescentou._

Ao salvar, a IDE passa a mostrar o repositório:

![O cabeçalho com a branch main e o número 5 ao lado; na árvore, os arquivos do projeto em verde e a nova pasta .git em cinza](./capturas/repositorio.png)

_Verde na árvore: arquivos novos, que o Git ainda não guarda. O 5 conta as mudanças._

## Faça o primeiro commit

Clique em **main**, no cabeçalho. A janela do Git abre no lugar da árvore, na aba **Commit**, com a lista do que mudou. Marque a caixinha de cada arquivo, escreva a mensagem embaixo e clique em **Commit (5)**:

![A janela do Git com os cinco arquivos marcados, a mensagem Primeiro commit e o botão Commit (5); acima da mensagem, em vermelho, git diff falhou: fatal: bad revision 'HEAD'](./capturas/primeiro-commit.png)

_Só o que está marcado entra no commit._

> **O aviso vermelho antes do primeiro commit.** Na 0.3.5, um repositório ainda sem commits mostra `git diff falhou: fatal: bad revision 'HEAD'`. É só porque ainda não existe um commit para comparar; o commit funciona normalmente.

Depois do commit, a lista fica vazia e o número some do cabeçalho.

## Mude, compare e faça outro commit

A janela do Git ocupa o lugar da árvore. Para abrir o `main.cpp`, use <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd>, como no capítulo anterior. Troque o texto entre aspas por `Olá, Git!` e salve:

![O main.cpp com a linha 5 mudada e uma barra azul na calha ao lado dela; o cabeçalho mostra main com 1 mudança e a janela do Git lista main.cpp em azul](./capturas/modificado.png)

_Azul: arquivo e linha modificados desde o último commit._

Clique no nome do arquivo na janela do Git para ver exatamente o que mudou:

![O diff do main.cpp: a linha antiga em vermelho, com o sinal de menos, e a nova em verde, com o sinal de mais](./capturas/diff.png)

_Vermelho saiu, verde entrou. Esc volta ao editor._

Aperte <kbd>Esc</kbd>, marque o `main.cpp`, escreva `Muda a mensagem` e clique em **Commit (1)**.

## Veja o histórico

Na janela do Git, a aba **Log** lista os commits, do mais novo para o mais antigo:

![A aba Log com os dois commits, cada um com o identificador curto e a idade: Muda a mensagem, com o selo main, e Primeiro commit](./capturas/log.png)

_O selo main marca onde a branch está agora._

Clique num commit para ver, no editor, quem fez, quais arquivos mudaram e o que mudou em cada um:

![Os detalhes do commit Muda a mensagem: o autor, a tabela com src/main.cpp, uma linha a mais e uma a menos, e o patch](./capturas/commit.png)

_Os detalhes do último commit._

Pelo terminal, o mesmo histórico:

```bash
cd ~/projetos/ola-kinein
git log --oneline
```

As duas linhas são os seus commits, o mais novo em cima.

## Confira o que aprendeu

Sem reler as etapas, responda:

1. Um commit envia o projeto automaticamente para o GitHub?
2. Por que ignorar .kinein antes do primeiro commit?
3. O que o diff permite conferir antes de salvar uma versão?

<details>
<summary>Conferir seu raciocínio</summary>

Um commit guarda uma versão no repositório local; não faz push. Ignorar .kinein evita guardar build e estado local da IDE. O diff mostra as linhas removidas e adicionadas, para conferir o que entrará no commit.

</details>

Se uma resposta ainda não ficou clara, volte à etapa correspondente e confira na IDE. O resultado que você observa vale mais do que decorar um atalho.
