#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
source_image="$repo_root/assets/episodes/ep-051-tienes-hambre/51.1.png"
output_image="$repo_root/docs/art-review/cutouts/sofa-azul-episodio-51-1-borrador-v5.png"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

# Build a non-repeating fabric field from many clean blue upholstery patches in
# 51.1, blended at the seams. This preserves the source's actual painted grain.
python - "$source_image" "$tmpdir/fabric-mosaic.png" <<'PY'
import random
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt

source_path, output_path = sys.argv[1:]
source = np.asarray(Image.open(source_path).convert("RGB"), dtype=np.float32)
r, g, b = source[:, :, 0], source[:, :, 1], source[:, :, 2]
is_fabric = (b > r + 35) & (g > r + 25) & (b > 110) & (g > 65) & (r < 110)
integral = np.pad(is_fabric.astype(np.int32), ((1, 0), (1, 0))).cumsum(0).cumsum(1)

patch = 128
overlap = 64
stride = patch - overlap
candidates = []
for y in range(1120, 1681, 24):
    for x in range(50, 1881, 24):
        count = integral[y + patch, x + patch] - integral[y, x + patch] - integral[y + patch, x] + integral[y, x]
        if count == patch * patch:
            candidates.append((x, y))

columns = 31
rows = 15
if not candidates:
    raise SystemExit("No clean source upholstery patches found")
rng = random.Random(5101)
rng.shuffle(candidates)
selected = candidates[:]
while len(selected) < columns * rows:
    rng.shuffle(candidates)
    selected.extend(candidates[:columns * rows - len(selected)])
weights = np.zeros((rows * stride + overlap, columns * stride + overlap), dtype=np.float32)
pixels = np.zeros((*weights.shape, 3), dtype=np.float32)
axis = np.ones(patch, dtype=np.float32)
ramp = np.linspace(1 / (overlap + 1), 1, overlap, dtype=np.float32)
axis[:overlap] = ramp
axis[-overlap:] = ramp[::-1]
weight = np.outer(axis, axis)

for index, (x, y) in enumerate(selected):
    row, column = divmod(index, columns)
    sample = source[y:y + patch, x:x + patch].copy()
    if rng.randrange(2):
        sample = sample[:, ::-1]
    if rng.randrange(2):
        sample = sample[::-1, :]
    turns = rng.randrange(4)
    sample = np.rot90(sample, turns)
    sample = np.clip(sample - sample.mean(axis=(0, 1)) + np.array([2.0, 122.0, 211.0]), 0, 255)
    left, top = column * stride, row * stride
    pixels[top:top + patch, left:left + patch] += sample * weight[:, :, None]
    weights[top:top + patch, left:left + patch] += weight

mosaic = np.clip(pixels / np.maximum(weights[:, :, None], 1e-5), 0, 255).astype(np.uint8)
Image.fromarray(mosaic, "RGB").save(output_path)
PY

tmp_svg="$tmpdir/sofa.svg"
cat > "$tmp_svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048">
  <defs>
    <pattern id="fabric" patternUnits="userSpaceOnUse" x="0" y="900" width="2048" height="1040">
      <image href="fabric-mosaic.png" width="2048" height="1040" preserveAspectRatio="none"/>
    </pattern>
  </defs>
  <g stroke="#514b48" stroke-width="18" stroke-linejoin="round" stroke-linecap="round">
    <!-- Small ochre feet match the visible right foot in the source; the left is reconstructed. -->
    <path fill="#e5a900" d="M154 1714 Q190 1708 221 1724 L218 1801 Q216 1818 198 1818 L174 1813 Q158 1807 157 1790 Z"/>
    <path fill="#e5a900" d="M1809 1722 Q1844 1707 1879 1714 L1883 1788 Q1881 1807 1863 1813 L1832 1817 Q1815 1813 1811 1796 Z"/>

    <!-- Single blue upholstered silhouette follows the broad rounded sofa in 51.1. -->
    <path fill="url(#fabric)" d="M320 1156 C252 1150 181 1143 124 1178 C78 1207 55 1264 53 1338 C49 1450 68 1597 96 1680 Q108 1726 156 1738 C495 1750 1510 1750 1890 1737 Q1940 1728 1957 1680 C1983 1584 2000 1437 1990 1339 C1982 1255 1950 1196 1906 1170 C1868 1148 1827 1152 1765 1160 C1640 1164 1538 1120 1458 1057 C1374 992 1300 921 1208 906 C1152 896 1107 898 1035 900 C957 898 908 901 852 909 C752 919 693 970 610 1038 C515 1116 421 1164 320 1156 Z"/>
  </g>
</svg>
SVG

mkdir -p "$tmpdir/config" "$tmpdir/cache" "$tmpdir/data"
env XDG_CONFIG_HOME="$tmpdir/config" XDG_CACHE_HOME="$tmpdir/cache" \
  XDG_DATA_HOME="$tmpdir/data" inkscape "$tmp_svg" --export-area-page \
  --export-width=2048 --export-height=2048 --export-filename="$tmpdir/base.png"

# Where the sofa is not obscured, keep the original upholstery pixels and grain.
# The quilted sampled texture fills only the occluded area behind the characters.
python - "$source_image" "$tmpdir/base.png" "$output_image" <<'PY'
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt

source_path, base_path, output_path = sys.argv[1:]
source = np.asarray(Image.open(source_path).convert("RGB"))
base = np.asarray(Image.open(base_path).convert("RGBA")).copy()
r, g, b = source[:, :, 0], source[:, :, 1], source[:, :, 2]
is_fabric = (b > r + 35) & (g > r + 25) & (b > 110) & (g > 65) & (r < 110)
inside_sofa = base[:, :, 3] > 0

# Borrow exact fabric texture from visible source areas, feathering it into the
# reconstructed upholstery so the seated characters' silhouettes do not stamp
# through as hard copy/paste boundaries.
distance, nearest = distance_transform_edt(~is_fabric, return_indices=True)
nearest_fabric = source[nearest[0], nearest[1]].astype(np.float32)
blend = (np.exp(-distance / 34.0) * inside_sofa).astype(np.float32)
base[:, :, :3] = np.clip(
    base[:, :, :3].astype(np.float32) * (1.0 - blend[:, :, None])
    + nearest_fabric * blend[:, :, None], 0, 255
).astype(np.uint8)
base[inside_sofa, 3] = 255

# Restore the author's actual charcoal contour where it is exposed in the frame.
y, x = np.indices(is_fabric.shape)
gray_ink = (
    (np.maximum.reduce([r, g, b]) - np.minimum.reduce([r, g, b]) < 22)
    & (r > 35) & (r < 130)
)
visible_outline = (
    ((x < 285) & (y > 1180) & (y < 1730))
    | ((x > 1860) & (x < 1985) & (y > 1180) & (y < 1730))
    | ((x > 700) & (x < 1350) & (y > 1735) & (y < 1810))
    | ((x > 880) & (x < 1210) & (y > 875) & (y < 935))
)
restore_ink = gray_ink & visible_outline
base[restore_ink, :3] = source[restore_ink]
base[restore_ink, 3] = 255

result = Image.fromarray(base, "RGBA")
box = result.getchannel("A").getbbox()
if not box:
    raise SystemExit("The reconstructed sofa is empty")
result.crop(box).save(output_path)
PY
