#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
out="$repo_root/docs/art-review/cutouts/review-contact-sheet.webp"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

sources=(
  'mando-episodio-01-1-borrador.png|Mando · episodio 1.1'
  'mando-episodio-01-3-borrador.png|Mando · episodio 1.3'
  'mando-episodio-14-1-borrador.png|Mando · episodio 14.1'
  'mandy-episodio-01-1-borrador.png|Mandy · episodio 1.1'
  'greg-episodio-14-1-borrador.png|Greg · episodio 14.1'
  '../../../assets/characters/review/morita-episode-59-1-review.png|Morita · episodio 59.1'
  '../../../assets/characters/review/morita-episode-59-2-review.png|Morita · episodio 59.2'
  '../../../assets/characters/review/morita-episode-59-3-review.png|Morita · episodio 59.3'
  '../../../assets/characters/review/morita-episode-59-4-review.png|Morita · episodio 59.4'
  '../../../assets/characters/review/mando-episode-87-1-review.png|Mando · episodio 87.1'
)

tiles=()
for i in "${!sources[@]}"; do
  IFS='|' read -r file label <<< "${sources[$i]}"
  magick "$repo_root/docs/art-review/cutouts/$file" \
    -resize 310x310 -background '#f2eee5' -gravity north -extent 360x350 \
    -gravity north -background '#f2eee5' -extent 360x400 \
    -gravity south -fill '#30251f' -font DejaVu-Sans -pointsize 18 \
    -annotate +0+12 "$label · revisión" "$tmpdir/$i.png"
  tiles+=("$tmpdir/$i.png")
done

magick montage "${tiles[@]}" -tile 3x4 -geometry 360x400+12+12 \
  -background '#ded8cd' -quality 88 "$out"
