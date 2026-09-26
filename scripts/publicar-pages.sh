#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_dir"

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

npm run build:pages

publish_dir="$(mktemp -d "${TMPDIR:-/tmp}/kinein-pages.XXXXXXXX")"
trap 'rm -rf -- "$publish_dir"' EXIT

git clone --quiet --branch gh-pages --single-branch "$(git remote get-url origin)" "$publish_dir"
rsync -a --delete --exclude='.git' dist/ "$publish_dir/"
touch "$publish_dir/.nojekyll"

git -C "$publish_dir" add -A
if git -C "$publish_dir" diff --cached --quiet; then
  echo 'O site publicado já corresponde ao build local.'
  exit 0
fi

git -C "$publish_dir" -c "user.name=$publish_name" -c "user.email=$publish_email" commit -m 'Atualizar site publicado'
git -C "$publish_dir" push origin gh-pages
echo 'Publicação enviada para https://viktorwalde.github.io/KineinSite/'
