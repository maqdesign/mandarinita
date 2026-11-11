#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
source_image="$repo_root/assets/episodes/ep-001-la-mosca/01.1.png"
output_image="$repo_root/docs/art-review/cutouts/mando-episodio-01-1-borrador.png"

# The cream field is isolated by edge-connected color removal. The lower contact
# shadow is intentionally retained because it touches the original feet.
magick "$source_image" -crop 920x1100+1170+500 +repage \
  -fuzz 8% -fill none -draw 'color 0,0 floodfill' \
  -trim +repage -bordercolor none -border 2 "$output_image"
