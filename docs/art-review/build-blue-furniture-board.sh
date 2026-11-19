#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
out="$repo_root/docs/art-review/blue-furniture-review.webp"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

sources=(
  'assets/episodes/ep-009-la-cena/09.1.png|Ep. 9 · sillón'
  'assets/episodes/ep-009-la-cena/09.2.png|Ep. 9 · sofá'
  'assets/episodes/ep-019-noche-de-peliculas/19.1.png|Ep. 19 · escena TV'
  'assets/episodes/ep-051-tienes-hambre/51.1.png|Ep. 51 · sofá'
  'assets/episodes/ep-052-fruitflix/52.1.png|Ep. 52 · olla/fondo azul'
)

tiles=()
for i in "${!sources[@]}"; do
  IFS='|' read -r file label <<< "${sources[$i]}"
  magick "$repo_root/$file" -resize 310x310 \
    -background '#f2eee5' -gravity north -extent 360x350 \
    -gravity north -background '#f2eee5' -extent 360x400 \
    -gravity south -fill '#30251f' -font DejaVu-Sans -pointsize 16 \
    -annotate +0+12 "$label · ref." "$tmpdir/$i.png"
  tiles+=("$tmpdir/$i.png")
done

magick montage "${tiles[@]}" -tile 3x2 -geometry 360x400+12+12 \
  -background '#ded8cd' -quality 88 "$out"
