#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
source_image="$repo_root/assets/episodes/ep-001-la-mosca/01.3.png"
output_image="$repo_root/docs/art-review/cutouts/mando-episodio-01-3-borrador.png"

# Crop keeps Mando's complete pose and excludes the fly and its looping trail.
# Edge-connected cream is made transparent; the original foot shadow remains.
magick "$source_image" -crop 1000x1100+1080+650 +repage \
  -fuzz 8% -fill none -draw 'color 0,0 floodfill' \
  -trim +repage -bordercolor none -border 2 "$output_image"
