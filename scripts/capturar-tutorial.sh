#!/usr/bin/env bash
# Reproduz capítulos do Guia da IDE na IDE de verdade e gera as capturas.
#
#   bash scripts/capturar-tutorial.sh <AppImage> <capítulo>...
#   (capítulo = pasta em src/content/aprender, por exemplo ide/instalar)
#
# Cada capítulo tem um roteiro.txt ao lado do index.md, um passo por linha:
#
#   pasta <dir>             diretório (relativo à HOME de demonstração) onde os
#                           próximos blocos rodam; criado se não existir
#   bloco <n>               roda o n-ésimo bloco ```bash do index.md. Os comandos
#                           executados são os do próprio texto, não uma cópia
#   conferir <texto>        o último bloco precisa ter impresso <texto>
#   abrir [pasta]           abre a IDE (tela inicial, ou a pasta da HOME)
#   esperar <segundos>
#   tecla <combinação>      no formato do xdotool: ctrl+shift+a, Return, Escape
#   digitar <texto>
#   clicar <x> <y>          coordenadas na janela de 1600x1000
#   foto <nome> [x y l a]   salva capturas/<nome>.png, opcionalmente recortada
#   fechar                  encerra a IDE
#
# Coordenadas e recortes são sempre em pixels lógicos da janela de 1600x1000.
# A IDE roda com QT_SCALE_FACTOR=2 (KINEIN_SCALE muda): mesmo layout, o dobro
# de pixels, e as capturas ficam nítidas em telas HiDPI. A página mostra cada
# captura na largura da coluna (cerca de 800 px), então recortes bem mais
# estreitos que isso aparecem ampliados; inclua contexto em volta.
#
# A HOME de demonstração é descartável (KINEIN_DEMO_HOME, padrão
# /tmp/kinein-demo/home): nada toca na sua configuração. Requer xvfb (Xvfb),
# xdotool, ImageMagick (import, convert), curl e unzip, mais as ferramentas
# que cada capítulo usa (cmake, g++, git, clangd...).
set -euo pipefail

