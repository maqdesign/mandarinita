#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
source_image="$repo_root/assets/episodes/ep-001-la-mosca/01.1.png"
output_image="$repo_root/docs/art-review/cutouts/mandy-episodio-01-1-borrador.png"

# Isolate the left figure from its edge-connected cream field. The rectangular
# alpha cleanup removes only three detached action marks above her, not her pose.
# Her contact shadow remains because it touches the feet in the source.
magick "$source_image" -crop 1050x1100+120+500 +repage \
  -fuzz 8% -fill none -draw 'color 0,0 floodfill' \
  -region 170x190+790+245 -channel A -evaluate set 0 +channel +region \
  -trim +repage -bordercolor none -border 2 "$output_image"
