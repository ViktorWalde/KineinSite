#!/usr/bin/env bash
# Gera as capturas reais da IDE exibidas no site (assets/ide/*.png) a partir
# de um AppImage publicado, sem tela (Xvfb) e sem tocar na sua configuração:
# HOME, XDG e o projeto de demonstração vivem num diretório temporário.
#
#   bash scripts/capturar-ide.sh <caminho/do/AppImage>
#   bash scripts/capturar-ide.sh <executavel-de-desenvolvimento> --preview
#
# Depois, atualize version e capturedAt em src/data/ide-screens.ts.
# Requer: xvfb-run, cmake, g++, git e clangd (sem ele a captura mostra o
# servidor de linguagem ausente, o que não é o uso normal). O projeto de
# demonstração é o programa do estudo de C++20 do site (src/content/estudos/cpp/telemetria-local.md),
# extraído do próprio Markdown para não existir uma segunda cópia do código.
set -euo pipefail

executable="$(realpath "${1:?Informe o caminho do executável da Kinein Vectis.}")"
repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="$repo_dir/assets/ide"
if [[ "${2:-}" == --preview ]]; then
  out_dir="$out_dir/desenvolvimento"
elif [[ -n "${2:-}" ]]; then
  echo 'O único segundo argumento aceito é --preview.' >&2
  exit 1
fi
study="$repo_dir/src/content/estudos/cpp/telemetria-local.md"

for tool in xvfb-run cmake g++ git clangd; do
  command -v "$tool" >/dev/null || {
    echo "Falta a ferramenta: $tool" >&2
    exit 1
  }
done

# Caminho fixo: ele aparece na barra de status e no log de build das
# capturas, então não pode ter sufixo aleatório. A marca garante que só uma
# pasta criada por este script é apagada.
work="${TMPDIR:-/tmp}/kinein-demo"
marker="$work/.capturar-ide"
if [[ -e "$work" && ! -e "$marker" ]]; then
  echo "$work existe e não foi criado por este script; remova-o antes." >&2
  exit 1
fi
rm -rf -- "$work"
mkdir -p "$work"
touch "$marker"
trap 'rm -rf -- "$work"' EXIT
project="$work/telemetria"
mkdir -p "$project/src" "$project/.kinein" "$work/home" "$work/runtime" "$out_dir"
chmod 700 "$work/runtime"

# Primeiro bloco ```cpp do estudo = src/main.cpp do projeto.
awk '/^```cpp$/ { inside = 1; next } inside && /^```$/ { exit } inside' \
  "$study" >"$project/src/main.cpp"
[[ -s "$project/src/main.cpp" ]] || {
  echo "Não achei o bloco C++ em $study" >&2
  exit 1
}

cat >"$project/CMakeLists.txt" <<'CMAKE'
cmake_minimum_required(VERSION 3.20)
project(telemetria LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(telemetria src/main.cpp)
target_compile_options(telemetria PRIVATE -Wall -Wextra -Wpedantic)
CMAKE

# Um repositório com histórico e uma mudança pendente (o cabeçalho da IDE
# mostra a branch e quantas mudanças há).
git -C "$project" init -q
git -C "$project" -c user.name="Kinein Vectis" \
  -c user.email="demo@kinein.invalid" add CMakeLists.txt src/main.cpp
git -C "$project" -c user.name="Kinein Vectis" \
  -c user.email="demo@kinein.invalid" commit -qm "Telemetria local em C++20"
printf '\n# Saída do build\nbuild/\n' >"$project/.gitignore"

# Sessão do editor: a IDE reabre estas abas (formato .kinein/session.json).
cat >"$project/.kinein/session.json" <<'SESSION'
{"schemaVersion":1,"openFiles":["src/main.cpp","CMakeLists.txt"],"activeFile":"src/main.cpp"}
SESSION

capture() {
  local name="$1" commands="$2" target="${3:-$out_dir/$1.png}"
  local log="$work/$1.log"
  HOME="$work/home" XDG_CONFIG_HOME="$work/home/.config" \
    XDG_DATA_HOME="$work/home/.local/share" XDG_CACHE_HOME="$work/home/.cache" \
    XDG_RUNTIME_DIR="$work/runtime" \
    RUSTUP_HOME="${RUSTUP_HOME:-$HOME/.rustup}" CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}" \
    APPIMAGE_EXTRACT_AND_RUN=1 KINEIN_DETACHED=1 QT_QPA_PLATFORM=xcb \
    KINEIN_STARTUP_COMMANDS="$commands" \
    KINEIN_SCREENSHOT="$target" KINEIN_SCREENSHOT_SIZE=1600x1000 \
    KINEIN_SCREENSHOT_DELAY_MS=9000 KINEIN_PERF_EXIT=1 \
    timeout 180 xvfb-run -a -s "-screen 0 1700x1100x24" \
    "$executable" --wait "$project" >"$log" 2>&1 || true
  if [[ ! -s "$target" ]]; then
    echo "A captura $name falhou; log:" >&2
    cat "$log" >&2
    exit 1
  fi
  echo "${target#"$repo_dir"/}"
}

# Aquecimento, descartado: na primeira abertura o clangd sobe antes de o
# configure do CMake gerar o compile_commands.json, analisa sem -std=c++20 e
# marca erros falsos (std::span). É o que o manual descreve; na segunda
# abertura o clangd já usa os flags reais.
capture aquecimento "" "$work/aquecimento.png"

# editor: código aberto e o build concluído no painel de baixo.
# ambiente: a aba Ferramentas com o que a IDE detectou e o que falta.
capture editor "build.run"
capture ambiente "tools.status"