appimage="$(realpath "${1:?Informe o caminho do AppImage da Kinein Vectis.}")"
shift
[[ $# -gt 0 ]] || {
  echo "Informe ao menos um capítulo, como ide/instalar." >&2
  exit 1
}
repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
content_dir="$repo_dir/src/content/aprender"
demo_home="${KINEIN_DEMO_HOME:-/tmp/kinein-demo/home}"
width=1600
height=1000
scale="${KINEIN_SCALE:-2}"
[[ "$scale" =~ ^[1-4]$ ]] || {
  echo "KINEIN_SCALE precisa ser um inteiro de 1 a 4." >&2
  exit 1
}

for tool in Xvfb xdotool import convert curl unzip; do
  command -v "$tool" >/dev/null || {
    echo "Falta a ferramenta: $tool" >&2
    exit 1
  }
done

# Um display livre só para a reprodução.
display_number=90
while [[ -e "/tmp/.X11-unix/X$display_number" ]]; do
  display_number=$((display_number + 1))
done
export DISPLAY=":$display_number"
Xvfb "$DISPLAY" -screen 0 "$((width * scale))x$((height * scale))x24" >/dev/null 2>&1 &
xvfb_pid=$!
ide_pid=""
work="$(mktemp -d "${TMPDIR:-/tmp}/kinein-roteiro.XXXXXX")"
stop_ide() {
  if [[ -n "$ide_pid" ]]; then
    kill -- -"$ide_pid" 2>/dev/null || true
  fi
  ide_pid=""
}
cleanup() {
  stop_ide
  kill "$xvfb_pid" 2>/dev/null || true
  rm -rf -- "$work"
}
trap cleanup EXIT
sleep 1

# Blocos ```bash do capítulo, um arquivo por bloco: bloco-1.sh, bloco-2.sh...
extract_blocks() {
  awk -v out="$work/bloco-" '
    /^```bash/ { n++; inside = 1; next }
    inside && /^```$/ { inside = 0; next }
    inside { print > (out n ".sh") }
  ' "$1"
}

fail() {
  echo "ERRO no roteiro $chapter, linha $line_number: $*" >&2
  exit 1
}

run_chapter() {
  chapter="$1"
  local dir="$content_dir/$chapter"
  local script="$dir/roteiro.txt"
  [[ -f "$script" ]] || fail "não existe $script"
  rm -f "$work"/bloco-*.sh
  extract_blocks "$dir/index.md"
  mkdir -p "$dir/capturas"

  # HOME limpa por capítulo, com caminho fixo (ele aparece nas capturas).
  rm -rf -- "$demo_home"
  mkdir -p "$demo_home"
  local cwd="$demo_home" output="" window=""
  local env_vars=(
    "HOME=$demo_home"
    "XDG_CONFIG_HOME=$demo_home/.config"
    "XDG_DATA_HOME=$demo_home/.local/share"
    "XDG_CACHE_HOME=$demo_home/.cache"
    "PATH=$demo_home/.local/bin:$PATH"
    "KINEIN_APPIMAGE=$appimage"
    "APPIMAGE_EXTRACT_AND_RUN=1"
    "QT_SCALE_FACTOR=$scale"
  )

  line_number=0
  while IFS= read -r raw || [[ -n "$raw" ]]; do
    line_number=$((line_number + 1))
    local step="${raw%%#*}"
    step="${step%"${step##*[![:space:]]}"}"
    [[ -z "$step" ]] && continue
    read -r verb rest <<<"$step"
    case "$verb" in
      pasta)
        cwd="$demo_home/$rest"
        mkdir -p "$cwd"
        ;;
      bloco)
        local block="$work/bloco-$rest.sh"
        [[ -f "$block" ]] || fail "o index.md não tem o bloco bash $rest"
        echo "  bloco $rest em ${cwd#"$demo_home"/}"
        output="$(cd "$cwd" && env "${env_vars[@]}" bash -e "$block" 2>&1)" ||
          fail "o bloco $rest falhou:"$'\n'"$output"
        ;;
      conferir)
        grep -qF -- "$rest" <<<"$output" ||
          fail "esperava \"$rest\" na saída, veio:"$'\n'"$output"
        ;;
      abrir)
        local target=()
        [[ -n "$rest" ]] && target=("$demo_home/$rest")
        (cd "$demo_home" && exec setsid env "${env_vars[@]}" \
          "$appimage" "${target[@]}" >"$work/ide.log" 2>&1) &
        ide_pid=$!
        window="$(xdotool search --sync --onlyvisible --class kinein 2>/dev/null | head -1)" ||
          fail "a janela da IDE não apareceu"
        xdotool windowsize "$window" "$((width * scale))" "$((height * scale))" \
          windowmove "$window" 0 0
        ;;
      esperar)
        sleep "$rest"
        ;;
      tecla)
        xdotool windowfocus --sync "$window" 2>/dev/null || true
        # shellcheck disable=SC2086  # várias teclas separadas por espaço.
        xdotool key --clearmodifiers $rest
        ;;
      digitar)
        xdotool type --delay 60 -- "$rest"
        ;;
      clicar)
        read -r x y <<<"$rest"
        xdotool mousemove "$((x * scale))" "$((y * scale))" click 1
        ;;
      foto)
        read -r name x y w h <<<"$rest"
        local file="$dir/capturas/$name.png"
        import -window root "$work/tela.png"
        if [[ -n "${h:-}" ]]; then
          convert "$work/tela.png" \
            -crop "$((w * scale))x$((h * scale))+$((x * scale))+$((y * scale))" \
            +repage "$file"
        else
          cp "$work/tela.png" "$file"
        fi
        echo "  ${file#"$repo_dir"/}"
        ;;
      fechar)
        stop_ide
        sleep 1
        ;;
      *)
        fail "passo desconhecido: $verb"
        ;;
    esac
  done <"$script"
  stop_ide
  echo "$chapter: reproduzido."
}

for chapter in "$@"; do
  run_chapter "$chapter"
done
