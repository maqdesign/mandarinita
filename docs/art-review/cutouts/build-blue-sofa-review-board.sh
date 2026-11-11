#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
out="$repo_root/docs/art-review/cutouts/sofa-azul-revision.webp"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

make_tile() {
  local source="$1" label="$2" background="$3" index="$4"
  magick "$source" -background "$background" -alpha remove -alpha off -resize 490x425 \
    -background "$background" -gravity center -extent 520x430 \
    -background '#f2eee5' -gravity north -extent 520x480 \
    -gravity south -fill '#30251f' -font DejaVu-Sans -pointsize 16 \
    -annotate +0+12 "$label" "$tmpdir/$index.png"
}

make_tile "$repo_root/assets/episodes/ep-051-tienes-hambre/51.1.png" \
  'Fuente primaria · episodio 51.1' '#f2eee5' 0
make_tile "$repo_root/assets/episodes/ep-009-la-cena/09.2.png" \
  'Cotejo visual · episodio 9.2' '#f2eee5' 1
make_tile "$repo_root/docs/art-review/cutouts/sofa-azul-episodio-51-1-borrador.png" \
  'Borrador PNG · fondo claro' '#f2eee5' 2
make_tile "$repo_root/docs/art-review/cutouts/sofa-azul-episodio-51-1-borrador.png" \
  'Transparencia · fondo oscuro' '#282522' 3

magick montage "$tmpdir/0.png" "$tmpdir/1.png" "$tmpdir/2.png" "$tmpdir/3.png" \
  -tile 2x2 -geometry 520x480+12+12 -background '#ded8cd' \
  -quality 88 "$out"
