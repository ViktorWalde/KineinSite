#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_dir"

for tool in git npm node mktemp gcc g++ rustc python3; do
  command -v "$tool" >/dev/null || { echo "Falta a ferramenta: $tool" >&2; exit 1; }
done

if [[ "$(git branch --show-current)" != main ]]; then
  echo 'Execute a publicação a partir da branch main.' >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo 'Faça commit ou descarte as alterações locais antes de publicar.' >&2
  exit 1
fi

publish_name="$(git config --local user.name || true)"
publish_email="$(git config --local user.email || true)"
if [[ -z "$publish_name" || "$publish_email" != *@users.noreply.github.com ]]; then
  echo 'Configure user.name e seu email noreply neste repositório antes de publicar.' >&2
  exit 1
fi

source_commit="$(git rev-parse HEAD)"
remote_commit="$(git ls-remote origin refs/heads/main | cut -f1)"
if [[ "$source_commit" != "$remote_commit" ]]; then
  echo 'Envie o commit de main para origin antes de publicar.' >&2
  exit 1
fi
npm run check:examples
npm run build:pages
npm run check:browser
if [[ "$(git rev-parse HEAD)" != "$source_commit" || -n "$(git status --porcelain)" ]]; then
  echo 'O código mudou durante o build; faça commit e publique novamente.' >&2
  exit 1
fi

publish_dir="$(mktemp -d "${TMPDIR:-/tmp}/kinein-pages.XXXXXXXX")"
trap 'rm -rf -- "$publish_dir"' EXIT

git clone --quiet --branch gh-pages --single-branch "$(git remote get-url origin)" "$publish_dir"
node scripts/sync-pages.mjs dist "$publish_dir" "$source_commit"

git -C "$publish_dir" add -A
if git -C "$publish_dir" diff --cached --quiet; then
  echo 'O site publicado já corresponde ao build local.'
  node scripts/verify-publication.mjs dist "$source_commit"
  exit 0
fi

git -C "$publish_dir" -c "user.name=$publish_name" -c "user.email=$publish_email" commit -m "Publicar site de ${source_commit:0:12}"
git -C "$publish_dir" push origin gh-pages
node scripts/verify-publication.mjs dist "$source_commit"
echo 'Versão conferida no ar: https://viktorwalde.github.io/KineinSite/'
