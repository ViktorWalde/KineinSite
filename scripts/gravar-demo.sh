#!/usr/bin/env bash
# Grava a IDE real em um display e perfil descartáveis. Não captura a sua tela.
# Uso: bash scripts/gravar-demo.sh <executável de desenvolvimento>
#      bash scripts/gravar-demo.sh <AppImage 0.3.5> --beta
set -euo pipefail
executable="$(realpath "${1:?Informe o executável de desenvolvimento.}")"
repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
duration=42
output_name=vectis-0-4-desenvolvimento
arguments=(--wait)
commands='@passo=6000,build.run,terminal.open,run.start,tools.status,git.log,terminal.open'
if [[ "${2:-}" == --beta ]]; then
  duration=24
  output_name=vectis-0-3-5-beta
  arguments=()
  commands=''
elif [[ -n "${2:-}" ]]; then
  echo 'O segundo argumento só pode ser --beta.' >&2; exit 1
fi
for tool in Xvfb xdotool ffmpeg ffprobe cmake g++ git clangd; do
  command -v "$tool" >/dev/null || { echo "Falta: $tool" >&2; exit 1; }
done
work="$(mktemp -d "${TMPDIR:-/tmp}/kinein-video.XXXXXXXX")"
project="$work/primeiro-projeto"
mkdir -p "$project/src" "$project/.kinein" "$work/home" "$work/runtime" "$repo_dir/public/videos"
chmod 700 "$work/runtime"
printf 'PS1="vectis-demo$ "\n' >"$work/home/.bashrc"
ide_pid=""; xvfb_pid=""; recorder_pid=""
cleanup() {
  [[ -z "$recorder_pid" ]] || kill "$recorder_pid" 2>/dev/null || true
  [[ -z "$ide_pid" ]] || kill -- -"$ide_pid" 2>/dev/null || true
  [[ -z "$xvfb_pid" ]] || kill "$xvfb_pid" 2>/dev/null || true
  rm -rf -- "$work"
}
trap cleanup EXIT
awk '/^```cpp$/ { inside = 1; next } inside && /^```$/ { exit } inside' \
  "$repo_dir/src/content/estudos/cpp/primeiros-passos.md" >"$project/src/main.cpp"
[[ -s "$project/src/main.cpp" ]]
cat >"$project/CMakeLists.txt" <<'CMAKE'
cmake_minimum_required(VERSION 3.24)
project(primeiro_projeto LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
add_executable(primeiro_projeto src/main.cpp)
target_compile_options(primeiro_projeto PRIVATE -Wall -Wextra -Wpedantic)
CMAKE
printf '.kinein/\n' >"$project/.gitignore"
printf '%s\n' '{"schemaVersion":1,"openFiles":["src/main.cpp","CMakeLists.txt"],"activeFile":"src/main.cpp"}' >"$project/.kinein/session.json"
git -C "$project" init -qb main
git -C "$project" add CMakeLists.txt src/main.cpp .gitignore
git -C "$project" -c user.name='Kinein Vectis' -c user.email='demo@kinein.invalid' commit -qm 'Primeiro programa: calcule uma média'
cmake -S "$project" -B "$project/.kinein/build" >"$work/configure.log" 2>&1
cmake --build "$project/.kinein/build" >"$work/build.log" 2>&1
[[ "$("$project/.kinein/build/primeiro_projeto")" == 'media: 22.00 C' ]]

display_number=110
while [[ -e "/tmp/.X11-unix/X$display_number" ]]; do display_number=$((display_number + 1)); done
export DISPLAY=":$display_number"
Xvfb "$DISPLAY" -screen 0 1600x1000x24 >"$work/xvfb.log" 2>&1 &
xvfb_pid=$!
sleep 1
setsid env HOME="$work/home" XDG_CONFIG_HOME="$work/home/.config" \
  XDG_DATA_HOME="$work/home/.local/share" XDG_CACHE_HOME="$work/home/.cache" \
  XDG_RUNTIME_DIR="$work/runtime" QT_QPA_PLATFORM=xcb KINEIN_DETACHED=1 \
  RUSTUP_HOME="${RUSTUP_HOME:-$HOME/.rustup}" CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}" \
  KINEIN_SCREENSHOT="$work/poster.png" KINEIN_SCREENSHOT_SIZE=1600x1000 \
  KINEIN_SCREENSHOT_DELAY_MS=1000 \
  APPIMAGE_EXTRACT_AND_RUN=1 KINEIN_STARTUP_COMMANDS="$commands" \
  "$executable" "${arguments[@]}" "$project" >"$work/ide.log" 2>&1 &
ide_pid=$!
window="$(timeout 30 xdotool search --sync --onlyvisible --class kinein | head -1)"
xdotool windowsize "$window" 1600 1000 windowmove "$window" 0 0
xdotool mousemove 1570 980
if [[ "${2:-}" == --beta ]]; then sleep 5; fi
echo "Gravando $duration segundos na IDE real."
ffmpeg -nostdin -hide_banner -loglevel error -y -f x11grab -framerate 20 \
  -video_size 1600x1000 -i "$DISPLAY" -t "$duration" -an -c:v libx264 \
  -preset fast -crf 28 -pix_fmt yuv420p -movflags +faststart "$work/demo.mp4" &
recorder_pid=$!
if [[ "${2:-}" == --beta ]]; then
  sleep 5
  xdotool windowfocus --sync "$window" key --clearmodifiers ctrl+alt+b
  sleep 6
  xdotool key --clearmodifiers alt+F12
  sleep 5
  xdotool mousemove 1499 61 click 1
  xdotool mousemove 1570 980
fi
wait "$recorder_pid"
recorder_pid=""
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$work/demo.mp4"
cp "$work/demo.mp4" "$repo_dir/public/videos/$output_name.mp4"
echo "public/videos/$output_name.mp4"
